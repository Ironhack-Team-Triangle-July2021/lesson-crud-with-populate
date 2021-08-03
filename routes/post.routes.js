const router = require("express").Router();

const User = require("../models/User.model");
const Post = require("../models/Post.model");

// ****************************************************************************************
// GET route to display the form to create a new post
// ****************************************************************************************

router.get("/post-create", (req, res) => {
  User.find()
    .then((dbUsers) => {
      res.render("posts/create", { dbUsers });
    })
    .catch((err) => console.log(`Err while displaying post input page: ${err}`));
});

// ****************************************************************************************
// POST route to submit the form to create a post
// ****************************************************************************************

router.post("/post-create", (req, res) => {
  const {title, content, author} = req.body;

  Post.create( {title, content, author} )
    .then( dbPost => {
      return User.findByIdAndUpdate(author, { $push: { posts: dbPost._id }} );
    })
    .then( () => {
      res.redirect("/posts")
    })
    .catch(err => {
      console.log(`Err while creating the post in the DB: ${err}`);
      next(err);
    });
});


// ****************************************************************************************
// GET route to display all the posts
// ****************************************************************************************

router.get("/posts", (req, res) => {
  Post.find()
    .populate('author')
    .then( dbPosts => {
      res.render('posts/list', {posts: dbPosts});
    })
    .catch(err => {
      console.log(`Err getting list of posts: ${err}`);
      next(err);
    });
});

// ****************************************************************************************
// GET route for displaying the post details page
// shows how to deep populate (populate the populated field)
// ****************************************************************************************


router.get("/posts/:postId", (req, res) => {
  const {postId} = req.params;
  Post.findById(postId)
    .populate('author')
    .then( dbPost => {
      res.render("posts/details", dbPost);
    })
});


module.exports = router;
