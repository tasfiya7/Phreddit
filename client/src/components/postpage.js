import timestampsdt from './timestamps';
import getTotalComments from './getTotalComments';
import '../stylesheets/postpage.css';
import {BiUpvote, BiDownvote} from 'react-icons/bi';
import React, { useState } from 'react';

export default function PostPage({ model, userMode, userID, post, onCreateComment, onVote }) {
  const voter = model.data.users.find(u => u.userID === userID);
  const handleVote = (id, type, votedUserID, value) => {
    onVote(id, type, votedUserID, value);
  };

  const renderComments = (commentIDs, indentLevel=0) => {
    commentIDs.sort((a, b) => model.data.comments.find(c => c.commentID === b).commentedDate - model.data.comments.find(c => c.commentID === a).commentedDate);
    
    return commentIDs.map(commentID => {
      const comment = model.data.comments.find(c => c.commentID === commentID);
      return (
        <>
          <div 
            key={comment.commentID} 
            className={"comment"} 
            style={{marginLeft: indentLevel*75}}
          >
            <strong>{comment.commentedBy.displayName}</strong> | {timestampsdt(comment.commentedDate)}
            <p>{comment.content}</p>
            <div id="comment-interactions">
              <button 
                className={"comment-upvote-btn" + (comment.upvoters.includes(userID) ? " upvoted" : " unvoted") + (userMode === 'user' ? " user" : " guest")}
                onClick={(userMode === 'user') ? () => handleVote(comment.commentID, 'comment', comment.commentedBy.userID, 1) : null}
              ><BiUpvote /></button>
              <p>{comment.upvoters.length - comment.downvoters.length}</p>
              <button 
                className={"comment-downvote-btn" + (comment.downvoters.includes(userID) ? " downvoted" : " unvoted") + (userMode === 'user' ? " user" : " guest")}
                onClick={(userMode === 'user') ? () => handleVote(comment.commentID, 'comment', comment.commentedBy.userID, -1) : null}
              ><BiDownvote /></button>
              <button 
                className={"reply-btn" + (userMode === 'user' ? " user" : " guest")}
                onClick={(userMode === 'user') ? () => onCreateComment(comment.commentID, 'comment') : null}
              >Reply</button>
            </div>
          </div>
          {comment.commentIDs.length > 0 && (
            <>{renderComments(comment.commentIDs, indentLevel + 1)}</>
          )}
        </>
      );
    });
  };

  const community = model.data.communities.find(c => c.postIDs.includes(post.postID));

  return (
    <div className="post-page">
      <div className="post-section">
        {voter && (voter.reputation < 50) && <p id="rep-warning">Warning: Reputation too low to vote!</p>}
        <p>
          <strong>{community.name}</strong> | {timestampsdt(post.postedDate)}
        </p>
        <p>By: <strong>{post.postedBy.displayName}</strong></p>
        <h2>{post.title}</h2>
        {post.linkFlairID && <span className="link-flair"><p>{model.data.linkFlairs.find(lf => lf.linkFlairID === post.linkFlairID).content}</p></span>}
        <p>{post.content}</p>
        <p className="counters">
          Views: {post.views} | Comments: {getTotalComments(model, post.commentIDs)}
        </p>
        <div 
          id="post-interactions"
        >
          <button 
            id="upvote-btn"
            className={"vote-btn" + (post.upvoters.includes(userID) ? " upvoted" : " unvoted") + (userMode === 'user' ? " user" : " guest")}
            onClick={(userMode === 'user') ? () => handleVote(post.postID, 'post', post.postedBy.userID, 1) : null}
          >
            <BiUpvote />
          </button>
          <p>{post.upvoters.length - post.downvoters.length}</p>
          <button 
            id="downvote-btn"
            className={"vote-btn" + (post.downvoters.includes(userID) ? " downvoted" : " unvoted") + (userMode === 'user' ? " user" : " guest")}
            onClick={(userMode === 'user') ? () => handleVote(post.postID, 'post', post.postedBy.userID, -1) : null}
          >
            <BiDownvote />
          </button>
          <button 
            className={"comment-btn" + (userMode === 'user' ? " user" : " guest")}
            onClick={(userMode === 'user') ? () => onCreateComment(post.postID, 'post') : null}
          >Add a comment</button>
        </div>
      </div>
      <hr></hr>
      <div className="comment-section">{renderComments(post.commentIDs)}</div>
    </div>
  );
}