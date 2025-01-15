'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Users,
  Clock,
  Activity,
  BarChart2,
  Calendar
} from 'lucide-react';

// Create a client-only chart components
const Charts = React.lazy(() => import('@/components/charts'));

const AnalyticsDashboard = () => {
  // Mock data
  const casesTrendData = [
    { month: 'Jan', newCases: 45, resolvedCases: 38 },
    { month: 'Feb', newCases: 52, resolvedCases: 43 },
    { month: 'Mar', newCases: 61, resolvedCases: 52 },
    { month: 'Apr', newCases: 58, resolvedCases: 49 },
    { month: 'May', newCases: 63, resolvedCases: 55 },
    { month: 'Jun', newCases: 72, resolvedCases: 61 }
  ];

  const specialtyDistribution = [
    { name: 'Cardiology', value: 35 },
    { name: 'Radiology', value: 25 },
    { name: 'Neurology', value: 20 },
    { name: 'Orthopedics', value: 15 },
    { name: 'Other', value: 5 }
  ];

  const responseTimeData = [
    { time: '<1h', cases: 142 },
    { time: '1-4h', cases: 256 },
    { time: '4-12h', cases: 187 },
    { time: '12-24h', cases: 95 },
    { time: '>24h', cases: 43 }
  ];

  const userEngagement = [
    { day: 'Mon', activeUsers: 234, answers: 67 },
    { day: 'Tue', activeUsers: 278, answers: 82 },
    { day: 'Wed', activeUsers: 289, answers: 91 },
    { day: 'Thu', activeUsers: 256, answers: 76 },
    { day: 'Fri', activeUsers: 245, answers: 72 },
    { day: 'Sat', activeUsers: 167, answers: 45 },
    { day: 'Sun', activeUsers: 189, answers: 51 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500">Platform insights and statistics</p>
        </div>
        <Select defaultValue="7d">
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Cases</p>
                <h3 className="text-2xl font-bold">1,247</h3>
                <p className="text-green-600 text-sm">+12% from last month</p>
              </div>
              <BarChart2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Active Users</p>
                <h3 className="text-2xl font-bold">412</h3>
                <p className="text-green-600 text-sm">+8% from last month</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Avg. Response Time</p>
                <h3 className="text-2xl font-bold">3.2h</h3>
                <p className="text-red-600 text-sm">+0.5h from last month</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Resolution Rate</p>
                <h3 className="text-2xl font-bold">87%</h3>
                <p className="text-green-600 text-sm">+5% from last month</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <React.Suspense fallback={<div>Loading charts...</div>}>
        <Charts 
          casesTrendData={casesTrendData}
          specialtyDistribution={specialtyDistribution}
          responseTimeData={responseTimeData}
          userEngagement={userEngagement}
          colors={COLORS}
        />
      </React.Suspense>
    </div>
  );
};

export default AnalyticsDashboard;