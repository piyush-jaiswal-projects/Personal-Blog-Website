const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/personalWebsiteDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const notesSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);
const Notes = mongoose.model("Note", notesSchema);


// let posts = [];
// let notes = [];
// let letters = [];

app.get('/',function(req,res) {
    res.render("index");
  });

  app.get('/blog',function(req,res) {
    // res.render("blog", {
    //     startingContent: homeStartingContent,
    //     posts: posts
    // });

    Post.find({}, function(err, posts){
      res.render("blog", {
        startingContent: homeStartingContent,
        posts: posts
        });
    });
  });

  app.get('/podcast',function(req,res) {
    res.render("podcast");
  });

  app.get('/newsletter',function(req,res) {
    res.render("newsletter", {
      letters: letters
    });
  });

  app.get('/bookNotes',function(req,res) {
    // res.render("bookNotes", {
    //     notes: notes 
    // });

    Notes.find({}, function(err, notes){
      res.render("bookNotes", {
        notes: notes
        });
    });
  });

  app.get('/about',function(req,res) {
    res.render("about");
  });

  app.get('/contact',function(req,res) {
    res.render("contact");
  });

  app.get('/compose',function(req,res) {
    res.render("compose");
  });

  app.post("/composePost", function(req,res){
  //  const postTitle = req.body.postTitle;
  // const postBody = req.body.postContent;

  //  const post = {
  //      title: postTitle,
  //      content: postBody
  //  };

  //  posts.push(post);

  //  res.redirect("/blog");


   const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });


  post.save(function(err){
    if (!err){
        res.redirect("/blog");
    }
  });
  });


 
  app.post("/composeNotes", function(req,res){
  //   const bookTitle = req.body.bookTitle;
  //  const bookBody = req.body.bookContent;
 
  //   const note = {
  //       title: bookTitle,
  //       content: bookBody
  //   };
 
  //   notes.push(note);
 
  //   res.redirect("/bookNotes");


    const note = new Notes({
      title: req.body.bookTitle,
      content: req.body.bookContent
    });
  
  
    note.save(function(err){
      if (!err){
          res.redirect("/bookNotes");
      }
    });
   });


   app.post("/composeLetters", function(req,res){
    const letterTitle = req.body.letterTitle;
   const letterBody = req.body.letterContent;
 
    const letter = {
        title: letterTitle,
        content: letterBody
    };
 
    letters.push(letter);
 
    res.redirect("/newsletter");
   });



  app.get("/blog/:postId", function(req, res){
    // const requestedTitle = _.lowerCase(req.params.postName);

    // posts.forEach(function(post){
    //  const storedTitle = _.lowerCase(post.title);

    //  if(storedTitle === requestedTitle){
    //   res.render("post", {
    //     title: post.title,
    //     content: post.content
    //   });   

    //  }
    // });


    const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
  });


  app.get("/bookNotes/:noteId", function(req, res){
    // const requestedTitle = _.lowerCase(req.params.bookName);

    // notes.forEach(function(note){
    //  const storedTitle = _.lowerCase(note.title);

    //  if(storedTitle === requestedTitle){
    //   res.render("note", {
    //     title: note.title,
    //     content: note.content
    //   });   

    //  }
    // });
    const requestedNoteId = req.params.noteId;

    Notes.findOne({_id: requestedNoteId}, function(err, note){
      res.render("note", {
        title: note.title,
        content: note.content
      });
    });
  });



  app.get("/newsletter/:letterName", function(req, res){
    const requestedTitle = _.lowerCase(req.params.letterName);

    letters.forEach(function(letter){
     const storedTitle = _.lowerCase(letter.title);

     if(storedTitle === requestedTitle){
      res.render("letter", {
        title: letter.title,
        content: letter.content
      });   

     }
    });
  });




app.listen(3000, function() {
    console.log("Server started on port 3000");
  });