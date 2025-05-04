import React, { useEffect, useState } from 'react';
import { User, Settings, Mail, Key, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  preferences: Record<string, any> | null;
}

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [profileUpdated, setProfileUpdated] = useState(false);

  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors },
    setValue: setProfileValue
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors },
    reset: resetPasswordForm
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setProfile(data);
        setProfileValue('fullName', data.full_name || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [user, setProfileValue]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, full_name: data.fullName } : null);
      toast.success('Profile updated successfully!');
      setProfileUpdated(true);
      
      // Reset success message after a delay
      setTimeout(() => setProfileUpdated(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setLoading(true);
      
      // In a real application, you would verify the current password
      // and then update to the new password
      
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully!');
      resetPasswordForm();
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>
      
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/4 mt-8"></div>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="fullName"
                        type="text"
                        {...registerProfile('fullName')}
                        className="input"
                        disabled={loading}
                      />
                      {profileErrors.fullName && (
                        <p className="mt-1 text-sm text-danger-600">{profileErrors.fullName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <div className="flex items-center input bg-gray-50 text-gray-500">
                        <Mail className="w-5 h-5 mr-2 text-gray-400" />
                        {user?.email}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Email address cannot be changed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    
                    {profileUpdated && (
                      <div className="ml-4 flex items-center text-success-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span>Profile updated successfully</span>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}
          
          {activeTab === 'security' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
              
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="currentPassword"
                      type="password"
                      {...registerPassword('currentPassword')}
                      className="input"
                      disabled={loading}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-danger-600">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="newPassword"
                      type="password"
                      {...registerPassword('newPassword')}
                      className="input"
                      disabled={loading}
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-danger-600">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      type="password"
                      {...registerPassword('confirmPassword')}
                      className="input"
                      disabled={loading}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-danger-600">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Default Phishing Detection Model</h3>
                  <div className="mt-1">
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="defaultModel"
                          value="model1"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2">Primary Model</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="defaultModel"
                          value="model2"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2">Secondary Model</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Notification Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Email notifications for high-risk detections</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Weekly scan summary reports</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">New feature announcements</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <button className="btn btn-primary">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}