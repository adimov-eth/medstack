import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  FileQuestion,
  UserCircle,
  Settings,
  Bell,
  BarChart2,
  Shield,
  Plus,
  FileText
} from 'lucide-react';

export default function RootPage() {
  const links = [
    { href: '/dashboard', icon: <Home className="w-5 h-5" />, title: 'Dashboard', description: 'Overview of platform activity' },
    { href: '/cases', icon: <FileQuestion className="w-5 h-5" />, title: 'Cases', description: 'Browse and manage medical cases' },
    { href: '/cases/new', icon: <Plus className="w-5 h-5" />, title: 'New Case', description: 'Create a new medical case' },
    { href: '/profile', icon: <UserCircle className="w-5 h-5" />, title: 'Profile', description: 'View and edit your profile' },
    { href: '/settings', icon: <Settings className="w-5 h-5" />, title: 'Settings', description: 'Manage your preferences' },
    { href: '/notifications', icon: <Bell className="w-5 h-5" />, title: 'Notifications', description: 'View your notifications' },
    { href: '/analytics', icon: <BarChart2 className="w-5 h-5" />, title: 'Analytics', description: 'Platform statistics and insights' },
    { href: '/moderation', icon: <Shield className="w-5 h-5" />, title: 'Moderation', description: 'Content moderation tools' },
    { href: '/login', icon: <FileText className="w-5 h-5" />, title: 'Login', description: 'Authentication page' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MedStack Navigation</h1>
          <p className="mt-2 text-gray-600">Access all available views and features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="block hover:no-underline"
            >
              <Card className="h-full hover:border-blue-200 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {link.icon}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{link.title}</h2>
                      <p className="text-sm text-gray-500">{link.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 