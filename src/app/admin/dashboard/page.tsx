'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; 
import Link from 'next/link'; 
import dynamic from 'next/dynamic';
import styles from './AdminDashboard.module.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; 

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  const [closedJobs, setClosedJobs] = useState<any[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      setLoadingUser(true); 
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUser(null);
      } else {
        setUser(user);
        fetchJobPostings();
      }
      setLoadingUser(false); 
    };

    checkUser();
  }, []);

  const fetchJobPostings = async () => {
    setLoadingJobs(true); 
    const { data: jobs, error } = await supabase.from('jobapplications').select('*');
    
    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      const openJobs = jobs.filter((job: any) => job.is_open === true);
      const closedJobs = jobs.filter((job: any) => job.is_open === false);
      setOpenJobs(openJobs);
      setClosedJobs(closedJobs);
    }
    setLoadingJobs(false); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editMode && editingJobId) {
      const { data, error } = await supabase
        .from('jobapplications')
        .update({
          job_title: jobTitle,
          location: location,
          description: description
        })
        .eq('id', editingJobId);

      if (error) {
        setError('Failed to update job posting: ' + error.message);
        setSuccess(null);
      } else {
        setSuccess('Job posting updated successfully!');
        setError(null);
        resetForm();
        fetchJobPostings();
      }
    } else {
      const { data, error } = await supabase.from('jobapplications').insert([
        {
          job_title: jobTitle,
          location: location,
          description: description,
          num_applicants: 0,
          is_open: true 
        }
      ]);

      if (error) {
        setError('Failed to create job posting: ' + error.message);
        setSuccess(null);
      } else {
        setSuccess('Job posting created successfully!');
        setError(null);
        resetForm();
        fetchJobPostings();
      }
    }
  };

  const handleDelete = async (jobId: number) => {
    const { data, error } = await supabase.from('jobapplications').delete().eq('id', jobId);
    if (error) {
      setError('Failed to delete job posting: ' + error.message);
    } else {
      setSuccess('Job posting deleted successfully!');
      fetchJobPostings();
    }
  };

  const handleEdit = (job: any) => {
    setEditMode(true);
    setEditingJobId(job.id);
    setJobTitle(job.job_title);
    setLocation(job.location);
    setDescription(job.description);
  };

  const handleCloseJob = async (jobId: number) => {
    const { data, error } = await supabase
      .from('jobapplications')
      .update({ is_open: false })
      .eq('id', jobId);

    if (error) {
      setError('Failed to close job posting: ' + error.message);
    } else {
      setSuccess('Job closed successfully!');
      fetchJobPostings();
    }
  };

  const handleOpenJob = async (jobId: number) => {
    const { data, error } = await supabase
      .from('jobapplications')
      .update({ is_open: true })
      .eq('id', jobId);

    if (error) {
      setError('Failed to open job posting: ' + error.message);
    } else {
      setSuccess('Job opened successfully!');
      fetchJobPostings();
    }
  };

  const resetForm = () => {
    setJobTitle('');
    setLocation('');
    setDescription('');
    setEditMode(false);
    setEditingJobId(null);
  };

  return (
    <div className={styles.dashboard}>
      {loadingUser ? (
        <p className={styles.paragraph}>Loading...</p>
      ) : user ? (
        <div className={styles.container}>
          <h1 className={styles.headingPrimary}>Welcome, {user.email}</h1>
          <p className={styles.paragraph}>Create, edit, or delete job postings below:</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div>
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                className={styles.inputField}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="location">Location</label>
              <select
                id="location"
                className={styles.selectField}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              >
                <option value="">Select a location</option>
                <option value="NY">NY</option>
                <option value="VT">VT</option>
              </select>
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                className={styles.quill}
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              {editMode ? 'Update Job Posting' : 'Create Job Posting'}
            </button>
            {editMode && (
              <button type="button" onClick={resetForm} className={styles.cancelButton}>
                Cancel Edit
              </button>
            )}
          </form>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}

          <h2 className={styles.headingSecondary}>Open Job Postings</h2>
          {loadingJobs ? (
            <p className={styles.paragraph}>Loading job postings...</p>
          ) : (
            <ul className={styles.jobList}>
              {openJobs.map((job) => (
                <li key={job.id} className={styles.jobListItem}>
                  <div className={styles.jobInfo}>
                    <h3>{job.job_title}</h3>
                    <p>{job.location}</p>
                    <div
                      dangerouslySetInnerHTML={{ __html: job.description }}
                      className={styles.description}
                    />
                    <p><strong>Applicants:</strong> {job.num_applicants}</p>
                  </div>
                  <div className={styles.jobActions}>
                    <button className={styles.editButton} onClick={() => handleEdit(job)}>Edit</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(job.id)}>Delete</button>
                    <button className={styles.closeButton} onClick={() => handleCloseJob(job.id)}>Close Job</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h2 className={styles.headingSecondary}>Closed Job Postings</h2>
          {loadingJobs ? (
            <p className={styles.paragraph}>Loading job postings...</p>
          ) : (
            <ul className={styles.jobList}>
              {closedJobs.map((job) => (
                <li key={job.id} className={styles.jobListItem}>
                  <div className={styles.jobInfo}>
                    <h3>{job.job_title}</h3>
                    <p>{job.location}</p>
                    <div
                      dangerouslySetInnerHTML={{ __html: job.description }}
                      className={styles.description}
                    />
                    <p><strong>Applicants:</strong> {job.num_applicants}</p>
                  </div>
                  <div className={styles.jobActions}>
                    <button className={styles.editButton} onClick={() => handleEdit(job)}>Edit</button>
                    <button className={styles.deleteButton} onClick={() => handleDelete(job.id)}>Delete</button>
                    <button className={styles.openButton} onClick={() => handleOpenJob(job.id)}>Open Job</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className={styles.paragraph}>
          You are not logged in. Please <Link href="/admin/login">login here</Link>.
        </p>
      )}
    </div>
  );
}
