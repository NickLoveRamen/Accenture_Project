//Node js require statements
const mysql = require('mysql');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

//database config
var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "mydb"
});

//misc config to get the html and css to play nice
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



/*======GET ROUTING===========*/
//root
app.get("/", function (req,res){
  res.render("index.ejs");
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

//define port
app.listen(8080, function (){
  console.log("listening on 8080.\n");
})
