'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function StudentSubmissions() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const res = await fetch('http://localhost:3000/api/submissions', {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const data = await res.json();
      setSubmissions(data);
    };
    if (session) fetchSubmissions();
  }, [session]);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Submissions</h2>
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white p-4 rounded shadow">
              <p><strong>Assignment:</strong> {submission.assignmentTitle}</p>
              <p><strong>Submission URL:</strong> <a href={submission.submissionUrl} className="text-blue-500">{submission.submissionUrl}</a></p>
              <p><strong>Note:</strong> {submission.note}</p>
              <p><strong>Status:</strong> {submission.status}</p>
              <p><strong>Feedback:</strong> {submission.feedback || 'None'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}