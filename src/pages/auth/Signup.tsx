import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../contexts/AuthContext';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const { signUp, loading } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    await signUp(data.email, data.password, data.fullName);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
      <p className="mt-2 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="mt-1">
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              {...register('fullName')}
              className="input"
              disabled={loading}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-danger-600">{errors.fullName.message}</p>
            )}
          </div>
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              {...register('password')}
              className="input"
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-danger-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="input"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-danger-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 justify-center"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
}