import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MainFeed() {
  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeed();
    fetchTrending();
  }, []);

  async function fetchFeed() {
    try {
      const res = await axios.get('/posts/feed', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setPosts(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed');
    }
  }

  async function fetchTrending() {
    try {
      const res = await axios.get('/posts/trending', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setTrending(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trending');
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/posts', {
        title: newPost.title,
        content: newPost.content,
        tags: newPost.tags.split(',').map(t => t.trim()),
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setNewPost({ title: '', content: '', tags: '' });
      fetchFeed();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
    setLoading(false);
  }

  return (
    <div className="main-feed">
      <h2>Trending Topics</h2>
      <ul>
        {trending.map(topic => (
          <li key={topic._id}>{topic.title}</li>
        ))}
      </ul>
      <h2>Create New Post</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={e => setNewPost({ ...newPost, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={e => setNewPost({ ...newPost, content: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={newPost.tags}
          onChange={e => setNewPost({ ...newPost, tags: e.target.value })}
        />
        <button type="submit" disabled={loading}>Create</button>
      </form>
      {error && <div className="error">{error}</div>}
      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>By {post.owner}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainFeed;
