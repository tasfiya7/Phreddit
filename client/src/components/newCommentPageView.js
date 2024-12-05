
import React, { useState } from 'react';
import '../stylesheets/comment.css';

export default function NewCommentPage({ onCommentSubmit, onCancel, parentID, parentType }) {
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState({});
  
    const validateForm = () => {
      const newErrors = {};
      if (!content) newErrors.content = 'Comment content is required.';
      if (content.length > 500) newErrors.content = 'Max 500 characters allowed.';
      if (!username) newErrors.username = 'Username is required.';
      return newErrors;
    };
  
    const handleSubmit = () => {
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }
  
      const newComment = {
        commentID: `comment${Date.now()}`,
        content,
        commentIDs: [], // To hold replies
        commentedBy: username,
        commentedDate: new Date(),
      };
  
      onCommentSubmit(newComment, parentID, parentType); // Submit the comment
    };
  
    return (
      <div className="new-comment-page">
        <h2>Add a Comment</h2>
        <form onSubmit={(e) => e.preventDefault()} className="new-comment-form">
          <div className="form-group">
            <label htmlFor="content"><b>Comment Content *</b></label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength="500"
              required
              className="large-textarea"
            />
            {errors.content && <p className="error">{errors.content}</p>}
          </div>
  
          <div className="form-group">
            <label htmlFor="username"><b>Your Username *</b></label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="large-input"
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
  
          <div className="form-actions">
            <button type="button" className="submit-btn" onClick={handleSubmit}>
              Submit Comment
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
  