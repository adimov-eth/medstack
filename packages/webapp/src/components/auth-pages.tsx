'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Lock,
  Upload,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const LoginForm = ({ setError }: { setError: (error: string) => void }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="doctor@hospital.com"
            className="pl-10"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            className="pl-10"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Log In
      </Button>
    </form>
  );
};

const RegisterForm = ({ setError }: { setError: (error: string) => void }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    specialty: '',
    institution: '',
    diploma: null as File | null
  });

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 1. Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Upload diploma if provided
      let diplomaUrl = null;
      if (formData.diploma) {
        const fileExt = formData.diploma.name.split('.').pop();
        const fileName = `${authData.user?.id}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('diplomas')
          .upload(fileName, formData.diploma);

        if (uploadError) throw uploadError;
        diplomaUrl = data.path;
      }

      // 3. Create profile
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: authData.user?.id,
          email: formData.email,
          full_name: formData.fullName,
          specialty: formData.specialty || null,
          institution: formData.institution,
          diploma_url: diplomaUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create profile');
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF or image file');
        return;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      setFormData({ ...formData, diploma: file as File });
      setError('');
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="fullName"
            placeholder="Dr. John Smith"
            className="pl-10"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="doctor@hospital.com"
            className="pl-10"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            className="pl-10"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialty">Specialty</Label>
        <Select
          value={formData.specialty}
          onValueChange={(value) => setFormData({ ...formData, specialty: value })}
        >
          <SelectTrigger id="specialty">
            <SelectValue placeholder="Select your specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="radiology">Radiology</SelectItem>
            <SelectItem value="neurology">Neurology</SelectItem>
            <SelectItem value="orthopedics">Orthopedics</SelectItem>
            <SelectItem value="internal">Internal Medicine</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="institution">Institution</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="institution"
            placeholder="Hospital or Medical Center"
            className="pl-10"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diploma">Medical License/Diploma</Label>
        <div className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <input
            id="diploma"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label 
            htmlFor="diploma" 
            className="flex flex-col items-center cursor-pointer space-y-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-500">
              {formData.diploma ? formData.diploma.name : 'Upload your medical license or diploma'}
            </span>
            <span className="text-xs text-gray-400">
              PDF, JPG or PNG (max. 5MB)
            </span>
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
};

const AuthPages = () => {
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">MedStack</CardTitle>
          <CardDescription className="text-center">
            A platform for medical professionals to discuss clinical cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login">
              <LoginForm setError={setError} />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm setError={setError} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPages;