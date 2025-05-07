import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const API_URL = process.env.REACT_APP_API_URL;

const Login = ({ isOpen, isSignIn, onChange, onClose, onAuthSuccess }) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [forgotPassword, setForgotPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear password error when user types in either password field
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const toggleMode = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    onChange(!isSignIn);
    setForgotPassword(false);
    setPasswordError('');
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    onChange(isSignIn);
    setForgotPassword(false);
    setPasswordError('');
    onClose();
  };

  const validateForm = () => {
    if (!isSignIn && !forgotPassword) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Handle login/signup logic here
    if (forgotPassword) {
      console.log('Password Reset Request for:', formData.email);
      // Show a success message for password reset
      alert('Password reset link sent to your email');
    } else {
      console.log(formData);
      if (isSignIn) {
        try {
          const response = await axios.post(`${API_URL}/users/login`, {
            email: formData.email,
            password: formData.password,
          });
          console.log(response);
          if (response.status === 200) {
            handleSuccess(response.data);
          }
        }
        catch (error) {
          console.error('Login error:', error);

          // Specify toast position as top-center
          toast.error('Login failed: ' + (error.response?.data?.message || 'Unknown error'), {
            position: "top-center"
          });
        }
      } else {
        try {
          const response = await axios.post(`${API_URL}/users/register`, {
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
          });
          console.log(response);
          if (response.status === 201) {
            // Save token and user data to localStorage
            localStorage.setItem('token', JSON.stringify(response.data.token));

            // Store fullName from backend response if available, otherwise use form input
            if (response.data.user && response.data.fullName) {
              localStorage.setItem('fullName', JSON.stringify(response.data.fullName));
            } else if (response.data.fullName) {
              localStorage.setItem('fullName', JSON.stringify(response.data.fullName));
            } else {
              // Fallback to the name entered in the form
              localStorage.setItem('fullName', JSON.stringify(formData.name));
            }

            // Store email for profile display
            localStorage.setItem('email', JSON.stringify(formData.email));

            // Specify toast position as top-center
            toast.success('Registration successful', {
              position: "top-center"
            });
            handleSuccess(response.data);
          }
        }
        catch (error) {
          console.error('Registration error:', error);

          // Specify toast position as top-center
          toast.error('Registration failed: ' + (error.response?.data?.message || 'Unknown error'), {
            position: "top-center"
          });
        }
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPassword(true);
  };

  const handleSuccess = (userData) => {
    // Call onAuthSuccess to update parent component state
    onAuthSuccess(userData);
    onClose();
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      ></div>
      <div className="bg-gray-800 relative w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-3 px-5 flex-shrink-0">
          <h2 className="text-lg font-bold text-white mt-2">
            {forgotPassword
              ? 'Reset Password'
              : isSignIn
                ? 'Welcome Back'
                : 'Create Account'
            }
          </h2>
          <p className="text-purple-200 mt-1 text-sm">
            {forgotPassword
              ? 'Enter your email to receive reset instructions'
              : isSignIn
                ? 'Sign in to access your personalized exercise programs'
                : 'Join thousands improving their health with expert guidance'
            }
          </p>
        </div>

        <div className="p-5 overflow-y-auto flex-grow">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && !forgotPassword && (
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-1 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your name"
                  required
                  autoComplete="username"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-gray-300 mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                required
                autoComplete="username"
              />
            </div>

            {!forgotPassword && (
              <div>
                <label htmlFor="password" className="block text-gray-300 mb-1 text-sm font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  autoComplete="current-password"
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={isSignIn ? "Enter your password" : "Create a password"}
                  required
                />
              </div>
            )}

            {!isSignIn && !forgotPassword && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-300 mb-1 text-sm font-medium">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                  />
                  {passwordError && (
                    <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-md font-medium hover:from-purple-700 hover:to-purple-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {forgotPassword
                ? 'Send Reset Link'
                : 'Sign In'
              }
            </button>
          </form>

          <div className="mt-3 text-center">
            {isSignIn && !forgotPassword && (
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
                  : isSignIn
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;