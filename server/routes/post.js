const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const requireLogin = require("../middleware/requireLogin")
const Post = mongoose.model("Post")

router.get("/allpost", requireLogin, (req, res) => {
  //find all posts
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts })
    })
    .catch((err) => {
      console.log("allpost error: ", err)
    })
})

router.get("/getsubpost", requireLogin, (req, res) => {
  //find all posts of users I follow
  //if postedBy in following
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts })
    })
    .catch((err) => {
      console.log("subpost error: ", err)
    })
})

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" })
  }
  req.user.password = undefined
  const post = new Post({
    title: title,
    body: body,
    photo: pic,
    postedBy: req.user,
  })
  post
    .save()
    .then((result) => {
      res.json({ post: result })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost })
    })
    .catch((err) => {
      console.log("mypost error: ", err)
    })
})

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id }, //add user's like to array
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    } else {
      res.json(result)
    }
  })
})

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id }, //remove user's like from array
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err })
    } else {
      res.json(result)
    }
  })
})

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  }
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment }, //add user's comment to array
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err })
      } else {
        res.json(result)
      }
    })
})

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err })
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json({ result })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
})

router.delete("/deletecomment/:postId/:commentId", requireLogin, (req, res) => {
  Post.findById(req.params.postId)
    //   .populate("postedBy","_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ message: "Some error occured!!" })
      }
      const comment = post.comments.find(
        (comment) => comment._id.toString() === req.params.commentId.toString()
      )
      if (comment.postedBy._id.toString() === req.user._id.toString()) {
        const removeIndex = post.comments
          .map((comment) => comment._id.toString())
          .indexOf(req.params.commentId)
        post.comments.splice(removeIndex, 1)
        post
          .save()
          .then((result) => {
            res.json(result)
          })
          .catch((err) => console.log(err))
      }
    })
})

module.exports = router
