import React from 'react';
import { UserCircle, FileQuestion, Home, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-blue-600">MedStack</h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="flex items-center">
              <FileQuestion className="mr-2 h-4 w-4" />
              Cases
            </Button>
            <Button variant="ghost" className="relative flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            <Button variant="ghost" className="flex items-center">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="ghost" className="flex items-center text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">© 2025 MedStack. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-600">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;