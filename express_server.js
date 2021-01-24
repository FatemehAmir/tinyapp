
const express = require("express");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const app = express();
const PORT = 3000; // default port 8080
app.set("view engine", "ejs");
app.use(morgan("dev"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require("cookie-parser");
const { request } = require("express");
app.use(cookieParser());

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRandomString(length) {
    let shortURL = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      shortURL += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return shortURL;
}

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
//shortURL=urlDatabase[res.cookie["user_id"]]
//shortURL=req.params.shortURL
//longURL= shortURL[longURL]
//userID=shortUrl[userID]


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

             //login 
app.get("/login", (req, res) => {
  const templateVars = {  user:users[res.cookie["user_id"]]};
  res.render("login", templateVars);

});


           //login submit handler

app.post("/login", (req, res) => {
  // username=req.cookies.user;
  //console.log(username);
  let email = req.body.email;
  let password =req.body.psw;
  //1. To check whether the email 
  if(!email){
    console.log('no email');
    res.status(403).send("Email and Password fields are required.");
  }
  bcrypt.compare(password, users[key].password, (err,result)=>{
  if(!result){
    return res.status(401).send("Password incorrect");
  }
  res.cookie("user_id" , users[key].id);
  res.redirect("/urls");
  })
});
  // let flag = false;
  // for (let key in users){
  //   if(users[key].email === email){
  //     if(users[key].password === password) {
  //       res.cookie("user_id" , users[key].id);
  //       res.redirect("/urls");
  //     } 
  //   }
  // }
  // res.status(403).send("wrong password")

//logout
// app.get("/logout", (req, res) => {

//   res.render("logout");
// });

      // logout submit handler

app.post("/logout", (req, res) => {
  console.log("hello");
  res.clearCookie("user_id");
  res.redirect("/urls");


});
      // register

app.get("/register",(req,res) =>{
  console.log("hiii")
  const templateVars = { user:users[res.cookie["user_id"]]};
  console.log("hiii")
  res.render("register", templateVars)
  
});

      //register handler

app.post ("/register" ,(req ,res)=>{
  const email = req.body.email;
  const password = req.body.psw;
 
  //1. To check whether the email or password is empty
  if(!email || !password){
    res.send("Email and Password fields are required.");
  }
  //2. To check whether the email is already taken or not
  let flag = false;
  for(let key in users){
    if(users[key].email === email){
      flag = true;
    }
  }
  if(flag){
    res.send("Email already used. Please try with a different one");
  } else {
    //register the user
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(password, salt,(err,hash)=>{
        const id = generateRandomString(6);
        const newUser = {
          id: id,
          email: email,
          password: hash
        };
        //add user object to user database
        users[id] = newUser;
        res.cookie("user_id", id)
        res.redirect('/urls') 
      })
    })
    
    
  }
});


    //home

app.get("/", (req, res) => {
  res.send("Hello!");
  const templateVars = { user:users[req.cookie["user_id"]]};
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = {longURL : longURL , userID:req.cookies["user_id"]};

  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
 
 delete urlDatabase[req.params.shortURL];
 res.redirect("/urls");

});
                //urls

app.get("/urls", (req, res) => {
  //console.log(users);
  if(!req.cookies["user_id"]){
res.redirect("/login");
  }else {
    result= urlsForUser(req.cookies["user_id"])    
  const templateVars = { urls:result ,  user:users[req.cookies["user_id"]]};
  //console.log(req.cookies["user_id"]);
  res.render("urls_index", templateVars);
      }
   }
  
);
               //urls/new

app.get("/urls/new", (req, res) => {
 
  if (!req.cookies["user_id"]){
 res.redirect("/login")
  }else{

    const templateVars = {  user:users[req.cookies["user_id"]]};
    res.render("urls_new",templateVars);
  }
});

         //u/:id

app.get("/u/:shortURL", (req, res) => {
   //const longURL = `http://www.${shortURL}`
   if (!req.cookies["user_id"]){
    res.redirect("/login")
     }else{
   const templateVars = { user:users[req.cookies["user_id"]]};
   const longURL = urlDatabase[req.params.shortURL]; 
  res.redirect(longURL);
     }
});
app.post("/urls/:shortURL", (req, res) => {
 const longURL=req.body.longURL
 
 result= urlsForUser(req.cookies["user_id"])    
 const templateVars = { urls:result ,  user:users[req.cookies["user_id"]]};
 //urlDatabase[req.params.shortURL]= `http://www.${longURL}`     
  //urlDatabase[req.body.longURL];
  res.redirect("/urls");
 
 });

app.get("/urls/:shortURL", (req, res) => {
  
    const urlObject = urlsForUser(req.cookies["user_id"])
    for (let shortURL in urlObject){
      if(shortURL===req.params.shortURL){ 
        const abc = {longURL :urlObject[shortURL] , shortURL:shortURL,  user:users[req.cookies["user_id"]], };
        res.render("urls_show", abc);
        return;
      }
    }
  res.redirect("/login");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

 const urlsForUser =function(id){
let result={};
    for(let element in urlDatabase){
      let urlinfo=urlDatabase[element];
      //if(users[key].email === email)
      if(id === urlinfo.userID){
        result[element]=urlinfo.longURL;
      }
    }
    return result;
  }  