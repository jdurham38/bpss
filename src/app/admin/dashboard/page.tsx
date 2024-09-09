'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  const [closedJobs, setClosedJobs] = useState<any[]>([]);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login'); // Redirect to login if not authenticated
      } else {
        setUser(user);
        fetchJobPostings(); // Fetch job postings when the user is authenticated
      }
    };

    checkUser();
  }, [router]);

  // Fetch job postings
  const fetchJobPostings = async () => {
    const { data: jobs, error } = await supabase.from('jobapplications').select('*');
    
    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      // Separate jobs by 'is_open'
      const openJobs = jobs.filter((job: any) => job.is_open === true);
      const closedJobs = jobs.filter((job: any) => job.is_open === false);
      setOpenJobs(openJobs);
      setClosedJobs(closedJobs);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Insert job posting data into Supabase
    const { data, error } = await supabase.from('jobapplications').insert([
      {
        job_title: jobTitle,
        location: location,
        description: description,
        num_applicants: 0,
        is_open: true  // Default is_open to true for new job postings
      }
    ]);

    if (error) {
      setError('Failed to create job posting: ' + error.message);
      setSuccess(null);
    } else {
      setSuccess('Job posting created successfully!');
      setError(null);
      setJobTitle('');
      setLocation('');
      setDescription('');
      fetchJobPostings();  // Refresh the job postings list after creation
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.email}</h1>
          <p>This is the admin dashboard where you can create a job posting.</p>

          {/* Job Posting Form */}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button type="submit">Create Job Posting</button>
          </form>

          {/* Display error or success message */}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          {/* Display Open Jobs */}
          <h2>Open Job Postings</h2>
          {openJobs.length > 0 ? (
            <ul>
              {openJobs.map((job) => (
                <li key={job.id}>
                  {job.job_title} - {job.location} - {job.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No open jobs.</p>
          )}

          {/* Display Closed Jobs */}
          <h2>Closed Job Postings</h2>
          {closedJobs.length > 0 ? (
            <ul>
              {closedJobs.map((job) => (
                <li key={job.id}>
                  {job.job_title} - {job.location} - {job.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No closed jobs.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
