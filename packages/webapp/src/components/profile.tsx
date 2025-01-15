import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  FileQuestion, 
  MessageSquare, 
  Star,
  Award,
  Settings,
  Mail,
  Building2
} from 'lucide-react';

const Profile = () => {
  // Mock data - replace with Supabase query
  const profile = {
    id: 1,
    name: "Dr. Sarah Smith",
    email: "sarah.smith@hospital.com",
    specialty: "Cardiology",
    institution: "Central Medical Center",
    joinDate: "2024-12-01",
    stats: {
      casesCreated: 15,
      answersGiven: 42,
      acceptedAnswers: 12,
      reputation: 856
    },
    recentActivity: {
      cases: [
        {
          id: 1,
          title: "Complex Cardiac Case: Unusual ECG Patterns",
          status: "open",
          created_at: "2025-01-14T10:00:00Z"
        },
        {
          id: 2,
          title: "Post-MI Complications Discussion",
          status: "resolved",
          created_at: "2025-01-10T15:30:00Z"
        }
      ],
      answers: [
        {
          id: 1,
          case_title: "Interpretation of Echo Results",
          is_accepted: true,
          created_at: "2025-01-13T09:15:00Z"
        },
        {
          id: 2,
          case_title: "Acute Heart Failure Management",
          is_accepted: false,
          created_at: "2025-01-12T14:20:00Z"
        }
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <div className="space-y-1 mt-1">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {profile.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    {profile.institution}
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileQuestion className="h-6 w-6 mx-auto text-blue-500" />
                  <div className="mt-2 text-2xl font-bold">{profile.stats.casesCreated}</div>
                  <div className="text-sm text-gray-500">Cases Created</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <MessageSquare className="h-6 w-6 mx-auto text-green-500" />
                  <div className="mt-2 text-2xl font-bold">{profile.stats.answersGiven}</div>
                  <div className="text-sm text-gray-500">Answers Given</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Star className="h-6 w-6 mx-auto text-yellow-500" />
                  <div className="mt-2 text-2xl font-bold">{profile.stats.acceptedAnswers}</div>
                  <div className="text-sm text-gray-500">Accepted Answers</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Award className="h-6 w-6 mx-auto text-purple-500" />
                  <div className="mt-2 text-2xl font-bold">{profile.stats.reputation}</div>
                  <div className="text-sm text-gray-500">Reputation</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Activity Tabs */}
      <Tabs defaultValue="cases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cases">My Cases</TabsTrigger>
          <TabsTrigger value="answers">My Answers</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          {profile.recentActivity.cases.map(case_ => (
            <Card key={case_.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium hover:text-blue-600 cursor-pointer">
                      {case_.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Created on {new Date(case_.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant={case_.status === 'resolved' ? 'secondary' : 'default'}>
                    {case_.status === 'resolved' ? 'Resolved' : 'Open'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="answers" className="space-y-4">
          {profile.recentActivity.answers.map(answer => (
            <Card key={answer.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium hover:text-blue-600 cursor-pointer">
                      {answer.case_title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Answered on {new Date(answer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {answer.is_accepted && (
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      Accepted Answer
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;