import React, { useState } from 'react';
import '../stylesheets/community.css';


export default function NewCommunityPage({ onCommunitySubmit, onCancel }) {
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!communityName) newErrors.communityName = 'Community name is required.';
    if (communityName.length > 100) newErrors.communityName = 'Max 100 characters allowed.';
    if (!description) newErrors.description = 'Description is required.';
    if (description.length > 500) newErrors.description = 'Max 500 characters allowed.';
    if (!username) newErrors.username = 'Username is required.';
    return newErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const newCommunity = {
      communityID: `community${Date.now()}`,
      name: communityName,
      description,
      postIDs: [],
      startDate: new Date(),
      members: [username],
      memberCount: 1,
    };

    onCommunitySubmit(newCommunity); // Pass new community back to parent component
  };

  return (
    <div className="new-community-page">
      <h2>Create a New Community</h2>
      <form className="new-community-form" onSubmit={(e) => e.preventDefault()}>
        {/* Community Name */}
        <div className="form-group">
          <label htmlFor="community-name"><b>Community Name *</b></label>
          <input
            type="text"
            id="community-name"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            maxLength="100"
            required
          />
          {errors.communityName && <p className="error">{errors.communityName}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description"><b>Description *</b></label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength="500"
            required
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        {/* Username */}
        <div className="form-group">
          <label htmlFor="username"><b>Your Username *</b></label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button type="button" className="submit-btn" onClick={handleSubmit}>
            Engender Community
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}