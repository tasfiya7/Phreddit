
import '../stylesheets/navbar.css';
import '../stylesheets/community.css';
import React, { useState } from 'react';

export default function Navbar({ mode, onSelectHome, communities, onCreateCommunity, onSelectCommunity, selectedCommunity }) {
  

  return (
    <div className="navbar">
      <button
        className="home-btn"
        style={{ 
          backgroundColor: mode === 'home' ? 'orangered' : '',
          color: mode === 'home' ? 'white' : '',
        }}
        onClick={() => onSelectHome()}
      >
        Home
      </button>
      <hr></hr>
      <h3>Communities</h3>
      <button className="create-community-btn"
        style={{
          backgroundColor: mode === 'newCommunity' ? 'orangered' : 'grey',
          color: 'white',
        }}
        onClick={() => onCreateCommunity()}
        
      >Create Community</button>
      {communities.map((community) => (
        <div key={community.communityID}>
          <button
            className="community-btn"
            style={{ 
              backgroundColor: selectedCommunity && (community.communityID === selectedCommunity.communityID) ? 'black' : '',
              color: selectedCommunity && (community.communityID === selectedCommunity.communityID) ? 'white' : '',
            }}
            onClick={() => onSelectCommunity(community.communityID)}
          >
            {community.name}
          </button>
        </div>
      ))}
    </div>
  );
}