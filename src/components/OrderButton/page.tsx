// RedirectButton.tsx
import React from 'react';

interface RedirectButtonProps {
  url: string;
  label: string;
}

const RedirectButton: React.FC<RedirectButtonProps> = ({ url, label }) => {
    const handleClick = () => {
      window.location.href = url;
    };
  
    return (
      <button
        onClick={handleClick}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {label}
      </button>
    );
  };
  

export default RedirectButton;
