import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './index.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState('');

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
    if (emailError || messageError || !recaptchaValue) {
      setStatusMessage('Please fix the errors before submitting.');
      setIsSuccess(false);
      return;
    }
    emailjs.send(
      process.env.REACT_APP_SERVICE_ID || '', // Replace with your EmailJS service ID
      process.env.REACT_APP_TEMPLATE_ID || '', // Replace with your EmailJS template ID
      formData,
      process.env.REACT_APP_USER_ID || '' // Replace with your EmailJS user ID
    )
    .then(() => {
      setIsSuccess(true);
      setStatusMessage('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setRecaptchaValue(''); // Reset reCAPTCHA
    }, () => {
      setIsSuccess(false);
      setStatusMessage('Failed to send message.');
    });
  };

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value || '');
  };

  return (
    <div className={styles.background}>
      <h2>Leave us a comment or suggestion and we will get back to you ASAP!</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailError && <p className={styles.errorMessage}>{emailError}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            maxLength={500}
            required
          />
          <p className={styles.charCount}>{formData.message.length}/500</p>
          {messageError && <p className={styles.errorMessage}>{messageError}</p>}
        </div>
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_SITE_KEY || ''} // Replace with your reCAPTCHA site key
          onChange={handleRecaptchaChange}
        />
        <button type="submit">Submit</button>
      </form>
      {statusMessage && (
        <p className={isSuccess ? styles.successMessage : styles.errorMessage}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}