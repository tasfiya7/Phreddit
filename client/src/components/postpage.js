import timestampsdt from './timestamps';
import getTotalComments from './getTotalComments';
import '../stylesheets/postpage.css';
import '../stylesheets/comment.css';

export default function PostPage({ model, post, onCreateComment }) {

  const renderComments = (commentIDs, indentLevel=0) => {
    commentIDs.sort((a, b) => model.data.comments.find(c => c.commentID === b).commentedDate - model.data.comments.find(c => c.commentID === a).commentedDate);
    
    return commentIDs.map(commentID => {
      const comment = model.data.comments.find(c => c.commentID === commentID);
      return (
        <>
          <div key={comment.commentID} className={"comment level-"+indentLevel} style={{marginLeft: indentLevel*75}}>
            <strong>{comment.commentedBy.displayName}</strong> | {timestampsdt(comment.commentedDate)}
            <p>{comment.content}</p>
            <button className="reply-btn" onClick={() => onCreateComment(comment.commentID, 'comment')}
            >Reply</button>
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
        <p>
          <strong>{community.name}</strong> | {timestampsdt(post.postedDate)}
        </p>
        <p>User: {post.postedBy.displayName}</p>
        <h2>{post.title}</h2>
        {post.linkFlairID && <span className="link-flair"><p>{model.data.linkFlairs.find(lf => lf.linkFlairID === post.linkFlairID).content}</p></span>}
        <p>{post.content}</p>
        <p className="counters">
          Views: {post.views} | Comments: {getTotalComments(model, post.commentIDs)}
        </p>
        <button className="comment-btn" onClick={() => onCreateComment(post.postID, 'post')}
        >Add a comment</button>
      </div>
      <hr></hr>
      <div className="comment-section">{renderComments(post.commentIDs)}</div>
    </div>
  );
}