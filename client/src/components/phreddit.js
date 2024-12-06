import React, { useState , useEffect} from 'react';
import Banner from './banner.js';
import Navbar from './navbar.js';
import PostListPage from './postlistpage.js';
import PostPage from './postpage.js';
import NewPostPage from './newPostPageView.js';
import NewCommunityPage from './newCommunityPageView.js';
import NewCommentPage from './newCommentPageView.js';

import '../stylesheets/postlist.css';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Fetch the data from the server
async function fetchData () {
  const posts1 = await api.get('/posts').then(res => res.data);
  const communities1 = await api.get('/communities').then(res => res.data);
  const linkFlairs1 = await api.get('/linkFlairs').then(res => res.data);
  const comments1 = await api.get('/comments').then(res => res.data);

  posts1.forEach(post => {
    post.postID = post._id;
    post.postedDate = new Date(post.postedDate);
  });
  communities1.forEach(community => {
    community.communityID = community._id;
    community.startDate = new Date(community.startDate);
  });
  linkFlairs1.forEach(linkFlair => {
    linkFlair.linkFlairID = linkFlair._id;
  });
  comments1.forEach(comment => {
    comment.commentID = comment._id;
    comment.commentedDate = new Date(comment.commentedDate);
  });

  const model = {data: {
    posts: posts1, 
    communities: communities1, 
    linkFlairs:linkFlairs1, 
    comments: comments1,
  }}

  return model;
}

var model = await fetchData();

//console.log(model);

const search = (model, query) => {
  const queryList = query.trim().toLowerCase().split(' ');
  if (query.trim() === '') return;
  
  // Filter posts by query
  const resultingPosts = model.data.posts.filter(post => {
    const postTitle = post.title.toLowerCase();
    const postContent = post.content.toLowerCase();

    // Check if the query is in the title or contents
    if (queryList.some(q => postTitle.includes(q) || postContent.includes(q))) return true;

    // Recursively check comments
    const commentIDs = post.commentIDs;
    return commentIDs.some(commentID => checkComments(model, commentID, queryList.join(' ')));
  })

  return resultingPosts;
}

function checkComments(model, commentID, queryListJoined) {
  const queryList = queryListJoined.split(' ');
  const comment = model.data.comments.find(c => c.commentID === commentID);
  const commentContent = comment.content.toLowerCase();

  /* Check if the query is in the comment content */
  if (queryList.some(q => commentContent.includes(q))) return true;

  /* Recursively check child comments */
  const childComments = comment.commentIDs;
  return childComments.some(childCommentID => checkComments(model, childCommentID, queryListJoined));
}

export default function Phreddit() {
  const [view, setView] = useState('home'); // Track current view (home, community, post)
  const [selectedCommunity, setSelectedCommunity] = useState(null); // Track selected community
  const [selectedPost, setSelectedPost] = useState(null); // Track selected post
  const [searchQuery, setSearchQuery] = useState(''); // Track search query
  const [searchResults, setSearchResults] = useState(); // Track search results
  const [commentParentID, setCommentParentID] = useState(null); // Track the parent ID of the comment
  const [commentParentType, setCommentParentType] = useState('');

  const handleCreateCommentView = (parentID, parentType) => {
    setCommentParentID(parentID);
    setCommentParentType(parentType);
    setView('newComment');
  };

  const handleCommentSubmit = async (newComment, parentID, parentType) => {
    // Add the new comment to the model
    model.data.comments.push(newComment);

    // Update the parent object (post or comment) with the new comment ID
    if (parentType === 'post') {
      // const post = model.data.posts.find(p => p.postID === parentID);
      // post.commentIDs.unshift(newComment.commentID);

      await api.post('/comments/post', {
        postID: parentID,
        commentedBy: newComment.commentedBy,
        content: newComment.content,
        commentedDate: newComment.commentedDate,
      });
    } else {
      // const parentComment = model.data.comments.find(c => c.commentID === parentID);
      // parentComment.commentIDs.unshift(newComment.commentID);

      await api.post('/comments/comment', {
        commentID: parentID,
        commentedBy: newComment.commentedBy,
        content: newComment.content,
        commentedDate: newComment.commentedDate,
      });
    }

    model = await fetchData();

    const updatedPost = model.data.posts.find(p => p.postID === selectedPost.postID);
    setSelectedPost(updatedPost);

    setView('post'); // Return to the Post Page view
  };


  // Handle switching to the home view
  const handleHomeView = () => {
    setSelectedCommunity(null);
    setSelectedPost(null);
    setView('home');
  };
  
  // Handle search
  const handleSearch = (query) => {
    if(query.trim() === '') {
      handleHomeView();
      return;
    }
    setSearchQuery(query);
    setSearchResults(search(model, query));
    setSelectedCommunity(null);
    setSelectedPost(null);
    setView('search');
  };

  const handleCreateCommunityView = () => {
    setSelectedCommunity(null);
    setSelectedPost(null);
    setView('newCommunity');
  };

  const handleCommunitySelect = (communityID) => {
    const community = model.data.communities.find(c => c.communityID === communityID);
    setSelectedCommunity(community);
    setView('community');
  };

  const handleCommunitySubmit =  async (newCommunity) => {
    //model.data.communities.push(newCommunity); // Add new community to the model

    const newCommunityID = await api.post('/communities', {
      name: newCommunity.name,
      description: newCommunity.description,
      startDate: newCommunity.startDate,
      members: newCommunity.members,
      memberCount: newCommunity.memberCount,
    });

    model = await fetchData();

    setSelectedCommunity(model.data.communities.find(c => c.communityID === newCommunityID.data));
    setView('community'); // Navigate to the new community's page
  };

  // Handle switching to the New Post Page view
  const handleCreatePost = () => {
    setSelectedCommunity(null);
    setSelectedPost(null);
    setView('newPost');
  };

  // Handle switching to a selected post view
  const handlePostSelect = async (postID) => {
    const community = model.data.communities.find(c => c.postIDs.includes(postID));
    var post = model.data.posts.find(p => p.postID === postID);

    await api.put(`/incrementViews?id=${post._id}`); // Increment post views in the database
    model = await fetchData();
    post = model.data.posts.find(p => p.postID === postID); // Get the updated post
    
    setSelectedCommunity(community);
    setSelectedPost(post);
    setView('post');
  };

  const handlePostSubmit = async (newPost, community) => {
    model.data.posts.push(newPost); // Add the new post to the top of the list
    // const targetCommunity = model.data.communities.find(c => c.communityID === community.communityID);
    // targetCommunity.postIDs.push(newPost.postID); // Add the new post to the community
    // console.log('Submitting new post: ', newPost, targetCommunity.postIDs);

    await api.post('/posts', {
      title: newPost.title,
      content: newPost.content,
      linkFlairID: newPost.linkFlairID,
      postedBy: newPost.postedBy,
      postedDate: newPost.postedDate,
      views: newPost.views,

      communityID: community.communityID,
      newFlair: newPost.newFlair,
    });

    model = await fetchData();
    
    handleHomeView();
  };

  // Render the appropriate view based on the current state
  const RenderView = () => {
    async function update () {
      model = await fetchData();
    }
    update();

    window.scrollTo(0, 0); // Always scroll to top

    if (view === 'home') {
      return (<PostListPage
        model = {model}
        mode = {view}
        title = "All Posts"
        initialPosts={model.data.posts} 
        onPostSelect={handlePostSelect} 
      />);
    }
    if (view === 'community') {
      return (<PostListPage
        model = {model} 
        mode = {view}
        title = {selectedCommunity.name}
        initialPosts={model.data.posts.filter(p => selectedCommunity.postIDs.includes(p.postID))}
        onPostSelect={handlePostSelect}
      />);
    }
    if (view === 'post') {
      return (<PostPage 
        model={model} 
        post={selectedPost} 
        onCreateComment={handleCreateCommentView}
      />);
    }
    if (view === 'search') {
      return (<PostListPage
        model = {model}
        mode = {view}
        title = { 
          ((searchResults.length > 0) ? "Results for:" : "No results found for:" ) + ' ' + searchQuery
        }
        initialPosts={searchResults}
        onPostSelect={handlePostSelect}
      />);
    }
    if (view === 'newPost') {
      return (<NewPostPage
        api = {api}
        postCount={model.data.posts.length}
        communities={model.data.communities}
        flairs={model.data.linkFlairs}
        onPostSubmit={handlePostSubmit}
        onCancel={() => handleHomeView()}
      />);
    }
    if (view === 'newCommunity') {
      return (<NewCommunityPage
        onCommunitySubmit={handleCommunitySubmit}
        onCancel={handleHomeView}
      />);
    }
    if (view === 'newComment') {
      return (<NewCommentPage
        onCommentSubmit={handleCommentSubmit}
        onCancel={() => setView('post')}
        parentID={commentParentID}
        parentType={commentParentType}
      />);
    }
  };

  return (
    <>
      <Banner 
        mode={view} 
        onSelectHome={handleHomeView} 
        onSearch={handleSearch}
        onCreatePost={handleCreatePost} 
      />
      <hr></hr>
      <div className="app-container">
        <Navbar 
          mode={view} 
          onSelectHome={handleHomeView} 
          communities={model.data.communities} 
          onSelectCommunity={handleCommunitySelect}
          onCreateCommunity={handleCreateCommunityView} 
          selectedCommunity={selectedCommunity} 
        />
        <main className={view === 'newCommunity' ? 'main new-community-main' : 'main'}>
        {RenderView()}</main>
      </div>
    </>
  );
}
