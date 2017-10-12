const word = require("./words.js");
const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");

let wordArr , guesses = 9, guessed = [];

var User = function(n){
	
		this.name = n;
		this.wins = 0;
		this.losses = 0;
		this.LogExists = false;
		this.getWords = function(func){

			if(typeof func !== "function"){

				throw new TypeError("Callback not a function, must pass function argument as Callback");
			}

			this.wordArr = fs.readFileSync("words.txt", "utf8").split(",");
			func(this.wordArr);
		}		
}

User.prototype.getInfo = function(func){

	if(typeof func !== "function"){

		throw new TypeError("Callback should be a function!!" + " " + typeof func);
	}

	var userObj = {

		name: this.name,
		win: this.wins,
		lose: this.losses
	}

	func(userObj);
}

User.prototype.appendUser = function(){


	if(this.LogExists){

		var userArr;

		fs.readFile("users.json", function(err, data){

			userArr = (JSON.parse(data));

			this.getInfo(function(user){

				userArr.push(user);

				fs.writeFile("users.json", JSON.stringify(userArr), function(err){

					console.log("Account Saved!!");

				});
			

			}.bind(this));

		}.bind(this));
	}

	else{

		this.getInfo(function(user){

			fs.writeFile("users.json", JSON.stringify(Array.of(user)), function(err){

				console.log("Account Saved!!!");

			});

		});

	}
		
}

User.prototype.updateFile = function(){

	fs.readdir(".", function(err, data){

		data.forEach(function(val, i, a){

			if(val === "users.json"){

				this.LogExists = true;
			}
			else if(i === data.length-1){

				this.appendUser();
			}


		}.bind(this));

	}.bind(this));

}

function start(func){

	if(typeof func !== "function"){

		throw new TypeError("Callback should be a function!!" + " " + typeof func);
	}

	inquirer.prompt([

		{
			name:"who",
			message:"Please enter your name: "
		}

	]).then(function(ans){

		func(ans.who);

});

}

User.prototype.initGame = function(user, arr, c){


	wordArr = arr;
	
	if(c >= arr.length){

		user.getInfo(function(obj){
						
			console.log("\n"+"All done !!!"+"\n"+"You got "+obj.win+chalk.green(" Right")+" && "
				+obj.lose+chalk.red(" Wrong")+"\n");
		});

		user.updateFile();

		inquirer.prompt([{

			type:"confirm",
			message: "Play Again?",
			choices:["Sure !", "No, Quit !"],
			name: "choice"

		}]).then(function(ans){

			if(ans.choice === "Sure !"){

				//restart game...
			}
			else{

				return;
			}
		});

	}

	else{
		
		var currentWord = new word(wordArr[c]);
		console.log(currentWord.currentWord);
		currentWord.createArr();
		user.gamePlay(currentWord, c);

	}


}

User.prototype.gamePlay = function(currentWord, c){
	console.log(c)
	var isFound = false;

	if(currentWord.letterArr.join("") === currentWord.holderArr.join("") && guesses >= 1){
			console.log(this);
			this.wins++;
			c++;
			console.log(c);
			guesses = 9;
			console.log("You got it Right!!! Next Word >>>");
			// console.log(wordArr);
			this.initGame(this,this.wordArr,c);
	}

	else if(currentWord.letterArr.join("") !== currentWord.holderArr.join("") && guesses == 0){
			console.log(this);
			this.losses++;
			c++;
			guesses = 9;
			console.log("Oops..better luck on Next Word >>>");
			console.log(wordArr);
			this.initGame(this,this.wordArr,c);
			
	}
	else{

		

		inquirer.prompt([
		{
			name: "name",
			message: "Guess a Letter:"
			
		}]).then(function(ans){

				if(guessed.indexOf(ans.name) > -1){

					console.log("\nYou already guessed this letter...you just lost an attempt for nothing, FACEPALM !!!\n");

				}

				for(var i = 0; i<currentWord.holderArr.length; i++){
				
					if((currentWord.letterArr[i] === ans.name || currentWord.letterArr[i] === ans.name.toUpperCase()) &&  guessed.indexOf(ans.name) === -1){

						currentWord.holderArr[i] = currentWord.letterArr[i];
						isFound = true;
						
					}
					
				}
				if(isFound){

					console.log(currentWord.holderArr.join(" ")+"\n");
					console.log(chalk.hex("#66ff00").bold("CORRECT"));
					this.gamePlay(currentWord, c);

				}
				else{
					guesses--;
					console.log(currentWord.holderArr.join(" ")+"\n");
					console.log(chalk.hex("#FF6600").bold("INCORRECT")+"\n");
					console.log("Guesses remaining: "+guesses);
					this.gamePlay(currentWord, c);
				}

				guessed.push(ans.name);

			}.bind(this));

		}

} 

module.exports = {

	User: User,
	start:start	
}