import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TopBarProps {
  onMenuButtonClick: () => void;
}

export default function TopBar({ onMenuButtonClick }: TopBarProps) {
  const { signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 lg:hidden"
              onClick={onMenuButtonClick}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <Bell className="w-6 h-6" />
            </button>
            
            <div className="relative ml-3">
              <div className="flex">
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1 text-sm text-primary-700 border border-primary-300 rounded-md hover:bg-primary-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}