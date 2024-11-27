import React, { useEffect, useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import styles from './ApplyForm.module.css';

interface ApplyFormProps {
  job: {
    id: number;
    job_title: string;
    description: string;
    location: string;
    created_at: string;
  };
  onClose: () => void;
}

const ApplyForm: React.FC<ApplyFormProps> = ({ job, onClose }) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement | null>(null); // Use ref for the form

  useEffect(() => {
    const scrollPosition = window.scrollY; // Capture current scroll position
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${scrollPosition}px`; // Freeze scroll position
  
    return () => {
      document.body.classList.remove('no-scroll');
      document.body.style.top = ''; // Remove top style
      window.scrollTo(0, scrollPosition); // Restore scroll position
    };
  }, []);
  

  const handleFileValidation = (file: File | null) => {
    if (!file) return false;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setFileError('Only PDF files are allowed.');
      return false;
    }

    // Validate file size (1MB = 1,048,576 bytes)
    if (file.size > 1048576) {
      setFileError('File size must be less than 1MB.');
      return false;
    }

    setFileError(null); // Clear file errors if validation passes
    return true;
  };

  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = formRef.current;
    if (!formElement) return; // Ensure the form exists

    const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0] || null;

    // Validate the file before submission
    if (!handleFileValidation(file)) {
      return;
    }

    // Strip HTML tags from the job description
    const cleanDescription = stripHtmlTags(job.description);

    // Manually set the cleaned job description to a hidden input field in the form
    const descriptionInput = document.createElement('input');
    descriptionInput.setAttribute('type', 'hidden');
    descriptionInput.setAttribute('name', 'job_description_clean');
    descriptionInput.setAttribute('value', cleanDescription);
    formElement.appendChild(descriptionInput); // Append it to the form

    // Send the form using emailjs.sendForm
    emailjs.sendForm(
      process.env.NEXT_PUBLIC_SERVICE_ID || '',
      process.env.NEXT_PUBLIC_JOB_TEMPLATE_ID || '',
      formElement,
      process.env.NEXT_PUBLIC_USER_ID || ''
    ).then(
      () => {
        setIsSuccess(true);
        setStatusMessage('Application submitted successfully!');

        // Clear form fields using ref
        formElement.reset();

        // Automatically close the form after 5 seconds
        setTimeout(onClose, 5000);
      },
      (error) => {
        setIsSuccess(false);
        setStatusMessage(`Failed to submit application: ${error.text}`);
      }
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2>Apply for {job.job_title}</h2>
        <p><strong>Location:</strong> {job.location}</p>
    
        <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="hidden" name="job_title" value={job.job_title} />
          <input type="hidden" name="job_location" value={job.location} />

          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="number">Phone Number:</label>
            <input type="text" id="number" name="number" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="userLocation">Your Location:</label>
            <input type="text" id="userLocation" name="userLocation" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="resume">Attach Resume (PDF only, max 1MB):</label>
            <input type="file" id="resume" name="my_file" required accept="application/pdf" />
          </div>

          {fileError && <p className={styles.errorMessage}>{fileError}</p>} {/* Display file errors */}

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
