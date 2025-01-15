'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  ImageIcon,
  Download,
  Maximize2,
  MinusCircle,
  PlusCircle,
  RotateCw,
  X,
  AlertTriangle,
  Upload
} from 'lucide-react';

const FileViewer = ({ files = [] }: { files: File[] }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageControls, setImageControls] = useState({
    zoom: 1,
    rotation: 0
  });
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Image viewer controls
  const handleZoom = (direction: 'in' | 'out') => {
    setImageControls(prev => ({
      ...prev,
      zoom: direction === 'in' 
        ? Math.min(prev.zoom + 0.25, 3) 
        : Math.max(prev.zoom - 0.25, 0.5)
    }));
  };

  const handleRotate = () => {
    setImageControls(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const resetControls = () => {
    setImageControls({ zoom: 1, rotation: 0 });
  };

  // File type detection
  const getFileType = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png'].includes(extension)) return 'image';
    if (extension === 'pdf') return 'pdf';
    if (['dcm', 'dicom'].includes(extension)) return 'dicom';
    return 'unknown';
  };

  const FilePreview = ({ file }: { file: File }) => {
    const fileType = getFileType(file);

    if (fileType === 'image') {
      return (
        <div className="relative">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            style={{
              transform: `scale(${imageControls.zoom}) rotate(${imageControls.rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
            className="max-w-full h-auto"
          />
          
          {/* Image Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/50 rounded-lg px-4 py-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleZoom('out')}
              className="text-white hover:bg-white/20"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleZoom('in')}
              className="text-white hover:bg-white/20"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRotate}
              className="text-white hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={resetControls}
              className="text-white hover:bg-white/20"
            >
              Reset
            </Button>
          </div>
        </div>
      );
    }

    if (fileType === 'pdf') {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-gray-50 rounded-lg">
          <FileText className="h-16 w-16 text-red-500" />
          <p className="text-gray-600">PDF files can be downloaded for viewing</p>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      );
    }

    if (fileType === 'dicom') {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-gray-50 rounded-lg">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
          <p className="text-gray-600">DICOM files require specialized software to view</p>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download DICOM</span>
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <AlertTriangle className="h-16 w-16 text-gray-400" />
        <p className="mt-4 text-gray-600">Unsupported file format</p>
      </div>
    );
  };

  // Empty state when no files are provided
  if (files.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">File Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No files to display</p>
            <p className="text-sm text-gray-500 mt-2">Upload files to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl">File Viewer</CardTitle>
        {selectedFile && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowFullscreen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {/* File list sidebar */}
          <div className="col-span-1 border-r pr-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                  selectedFile === file ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex items-center space-x-2">
                  {getFileType(file) === 'image' ? (
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                  ) : getFileType(file) === 'pdf' ? (
                    <FileText className="h-4 w-4 text-red-500" />
                  ) : (
                    <FileText className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <div className="mt-1 flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {getFileType(file).toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main preview area */}
          <div className="col-span-3 min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
            {selectedFile ? (
              <FilePreview file={selectedFile} />
            ) : (
              <div className="text-gray-500">
                Select a file to preview
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Fullscreen preview dialog */}
      <AlertDialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <AlertDialogContent className="max-w-screen-xl h-[90vh]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              {selectedFile?.name}
              <AlertDialogCancel className="relative inline-flex h-9 w-9 items-center justify-center rounded-full">
                <X className="h-4 w-4" />
              </AlertDialogCancel>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedFile && <FilePreview file={selectedFile} />}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

// Example usage:
const FileViewerDemo = () => {
  // Mock files for demonstration
  const mockFiles = [
    new File([''], 'example.jpg', { type: 'image/jpeg' }),
    new File([''], 'document.pdf', { type: 'application/pdf' }),
    new File([''], 'scan.dcm', { type: 'application/dicom' })
  ];

  return <FileViewer files={mockFiles} />;
};

export default FileViewer;