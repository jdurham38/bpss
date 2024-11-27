'use client';

import ReturnButton from '@/components/ReturnHome/ReturnButton';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import ApplyForm from '@/components/ApplyForm/ApplyForm';

interface JobPosting {
  id: number;
  num_applicants: number;
  job_title: string;
  description: string; // This contains rich text HTML from ReactQuill
  location: string;
  created_at: string;
}

const CareersPage: React.FC = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [filteredJobPostings, setFilteredJobPostings] = useState<JobPosting[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null); // For the selected job when applying
  const [loading, setLoading] = useState(true); // Loading state for spinner
  const [locationFilter, setLocationFilter] = useState(''); // For dropdown
  const [dateFilter, setDateFilter] = useState('all');
  const [showDescriptionModal, setShowDescriptionModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  useEffect(() => {
    if (showDescriptionModal) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable background scrolling
      document.body.style.overflow = 'auto';
    }
  
    // Clean up when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDescriptionModal]);
  

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const res = await fetch('/api/careers/jobPostings');
        if (!res.ok) throw new Error('Failed to fetch job postings');
        const data = await res.json();
        setJobPostings(data);
        setFilteredJobPostings(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error occurred');
      } finally {
        setLoading(false); // Stop loading after fetch completes
      }
    };

    fetchJobPostings();
  }, []);

  // Filtering logic based on location and date
  const handleFilterChange = () => {
    let filteredJobs = [...jobPostings];

    if (locationFilter) {
      filteredJobs = filteredJobs.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      filteredJobs = filteredJobs.filter((job) => {
        const jobDate = new Date(job.created_at);
        switch (dateFilter) {
          case '24hours':
            return now.getTime() - jobDate.getTime() <= 24 * 60 * 60 * 1000;
          case '1week':
            return now.getTime() - jobDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
          case '2weeks':
            return now.getTime() - jobDate.getTime() <= 14 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    setFilteredJobPostings(filteredJobs);
    setCurrentPage(1); // Reset pagination to first page
  };

  const handleApplyClick = (job: JobPosting) => {
    setSelectedJob(job); // Set the selected job to display in the apply form
  };

  const handleCloseForm = () => {
    setSelectedJob(null); // Close the overlay form
  };

  const handleReadMoreClick = (description: string) => {
    setModalContent(description);
    setShowDescriptionModal(true);
  };

  const handleCloseModal = () => {
    setShowDescriptionModal(false);
    setModalContent('');
  };


  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobPostings.slice(indexOfFirstJob, indexOfLastJob);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.background}>
      <p className={styles.coreValues}>
        At Big Pop&#39;s, we embody our Core Values of Community, Quality, Respect, Authenticity, and Fun in everything we do, bringing our shared commitment and passion to every experience.
      </p>
      <ReturnButton />
      <h1 className={styles.heading}>Careers</h1>
  
      {error && <p className={styles.errorMessage}>{error}</p>}
  
      {/* Filters */}
      <div className={styles.filterContainer}>
        <label>
          Location:
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className={styles.select}
          >
            <option value="">All Locations</option>
            <option value="ny">NY</option>
            <option value="vt">VT</option>
          </select>
        </label>

  
        <button onClick={handleFilterChange} className={styles.filterButton}>
          Apply Filters
        </button>
      </div>
  
      {/* Show loading animation while fetching data */}
      {loading && <div className={styles.loader}>Loading...</div>}
  
      {/* Job Listings in a grid */}
      {!loading && filteredJobPostings.length > 0 ? (
        <div className={styles.gridContainer}>
          {currentJobs.map((job) => (
            <div key={job.id} className={styles.jobBox}>
              <h3>{job.job_title}</h3>
              {/* Job description with conditional "Read More" */}
              <div className={styles.jobDescription}>
                <div
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>
              {/* Check if the description is longer than a certain length */}
              {job.description.length > 200 && (
                <button
                  className={styles.readMoreButton}
                  onClick={() => handleReadMoreClick(job.description)}
                >
                  Read More
                </button>
              )}
              <p className={styles.text}><strong>Location:</strong> {job.location}</p>
              <button className={styles.applyButton} onClick={() => handleApplyClick(job)}>
                Apply
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className={styles.text}>No open job postings available.</p>
      )}
  
      {/* Modal Overlay for Full Description */}
      {showDescriptionModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeModalButton}
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <div dangerouslySetInnerHTML={{ __html: modalContent }} />
          </div>
        </div>
      )}
  
      {selectedJob && <ApplyForm job={selectedJob} onClose={handleCloseForm} />}
  
      {/* Pagination */}
      {filteredJobPostings.length > jobsPerPage && (
        <div className={styles.paginationContainer}>
          {Array.from(
            {
              length: Math.ceil(
                filteredJobPostings.length / jobsPerPage
              ),
            },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={
                  i + 1 === currentPage
                    ? styles.activePageButton
                    : styles.pageButton
                }
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
  
};

export default CareersPage;
