const user = require("./useradmin.js");
const inquirer = require("inquirer");

let currentUser, guesses = 9, currentWord, wordArr;

user.start(function(name){

	currentUser = new user.User(name);
	currentUser.getWords(function(arr){

		wordArr = arr;
		initGame(currentUser, wordArr, 0);
	});
});

function initGame(user, arr, c){

	
	if(c === arr.length){

		inquirer.prompt([{

			type:"confirm",
			message: "Play Again?",
			choices:["Sure !", "No, Quit !"],
			name: "choice"

		}]).then(function(ans){

			if(ans.choice === "Sure !"){

				play(user, arr, 0);
			}
			else{

				user.getInfo(function(obj){

					console.log(obj.win+ " " +obj.lose);
				});

				user.updateFile();
			}
		});

	}

	else{




	}


}

function gamePlay(c){

	inquirer.prompt([
	{

		
	}])

}