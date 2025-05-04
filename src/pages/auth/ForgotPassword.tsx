import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../contexts/AuthContext';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { resetPassword, loading } = useAuth();
  const [submitted, setSubmitted] = React.useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await resetPassword(data.email);
    setSubmitted(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>
      <p className="mt-2 text-sm text-gray-600">
        Remember your password?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </p>

      {submitted ? (
        <div className="mt-8 p-4 bg-success-50 border border-success-200 rounded-lg">
          <h3 className="text-success-800 font-medium">Password reset email sent</h3>
          <p className="mt-2 text-success-700">
            Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
          </p>
          <Link 
            to="/login" 
            className="mt-4 inline-block text-primary-600 hover:text-primary-500 font-medium"
          >
            Return to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="input"
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 justify-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}