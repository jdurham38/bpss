import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import styles from './index.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'General Inquiry' 
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
  
    if (name === 'email') validateEmail(value);
    checkFormValidity(updatedFormData, isConfirmed);
  };
  
  
  const handleCheckboxChange = () => {
    const updatedConfirmed = !isConfirmed;
    setIsConfirmed(updatedConfirmed);
    checkFormValidity(formData, updatedConfirmed); 
  };
  
  const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook|live|aol|icloud|mail|protonmail|zoho|yandex|gmx)\.(com|edu|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)$/;
    const isValid = regex.test(email);
    setEmailError(isValid ? '' : 'Please enter a valid email address.');
    return isValid;
  };
  

  const validateMessage = (message: string) => {
    setMessageError(message.length > 500 ? 'Message cannot exceed 500 characters.' : '');
  };

const checkFormValidity = (data: typeof formData, confirmed: boolean) => {
  const isEmailValid = validateEmail(data.email);
  const isMessageValid = data.message.trim().length <= 500;

  const isFormComplete =
    data.name.trim() !== '' &&
    data.email.trim() !== '' &&
    isEmailValid && 
    data.message.trim() !== '' &&
    isMessageValid && 
    confirmed;

  setIsFormValid(isFormComplete);
};

  


  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!isFormValid) {
      setStatusMessage('Please fill out all required fields correctly.');
      setIsSuccess(false);
      return;
    }

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      subject: formData.subject
    };
    emailjs
      .send(
        process.env.NEXT_PUBLIC_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_TEMPLATE_ID || '',
        templateParams,
        process.env.NEXT_PUBLIC_USER_ID || ''
      )
      .then(() => {
        setIsSuccess(true);
        setStatusMessage('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          message: '',
          subject: 'General Inquiry'
        });
        setIsConfirmed(false);
      })
      .catch(() => {
        setIsSuccess(false);
        setStatusMessage('Failed to send message.');
      });
  };

  return (
    <div className={styles.background}>
      <h2 className={styles.heading}>Leave us a question, comment, or catering request and we will get back to you ASAP!</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div>
            <label className={styles.labels} htmlFor="name">
              Name <span className={styles.asterisk}>*</span>
            </label>
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
            <label className={styles.labels} htmlFor="email">
              Email <span className={styles.asterisk}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
            {emailError && <p className={styles.successMessage}>{emailError}</p>}
          </div>
        </div>
        <div>
          <label className={styles.labels} htmlFor="subject">
            Subject <span className={styles.asterisk}>*</span>
          </label>
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
          <label className={styles.labels} htmlFor="message">
            Message <span className={styles.asterisk}>*</span>
          </label>
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
          I understand this is <u>NOT</u> an order submission form.
        </label>

        </div>
        <button type="submit" className={styles.button} disabled={!isFormValid}>
          Submit
        </button>
      </form>
      {statusMessage && (
        <p className={isSuccess ? styles.successMessage : styles.errorMessage}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}
