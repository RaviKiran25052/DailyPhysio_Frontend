import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
const API_URL = process.env.REACT_APP_API_URL;

const Login = ({ isOpen, isSignIn, onChange, onClose, onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });

  // Add resetStep state to track password reset flow
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  // Add registrationStep state to track registration flow
  const [registrationStep, setRegistrationStep] = useState(1); // 1: Form, 2: OTP Verification

  const [passwordError, setPasswordError] = useState('');
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      otp: '',
    });
    onChange(!isSignIn);
    setForgotPassword(false);
    setResetStep(1);
    setRegistrationStep(1);
    setPasswordError('');
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      otp: '',
    });
    onChange(isSignIn);
    setForgotPassword(false);
    setResetStep(1);
    setRegistrationStep(1);
    setPasswordError('');
    onClose();
  };

  const validateForm = () => {
    if (!isSignIn && !forgotPassword && registrationStep === 1) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return false;
      }
    }

    // Password reset form validation
    if (forgotPassword && resetStep === 3) {
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
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    // Handle forgot password flow
    if (forgotPassword) {
      try {
        // Step 1: Send email for OTP
        if (resetStep === 1) {
          const response = await axios.post(`${API_URL}/users/send-otp`, {
            email: formData.email,
          });

          if (response.status === 200) {
            toast.success('OTP sent to your email', {
              position: "top-center"
            });
            setResetStep(2);
          }
        }
        // Step 2: Verify OTP
        else if (resetStep === 2) {
          const response = await axios.post(`${API_URL}/users/verify-otp`, {
            email: formData.email,
            otp: formData.otp,
          });

          if (response.status === 200) {
            toast.success('OTP verified successfully', {
              position: "top-center"
            });
            setResetStep(3);
          }
        }
        // Step 3: Reset Password
        else if (resetStep === 3) {
          const response = await axios.post(`${API_URL}/users/reset-password`, {
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          });

          if (response.status === 200) {
            toast.success('Password reset successful', {
              position: "top-center"
            });
            setForgotPassword(false);
            setResetStep(1);
            setFormData({
              ...formData,
              password: '',
              confirmPassword: '',
              otp: '',
            });
          }
        }
      } catch (error) {
        console.error('Password reset error:', error);
        toast.error(error.response?.data?.message || 'An error occurred', {
          position: "top-center"
        });
      }
    } else {
      // Original login/signup logic
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
        // Registration flow with OTP verification
        try {
          // Step 1: Send OTP for email verification
          if (registrationStep === 1) {
            const response = await axios.post(`${API_URL}/users/send-otp`, {
              email: formData.email,
            });

            if (response.status === 200) {
              toast.success('OTP sent to your email for verification', {
                position: "top-center"
              });
              setRegistrationStep(2);
            }
          }
          // Step 2: Verify OTP and create user
          else if (registrationStep === 2) {
            const response = await axios.post(`${API_URL}/users/register`, {
              fullName: formData.name,
              email: formData.email,
              password: formData.password,
              otp: formData.otp,
            });

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
              setRegistrationStep(1);
            }
          }
        }
        catch (error) {
          console.error('Registration error:', error);

          // Specify toast position as top-center
          toast.error('Registration failed: ' + (error.response?.data?.message || 'Unknown error'), {
            position: "top-center"
          });
          setIsLoading(false); // Add this line in catch blocks
        } finally {
          setIsLoading(false); // Add this line to ensure loading stops in all cases
        }
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPassword(true);
    setResetStep(1);
  };

  const handleSuccess = (userData) => {
    // Call onAuthSuccess to update parent component state
    onAuthSuccess(userData);
    onClose();
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      otp: '',
    });
  };

  // Back button for multi-step forgot password flow
  const handleBackStep = () => {
    if (resetStep > 1) {
      setResetStep(resetStep - 1);
    } else {
      setForgotPassword(false);
    }
  };

  // Back button for registration flow
  const handleRegistrationBackStep = () => {
    if (registrationStep > 1) {
      setRegistrationStep(registrationStep - 1);
    }
  };

  if (!isOpen) return null;

  // Determine the title and subtitle based on the current mode and step
  let title, subtitle;
  if (forgotPassword) {
    if (resetStep === 1) {
      title = 'Reset Password';
      subtitle = 'Enter your email to receive a verification code';
    } else if (resetStep === 2) {
      title = 'Enter OTP';
      subtitle = 'Enter the 4-digit code sent to your email';
    } else {
      title = 'Create New Password';
      subtitle = 'Enter and confirm your new password';
    }
  } else if (!isSignIn && registrationStep === 2) {
    title = 'Verify Your Email';
    subtitle = 'Enter the 4-digit code sent to your email';
  } else {
    title = isSignIn ? 'Welcome Back' : 'Create Account';
    subtitle = isSignIn
      ? 'Sign in to access your personalized exercise programs'
      : 'Join thousands improving their health with expert guidance';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      ></div>
      <div className="bg-white relative w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-3 px-5 flex-shrink-0">
          <h2 className="text-lg font-bold text-white mt-2">
            {title}
          </h2>
          <p className="text-primary-200 mt-1 text-sm">
            {subtitle}
          </p>
        </div>

        <div className="p-5 overflow-y-auto flex-grow">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registration field - only shown in sign up mode step 1 */}
            {!isSignIn && !forgotPassword && registrationStep === 1 && (
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-1 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter your name"
                  required
                  autoComplete="username"
                />
              </div>
            )}

            {/* Email field - shown in all modes except registration step 2 and forgot password step 2 & 3 */}
            {(resetStep === 1 || (!forgotPassword && (isSignIn || registrationStep === 1))) && (
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter your email"
                  required
                  autoComplete="username"
                />
              </div>
            )}

            {/* OTP field - shown in forgot password step 2 and registration step 2 */}
            {((forgotPassword && resetStep === 2) || (!forgotPassword && !isSignIn && registrationStep === 2)) && (
              <div>
                <label htmlFor="otp" className="block text-gray-700 mb-1 text-sm font-medium">Verification Code</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 tracking-widest text-center text-lg"
                  placeholder="Enter 4-digit code"
                  maxLength="4"
                  required
                />
              </div>
            )}

            {/* Password fields - shown in login, signup step 1, and forgot password step 3 */}
            {(
              ((isSignIn || (!forgotPassword && registrationStep === 1)) && (!forgotPassword && resetStep === 1)) || (forgotPassword && resetStep === 3)
            ) && (
                <div>
                  <label htmlFor="password" className="block text-gray-700 mb-1 text-sm font-medium">
                    {forgotPassword ? 'New Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      autoComplete="current-password"
                      onChange={handleChange}
                      className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder={forgotPassword ? "Create new password" : isSignIn ? "Enter your password" : "Create a password"}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

            {/* Confirm password - shown in signup step 1 and forgot password step 3 */}
            {((!isSignIn && !forgotPassword && registrationStep === 1) || (forgotPassword && resetStep === 3)) && (
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-1 text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                )}
              </div>
            )}

            {/* Submit button with context-aware label */}
            <button
              type="submit"
              className="w-full text-white bg-gradient-to-r from-primary-600 to-primary-800 py-2 px-4 rounded-md font-medium hover:from-primary-700 hover:to-primary-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {forgotPassword
                    ? (resetStep === 1 ? 'Sending...' :
                      resetStep === 2 ? 'Verifying...' :
                        'Resetting...')
                    : (isSignIn ? 'Signing In...' :
                      registrationStep === 1 ? 'Sending...' :
                        'Registering...')
                  }
                </>
              ) : (
                forgotPassword
                  ? (resetStep === 1 ? 'Send Verification Code' :
                    resetStep === 2 ? 'Verify Code' :
                      'Reset Password')
                  : (isSignIn ? 'Sign In' :
                    registrationStep === 1 ? 'Send Verification Code' :
                      'Complete Registration')
              )}
            </button>
          </form>

          <div className="mt-3 text-center">
            {/* Back button for forgot password flow */}
            {forgotPassword && (
              <button
                onClick={handleBackStep}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {resetStep > 1 ? 'Back to previous step' : 'Back to Sign In'}
              </button>
            )}

            {/* Back button for registration flow */}
            {!isSignIn && !forgotPassword && registrationStep === 2 && (
              <button
                onClick={handleRegistrationBackStep}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Back to registration form
              </button>
            )}

            {/* Forgot password link - only in sign in mode */}
            {isSignIn && !forgotPassword && (
              <button
                onClick={handleForgotPassword}
                className="text-primary-600 hover:underline text-sm font-medium"
              >
                Forgot your password?
              </button>
            )}

            {/* Toggle between sign in and sign up - not in forgot password flow or registration step 2 */}
            {!forgotPassword && (isSignIn || registrationStep === 1) && (
              <div className="mt-2">
                <button
                  onClick={toggleMode}
                  className="text-black text-sm font-medium"
                >
                  {isSignIn
                    ? <span>Don't have an account? <span className='text-primary-600 hover:underline'>Sign up</span></span>
                    : <span>Already have an account? <span className='text-primary-600 hover:underline'>Sign in</span></span>
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;