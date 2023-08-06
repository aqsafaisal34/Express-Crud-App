import express from "express";
import path from "path";
import { nanoid } from "nanoid";
const __dirname = path.resolve();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// create dummy post then replace it with mongodb database
let posts = [
  {
    id: nanoid(),
    title: "first post",
    text: "This is dummy post",
  },
];

app.post("/post", (req, res, next) => {
  if (!req.body.title || !req.body.text) {
    return res.status(400).json({
      error: "title and text are required",
    });
  }
  posts.push({
    id: nanoid(),
    title: req.body.title,
    text: req.body.text,
  });
  res.send({
    message: "Post added",
    posts: posts,
  });
});

app.get("/posts", (req, res, next) => {
  res.send({
    posts: posts,
  });
});

app.get("/post/:id", (req, res, next) => {
  let id = req.params.id;
  const postFound = posts.find((post) => post.id == id);
  if (!postFound) {
    return res.status(404).json({
      error: "Post not found",
    });
  } else {
    res.send({
      post: postFound,
      message: "Post found",
    });
  }
});

app.put('/post/:postId', (req, res, next) => {

  if (!req.params.postId
      || !req.body.text
      || !req.body.title) {
      res.status(403).send(`example put body: 
      PUT     /api/v1/post/:postId
      {
          title: "updated title",
          text: "updated text"
      }
      `)
  }

  for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === req.params.postId) {
          posts[i] = {
              id: req.params.postId,
              text: req.body.text,
              title: req.body.title,
          }
          res.send('post updated with id ' + req.params.postId);
          return;
      }
  }
  res.send('post not found with id ' + req.params.postId);
})

app.delete('/post/:postId', (req, res, next) => {

  if (!req.params.postId) {
      res.status(403).send(`post id must be a valid id`)
  }

  for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === req.params.postId) {
          posts.splice(i, 1)
          res.send('post deleted with id ' + req.params.postId);
          return;
      }
  }
  res.send('post not found with id ' + req.params.postId);
})


app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
