'use client';

import ReturnButton from '@/components/ReturnHome/ReturnButton';
import React, { useEffect, useState } from 'react';

const CareersPage: React.FC = () => {
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const res = await fetch('/api/careers/jobPostings'); // Correct API path
        if (!res.ok) throw new Error('Failed to fetch job postings');
        const data = await res.json();
        setJobPostings(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error occurred');
      }
    };

    fetchJobPostings();
  }, []);

  return (
    <div>
      <ReturnButton />
      <h1>Careers Page</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {jobPostings.length > 0 ? (
        <ul>
          {jobPostings.map((job) => (
            <li key={job.id}>{job.job_title} {job.description} {job.location} {job.date_posted}</li>
          ))}
        </ul>
      ) : (
        <p>No open job postings available.</p>
      )}
    </div>
  );
};

export default CareersPage;
