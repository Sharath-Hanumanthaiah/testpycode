import React, { useState } from 'react';

const ReportModal = ({ postId, onClose }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post: postId, reason }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to report');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={modalStyle}>
        <button aria-label="Close" onClick={onClose} style={closeBtnStyle}>&times;</button>
        <h2>Report Post</h2>
        {success ? (
          <div style={{ color: 'green' }}>Thank you for your report. Our moderators will review it.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="reason">Reason for reporting:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
              minLength={10}
              maxLength={1000}
              style={{ width: '100%', minHeight: 80 }}
            />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button type="submit" disabled={loading || reason.length < 10} style={submitBtnStyle}>
              {loading ? 'Reporting...' : 'Submit Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: '#fff',
  borderRadius: 8,
  padding: 24,
  minWidth: 320,
  maxWidth: 400,
  boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
  position: 'relative',
};

const closeBtnStyle = {
  position: 'absolute',
  top: 8,
  right: 8,
  background: 'none',
  border: 'none',
  fontSize: 24,
  cursor: 'pointer',
};

const submitBtnStyle = {
  marginTop: 16,
  background: '#d32f2f',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  padding: '8px 16px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default ReportModal;
