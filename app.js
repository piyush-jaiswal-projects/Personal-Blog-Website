const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

var fs = require('fs');
var path = require('path');
require('dotenv/config');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect("mongodb+srv://pjadmin2154:pj7210479283@cluster0.dwjvq.mongodb.net/personalWebsiteDB",
	{ useNewUrlParser: true, useUnifiedTopology: true }, err => {
		console.log('connected')
	});



const postSchema = {
  title: String,
  content: String,
  code: String
};

const notesSchema = {
  title: String,
  code: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);
const Notes = mongoose.model("Note", notesSchema);




app.get('/',function(req,res) {
    res.render("index");
  });

  app.get('/blog',function(req,res) {

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
    res.render("newsletter");
  });

  app.get('/bookNotes',function(req,res) {


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
    res.render("admin");

  });

  app.get('/admin', function(req, res){
      res.render("admin");
  });

  app.post("/authorization", function(req, res){
      const user = req.body.username;
      const pass = req.body.password;
      const username = "@piyush72104792832154";
      const password = "#PJaiswal7210479283";
      if(user == username && pass == password){
        res.render("compose");
      }
      else{
        res.render("failure");
      }

  });

  app.post("/composePost", function(req, res) {

   const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent,
    code: req.body.postCode
  });


  post.save(function(err){
    if (!err){
        res.redirect("/blog");
    }
  });


  });


 
  app.post("/composeNotes", function(req,res){
  

    const note = new Notes({
      title: req.body.bookTitle,
      content: req.body.bookContent,
      code: req.body.bookCode
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



  app.get("/blog/:code", function(req, res){

    var requestedPostCode = req.params.code;

    app.set('views', [path.join(__dirname, 'views'),
                      path.join(__dirname, 'views/articles/')]);

  Post.findOne({code: requestedPostCode}, function(err, post){
    res.render(requestedPostCode, {
        title: post.title
      });
  });
  });


  app.get("/bookNotes/:code", function(req, res){

    const requestedNoteCode = req.params.code;
    app.set('views', [path.join(__dirname, 'views'),
                      path.join(__dirname, 'views/notes/')]);

    Notes.findOne({code: requestedNoteCode}, function(err, note){
      res.render(requestedNoteCode, {
        title: note.title
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

  let port = process.env.PORT;
  // if (port == null || port == "") {
  //   port = 3000;
  // }


app.listen(port, function() {
    console.log("Server started successfully");
  });