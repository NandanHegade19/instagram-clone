import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase';
import firebase from 'firebase'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SendIcon from '@material-ui/icons/Send';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';


function PostComp({postId, username, caption, imageURL, user}) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
                            .collection("posts")
                            .doc(postId)
                            .collection("comments")
                            .orderBy('timestamp', 'desc')
                            .onSnapshot((snapshot) => {
                                setComments(snapshot.docs.map((doc) => doc.data()));
                            });
        }
        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (evt) => {
        evt.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className = "post">
            {/**Avatar, username */}
            <div className = "post__header">
                <Avatar className = "post__avatar" alt = {username} src = "/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            
            {/**Post Image */}
            <img className = "post__post-image" src = {imageURL} 
                 alt = "username_avatar"/>
            <div className = "post_actions">
                <div className = "post_actions_left">
                    <FavoriteBorderIcon/>
                    <ChatBubbleOutlineIcon/>
                    <SendIcon/>
                </div>
                <div className = "post_actions_right">
                    <BookmarkBorderIcon/>
                </div>
            </div>
            {/** Username: caption below image*/}
            <h4 className = "post__caption"><strong>{username}</strong> {caption}</h4>

            {
                <div className = "post__comments">
                    {comments.map((comm) => (
                        <p><strong> {comm.username} </strong> {comm.text} </p>
                    ))}
                </div> 
            
            }

            {/**Show add comment input only if user is logged in */}
            {
                user && (
                    <form className = "post__commentBox">
                        <input type = "text" value = {comment} onChange = {e => setComment(e.target.value)} placeholder = "Add comment..." className = "post__comment-input"/>
                        <button type = "submit" disabled = {!comment} onClick = {postComment} className = "post__comment-button">Post</button>
                    </form>
                )
            }
                        
        </div>
    )
}

export default PostComp
