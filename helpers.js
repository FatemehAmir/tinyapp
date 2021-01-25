


const getUserByEmail = function(email, userDatabase) {

    for (const user in userDatabase) {
      if (userDatabase[user].email === email) {
        return userDatabase[user];
      }
    }
  };
  


//random


function generateRandomString(length) {
  
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


    let shortURL = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      shortURL += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return shortURL;
}
//
const urlsForUser =function(id,urlDatabase){
  let result={};
      for(let element in urlDatabase){
        console.log( "qqqqqqqqq",urlDatabase)
        let urlinfo=urlDatabase[element];
        //if(users[key].email === email)
        if(id === urlinfo.userID){
          result[element]=urlinfo.longURL;
        }
      }
      return result;
    } 




module.exports = {
  generateRandomString,
  urlsForUser,
  getUserByEmail
};