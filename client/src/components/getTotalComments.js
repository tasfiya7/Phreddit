/*

Recursively calculates the total number of comments for a given commentID.
Used in postpage.js and postlistpage.js

*/


export default function getTotalComments (model, commentIDs) {
    let total = commentIDs.length;
    commentIDs.forEach(commentID => {
        const comment = model.data.comments.find(c => c.commentID === commentID);
        total += getTotalComments(model, comment.commentIDs);
    });
    return total;
}
