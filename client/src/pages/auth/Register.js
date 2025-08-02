import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Home } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaedf1] px-10 py-3">
          <div className="flex items-center gap-4 text-[#101418]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_330)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_6_330">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-[#101418] text-lg font-bold leading-tight tracking-[-0.015em]">QuickDesk</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex gap-2">
              <Link
                to="/"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#eaedf1] text-[#101418] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <Home className="w-4 h-4 mr-2" />
                <span className="truncate">Home</span>
              </Link>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[480px] flex-1">
            {/* Register Form */}
            <div className="flex flex-col gap-6 px-4 py-10">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-[#101418] text-4xl font-black leading-tight tracking-[-0.033em]">
                  Create Account
                </h1>
                <p className="text-[#101418] text-base font-normal leading-normal">
                  Join QuickDesk and streamline your support
                </p>
              </div>

              {/* Form Container */}
              <div className="flex flex-col gap-6 rounded-xl border border-[#d4dbe2] bg-gray-50 p-8">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Name Field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[#101418] text-sm font-medium leading-normal">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        },
                        maxLength: {
                          value: 50,
                          message: 'Name cannot be more than 50 characters'
                        }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-[#d4dbe2] bg-white text-[#101418] text-sm font-normal leading-normal focus:outline-none focus:ring-2 focus:ring-[#b2cae5] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm font-normal leading-normal">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[#101418] text-sm font-medium leading-normal">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-[#d4dbe2] bg-white text-[#101418] text-sm font-normal leading-normal focus:outline-none focus:ring-2 focus:ring-[#b2cae5] focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm font-normal leading-normal">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-[#101418] text-sm font-medium leading-normal">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-[#d4dbe2] bg-white text-[#101418] text-sm font-normal leading-normal focus:outline-none focus:ring-2 focus:ring-[#b2cae5] focus:border-transparent pr-12"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-[#5c718a]" />
                        ) : (
                          <Eye className="h-5 w-5 text-[#5c718a]" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-sm font-normal leading-normal">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="text-[#101418] text-sm font-medium leading-normal">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-[#d4dbe2] bg-white text-[#101418] text-sm font-normal leading-normal focus:outline-none focus:ring-2 focus:ring-[#b2cae5] focus:border-transparent pr-12"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-[#5c718a]" />
                        ) : (
                          <Eye className="h-5 w-5 text-[#5c718a]" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm font-normal leading-normal">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        {...register('terms', {
                          required: 'You must accept the terms and conditions'
                        })}
                        className="h-4 w-4 text-[#b2cae5] focus:ring-[#b2cae5] border-[#d4dbe2] rounded"
                      />
                    </div>
                    <div className="text-sm">
                      <label htmlFor="terms" className="text-[#101418] text-sm font-normal leading-normal">
                        I agree to the{' '}
                        <a href="#" className="text-[#101418] text-sm font-bold leading-normal hover:text-[#b2cae5]">
                          Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-[#101418] text-sm font-bold leading-normal hover:text-[#b2cae5]">
                          Privacy Policy
                        </a>
                      </label>
                      {errors.terms && (
                        <p className="text-red-600 text-sm font-normal leading-normal">{errors.terms.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#b2cae5] text-[#101418] text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-[#101418] border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span className="truncate">Creating account...</span>
                      </div>
                    ) : (
                      <span className="truncate">Create Account</span>
                    )}
                  </button>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-[#101418] text-sm font-normal leading-normal">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        className="text-[#101418] text-sm font-bold leading-normal hover:text-[#b2cae5]"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 
