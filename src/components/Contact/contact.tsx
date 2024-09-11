'use client';
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import styles from './index.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'General Inquiry' // Default value for the subject
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false); // State for checkbox

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'email') {
      validateEmail(value);
    }

    if (name === 'message') {
      validateMessage(value);
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|live|aol|icloud|mail|protonmail|zoho|yandex|gmx)\.(com|edu|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)$/;
    if (!regex.test(email)) {
      setEmailError('Please enter a valid email address with a valid provider and domain extension.');
    } else {
      setEmailError('');
    }
  };

  const validateMessage = (message: string) => {
    if (message.length > 500) {
      setMessageError('Message cannot exceed 500 characters.');
    } else {
      setMessageError('');
    }
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (emailError || messageError || !isConfirmed) {
      setStatusMessage('Please fix the errors and confirm the checkbox before submitting.');
      setIsSuccess(false);
      return;
    }

    const templateParams = {
      name: formData.name,        // Passed to {{name}}
      email: formData.email,      // Passed to {{email}}
      message: formData.message,  // Passed to {{message}}
      subject: formData.subject   // Passed to {{subject}}
    };
    emailjs.send(
      process.env.NEXT_PUBLIC_SERVICE_ID || '', 
      process.env.NEXT_PUBLIC_TEMPLATE_ID || '', 
      templateParams, // Pass the subject to EmailJS template
      process.env.NEXT_PUBLIC_USER_ID || ''
    )
    .then(() => {
      setIsSuccess(true);
      setStatusMessage('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: '',
        subject: 'General Inquiry' // Reset subject to default
      });
      setIsConfirmed(false);
    }, () => {
      setIsSuccess(false);
      setStatusMessage('Failed to send message.');
    });
  };


  const handleCheckboxChange = () => {
    setIsConfirmed(!isConfirmed); // Toggle checkbox state
  };

  return (
    <div className={styles.background}>
      <h2 className={styles.heading}>Leave us a question, comment, or catering request and we will get back to you ASAP!</h2>  
      <h3 className={styles.headingTwo}>Please do not submit orders here. To place an order, click the <b>&quot;Order Now&quot;</b> button above.</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div>
            <label className={styles.labels} htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div>
            <label className={styles.labels} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {emailError && <p className={styles.errorMessage}>{emailError}</p>}
          </div>
        </div>
        <div>
          <label className={styles.labels} htmlFor="subject">Subject</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Question">Question</option>
            <option value="Catering">Catering</option>
          </select>
        </div>
        <div>
          <label className={styles.labels} htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            maxLength={500}
            required
            className={styles.textarea}
          />
          <p className={styles.charCount}>{formData.message.length}/500</p>
          {messageError && <p className={styles.errorMessage}>{messageError}</p>}
        </div>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="confirm"
            checked={isConfirmed}
            onChange={handleCheckboxChange}
            className={styles.checkbox}
          />
          <label htmlFor="confirm" className={styles.checkboxLabel}>
            I understand this is not an order submission form.
          </label>
        </div>
        <button type="submit" className={styles.button} disabled={!isConfirmed}>Submit</button>
      </form>
      {statusMessage && (
        <p className={isSuccess ? styles.successMessage : styles.errorMessage}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}
