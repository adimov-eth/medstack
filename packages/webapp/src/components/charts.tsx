'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

interface ChartsProps {
  casesTrendData: Array<{
    month: string;
    newCases: number;
    resolvedCases: number;
  }>;
  specialtyDistribution: Array<{
    name: string;
    value: number;
  }>;
  responseTimeData: Array<{
    time: string;
    cases: number;
  }>;
  userEngagement: Array<{
    day: string;
    activeUsers: number;
    answers: number;
  }>;
  colors: string[];
}

const Charts = ({ 
  casesTrendData,
  specialtyDistribution,
  responseTimeData,
  userEngagement,
  colors 
}: ChartsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cases Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Cases Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={casesTrendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="newCases" 
                  stroke="#0088FE" 
                  name="New Cases" 
                />
                <Line 
                  type="monotone" 
                  dataKey="resolvedCases" 
                  stroke="#00C49F" 
                  name="Resolved Cases" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Specialty Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Cases by Specialty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={specialtyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {specialtyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Response Time Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Response Time Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cases" fill="#8884d8">
                  {responseTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weekly User Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userEngagement}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="activeUsers" fill="#0088FE" name="Active Users" />
                <Bar dataKey="answers" fill="#00C49F" name="Answers Posted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts; 