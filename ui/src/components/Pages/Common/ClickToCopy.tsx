import React, { useState } from 'react';

interface ClickToCopyProps {
  ContentToCopy: string | null;
}

const ClickToCopy: React.FC<ClickToCopyProps> = ({ ContentToCopy }) => {
  const [copied, setCopied] = useState(false);

  if (!ContentToCopy) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(ContentToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 5000); // Reset copied state after 2 seconds
      })
      .catch((err) => {
       return
      });
  };

  return (
    <span onClick={handleCopy} className={`material-symbols-outlined pseudo-link app-primary-color text-size-15  ${copied ? 'copied' : ''} `}>
      {copied ? 'check_circle' : <span> &#128464;</span>}
    </span>
  );
};

export default ClickToCopy;
