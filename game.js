const user = require("./useradmin.js");//require user constructor..to keep a log of users in users.json and play game.

let currentUser//var to hold current user

user.start(function(name){//exported function from useradmin that returns a name value with callback function

	currentUser = new user.User(name);
	currentUser.getWords();	//function to read words from "database"..currently a txt file in same directory
	currentUser.initGame(currentUser,currentUser.wordArr, 0);//function to start Game

});

