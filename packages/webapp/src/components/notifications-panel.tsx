'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Star,
  Clock,
  AtSign,
  Check
} from 'lucide-react';

type Notification = {
  id: number;
  type: 'answer' | 'accepted' | 'mention' | 'system';
  message: string;
  timestamp: string;
  caseId?: string;
};

const NotificationsPanel = () => {
  // Mock data - replace with Supabase query
  const notifications = {
    unread: [
      {
        id: 1,
        type: 'answer',
        message: 'Dr. Johnson replied to your case "Unusual ECG Patterns"',
        timestamp: '2025-01-15T10:30:00Z',
        caseId: '123'
      },
      {
        id: 2,
        type: 'accepted',
        message: 'Your answer was accepted as solution for "Complex Spine MRI"',
        timestamp: '2025-01-15T09:45:00Z',
        caseId: '456'
      },
      {
        id: 3,
        type: 'mention',
        message: 'Dr. Williams mentioned you in a discussion',
        timestamp: '2025-01-15T08:15:00Z',
        caseId: '789'
      }
    ],
    earlier: [
      {
        id: 4,
        type: 'answer',
        message: 'Dr. Smith commented on your case "Post-operative Care"',
        timestamp: '2025-01-14T15:20:00Z',
        caseId: '101'
      },
      {
        id: 5,
        type: 'system',
        message: 'Your account was successfully verified',
        timestamp: '2025-01-14T11:00:00Z'
      }
    ]
  };

  const getNotificationIcon = (type: 'answer' | 'accepted' | 'mention' | 'system') => {
    switch (type) {
      case 'answer':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'mention':
        return <AtSign className="h-4 w-4 text-purple-500" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{notification.message}</p>
        <div className="flex items-center mt-1 space-x-2">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500">
            {formatTimestamp(notification.timestamp)}
          </span>
        </div>
      </div>
      {notification.type !== 'system' && (
        <Button variant="ghost" size="sm" className="flex-shrink-0">
          View
        </Button>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Notifications</CardTitle>
        <div className="flex items-center space-x-2">
          {notifications.unread.length > 0 && (
            <Badge variant="default" className="rounded-full">
              {notifications.unread.length} new
            </Badge>
          )}
          <Button variant="ghost" size="sm">
            Mark all as read
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="answers">Answers</TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.unread.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">New</h3>
                <div className="space-y-1">
                  {notifications.unread.map(notification => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification as Notification} 
                    />
                  ))}
                </div>
              </div>
            )}

            {notifications.earlier.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Earlier</h3>
                <div className="space-y-1">
                  {notifications.earlier.map(notification => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification as Notification} 
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="answers">
            <div className="space-y-1">
              {[...notifications.unread, ...notifications.earlier]
                .filter(n => n.type === 'answer')
                .map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification as Notification} 
                  />
                ))
              }
            </div>
          </TabsContent>

          <TabsContent value="mentions">
            <div className="space-y-1">
              {[...notifications.unread, ...notifications.earlier]
                .filter(n => n.type === 'mention')
                .map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification as Notification} 
                  />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;