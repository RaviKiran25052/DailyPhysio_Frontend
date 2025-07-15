const express = require('express');
const httpProxy = require('http-proxy');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

const userServer = process.env.USER_SERVER || 'http://localhost:4322';
const therapistServer = process.env.THERAPIST_SERVER || 'http://localhost:4323';
const adminServer = process.env.ADMIN_SERVER || 'http://localhost:4324';

// Middlewares
app.use(cors(["http://localhost:4321", "https://helodr-saisobila.vercel.app"])); // Allow cross-origin requests
app.use(morgan('combined')); // Detailed request logging

// Proxy error handler (global)
proxy.on('error', (err, req, res) => {
	console.error(`Proxy error for ${req.url}:`, err.message);
	if (!res.headersSent) {
		res.status(502).json({ error: 'Bad Gateway', message: err.message });
	}
});

// Log proxy request details
proxy.on('proxyReq', (proxyReq, req, res, options) => {
	console.log(`Proxying to ${options.target}: ${req.method} ${req.url}`);
});

// Timeout middleware (optional)
app.use((req, res, next) => {
	res.setTimeout(150000, () => {
		console.warn(`Request timed out: ${req.method} ${req.url}`);
		res.status(504).json({ error: 'Gateway Timeout' });
	});
	next();
});

// Routes
app.use('/users', (req, res) => {
	console.log(`Routing /users → ${userServer}`);
	proxy.web(req, res, { target: userServer });
});

app.use('/therapists', (req, res) => {
	console.log(`Routing /therapists → ${therapistServer}`);
	proxy.web(req, res, { target: therapistServer });
});

app.use('/admin', (req, res) => {
	console.log(`Routing /admin → ${adminServer}`);
	proxy.web(req, res, { target: adminServer });
});

// Health check
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'API Gateway is running' });
});

// Start the server
const PORT = process.env.MAIN_SERVER_PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 API Gateway listening on port ${PORT}`);
});
