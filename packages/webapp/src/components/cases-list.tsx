'use client';

import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ArrowUpRight } from 'lucide-react';

const CasesList = () => {
  const [specialty, setSpecialty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual Supabase query
  const cases = [
    {
      id: 1,
      title: "Complex Cardiac Case: Unusual ECG Patterns",
      specialty: "Cardiology",
      status: "open",
      author: "Dr. Smith",
      created_at: "2025-01-14T10:00:00Z",
      answers_count: 3
    },
    {
      id: 2,
      title: "Interpretation of Cervical Spine MRI",
      specialty: "Radiology",
      status: "resolved",
      author: "Dr. Johnson",
      created_at: "2025-01-13T15:30:00Z",
      answers_count: 5
    },
    // Add more mock cases here
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Clinical Cases</h2>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Case
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="radiology">Radiology</SelectItem>
            <SelectItem value="neurology">Neurology</SelectItem>
            <SelectItem value="orthopedics">Orthopedics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cases List */}
      <div className="grid gap-4">
        {cases.map((case_) => (
          <Card key={case_.id} className="hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg hover:text-blue-600 cursor-pointer flex items-center">
                    {case_.title}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{case_.author}</span>
                    <span>•</span>
                    <span>{new Date(case_.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge variant={case_.status === 'resolved' ? 'secondary' : 'default'}>
                  {case_.status === 'resolved' ? 'Resolved' : 'Open'}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <Badge variant="outline" className="bg-blue-50">
                  {case_.specialty}
                </Badge>
                <span className="text-sm text-gray-500">
                  {case_.answers_count} {case_.answers_count === 1 ? 'answer' : 'answers'}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CasesList;