
const express = require("express");
const { getUserByEmail,  generateRandomString, urlsForUser} = require("./helpers");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const app = express();
const PORT = 3000; // default port 8080
app.set("view engine", "ejs");
app.use(morgan("dev"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
//const cookieParser = require("cookie-parser");
const { request } = require("express");
//app.use(cookieParser());
app.use(cookieSession({
  name: 'user_id',
  keys: ["secret"," more secret"]
}));



const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};



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
  const templateVars = {  user:users[req.session.user_id]};
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
  //let flag = false;
  let user = getUserByEmail(email,users);
  if(user){
  bcrypt.compare(password, user.password, (err,result)=>{
  if(!result){
    return res.status(401).send("Password incorrect");
  }
  //res.cookie("user_id" , users[key].id);
  req.session.user_id = user.id;
  res.redirect("/urls");
  })
 }

});


//logout
// app.get("/logout", (req, res) => {

//   res.render("logout");
// });

      // logout submit handler

app.post("/logout", (req, res) => {
  console.log("hello");
  res.clearCookie("user_id");
  req.session =null
  res.redirect("/urls");


});
      // register

app.get("/register",(req,res) =>{
  console.log("hiii")
  const templateVars = { user:users[req.session.user_id]};
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
  let user = getUserByEmail(email,users);
  
  if(user){
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
        users[id] = newUser;
        //res.cookie("user_id", id)
        req.session.user_id =id
        res.redirect('/urls') 
      })
    })  
  }
});


    //home

app.get("/", (req, res) => {
  res.send("Hello!");
  const templateVars = { user:users[req.session.user_id]};
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  //console.log(req.body);  
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = {longURL : longURL , userID:req.session.user_id};
  //console.log(urlDatabase)
  res.redirect("/urls");     
});

app.post("/urls/:shortURL/delete", (req, res) => {
 delete urlDatabase[req.params.shortURL];
 res.redirect("/urls");

});
                //urls

app.get("/urls", (req, res) => {
  //console.log(users);
  if(!req.session.user_id){
res.redirect("/login");
  }else {
    //console.log(req.session.user_id);
    let result= urlsForUser(req.session.user_id,urlDatabase)
    console.log("result", result) ;   
  const templateVars = { urls:result ,  user:users[req.session.user_id]};
  //console.log(req.cookies["user_id"]);
  res.render("urls_index", templateVars);
      }
   }
  
);
               //urls/new

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id){
 res.redirect("/login")
  }else{
    const templateVars = {  user:users[req.session.user_id]};
    res.render("urls_new",templateVars);
  }
});

         //u/:id

app.get("/u/:shortURL", (req, res) => { 
   if (!req.session.user_id){
    res.redirect("/login")
     }else{
   const templateVars = { user:users[req.session.user_id]};
   const longURL = urlDatabase[req.params.shortURL]; 
  res.redirect(longURL);
     }
});
app.post("/urls/:shortURL", (req, res) => {
 const longURL=req.body.longURL;
 let shortURL = req.params.shortURL;
 urlDatabase[shortURL].longURL = longURL  
 console.log("urldatabace",urlDatabase[shortURL]) ;
 let result= urlsForUser(req.session.user_id, urlDatabase) 
 const templateVars = { urls:result ,  user:users[req.session.user_id]};
  res.redirect("/urls",templateVars  );
 });

app.get("/urls/:shortURL", (req, res) => {
  
    const urlObject = urlsForUser(req.session.user_id, urlDatabase)
    
    for (let shortURL in urlObject){
      if(shortURL===req.params.shortURL){ 
        const abc = {longURL :urlObject[shortURL] , shortURL:shortURL,  user:users[req.session.user_id], };
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



  //const getUserByEmail = function(email, database)  