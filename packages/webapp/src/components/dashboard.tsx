import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileQuestion, 
  MessageSquare, 
  TrendingUp, 
  Users,
  CheckCircle2,
  Plus,
  Clock,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  // Mock data - replace with Supabase queries
  const stats = {
    totalCases: 1247,
    activeCases: 89,
    totalDoctors: 412,
    responseRate: 94
  };

  const recentCases = [
    {
      id: 1,
      title: "Unusual Presentation of Acute Coronary Syndrome",
      specialty: "Cardiology",
      status: "open",
      answers: 3,
      created_at: "2025-01-14T10:00:00Z"
    },
    {
      id: 2,
      title: "Complex Spine MRI Interpretation",
      specialty: "Radiology",
      status: "open",
      answers: 2,
      created_at: "2025-01-14T09:30:00Z"
    },
    {
      id: 3,
      title: "Post-operative Complications in Total Hip Replacement",
      specialty: "Orthopedics",
      status: "resolved",
      answers: 5,
      created_at: "2025-01-13T16:45:00Z"
    }
  ];

  const topSpecialties = [
    { name: "Cardiology", cases: 324 },
    { name: "Radiology", cases: 256 },
    { name: "Neurology", cases: 198 },
    { name: "Orthopedics", cases: 167 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Dr. Smith</h1>
          <p className="text-gray-500">Here's what's happening in the medical community</p>
        </div>
        <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Case
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Cases</p>
                <p className="text-2xl font-bold">{stats.totalCases}</p>
              </div>
              <FileQuestion className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Cases</p>
                <p className="text-2xl font-bold">{stats.activeCases}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Registered Doctors</p>
                <p className="text-2xl font-bold">{stats.totalDoctors}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Response Rate</p>
                <p className="text-2xl font-bold">{stats.responseRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-semibold">
                <Clock className="mr-2 h-5 w-5" />
                Recent Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCases.map(case_ => (
                  <div 
                    key={case_.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{case_.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Badge variant="outline">{case_.specialty}</Badge>
                        <span>•</span>
                        <span>{new Date(case_.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{case_.answers} answers</span>
                      </div>
                    </div>
                    <Badge variant={case_.status === 'resolved' ? 'secondary' : 'default'}>
                      {case_.status === 'resolved' ? 'Resolved' : 'Open'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Specialties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Top Specialties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSpecialties.map(specialty => (
                  <div 
                    key={specialty.name}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{specialty.name}</span>
                    <Badge variant="outline">{specialty.cases} cases</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Case
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Browse Open Cases
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  View Resolved Cases
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;