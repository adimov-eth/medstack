'use client';

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  Paperclip,
  Image,
  Check
} from 'lucide-react';

const CaseDetail = () => {
  const [newAnswer, setNewAnswer] = useState('');

  // Mock data - replace with Supabase query
  const case_ = {
    id: 1,
    title: "Complex Cardiac Case: Unusual ECG Patterns",
    description: "67-year-old male presented with chest pain and dyspnea. ECG shows unusual ST elevation in leads V1-V3. Previous history of hypertension and diabetes. Looking for interpretation and management suggestions.",
    specialty: "Cardiology",
    status: "open",
    author: "Dr. Smith",
    created_at: "2025-01-14T10:00:00Z",
    attachments: [
      { id: 1, name: "ECG-Reading.pdf", type: "pdf" },
      { id: 2, name: "chest-xray.jpg", type: "image" }
    ],
    answers: [
      {
        id: 1,
        author: "Dr. Johnson",
        content: "Based on the ECG pattern, this could indicate Brugada syndrome. Would recommend immediate cardiac consultation and possible electrophysiology study.",
        is_accepted: false,
        likes: 5,
        created_at: "2025-01-14T11:30:00Z",
      },
      {
        id: 2,
        author: "Dr. Williams",
        content: "Agree with Dr. Johnson. The ST elevation pattern is characteristic of Brugada. Additional history of any syncope or family history of sudden cardiac death would be helpful.",
        is_accepted: true,
        likes: 8,
        created_at: "2025-01-14T12:15:00Z",
      }
    ]
  };

  const handleSubmitAnswer = () => {
    // Implement answer submission logic
    console.log("Submitting answer:", newAnswer);
    setNewAnswer('');
  };

  return (
    <div className="space-y-6">
      {/* Case Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{case_.title}</h1>
          <Badge variant={case_.status === 'resolved' ? 'secondary' : 'default'}>
            {case_.status === 'resolved' ? 'Resolved' : 'Open'}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{case_.author}</span>
          <span>•</span>
          <span>{new Date(case_.created_at).toLocaleDateString()}</span>
          <span>•</span>
          <Badge variant="outline" className="bg-blue-50">
            {case_.specialty}
          </Badge>
        </div>
      </div>

      {/* Case Content */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <p className="text-gray-700 whitespace-pre-wrap">{case_.description}</p>
          
          {/* Attachments */}
          {case_.attachments.length > 0 && (
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </h3>
              <div className="grid gap-2">
                {case_.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center gap-2 text-sm">
                    {attachment.type === 'pdf' ? (
                      <FileText className="h-4 w-4 text-red-500" />
                    ) : (
                      <Image className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {attachment.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answers Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Answers ({case_.answers.length})
        </h2>

        {/* Answer List */}
        <div className="space-y-4">
          {case_.answers.map(answer => (
            <Card key={answer.id} className={answer.is_accepted ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{answer.author}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(answer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {answer.is_accepted && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Accepted Answer
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
                <div className="mt-4 flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {answer.likes}
                  </Button>
                  {case_.status !== 'resolved' && (
                    <Button variant="ghost" size="sm" className="text-green-600">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Accept Answer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Answer Form */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Your Answer</h3>
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              className="min-h-[150px] mb-4"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitAnswer}>
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseDetail;