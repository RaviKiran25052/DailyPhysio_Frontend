import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ initialMode = true }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(initialMode);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(initialMode);
    setForgotPassword(false);
  }, [initialMode]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForgotPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login/signup logic here
    if (forgotPassword) {
      console.log('Password Reset Request for:', email);
      // Show a success message for password reset
      alert('Password reset link sent to your email');
    } else {
      console.log(isLogin ? 'Login' : 'Signup', { 
        email, 
        password,
        ...(isLogin ? {} : { name, confirmPassword })
      });
      
      // In a real app, you would perform authentication here
      // For demo purposes, we'll simulate a successful login/signup
      if (email && password) {
        // Store user info in sessionStorage or localStorage if needed
        sessionStorage.setItem('user', JSON.stringify({
          name: isLogin ? 'John Doe' : name, // Use form name for signup
          email: email,
          joined: "January 2023",
          location: "New York, USA"
        }));
        
        // Redirect to profile page after successful login/signup
        navigate('/profile');
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPassword(true);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl w-full flex flex-col max-h-[85vh] overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-3 px-5 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-purple-600 font-bold">E</div>
          <span className="text-lg font-bold text-white">ExerciseMD</span>
        </div>
        <h2 className="text-lg font-bold text-white mt-2">
          {forgotPassword 
            ? 'Reset Password' 
            : isLogin 
              ? 'Welcome Back' 
              : 'Create Account'
          }
        </h2>
        <p className="text-purple-200 mt-1 text-sm">
          {forgotPassword
            ? 'Enter your email to receive reset instructions'
            : isLogin 
              ? 'Sign in to access your personalized exercise programs'
              : 'Join thousands improving their health with expert guidance'
          }
        </p>
      </div>
      
      <div className="p-5 overflow-y-auto flex-grow">
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && !forgotPassword && (
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-1 text-sm font-medium">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1 text-sm font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          {!forgotPassword && (
            <div>
              <label htmlFor="password" className="block text-gray-300 mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                required
              />
            </div>
          )}

          {!isLogin && !forgotPassword && (
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-300 mb-1 text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-md font-medium hover:from-purple-700 hover:to-purple-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {forgotPassword 
              ? 'Send Reset Link' 
              : isLogin 
                ? 'Sign In' 
                : 'Create Account'
            }
          </button>
        </form>
        
        <div className="mt-3 text-center">
          {isLogin && !forgotPassword && (
            <button
              onClick={handleForgotPassword}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              Forgot your password?
            </button>
          )}
          
          <div className="mt-2">
            <button
              onClick={toggleMode}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              {forgotPassword 
                ? 'Back to Sign In' 
                : isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex justify-center space-x-4">
            <button className="p-1.5 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-300">
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="p-1.5 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-300">
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.015-.628.961-.689 1.8-1.56 2.46-2.548z"/>
              </svg>
            </button>
            <button className="p-1.5 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-300">
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.141 18.596c-3.924-.86-6.855-4.31-6.855-8.403 0-4.718 3.839-8.557 8.557-8.557 4.718 0 8.557 3.839 8.557 8.557 0 2.893-1.436 5.453-3.643 7.009l-1.44-2.496c1.314-1.082 2.152-2.733 2.152-4.513 0-3.211-2.615-5.825-5.825-5.825-3.211 0-5.825 2.615-5.825 5.825 0 3.211 2.615 5.825 5.825 5.825.347 0 .686-.032 1.018-.092l.834 3.165c-.607.082-1.227.126-1.852.126-.834 0-1.646-.082-2.433-.234zm4.655-.362l-.834-3.165c1.545-.519 2.658-1.982 2.658-3.698 0-2.152-1.748-3.9-3.9-3.9s-3.9 1.748-3.9 3.9c0 2.152 1.748 3.9 3.9 3.9.173 0 .347-.014.519-.028l1.44 2.496c-.607.304-1.254.548-1.919.731z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;