require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const app = express();

// Morgan for logging HTTP requests
app.use(morgan('combined'));

const userServer = process.env.USER_SERVER || 'http://localhost:4322';
const therapistServer = process.env.THERAPIST_SERVER || 'http://localhost:4323';
const adminServer = process.env.ADMIN_SERVER || 'http://localhost:4324';

// Health check with service availability
app.get('/health', async (req, res) => {
	const checkService = async (url) => {
		try {
			const response = await fetch(`${url}/health`);
			return response.ok;
		} catch (error) {
			return false;
		}
	};

	const services = {
		users: {
			url: userServer,
			status: await checkService(userServer) ? 'UP' : 'DOWN'
		},
		therapists: {
			url: therapistServer,
			status: await checkService(therapistServer) ? 'UP' : 'DOWN'
		},
		admin: {
			url: adminServer,
			status: await checkService(adminServer) ? 'UP' : 'DOWN'
		}
	};

	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		services
	});
});

// Proxy configuration with better error handling
const proxyOptions = {
	changeOrigin: true,
	timeout: 10000,
	proxyTimeout: 10000,
	onError: (err, req, res) => {
		console.error(`Proxy error for ${req.url}:`, err.message);
		if (!res.headersSent) {
			res.status(503).json({
				error: 'Service temporarily unavailable',
				service: req.url.split('/')[1],
				timestamp: new Date().toISOString()
			});
		}
	},
	onProxyReq: (proxyReq, req, res) => {
		console.log(`Proxying ${req.method} ${req.url} to ${proxyReq.path}`);
	}
};

// Create proxy middlewares
const userProxy = createProxyMiddleware({
	target: userServer,
	pathRewrite: { '^/users': '' },
	...proxyOptions
});

const therapistProxy = createProxyMiddleware({
	target: therapistServer,
	pathRewrite: { '^/therapists': '' },
	...proxyOptions
});

const adminProxy = createProxyMiddleware({
	target: adminServer,
	pathRewrite: { '^/admin': '' },
	...proxyOptions
});

// Apply proxy routes
app.use('/users', userProxy);
app.use('/therapists', therapistProxy);
app.use('/admin', adminProxy);

// Default route
app.get('/', (req, res) => {
	res.json({
		message: 'Microservices Proxy Server',
		endpoints: {
			users: `http://localhost:${process.env.MAIN_SERVER_PORT || 4321}/users`,
			therapists: `http://localhost:${process.env.MAIN_SERVER_PORT || 4321}/therapists`,
			admin: `http://localhost:${process.env.MAIN_SERVER_PORT || 4321}/admin`,
			health: `http://localhost:${process.env.MAIN_SERVER_PORT || 4321}/health`
		}
	});
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({
		error: 'Route not found',
		availableRoutes: ['/users', '/therapists', '/admin', '/health']
	});
});

const PORT = process.env.MAIN_SERVER_PORT || 4321;

app.listen(PORT, () => {
	console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
	console.log(`📱 Users: http://localhost:${PORT}/users`);
	console.log(`👨‍⚕️ Therapists: http://localhost:${PORT}/therapists`);
	console.log(`👑 Admin: http://localhost:${PORT}/admin`);
	console.log(`❤️  Health: http://localhost:${PORT}/health`);
});