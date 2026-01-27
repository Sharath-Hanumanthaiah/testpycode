import React from 'react';
import ReportButton from './ReportButton';

const Post = ({ post }) => {
  return (
    <div className="post" style={postStyle}>
      <div className="post-content">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>
      <div className="post-actions" style={{ marginTop: 8 }}>
        {/* Other actions here */}
        <ReportButton postId={post._id} />
      </div>
    </div>
  );
};

const postStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  background: '#fff',
};

export default Post;
