
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
const e = require("express");
app.use(bodyParser.urlencoded({extended: true}));

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


app.get("/", (req, res) => {
  res.send("Hello!");
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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
   //const longURL = `http://www.${shortURL}`
   const longURL = urlDatabase[req.params.shortURL]; 
  res.redirect(longURL);
});
app.post("/urls/:shortURL", (req, res) => {
 const longURL=req.body.longURL
 urlDatabase[req.params.shortURL]=longURL
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