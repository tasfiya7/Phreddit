import React, { useState } from 'react';
import ListViewHeader from './listviewheader.js';
import timestampsdt from './timestamps.js';
import getTotalComments from './getTotalComments.js';

/*

Handles home view, community view, and search results view all in one component.

*/

const sortPosts = (model, posts, sort)  => {
  if(posts.length === 0) return sortedList;

  var sortedList = [...posts];

  if (sort === 'newest') {
    return sortedList.sort((a, b) => b.postedDate - a.postedDate);
  } else if (sort === 'oldest') {
    return sortedList.sort((a, b) => a.postedDate - b.postedDate);
  } else if (sort === 'active') { 
    const postsWithComments = posts.filter(post => post.commentIDs.length > 0);
    const postsWithoutComments = posts.filter(post => post.commentIDs.length === 0);

    // Sort posts with comments by last comment date
    postsWithComments.forEach(post => {
      post.lastCommentDate = getLastCommentDate(model, post.commentIDs);
    });
    postsWithComments.sort((a, b) => b.lastCommentDate - a.lastCommentDate);

    // Sort posts without comments by postedDate
    postsWithoutComments.sort((a, b) => b.postedDate - a.postedDate);

    sortedList.length = 0;
    sortedList.push(...postsWithComments, ...postsWithoutComments);

    return sortedList;
  }
}

const getLastCommentDate = (model, commentIDs) => {
  let latestDate = new Date(0);
  commentIDs.forEach(commentID => {
    const comment = model.data.comments.find(c => c.commentID === commentID);
    if (comment.commentedDate > latestDate) {
      latestDate = comment.commentedDate;
    }
    latestDate = Math.max(latestDate, getLastCommentDate(model, comment.commentIDs));
  });
  return latestDate;
}

export default function PostListPage({ model, mode, title, initialPosts, onPostSelect }) {
  const [sort, setSort] = useState('newest');

  const handleSortSelect = (sort) => {
    setSort(sort);
  };

  const renderPostList = () => {
    if(initialPosts.length === 0) return;
    const posts = sortPosts(model, initialPosts, sort);

    return posts.map(post => {
      return (
        <div key={post.postID}>
          <div className="post" onClick={() => onPostSelect(post.postID)}>
            <p>
              {!(mode === 'community') ? (<><strong>
                {model.data.communities.find(c => c.postIDs.includes(post.postID)).name}
              </strong> | </>) : ''}
              {post.postedBy.displayName} | {timestampsdt(post.postedDate)}
            </p>
            <p><strong>{post.title}</strong></p>
            {post.linkFlairID && <span className="link-flair"><p>{model.data.linkFlairs.find(lf => lf.linkFlairID === post.linkFlairID).content}</p></span>}
            <p>
              {post.content.slice(0, 80).trim()}
              {post.content.length > 80 ? '...' : ''}
            </p>
            <p>Views: {post.views} | Comments: {getTotalComments(model, post.commentIDs)}</p>
          </div>
          <hr></hr>
        </div>
      );
    });
  }
  

  return (
    <div className="post-list-page">
      <div className="pl-header">
        <ListViewHeader title={title} onSortSelect={handleSortSelect}/>
        {mode==='community' && <>
          <p className="community-description">{model.data.communities.find(c => c.name === title).description}</p>
          <p>Created {timestampsdt(model.data.communities.find(c => c.name === title).startDate)}</p>
        </>}
        <p>
          {initialPosts.length} Post{initialPosts.length === 1 ? '' : 's'}
          {mode === 'community' && <> | {model.data.communities.find(c => c.name === title).memberCount} Members</>}
        </p>
      </div>
      <hr></hr>
      <div className="postlist">{renderPostList()}</div>
    </div>
  );
}