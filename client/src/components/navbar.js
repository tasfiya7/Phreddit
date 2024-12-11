import '../stylesheets/navbar.css';
import '../stylesheets/community.css';
import React, { useState } from 'react';

export default function Navbar({ mode, userMode, onSelectHome, communities, onCreateCommunity, onSelectCommunity, selectedCommunity }) {
  

  return (
    <div className="navbar">
      <button
        className="home-btn"
        style={{ 
          backgroundColor: (mode === 'home' || mode === 'welcome')? 'orangered' : '',
          color: (mode === 'home' || mode === 'welcome')? 'white' : '',
        }}
        onClick={() => onSelectHome()}
      >
        Home
      </button>
      <hr></hr>
      <h3>Communities</h3>
      <button className="create-community-btn"
        onClick={userMode === 'user' ? () => onCreateCommunity() : null}
        style={{
          backgroundColor: mode === 'newCommunity' ? 'orangered' : '',
          color: mode === 'newCommunity' ? 'white' : '',
        }}
        id = {userMode === 'user' ? 'user' : 'guest'}
      >Create Community</button>
      {communities.map((community) => (
        <div key={community.communityID}>
          <button
            className="community-btn"
            style={{ 
              backgroundColor: selectedCommunity && (community.communityID === selectedCommunity.communityID) ? 'black' : '',
              color: selectedCommunity && (community.communityID === selectedCommunity.communityID) ? 'white' : '',
            }}
            onClick={userMode ? () => onSelectCommunity(community.communityID) : null}
            id = {userMode ? 'user' : 'guest'}
            /*For actual community buttons, allow clicking once even in guest mode*/
          >
            {community.name}
          </button>
        </div>
      ))}
    </div>
  );
}