import express from "express";
import path from "path";
import { nanoid } from "nanoid";
const __dirname = path.resolve();
import { ObjectId } from "mongodb";

// set on environment variable
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
import { MongoClient } from "mongodb";

const PORT = process.env.PORT || 3000;

const mongodbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.iunhwh0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(mongodbURI);
async function run() {
  try {
    await client.connect();
    console.log("succesfully connected to Atlas");
  } catch (err) {
    console.log(err.stack);
    await client.close();
    process.exit(1);
  }
}
run().catch(console.dir);

process.on("SIGINT", async () => {
  console.log("app is terminaring");
  await client.close();
});

const database = client.db("crudapp");
const postsCollection = database.collection("posts");

app.post("/post", async (req, res, next) => {
  if (!req.body.title || !req.body.text) {
    return res.status(400).json({
      error: "title and text are required",
    });
  }
  // add document into database

  const post = {
    title: req.body.title,
    text: req.body.text,
    
  };
  try {
    const result = await postsCollection.insertOne(post);
    res.send({
      message: "Post added",
      posts: post,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/posts", async (req, res, next) => {
  const cursor = postsCollection.find({})
        .sort({ _id: -1 })
        .limit(100);

        try {
          let results = await cursor.toArray()
          console.log("results: ", results);
          res.send(results);
      } catch (e) {
          console.log("error getting data mongodb: ", e);
          res.status(500).send('server error, please try later');
      }
});

app.get("/post/:postId", async (req, res, next) => {
  if (!ObjectId.isValid(req.params.postId)) {
    res.status(403).send(`Invalid post id`);
    return;
  }
  try {
    const result = await postsCollection.findOne({
      _id: new ObjectId(req.params.postId),
    });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.put("/post/:postId", async (req, res, next) => {
  if (!ObjectId.isValid(req.params.postId)) {
    res.status(403).send(`Invalid post id`);
    return;
  }

  if (!req.body.text && !req.body.title) {
    res.status(403).send(`required parameter missing, example put body: 
      PUT     /api/v1/post/:postId
      {
          title: "updated title",
          text: "updated text"
      }
      `);
  }
  let dataToBeUpdated = {};

  if (req.body.title) {
    dataToBeUpdated.title = req.body.title;
  }
  if (req.body.text) {
    dataToBeUpdated.text = req.body.text;
  }

  try {
    const updateResponse = await postsCollection.updateOne(
      {
        _id: new ObjectId(req.params.postId),
      },
      {
        $set: dataToBeUpdated,
      }
    );
    console.log("updateResponse: ", updateResponse);

    res.send("post updated");
  } catch (e) {
    console.log("error inserting mongodb: ", e);
    res.status(500).send("server error, please try later");
  }
});

app.delete("/post/:postId", async (req, res, next) => {
  if (!ObjectId.isValid(req.params.postId)) {
    res.status(403).send(`Invalid post id`);
    return;
  }
  try {
    const deleteResponse = await postsCollection.deleteOne({
      _id: new ObjectId(req.params.postId),
    });
    console.log("deleteResponse: ", deleteResponse);
    res.send("post deleted");
  } catch (e) {
    console.log("error deleting mongodb: ", e);  // }

    res.status(500).send("server error, please try later");
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
