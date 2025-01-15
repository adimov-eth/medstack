'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, X, AlertTriangle, Upload } from 'lucide-react';

const CreateCase = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    specialty: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtyChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      specialty: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    // Validate file types and sizes
    const invalidFiles = newFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/dicom'];
      const maxSize = 100 * 1024 * 1024; // 100MB
      
      return !validTypes.includes(file.type) || file.size > maxSize;
    });

    if (invalidFiles.length > 0) {
      setError('Some files were rejected. Please only upload images, PDFs, or DICOM files under 100MB.');
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.specialty) {
      setError('Please fill in all required fields.');
      return;
    }

    // Show privacy confirmation
    setShowPrivacyAlert(true);
  };

  const handleConfirmedSubmit = async () => {
    try {
      // Here you would:
      // 1. Upload files to Supabase Storage
      // 2. Create case record in database
      // 3. Link files to case
      console.log('Submitting:', { formData, files });
      
      // Reset form after successful submission
      setFormData({ title: '', description: '', specialty: '' });
      setFiles([]);
      setShowPrivacyAlert(false);
      
    } catch (error) {
      setError('An error occurred while creating the case. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Clinical Case</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Case Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title"
            />
          </div>

          {/* Specialty */}
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Select
              value={formData.specialty}
              onValueChange={handleSpecialtyChange}
            >
              <SelectTrigger id="specialty">
                <SelectValue placeholder="Select a specialty" />
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Case Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed information about the case"
              className="min-h-[200px]"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf,.dcm"
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Drop files here or click to upload
                </span>
                <span className="text-xs text-gray-400">
                  Supports: Images, PDFs, DICOM files (max 100MB)
                </span>
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              Create Case
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Confirmation Dialog */}
      <AlertDialog open={showPrivacyAlert} onOpenChange={setShowPrivacyAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm that all patient identifying information has been removed 
              from the case description and attached files. This is crucial for 
              maintaining patient privacy and confidentiality.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConfirmedSubmit}>
              Confirm & Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateCase;