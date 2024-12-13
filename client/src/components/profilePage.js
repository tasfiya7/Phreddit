import { useState } from 'react';
import timestampsdt from './timestamps';
import '../stylesheets/profilePage.css';

export default function ProfilePage({ model, userMode, user }) {

    const [listing, setListing] = useState('posts');

    const handleListingSelect = (listing) => {
        setListing(listing);
    };

    const getReputation = (user) => {
        return model.data.users.find(u => u.userID === user).reputation;
    };

    const renderListing = () => {
        if(listing === 'posts'){
            var posts = model.data.posts.filter(p => p.postedBy.userID === user);
            return (
                <>
                    {posts && posts.map(post => renderPost(post))}
                </>
            )
        } else if(listing === 'comments'){
            var comments = model.data.comments.filter(c => c.commentedBy.userID === user);
            return (
                <>
                    {comments && comments.map(comment => renderComment(comment))}
                </>
            )
        } else if(listing === 'communities'){
            var communities = model.data.communities.filter(c => c.madeBy === user);
            return (
                <>
                    {communities && communities.map(community => renderCommunity(community))}
                </>
            )
        }
    }

    const renderPost = (post) => {
        return (
            <div key={post.postID}>
                <div className="post">
                    <p>
                        <strong>{model.data.communities.find(c => c.postIDs.includes(post.postID)).name}</strong> | {post.postedBy.displayName} | {timestampsdt(post.postedDate)}
                    </p>
                    <p>{post.title}</p>
                    <p>{post.content}</p>
                    <p>Upvotes: {post.upvoters.length} | Downvotes: {post.downvoters.length}</p>
                </div>
            </div>
        )
    }

    const checkComments = (commentIDs, commentID) => {
        for (let cID of commentIDs) {
            if(cID === commentID) {
                return true;
            }
            let comment = model.data.comments.find(c => c.commentID === cID);
            if(comment.commentIDs.length > 0) {
                return checkComments(comment.commentIDs, commentID);
            }
        }
        return false;
    }

    const findPost = (commentID) => {
        const comment = model.data.comments.find(c => c.commentID === commentID);
        for (let post of model.data.posts) {
            if(post.commentIDs.length > 0) {
                if (checkComments(post.commentIDs, commentID)) {
                    return post;
                }
            }
        }
    }

    const renderComment = (comment) => {
        return (
            <div key={comment.commentID}>
                {findPost(comment.commentID) && <>
                <div className="comment">
                    <p>
                        <strong>{findPost(comment.commentID).title}</strong> | {timestampsdt(comment.commentedDate)}
                    </p>
                    <p>{comment.content.substring(0, 20)}{comment.content.length > 20 ? '...' : ''}</p>
                    <p>Upvotes: {comment.upvoters.length} | Downvotes: {comment.downvoters.length}</p>
                </div>
                </>}
            </div>
        )
    }


    const renderCommunity = (community) => {
        return (
            <>
            <div key={community._id}>
                <div className="community">
                    <p>
                        {community.name} | {timestampsdt(community.startDate)}
                    </p>
                    <p>{community.description}</p>
                    <p>Members: {community.memberCount}</p>
                </div>
            </div>
            <hr />
            </>
        )
    }

    return (
        <div id="profile-page">
            <div id="profile-info">
                <h2>{model.data.users.find(u => u.userID === user).displayName}</h2>
                <p>{model.data.users.find(u => u.userID === user).username}</p>
                <p>{model.data.users.find(u => u.userID === user).email}</p>
                <p>Member since: {timestampsdt(model.data.users.find(u => u.userID === user).joinedDate)}</p>
                <p>Reputation: {getReputation(user)}</p>
            </div>
            <div id="profile-listing">
                <button onClick={() => handleListingSelect('posts')}>Posts</button>
                <button onClick={() => handleListingSelect('comments')}>Comments</button>
                <button onClick={() => handleListingSelect('communities')}>Communities</button>
                {renderListing()}
            </div>
        </div>
    );

}
