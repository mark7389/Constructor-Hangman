const user = require("./useradmin.js");
const inquirer = require("inquirer");

let currentUser, guesses = 9, currentWord, wordArr;

inquirer.prompt([

		{
			name:"who",
			message:"Please enter your name: "
		}

	]).then(function(ans){

		currentUser = new user(ans.who);
		currentUser.getWords(function(arr){
			wordArr = arr;

		});

});

