import React, { useState } from 'react';
import '../stylesheets/newpost.css';

export default function NewPostPage({ api, postCount, communities, flairs, onPostSubmit, onCancel }) {
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [selectedFlair, setSelectedFlair] = useState('');
  const [newFlair, setNewFlair] = useState('');
  const [postContent, setPostContent] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!selectedCommunity) newErrors.community = 'Please select a community.';
    if (!postTitle) newErrors.title = 'Post title is required.';
    if (postTitle.length > 100) newErrors.title = 'Title must be 100 characters or less.';
    if (selectedFlair && newFlair) {
        newErrors.flair = 'Please select either a pre-existing flair or create a new one, not both.';
      }
    if (newFlair && newFlair.length > 30) newErrors.newFlair = 'New flair must be 30 characters or less.';
    if (!postContent) newErrors.content = 'Post content cannot be empty.';
    if (!username) newErrors.username = 'Username is required.';
    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    var flairID = '';
    if(selectedFlair) {
      flairID = selectedFlair;
    }
    if(newFlair) {
      flairID = newFlair;
    }

    // Create new post object
    const newPost = {
      postID: `p${postCount + 1}`,
      title: postTitle,
      content: postContent,
      linkFlairID: flairID,
      postedBy: username,
      postedDate: new Date(),
      commentIDs: [],
      views: 0,
      newFlair: newFlair,
    };

    // Find and update the selected community
    const community = communities.find(c => c.communityID === selectedCommunity);
    // community.postIDs.push(newPost.postID);

    onPostSubmit(newPost, community); // Submit post and navigate back to home
  };

  const clearErrors = () => setErrors({});

  return (
    <div className="new-post-page">
      <h2></h2>
      <form className="new-post-form" onSubmit={(e) => e.preventDefault()}>
        {/* Community Dropdown */}
        <div className="form-group">
          <label htmlFor="community-select">Select Community *</label>
          <select
            id="community-select"
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            required
          >
            <option value="">Select a community</option>
            {communities.map((community) => (
              <option key={community.communityID} value={community.communityID}>
                {community.name}
              </option>
            ))}
          </select>
          {errors.community && <p className="error">{errors.community}</p>}
        </div>

        {/* Post Title */}
        <div className="form-group">
          <label htmlFor="post-title">Post Title (Max 100 Characters) *</label>
          <input
            type="text"
            id="post-title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            maxLength="100"
            required
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        {/* Flair Selection */}
        <div className="form-group">
          <label htmlFor="flair-select">Select Link Flair (Optional)</label>
          <select
            id="flair-select"
            value={selectedFlair}
            onChange={(e) => setSelectedFlair(e.target.value)}
          >
            <option value="">None</option>
            {flairs.map((flair) => (
              <option key={flair.linkFlairID} value={flair.linkFlairID}>
                {flair.content}
              </option>
            ))}
          </select>

          <label htmlFor="new-flair">Or Create a New Flair (Max 30 Characters)</label>
          <input
            type="text"
            id="new-flair"
            value={newFlair}
            onChange={(e) => setNewFlair(e.target.value)}
            maxLength="30"
          />
          {errors.flair && <p className="error">{errors.flair}</p>}
          {errors.newFlair && <p className="error">{errors.newFlair}</p>}
        </div>

        {/* Post Content */}
        <div className="form-group">
          <label htmlFor="post-content">Post Content *</label>
          <textarea
            id="post-content"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            required
          />
          {errors.content && <p className="error">{errors.content}</p>}
        </div>

        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">Your Username *</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="form-actions">
          <button type="button" className="submit-btn" onClick={handleSubmit}>
            Submit Post
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
