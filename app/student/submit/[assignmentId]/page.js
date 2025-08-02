'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';

export default function SubmitAssignment() {
  const { data: session, status } = useSession();
  const { assignmentId } = useParams();
  const router = useRouter();
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');

  useEffect(() => {
    const fetchAssignment = async () => {
      if (status === 'authenticated' && assignmentId) {
        try {
          const res = await fetch(`http://localhost:3000/api/assignments/${assignmentId}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          if (!res.ok) throw new Error('Failed to fetch assignment');
          const data = await res.json();
          setAssignmentTitle(data.title || 'Untitled Assignment');
        } catch (err) {
          setError('Error fetching assignment details');
          console.error(err);
        }
      }
    };

    fetchAssignment();
  }, [assignmentId, session, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ assignmentId: Number(assignmentId), submissionUrl, note }),
      });
      if (res.ok) {
        router.push('/student/submissions');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to submit assignment');
      }
    } catch (error) {
      setError('Something went wrong');
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || session.user.role !== 'student') {
    return <div className="min-h-screen flex items-center justify-center">Access denied</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Submit Assignment</h2>
        <h3 className="text-xl font-semibold mb-4">Assignment: {assignmentTitle}</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Submission URL</label>
            <input
              type="url"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}