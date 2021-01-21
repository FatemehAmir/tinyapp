
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require("cookie-parser");
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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users={"fatemeh" : "amir"};
//login

// app.get("/login", (req, res) => {
//   res.render("login");
// });


//login submit handler

app.post("/login", (req, res) => {
  // username=req.cookies.user;
  //console.log(username);
  let username = req.body.username;
  //let password=users[username]
  // if(users[username]){
  //   const templateVars = { username: req.cookies["username"], password: password};
  //   res.render("urls-index", templateVars);  
  // } else {
  //   res.redirect('/urls');
  // }

  res.cookie("username" , username);
  res.redirect("/urls");
  
});
// //logout
// app.get("/logout", (req, res) => {
//   res.render("logout");
// });

// // logout submit handler
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});





app.get("/", (req, res) => {
  res.send("Hello!");
  const templateVars = { username:req.cookies["username"]};
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = `http://www.${longURL}`;

  res.redirect("/urls");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
 
 delete urlDatabase[req.params.shortURL];
 res.redirect("/urls");

});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase ,username:req.cookies["username"]};
  res.render("urls_index", templateVars);


});

app.get("/urls/new", (req, res) => {
  const templateVars = { username:req.cookies["username"]};
  res.render("urls_new",templateVars);
});

app.get("/u/:shortURL", (req, res) => {
   //const longURL = `http://www.${shortURL}`
   const templateVars = { username:req.cookies["username"]};
   const longURL = urlDatabase[req.params.shortURL]; 
  res.redirect(longURL);
});
app.post("/urls/:shortURL", (req, res) => {
 const longURL=req.body.longURL
 console.log(req.body);
 console.log(req.params);
 urlDatabase[req.params.shortURL]= `http://www.${longURL}`     
  //urlDatabase[req.body.longURL];
  res.redirect("/urls");
 
 });

app.get("/urls/:shortURL", (req, res) => {

  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
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