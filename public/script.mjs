window.addPost = async () => {
  let title = document.getElementById("title").value;
  let text = document.getElementById("text").value;
  try{
    await axios
    .post("/post", {
      title,
      text,
    })
    .then((res) => {
      console.log(res.data);
      document.getElementById("title").value = "";
      document.getElementById("text").value = "";
      getAllPosts();
      alert("New Post added");
    });
  }catch(err){
    console.log(err);
    alert("error in adding post");
  }
};

window.getAllPosts = async () => {
  try{
 await axios
    .get("/posts")
    .then((res) => {
      console.log(res.data);

      let postsHtml = ``;

      res.data.map((eachPost) => {
        postsHtml += `<div id='card-${eachPost._id}' class="post-card">
                  <h3 class="post-title">Title:${eachPost.title}</h3>
                  <p class="post-text">${eachPost.text} </p>
                  <button class="edit-btn btn btn-danger" onclick="delPost('${eachPost._id}')">Delete</button>
                  <button class="delete-btn btn btn-success" onclick="editPost('${eachPost._id}','${eachPost.title}','${eachPost.text}', )">Edit</button>
              </div> 
              <br />`;
      });

      document.querySelector("#post-list").innerHTML = postsHtml;
    })
  }catch(err){
    console.log(err);
  }
};

window.delPost = async (postId) => {
  console.log("delete: ", postId);
  try {
    await axios
      .delete(`/post/${postId}`)
      .then(function (response) {
        console.log(response.data);

        alert("Post deleted");
        getAllPosts();
      });
  } catch (error) {
    console.log(error);
    alert("error in deleting post");
  }
};

window.editPost = (postId, title, text) => {
  console.log("delete: ", postId);

  document.querySelector(
    `#card-${postId}`
  ).innerHTML = `<form onsubmit="savePost('${postId}')">
          title: <input type='text' value='${title}' id='title-${postId}' class='post-tit'/>
          <br/>
          text: <input type='text' value='${text}' id='text-${postId}' class='post-tex' />
          <br/>
          <button class='post-tit btn btn-primary'>Save</button>

      </form>`;
};
window.savePost = async (postId) => {
  try{
  const updatedTitle = document.querySelector(`#title-${postId}`).value;
  const updatedText = document.querySelector(`#text-${postId}`).value;

 await axios
    .put(`/post/${postId}`, {
      id: postId,
      title: updatedTitle,
      text: updatedText,
    })
    .then(function (response) {
      console.log(response.data);
      alert("Post updated");
      getAllPost();
    })
  }catch(error){
    console.log(error);
    alert("error in updating post");
}
};
