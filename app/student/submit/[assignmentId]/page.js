'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';

export default function SubmitAssignment() {
  const { data: session } = useSession();
  const { assignmentId } = useParams();
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Submit Assignment</h2>
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
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