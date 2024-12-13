import React, { useState , useEffect} from 'react';
import Banner from './banner.js';
import Navbar from './navbar.js';
import PostListPage from './postlistpage.js';
import PostPage from './postpage.js';
import NewPostPage from './newPostPageView.js';
import NewCommunityPage from './newCommunityPageView.js';
import NewCommentPage from './newCommentPageView.js';
import WelcomePage from './welcome.js';
import ProfilePage from './profilePage.js';

import '../stylesheets/postlist.css';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// Fetch the data from the server
async function fetchData () {
  const users1 = await api.get('/users').then(res => res.data);
  const posts1 = await api.get('/posts').then(res => res.data);
  const communities1 = await api.get('/communities').then(res => res.data);
  const linkFlairs1 = await api.get('/linkFlairs').then(res => res.data);
  const comments1 = await api.get('/comments').then(res => res.data);

  users1.forEach(user => { 
    user.userID = user._id;
    user.joinedDate = new Date(user.createdAt);
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
    comment.commentedBy = users1.find(u => u.userID === comment.commentedBy);
  });
  posts1.forEach(post => {
    post.postID = post._id;
    post.postedDate = new Date(post.postedDate);
    post.postedBy = users1.find(u => u.userID === post.postedBy);
  });

  const model = {data: {
    posts: posts1, 
    communities: communities1, 
    linkFlairs:linkFlairs1, 
    comments: comments1,
    users: users1,
  }}

  return model;
}

var model = await fetchData();

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
  const [view, setView] = useState('welcome'); // Track current view (home, community, post)
  const [selectedCommunity, setSelectedCommunity] = useState(null); // Track selected community
  const [selectedPost, setSelectedPost] = useState(null); // Track selected post
  const [searchQuery, setSearchQuery] = useState(''); // Track search query
  const [searchResults, setSearchResults] = useState(); // Track search results
  const [commentParentID, setCommentParentID] = useState(null); // Track the parent ID of the comment
  const [commentParentType, setCommentParentType] = useState('');
  const [userMode, setUserMode] = useState(null); // null, 'guest', or 'user'
  const [user, setUser] = useState(null); // User (ID)

  // Creating Communities
  const handleCreateCommunityView = () => {
    setSelectedCommunity(null);
    setSelectedPost(null);
    setView('newCommunity');
  };

  const handleCommunitySubmit =  async (newCommunity) => {
    //model.data.communities.push(newCommunity); // Add new community to the model

    const newCommunityID = await api.post('/communities', {
      name: newCommunity.name,
      description: newCommunity.description,
      madeBy: user,
      startDate: newCommunity.startDate,
    });

    model = await fetchData();

    setSelectedCommunity(model.data.communities.find(c => c.communityID === newCommunityID.data));
    setView('community'); // Navigate to the new community's page
  };

  // Creating Posts
  const handleCreatePost = () => {
    setSelectedCommunity(null);
    setSelectedPost(null);
    setView('newPost');
  };

  const handlePostSubmit = async (newPost, community) => {
    model.data.posts.push(newPost); // Add the new post to the top of the list

    await api.post('/posts', {
      title: newPost.title,
      content: newPost.content,
      postedBy: user,
      postedDate: newPost.postedDate,
      community: newPost.community,
      linkFlairID: newPost.linkFlairID,
      newFlair: newPost.newFlair,
    });

    model = await fetchData();
    
    handleHomeView();
  };

  // Creating Comments
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

      await api.post('/comments/post', {
        postID: parentID,
        content: newComment.content,
        commentedBy: user,
        commentedDate: newComment.commentedDate,
      });
    } else {
      await api.post('/comments/comment', {
        commentID: parentID,
        content: newComment.content,
        commentedBy: user,
        commentedDate: newComment.commentedDate,
      });
    }

    model = await fetchData();

    const updatedPost = model.data.posts.find(p => p.postID === selectedPost.postID);
    setSelectedPost(updatedPost);

    setView('post'); // Return to the Post Page view
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
  
  // Handle selecting a community (from the navbar)
  const handleCommunitySelect = (communityID) => {
    const community = model.data.communities.find(c => c.communityID === communityID);
    setSelectedCommunity(community);
    setView('community');
  };

  // Handle join/leave community
  const handleJoinLeave = async () => {
    await api.put('/joinleave', {
      communityID: selectedCommunity.communityID,
      userID: user,
    });

    model = await fetchData();
    setSelectedCommunity(model.data.communities.find(c => c.communityID === selectedCommunity.communityID));
    setView('community');
  };


  // Handle selecting a post (from the post list)
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

  // Handle voting
  const handleVote = async (id, type, targetID, vote) => {
    await api.put('/vote', {
      id: id,
      type: type,
      voterID: user,
      targetID: targetID,
      vote: vote,
    });
    model = await fetchData();
    setSelectedPost(model.data.posts.find(p => p.postID === selectedPost.postID));
  };

  // Handle profile view
  const handleProfileView = () => {
    setSelectedCommunity(null);
    setSelectedPost(null);
    setView('profile');
  };

  // Logging out
  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  }

  const handleLogout = async () => {
    await logout();
    setUserMode(null);
    setSelectedCommunity(null);
    setSelectedPost(null);
    setView('welcome');
  }

  // Handle logging in
  const handleLogin = async (userID) => {
    model = await fetchData();
    if(userID === 'guest') {
      if(userMode === 'user') {
        await logout();
        console.log('Successfully logged out.');
      }
      setUserMode('guest');
      console.log('Logged in as a guest.');
    } else {
      setUserMode('user');
      setUser(userID);
      console.log('Logged in as', model.data.users.find(u => u.userID === userID).displayName);
    }
    setView('home');
  };

  // Handle switching to welcome view (Phreddit button)
  const handleWelcomeView = () => {
    setSelectedCommunity(null);
    setSelectedPost(null);
    if(userMode === 'guest') {
      setUserMode(null);
    }
    setView('welcome');
  };

  // Handle switching to the home view
  const handleHomeView = () => {
    setSelectedCommunity(null);
    setSelectedPost(null);
    if (!userMode) {
      setView('welcome');
    } else {
      setView('home');
    }
  };

  // Render the appropriate view based on the current state
  const RenderView = () => {
    async function update () {
      model = await fetchData();
    }
    update();

    window.scrollTo(0, 0); // Always scroll to top

    if (view === 'welcome') {
      return (<WelcomePage
        api = {api}
        model = {model}
        userMode = {userMode}
        onLogin={handleLogin}
      />);
    }
    if (view === 'home') {
      return (<PostListPage
        model = {model}
        mode = {view}
        userMode = {userMode}
        user = {user}
        title = "All Posts"
        initialPosts={model.data.posts} 
        onPostSelect={handlePostSelect} 
      />);
    }
    if (view === 'community') {
      return (<PostListPage
        model = {model} 
        mode = {view}
        userMode = {userMode}
        user = {user}
        title = {selectedCommunity.name}
        initialPosts={model.data.posts.filter(p => selectedCommunity.postIDs.includes(p.postID))}
        onPostSelect={handlePostSelect}
        onJoin={handleJoinLeave}
      />);
    }
    if (view === 'post') {
      return (<PostPage 
        model={model} 
        userMode={userMode}
        userID={user}
        post={selectedPost} 
        onCreateComment={handleCreateCommentView}
        onVote={handleVote}
      />);
    }
    if (view === 'search') {
      return (<PostListPage
        model = {model}
        mode = {view}
        userMode = {userMode}
        user = {user}
        title = { 
          ((searchResults.length > 0) ? "Results for:" : "No results found for:" ) + ' ' + searchQuery
        }
        initialPosts={searchResults}
        onPostSelect={handlePostSelect}
      />);
    }
    if (view === 'newPost') {
      return (<NewPostPage
        postCount={model.data.posts.length}
        communities={model.data.communities}
        flairs={model.data.linkFlairs}
        onPostSubmit={handlePostSubmit}
        onCancel={() => handleHomeView()}
      />);
    }
    if (view === 'newCommunity') {
      return (<NewCommunityPage
        model = {model}
        onCommunitySubmit={handleCommunitySubmit}
        onCancel={handleHomeView}
      />);
    }
    if (view === 'newComment') {
      return (<NewCommentPage
        user={user}
        onCommentSubmit={handleCommentSubmit}
        onCancel={() => setView('post')}
        parentID={commentParentID}
        parentType={commentParentType}
      />);
    }
    if (view === 'profile') {
      return (<ProfilePage
        model={model}
        userMode={userMode}
        user={user}
      />);
    }
  };

  return (
    <>
      <Banner 
        mode={view} 
        userMode={userMode}
        displayName={userMode === 'user' ? model.data.users.find(u => u.userID === user).displayName : ''}
        onPhreddit={handleWelcomeView} 
        onSearch={handleSearch}
        onCreatePost={handleCreatePost} 
        onProfile={handleProfileView}
        onLogout={handleLogout}
      />
      <hr></hr>
      <div className="app-container">
        <Navbar 
          mode={view} 
          userMode={userMode}
          user={user}
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
