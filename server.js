//Node js require statements
const mysql = require('mysql');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

//database config
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Coding4life!@19",
  database: "testdb"
});

//misc config to get the html and css to play nice
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.resolve(__dirname, "views"));
//var duplicate = con.query("SELECT username, COUNT(*) FROM users GROUP BY username HAVING COUNT(*) >1");


/*======GET ROUTING===========*/
//root
app.get("/", function (req,res){
  res.render("index.ejs");
})
app.get("/:create", function(req, res){
  res.render(req.params.create);
})


/*=======METHODS==============*/
app.post('/', function(req,res){
    con.query("SELECT * FROM users WHERE username = ?", [req.body.username], function(err, results){
      //throw SQL error
      if(err) throw (err);
      //interpret query response
      console.log(req.body.username + " attempting login...");
      if(!results.length){
        //handle no such username
        console.log("No such username found.\n");
        res.render("noname.ejs");
        return
      }
      else{
        //check if password matches
        if(req.body.password == results[0].password){
          //log in successfull
          console.log("log in successfull!\n");
          res.render("success.ejs");
          return;
        }
        else{
          //wrong password
          console.log("Incorrect Password.\n");
          res.render("wrongpass.ejs");
          return;
        }
      }
    });
})
app.post("/:create", function(req,res){
  con.query("INSERT INTO users VALUES('" +req.body.username+"', '"+req.body.password+"')", function(err, results){
    if(err) throw err;
    try {
      res.render("create.ejs");
      if(req.body.password == results[0].password){
        console.log("New user has been created!");
        res.render("successCreate.ejs");
        return;
    }
   
    }catch(error){
      console.log(error, "username already in database.");
    }
  });
})

//define port
app.listen(8080, function (){
  console.log("listening on 8080.\n");
})
