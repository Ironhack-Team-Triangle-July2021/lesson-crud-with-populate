const router = require("express").Router();

const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Comment = require("../models/Comment.model");

// ****************************************************************************************
// POST route - create a comment of a specific post
// ****************************************************************************************

router.post('/posts/:postId/comment', (req, res, next) => {
  const { postId } = req.params;
  const { author, content } = req.body;

  User.findOne( {username: author} )
    .then( userFromDB => {
      if( userFromDB) {
        // Create comment
        return Comment.create( {author: userFromDB._id, content});
      } else {
        res.status(403).send("user does not exist");
        return Promise.reject("user does not exist");
      }
    })
    .then( commentCreated => {
      return Post.findByIdAndUpdate( 
        postId, 
        { $push: { comments: commentCreated._id  } }, 
        { new: true }
      );
    })
    .then( postFromDB => {
      res.redirect(`/posts/${postFromDB._id}`);
    })
    .catch(err => {
      console.log(`Err publishing comment: ${err}`);
      next(err);
    });

});

module.exports = router;
