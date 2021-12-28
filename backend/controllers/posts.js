const Post = require('../models/post')


exports.getPosts = (req, res, next) => {
  console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchedPosts;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery.find().
    then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {

      //console.log(documents);
      res.status(200).json({
        posts: fetchedPosts, 'message': 'Posts fetched successfully',
        maxPosts: count
      });
    });


}



// Get a specific post
exports.getPost = (req, res) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post Not found' })
    }
  })
};


exports.addPost = (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  })
  console.log('server: adding new post + ' + post);
  console.log(req.userData);
  //return res.status(200).json({});
  post.save().then(result => {
    console.log(result);
    res.status(201).json({
      'message': 'Post added successfully',
      //postId: result._id
      post: {
        _id: result._id,
        title: result.title,
        content: result.content,
        imagePath: result.imagePath
      }
    });
  });

  //res.status(201).json({ 'message': 'Post added successfully' });
};


exports.updatePost = (req, res) => {
  //const url = req.protocol+"://"+req.get("host");
  //console.log(req.file);
  let imagePath = req.body.imagePath;
  if (req.file) {
    imagePath = req.protocol + "://" + req.get("host") + "/images/" + req.file.filename
  }
  let post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId

  });

  console.log('updating post with id: ' + req.body._id)
  console.log(post)
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: 'Succesfully updated post' });
    }
    else {
      res.status(401).json({ message: 'Not authorized' })
    }
  })
};

exports.deletePost = (req, res) => {

  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
  .then(result => {
    console.log(result);
    if (result.deletedCount ==1) {
      res.status(200).json({ message: 'Successfully deleted' });
    } else {
      res.status(401).json({ message: 'Not authorized to perform delete op' })
    }
  });
};

