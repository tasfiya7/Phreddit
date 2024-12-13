import { useState } from 'react';
import '../stylesheets/banner.css';
import '../stylesheets/newpost.css';



export default function Banner({ mode, userMode, displayName, onPhreddit, onSearch, onCreatePost, onProfile, onLogout}) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div id="banner"> 
      <button 
        id="banner-btn"
        onClick={() => (onPhreddit())}
      >Phreddit</button>
      <input 
        type="text" 
        placeholder="Search Phreddit…" 
        id="search-bar" 
        onInput={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (userMode && e.key === 'Enter') {
            onSearch(searchQuery);
          }
        }}
      />
      <div id="banner-right">
        <button 
          id="create-post-btn" 
          onClick={userMode === 'user' ? () => onCreatePost() : null}
          style={{ 
            backgroundColor: mode === 'newPost' ? 'orangered' : '',
            color: mode === 'newPost' ? 'white' : '',
          }}
          className={userMode === 'user' ? 'user' : 'guest'}
        >Create Post</button>
        <button
          id="profile-btn"
          onClick={userMode === 'user' ? () => onProfile() : null}
          style={{ 
            backgroundColor: mode === 'profile' ? 'orangered' : '',
            color: mode === 'profile' ? 'white' : '',
          }}
          className={userMode === 'user' ? 'user' : 'guest'}
        >{userMode === 'user' ? 'Profile' : 'Guest'}</button>
        {userMode === 'user' && 
          <div id="name-log-div">
            <p id="display-name">{displayName}</p>
            <button
              id="logout-btn"
              onClick={() => onLogout()}
            >Logout</button>
          </div>
        }
      </div>
    </div>
  );
}