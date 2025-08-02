'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

export default function Submissions() {
  const { data: session } = useSession();
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      const res = await fetch(`http://localhost:3000/api/submissions?assignmentId=${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const data = await res.json();
      setSubmissions(data);
    };
    if (session) fetchSubmissions();
  }, [session, assignmentId]);

  const handleUpdate = async (submissionId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/submissions/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          status: status[submissionId] || 'pending',
          feedback: feedback[submissionId] || '',
        }),
      });
      if (res.ok) {
        alert('Submission updated');
        const updatedSubmissions = submissions.map((sub) =>
          sub.id === submissionId
            ? { ...sub, status: status[submissionId], feedback: feedback[submissionId] }
            : sub
        );
        setSubmissions(updatedSubmissions);
      }
    } catch (error) {
      alert('Failed to update submission');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Submissions for Assignment {assignmentId}</h2>
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white p-4 rounded shadow">
              <p><strong>Student:</strong> {submission.studentName}</p>
              <p><strong>Submission URL:</strong> <a href={submission.submissionUrl} className="text-blue-500">{submission.submissionUrl}</a></p>
              <p><strong>Note:</strong> {submission.note}</p>
              <p><strong>Status:</strong> {submission.status}</p>
              <p><strong>Feedback:</strong> {submission.feedback || 'None'}</p>
              <div className="mt-4">
                <label className="block text-gray-700">Update Status</label>
                <select
                  value={status[submission.id] || submission.status}
                  onChange={(e) => setStatus({ ...status, [submission.id]: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <label className="block text-gray-700">Feedback</label>
                <textarea
                  value={feedback[submission.id] || ''}
                  onChange={(e) => setFeedback({ ...feedback, [submission.id]: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                />
                <button
                  onClick={() => handleUpdate(submission.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}