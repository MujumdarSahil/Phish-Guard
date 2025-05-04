import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Search, History, User, BookOpen, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Scan URL', path: '/scan', icon: Search },
    { name: 'History', path: '/history', icon: History },
    { name: 'Educational Resources', path: '/education', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:w-64 lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <ShieldCheck className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-primary-900">PhishGuard</span>
            </Link>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 px-3 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    onClick={() => onClose()}
                  >
                    <Icon className={cn(
                      "flex-shrink-0 w-5 h-5 mr-3",
                      isActive ? "text-primary-600" : "text-gray-400"
                    )} />
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}