'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  UserCheck,
  UserX,
  Flag,
  AlertTriangle,
  Search,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Shield,
  User
} from 'lucide-react';

const ModerationTools = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');

  // Mock data - replace with Supabase queries
  const verificationQueue = [
    {
      id: 1,
      name: "Dr. James Wilson",
      email: "james.wilson@hospital.com",
      specialty: "Cardiology",
      institution: "Central Hospital",
      documentUrl: "license-123.pdf",
      submittedAt: "2025-01-14T10:00:00Z"
    },
    {
      id: 2,
      name: "Dr. Emily Chen",
      email: "emily.chen@medical.org",
      specialty: "Neurology",
      institution: "City Medical Center",
      documentUrl: "license-124.pdf",
      submittedAt: "2025-01-14T11:30:00Z"
    }
  ];

  const reportedContent = [
    {
      id: 1,
      type: "case",
      title: "Patient Case Discussion",
      reason: "Contains identifiable patient information",
      reportedBy: "Dr. Smith",
      reportedAt: "2025-01-14T09:00:00Z",
      status: "pending"
    },
    {
      id: 2,
      type: "comment",
      title: "Re: Treatment Protocol",
      reason: "Inappropriate content",
      reportedBy: "Dr. Johnson",
      reportedAt: "2025-01-14T08:15:00Z",
      status: "pending"
    }
  ];

  const userManagement = [
    {
      id: 1,
      name: "Dr. Robert Brown",
      email: "robert.brown@hospital.com",
      status: "active",
      role: "doctor",
      lastActive: "2025-01-14T12:00:00Z",
      casesCreated: 15,
      answersGiven: 42
    },
    {
      id: 2,
      name: "Dr. Sarah Parker",
      email: "sarah.parker@clinic.com",
      status: "suspended",
      role: "doctor",
      lastActive: "2025-01-13T16:45:00Z",
      casesCreated: 8,
      answersGiven: 23
    }
  ];

  const handleAction = (item: any, action: string) => {
    setSelectedItem(item);
    setActionType(action);
    setShowActionDialog(true);
  };

  const confirmAction = async () => {
    try {
      // Implement action based on actionType
      console.log('Performing action:', actionType, 'on item:', selectedItem);
      setShowActionDialog(false);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const VerificationQueueTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pending Verifications ({verificationQueue.length})</h3>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search by name or email"
            className="w-64"
          />
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {verificationQueue.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>{item.email}</p>
                    <p>{item.specialty} • {item.institution}</p>
                    <p className="text-xs">
                      Submitted {new Date(item.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(item.documentUrl, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Document
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(item, 'approve')}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAction(item, 'reject')}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ReportedContentTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Reported Content ({reportedContent.length})</h3>
        <Button variant="outline" size="sm">
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {reportedContent.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <Badge variant="outline">
                      {item.type}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                      {item.reason}
                    </p>
                    <p>Reported by {item.reportedBy}</p>
                    <p className="text-xs">
                      {new Date(item.reportedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(item, 'view')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAction(item, 'dismiss')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAction(item, 'remove')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const UserManagementTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search users"
            className="w-64"
          />
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {userManagement.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{user.name}</h4>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>{user.email}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                      <span>•</span>
                      <span>{user.casesCreated} cases</span>
                      <span>•</span>
                      <span>{user.answersGiven} answers</span>
                    </div>
                    <p className="text-xs">
                      Last active: {new Date(user.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(user, 'view-profile')}
                  >
                    <User className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                  {user.status === 'active' ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleAction(user, 'suspend')}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction(user, 'reactivate')}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Moderation Tools</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="verification" className="space-y-4">
            <TabsList>
              <TabsTrigger value="verification">
                Verification Queue
              </TabsTrigger>
              <TabsTrigger value="reports">
                Reported Content
              </TabsTrigger>
              <TabsTrigger value="users">
                User Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verification">
              <VerificationQueueTab />
            </TabsContent>

            <TabsContent value="reports">
              <ReportedContentTab />
            </TabsContent>

            <TabsContent value="users">
              <UserManagementTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve' && "Are you sure you want to approve this user's verification?"}
              {actionType === 'reject' && "Are you sure you want to reject this user's verification?"}
              {actionType === 'remove' && "Are you sure you want to remove this content?"}
              {actionType === 'suspend' && "Are you sure you want to suspend this user?"}
              {actionType === 'reactivate' && "Are you sure you want to reactivate this user?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ModerationTools;