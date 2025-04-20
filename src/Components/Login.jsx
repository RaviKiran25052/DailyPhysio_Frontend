import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;

const Login = ({ isOpen, isSignIn, onClose, onAuthSuccess }) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    membershipType: 'free'
  });
  const [isLogin, setIsLogin] = useState(isSignIn);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      membershipType: 'free'
    });
    setIsLogin(!isLogin);
    setForgotPassword(false);
    setPasswordError('');
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      membershipType: 'free'
    });
    setIsLogin(!isLogin);
    setForgotPassword(false);
    setPasswordError('');
    onClose();
  };

  const validateForm = () => {
    if (!isLogin && !forgotPassword) {
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
      if (isLogin) {
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
    setIsLoading(false);
    
    // Call onAuthSuccess to update parent component state
    onAuthSuccess(userData);
    onClose();
    
    // if (redirectTo === 'profile' || redirectTo === 'mystuff') {
    //   navigate('/profile');
    // } else if (redirectTo === 'myexercises') {
    //   navigate('/profile?tab=myexercises');
    // } else if (redirectTo === 'routines') {
    //   navigate('/profile?tab=routines');
    // } else if (redirectTo === 'settings') {
    //   navigate('/profile?tab=settings');
    // } else {
    //   navigate(redirectTo || '/');
    // }

    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    toast.success(`Welcome${isSignIn ? ' back' : ''}, ${userData.fullName}!`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={handleClose}
        ></div>
        <div className="bg-gray-800 relative w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 overflow-hidden">
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
              {!isLogin && !forgotPassword && formData.membershipType === 'pro' && (
                <span className="ml-2 bg-yellow-400 text-black text-xs py-1 px-2 rounded uppercase">Pro</span>
              )}
            </h2>
            <p className="text-purple-200 mt-1 text-sm">
              {forgotPassword
                ? 'Enter your email to receive reset instructions'
                : isLogin
                  ? 'Sign in to access your personalized exercise programs'
                  : formData.membershipType === 'pro'
                    ? 'Join ExerciseMD Pro and get access to all premium features'
                    : 'Join thousands improving their health with expert guidance'
              }
            </p>
          </div>

          <div className="p-5 overflow-y-auto flex-grow">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !forgotPassword && (
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
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    required
                  />
                </div>
              )}

              {!isLogin && !forgotPassword && (
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

                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Membership Type</label>
                    <div className="flex items-center space-x-4 bg-gray-700 border border-gray-600 rounded-md p-3">
                      <div
                        className={`flex items-center cursor-pointer ${formData.membershipType === 'free' ? 'text-white' : 'text-gray-400'}`}
                        onClick={() => setFormData(prev => ({ ...prev, membershipType: 'free' }))}
                      >
                        <div className={`w-4 h-4 rounded-full border ${formData.membershipType === 'free' ? 'border-purple-500 bg-purple-500' : 'border-gray-400'} mr-2`}></div>
                        <span>Free Plan</span>
                      </div>
                      <div
                        className={`flex items-center cursor-pointer ${formData.membershipType === 'pro' ? 'text-white' : 'text-gray-400'}`}
                        onClick={() => setFormData(prev => ({ ...prev, membershipType: 'pro' }))}
                      >
                        <div className={`w-4 h-4 rounded-full border ${formData.membershipType === 'pro' ? 'border-purple-500 bg-purple-500' : 'border-gray-400'} mr-2`}></div>
                        <span>Pro Plan</span>
                        <span className="ml-1 text-xs px-1 py-0.5 bg-yellow-400 text-black rounded">$7/mo</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 px-4 rounded-md font-medium hover:from-purple-700 hover:to-purple-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {forgotPassword
                  ? 'Send Reset Link'
                  : isLogin
                    ? 'Sign In'
                    : formData.membershipType === 'pro'
                      ? 'Create Pro Account'
                      : 'Create Free Account'
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
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="p-1.5 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-300">
                  <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.015-.628.961-.689 1.8-1.56 2.46-2.548z" />
                  </svg>
                </button>
                <button className="p-1.5 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-300">
                  <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.141 18.596c-3.924-.86-6.855-4.31-6.855-8.403 0-4.718 3.839-8.557 8.557-8.557 4.718 0 8.557 3.839 8.557 8.557 0 2.893-1.436 5.453-3.643 7.009l-1.44-2.496c1.314-1.082 2.152-2.733 2.152-4.513 0-3.211-2.615-5.825-5.825-5.825-3.211 0-5.825 2.615-5.825 5.825 0 3.211 2.615 5.825 5.825 5.825.347 0 .686-.032 1.018-.092l.834 3.165c-.607.082-1.227.126-1.852.126-.834 0-1.646-.082-2.433-.234zm4.655-.362l-.834-3.165c1.545-.519 2.658-1.982 2.658-3.698 0-2.152-1.748-3.9-3.9-3.9s-3.9 1.748-3.9 3.9c0 2.152 1.748 3.9 3.9 3.9.173 0 .347-.014.519-.028l1.44 2.496c-.607.304-1.254.548-1.919.731z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;