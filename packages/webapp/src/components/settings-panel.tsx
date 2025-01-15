'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Bell,
  Lock,
  Building2,
  Stethoscope,
  Settings,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

type NotificationKey = 'newAnswers' | 'mentionsAndReplies' | 'acceptedSolutions' | 'weeklyDigest' | 'emailNotifications';

const SettingsPanel = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  // Profile settings state
  const [profile, setProfile] = useState({
    fullName: 'Dr. Sarah Smith',
    email: 'sarah.smith@hospital.com',
    specialty: 'cardiology',
    institution: 'Central Medical Center',
    biography: 'Cardiologist with 10 years of experience in interventional procedures.'
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    newAnswers: true,
    mentionsAndReplies: true,
    acceptedSolutions: true,
    weeklyDigest: false,
    emailNotifications: true
  });

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Implement Supabase profile update
      console.log('Updating profile:', profile);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      // Implement Supabase password change
      console.log('Changing password');
      setSuccessMessage('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to change password');
    }
  };

  const handleNotificationChange = (key: NotificationKey) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {successMessage && (
        <Alert className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your personal and professional information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select
                  value={profile.specialty}
                  onValueChange={(value) => setProfile({ ...profile, specialty: value })}
                >
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="radiology">Radiology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography">Professional Biography</Label>
              <textarea
                id="biography"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={profile.biography}
                onChange={(e) => setProfile({ ...profile, biography: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Update your password and security preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Change Password</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Customize how you want to receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Answers</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications when someone answers your cases
                </p>
              </div>
              <Switch
                checked={notifications.newAnswers}
                onCheckedChange={() => handleNotificationChange('newAnswers')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mentions & Replies</Label>
                <p className="text-sm text-gray-500">
                  Get notified when you're mentioned or someone replies to your answer
                </p>
              </div>
              <Switch
                checked={notifications.mentionsAndReplies}
                onCheckedChange={() => handleNotificationChange('mentionsAndReplies')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Accepted Solutions</Label>
                <p className="text-sm text-gray-500">
                  Notifications when your answer is marked as solution
                </p>
              </div>
              <Switch
                checked={notifications.acceptedSolutions}
                onCheckedChange={() => handleNotificationChange('acceptedSolutions')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Digest</Label>
                <p className="text-sm text-gray-500">
                  Receive a weekly summary of activity in your specialties
                </p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={() => handleNotificationChange('weeklyDigest')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email in addition to in-app alerts
                </p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={() => handleNotificationChange('emailNotifications')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;