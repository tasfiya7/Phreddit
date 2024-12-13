import '../stylesheets/navbar.css';
import '../stylesheets/community.css';
import React, { useState } from 'react';

export default function Navbar({ mode, userMode, user, onSelectHome, communities, onCreateCommunity, onSelectCommunity, selectedCommunity }) {
  
  const renderCommunities = () => {
    var joined = [];
    var notJoined = [];
    
    if(userMode === 'user') {
      for(var i = 0; i < communities.length; i++) {
        if(communities[i].members.includes(user)) {
          joined.push(communities[i]);
        } else {
          notJoined.push(communities[i]);
        }
      }
    } else {
      joined = communities;
    }

    return (<>
      {joined.map((community) => (
        <div key={community.communityID}>
          <button
            className={"community-btn" + (userMode ? ' user' : ' guest')}
            style={{ 
              backgroundColor: selectedCommunity && (community.communityID === selectedCommunity.communityID) ? 'black' : '',
              color: selectedCommunity && (community.communityID === selectedCommunity.communityID) ? 'white' : '',
            }}
            onClick={userMode ? () => onSelectCommunity(community.communityID) : null}
          >
            {community.name}
          </button>
        </div>
      ))}
      {(userMode === 'user') ? <hr></hr> : null}
      {notJoined.map((community) => (
        <div key={community.communityID}>
          <button
            className={"community-btn" + (userMode ? ' user' : ' guest')}
            style={{ 
              backgroundColor: selectedCommunity && (community.communityID === selectedCommunity.communityID) ? 'black' : '',
              color: selectedCommunity && (community.communityID === selectedCommunity.communityID) ? 'white' : '',
            }}
            onClick={userMode ? () => onSelectCommunity(community.communityID) : null}
          >
            {community.name}
          </button>
        </div>
      ))}
    </>)

  }


  return (
    <div className="navbar">
      <button
        className={"home-btn" + (userMode ? ' user' : ' guest')}
        style={{ 
          backgroundColor: (mode === 'home') ? 'orangered' : '',
          color: (mode === 'home')? 'white' : '',
        }}
        onClick={() => onSelectHome()}
      > Home
      </button>
      <hr></hr>
      <h3>Communities</h3>
      <button className={"create-community-btn" + (userMode === 'user' ? ' user' : ' guest')}
        onClick={userMode === 'user' ? () => onCreateCommunity() : null}
        style={{
          backgroundColor: mode === 'newCommunity' ? 'orangered' : '',
          color: mode === 'newCommunity' ? 'white' : '',
        }}
      >Create Community</button>
      <hr></hr>
      <div className="communities">
        {renderCommunities()}
      </div>
    </div>
  );
}