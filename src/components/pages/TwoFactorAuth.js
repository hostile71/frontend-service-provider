import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useVerify2FA, useResend2FACode } from '../../hooks/useAuth';

const TwoFactorAuth = () => {
  const { t, isRTL } = useLocalization();
  const { themeConfig } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use React Query mutation hooks
  const verify2FAMutation = useVerify2FA();
  const resend2FAMutation = useResend2FACode();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Redirect if no email in state (came directly to this page)
  useEffect(() => {
    if (!location.state?.email) {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Clear error when user types
    if (verify2FAMutation.isError) {
      verify2FAMutation.reset();
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newCode[index] = char;
      }
    });
    setCode(newCode);
    
    // Focus last filled input
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      return;
    }

    // Get email from location state
    const email = location.state?.email || localStorage.getItem('userEmail');
    
    if (!email) {
      navigate('/login', { replace: true });
      return;
    }

    // Call verify 2FA mutation
    verify2FAMutation.mutate({
      email,
      code: verificationCode
    });
  };

  const handleResendCode = async () => {
    const email = location.state?.email || localStorage.getItem('userEmail');
    
    if (!email) {
      navigate('/login', { replace: true });
      return;
    }

    // Call resend mutation
    resend2FAMutation.mutate(email);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'} min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md px-6 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToLogin}
          className={`mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {t('backToLogin') || 'Back to Login'}
        </button>

        {/* 2FA Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${themeConfig.gradient} mb-4`}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('twoFactorAuth') || 'Two-Factor Authentication'}
            </h1>
            <p className="text-gray-600">
              {t('enterVerificationCode') || "We've sent a verification code to"}
            </p>
            <p className="text-gray-900 font-medium mt-1">
              {location.state?.email || 'your email'}
            </p>
          </div>

          {/* Error Message */}
          {verify2FAMutation.isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {verify2FAMutation.error?.message || 'Verification failed. Please check your code.'}
            </div>
          )}

          {/* Success Message for Resend */}
          {resend2FAMutation.isSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {resend2FAMutation.data?.message || t('codeResent') || 'Verification code sent successfully!'}
            </div>
          )}

          {/* Error Message for Resend */}
          {resend2FAMutation.isError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {resend2FAMutation.error?.message || 'Failed to resend code. Please try again.'}
            </div>
          )}

          {/* 2FA Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                {t('enterCode') || 'Enter 6-digit code'}
              </label>
              <div className={`flex justify-center ${isRTL ? 'space-x-reverse' : ''} space-x-3`} onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    disabled={verify2FAMutation.isPending}
                  />
                ))}
              </div>
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resend2FAMutation.isPending}
                className={`text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {resend2FAMutation.isPending ? (
                  <>
                    <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'} animate-spin`} />
                    {t('sending') || 'Sending...'}
                  </>
                ) : (
                  <>
                    <RefreshCw className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {t('resendCode') || 'Resend Code'}
                  </>
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={verify2FAMutation.isPending || code.join('').length !== 6}
              className={`w-full bg-gradient-to-r ${themeConfig.gradient} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
            >
              {verify2FAMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('verifying') || 'Verifying...'}</span>
                </>
              ) : (
                <span>{t('verify') || 'Verify & Continue'}</span>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-2">Demo Code:</p>
            <p className="text-xs text-blue-600">Code: 123456</p>
            <p className="text-xs text-blue-500 mt-2">Note: Make sure backend server is running on localhost</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 10s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default TwoFactorAuth;
