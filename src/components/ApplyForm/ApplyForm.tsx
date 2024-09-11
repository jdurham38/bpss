import React, { useEffect, useState } from 'react';
import styles from './ApplyForm.module.css';
import emailjs from 'emailjs-com';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client for updating num_applicants

interface ApplyFormProps {
  job: {
    num_applicants: number;
    id: number;
    job_title: string;
    description: string;
    location: string;
    created_at: string;
  };
  onClose: () => void; // Function to close the overlay
}

interface FormData {
  name: string;
  email: string;
  number: string;
  userLocation: string;
  resume: File | null; // Explicitly type resume as File | null
  resumeBase64: string | null; // Store base64-encoded resume
}

const ApplyForm: React.FC<ApplyFormProps> = ({ job, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    number: '',
    userLocation: '',
    resume: null,
    resumeBase64: null, // Initially null
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    // Disable scrolling on the body when the overlay is active
    document.body.classList.add('no-scroll');

    // Cleanup: Re-enable scrolling on body when the overlay is closed
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const templateParams = {
      name: formData.name,
      email: formData.email,
      number: formData.number,
      userLocation: formData.userLocation,
      job_title: job.job_title,
      job_description: job.description,
      job_location: job.location,
      job_date_posted: job.created_at,
    };

    try {
      // Send email via emailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_JOB_TEMPLATE_ID || '',
        templateParams,
        process.env.NEXT_PUBLIC_USER_ID || ''
      );

      // Increment the num_applicants field for the job
      const { data, error } = await supabase
        .from('jobapplications') // Ensure this matches your Supabase table
        .update({ num_applicants: job.num_applicants + 1 })
        .eq('id', job.id);

      if (error) {
        throw new Error('Failed to update applicant count');
      }

      setIsSuccess(true);
      setStatusMessage('Application submitted successfully!');
      setFormData({ name: '', email: '', number: '', userLocation: '', resume: null, resumeBase64: null });
    } catch (error) {
      setIsSuccess(false);
      setStatusMessage('Failed to submit application.');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2>Apply for {job.job_title}</h2>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Date Posted:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
        <p><strong>Job Description:</strong></p>
        <p dangerouslySetInnerHTML={{ __html: job.description }} />

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="number">Phone Number:</label>
            <input type="text" id="number" name="number" value={formData.number} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userLocation">Your Location:</label>
            <input type="text" id="userLocation" name="userLocation" value={formData.userLocation} onChange={handleChange} required />
          </div>

          <button type="submit" className={styles.submitButton}>Submit Application</button>
        </form>

        {statusMessage && (
          <p className={isSuccess ? styles.successMessage : styles.errorMessage}>
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplyForm;
