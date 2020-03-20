const express = require('express');

const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error adding the user" });
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  Posts.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error adding post."})
    })

});

router.get('/', (req, res) => {
  // do your magic!
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving the users."})
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving posts for the user."})
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
    .then(user => {
      if (user > 0) {
        res.status(200).json({ message: "User has been deleted." })
      } else {
        res.status(404).json({ message: "User could not be found."})
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error deleting user from database." })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  Users.update(req.params.id, req.body)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User could not be found."})
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving user from database."})
    })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        next(new Error("invalid user id"))
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "exception", error})
    })

}

function validateUser(req, res, next) {
  // do your magic!
  const reqBody = req.body;
  const { name } = req.body;
  if (!reqBody || reqBody === {}) {
    res.status(400).json({ message: "missing user data" })
  } else if (!name || name === undefined) {
    res.status(400).json({ message: "missing required name field" })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  const reqBody = req.body;
  const { text } = req.body;
  if (!reqBody || reqBody === {}) {
    res.status(400).json({ message: "missing post data" })
  } else if (!text || text === undefined) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next();
  }
}

module.exports = router;
