import React, { useState } from 'react';
import ReportModal from './ReportModal';

const ReportButton = ({ postId }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="report-btn"
        aria-label="Report inappropriate content"
        onClick={() => setOpen(true)}
        style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}
      >
        🚩 Report
      </button>
      {open && <ReportModal postId={postId} onClose={() => setOpen(false)} />}
    </>
  );
};

export default ReportButton;
