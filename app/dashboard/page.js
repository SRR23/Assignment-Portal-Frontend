'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [analytics, setAnalytics] = useState({ pending: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/assignments', {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch assignments');
        const data = await res.json();
        setAssignments(data || []);
      } catch (err) {
        setError('Error fetching assignments');
        console.error(err);
      }
    };

    const fetchAnalytics = async () => {
      if (session?.user?.role === 'instructor') {
        try {
          const res = await fetch('http://localhost:3000/api/submissions/analytics/status', {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });
          if (!res.ok) throw new Error('Failed to fetch analytics');
          const data = await res.json();
          setAnalytics({
            pending: data.pending || 0,
            accepted: data.accepted || 0,
            rejected: data.rejected || 0,
          });
        } catch (err) {
          setError('Error fetching analytics');
          console.error(err);
        }
      }
    };

    if (status === 'authenticated') {
      setLoading(false);
      fetchAssignments();
      fetchAnalytics();
    }
  }, [session, status]);

  // Pie chart data
  const pieData = {
    labels: ['Pending', 'Accepted', 'Rejected'],
    datasets: [
      {
        data: [analytics.pending, analytics.accepted, analytics.rejected],
        backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Please log in</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {session?.user?.role === 'instructor' && (
          <div className="mb-8">
            <Link
              href="/instructor/create-assignment"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Assignment
            </Link>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Submission Analytics</h2>
              {loading ? (
                <p>Loading analytics...</p>
              ) : (
                <div className="max-w-md mx-auto">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              )}
            </div>
          </div>
        )}

        {session?.user?.role === 'student' && (
          <div className="mb-8">
            <Link
              href="/student/submissions"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              My Submissions
            </Link>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Assignments</h2>
        {loading ? (
          <p>Loading assignments...</p>
        ) : (
          <div className="grid gap-4">
            {assignments.length === 0 ? (
              <p>No assignments available</p>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white p-4 rounded shadow">
                  <h3 className="text-xl font-semibold">{assignment.title}</h3>
                  <p className="text-gray-600">{assignment.description}</p>
                  <p className="text-gray-500">
                    Deadline: {new Date(assignment.deadline).toLocaleString()}
                  </p>
                  {session?.user?.role === 'student' && (
                    <Link
                      href={`/student/submit/${assignment.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Submit Assignment
                    </Link>
                  )}
                  {session?.user?.role === 'instructor' && (
                    <Link
                      href={`/instructor/submissions/${assignment.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Submissions
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}