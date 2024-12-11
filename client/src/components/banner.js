import { useState } from 'react';
import '../stylesheets/banner.css';
import '../stylesheets/newpost.css';



export default function Banner({ mode, userMode, onSelectHome, onSearch, onCreatePost}) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="banner"> 
      <button 
        className="banner-btn"
        onClick={() => (onSelectHome())}
      >Phreddit</button>
      <input 
        type="text" 
        placeholder="Search Phreddit…" 
        className="search-bar" 
        onInput={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (userMode && e.key === 'Enter') {
            onSearch(searchQuery);
          }
        }}
        />
      <button 
        className="create-post-btn" 
        onClick={userMode === 'user' ? () => onCreatePost() : null}
        style={{ 
          backgroundColor: mode === 'newPost' ? 'orangered' : '',
          color: mode === 'newPost' ? 'white' : '',
        }}
        id={userMode === 'user' ? 'user' : 'guest'}
      >Create Post</button>
    </div>
  );
}