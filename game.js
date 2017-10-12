const user = require("./useradmin.js");
const inquirer = require("inquirer");

let currentUser

user.start(function(name){

	currentUser = new user.User(name);
	currentUser.getWords();	
	currentUser.initGame(currentUser,currentUser.wordArr, 0);

});

