import '../stylesheets/navbar.css';
import '../stylesheets/community.css';
import React, { useState } from 'react';

export default function Navbar({ mode, userMode, userID, onSelectHome, communities, onCreateCommunity, onSelectCommunity, selectedCommunity }) {
  

  return (
    <div className="navbar">
      <button
        className={"home-btn" + (userMode ? ' user' : ' guest')}
        style={{ 
          backgroundColor: (mode === 'home' || mode === 'welcome')? 'orangered' : '',
          color: (mode === 'home' || mode === 'welcome')? 'white' : '',
        }}
        onClick={() => onSelectHome()}
      > Home
      </button>
      <hr></hr>
      <h3>Communities</h3>
      <button className={"create-community-btn" + (userMode ? ' user' : ' guest')}
        onClick={userMode === 'user' ? () => onCreateCommunity() : null}
        style={{
          backgroundColor: mode === 'newCommunity' ? 'orangered' : '',
          color: mode === 'newCommunity' ? 'white' : '',
        }}
      >Create Community</button>
      {communities.map((community) => (
        <div key={community.communityID}>
          <button
            className={"community-btn" + (userMode ? ' user' : ' guest')}
            style={{ 
              backgroundColor: selectedCommunity && (community.communityID === selectedCommunity.communityID) ? 'black' : '',
              color: selectedCommunity && (community.communityID === selectedCommunity.communityID) ? 'white' : '',
            }}
            onClick={userMode ? () => onSelectCommunity(community.communityID) : null}
            /*For actual community buttons, allow clicking once even in guest mode*/
          >
            {community.name}
          </button>
        </div>
      ))}
    </div>
  );
}