const word = require("./words.js");
const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
//variables to store number of guesses and gussed letters
let guesses, guessed;
//user constructor to keep score and simulate a create account 
var User = function(n){
	
		this.name = n;
		this.wins = 0;
		this.losses = 0;
		this.LogExists = false;
		this.getWords = function(){

			this.wordArr = fs.readFileSync("words.txt", "utf8").split(",");
		}		
}
//function that returns userinfo as name and wins and losses per complete gameplay to pass to log file
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
//fucntion to append log file with user info
User.prototype.appendUser = function(){


	if(this.LogExists){

		var userArr;

		fs.readFile("users.json", function(err, data){

			userArr = (JSON.parse(data));

			this.getInfo(function(user){

				userArr.push(user);

				fs.writeFile("users.json", JSON.stringify(userArr), function(err){

						if(err) throw err;					

				});
			

			}.bind(this));//inner callback function bind this value to be user

		}.bind(this));//outter callback function bind this value to be user
	}

	else{

		this.getInfo(function(user){

			fs.writeFile("users.json", JSON.stringify(Array.of(user)), function(err){

				if(err) throw err;

			});

		});

	}
		
}
//function to check if log exists then call appendUser to either write file or update existing
User.prototype.updateFile = function(){

	fs.readdir(".", function(err, data){

		if(err) throw err;

		data.forEach(function(val, i, a){

			if(val === "users.json"){

				this.LogExists = true;
			}
			else if(i === data.length-1){

				this.appendUser();
			}


		}.bind(this));//inner callback function bind this value to be user


	}.bind(this));//outter callback function bind this value to be user

}
//start point to get username
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
//initialize game with current user array of words from txt file "database" and a counter to track words played
User.prototype.initGame = function(user, arr, c){

	guesses = 9;
	guessed = [];
	wordArr = arr;
	//if counter equal word array.length then round is done get info update file and ask if user wants to quit or continue playing
	if(c >= arr.length){

		user.getInfo(function(obj){
						
			console.log("\n"+"All done !!!"+"\n"+"You got "+obj.win+chalk.hex("#66ff00").bold(" Right")+" && "
				+obj.lose+chalk.red(" Wrong")+"\n");
		});

		user.updateFile();

		inquirer.prompt([{

			type:"list",
			message: "Play Again?",
			choices:["Sure !", "No, Quit !"],
			name: "choice"

		}]).then(function(ans){

			if(ans.choice === "Sure !"){

				this.initGame(this,this.wordArr,0);
			}
			else{

				return;
			}
		}.bind(this));//bind user to callback

	}

	else{
		//initialize a new word from word array using word object consructor 
		var currentWord = new word(this.wordArr[c]);
		currentWord.createArr();//create letter and placeholder arrays from letter objects created within function
		user.gamePlay(currentWord, c);//call the gameplay control function

	}


}
//gameplay function controls flow of game takes current word argument and counter to increment before restarting with next word from array
User.prototype.gamePlay = function(currentWord, c){
	
	var isFound = false;//a flag for whether guess is correct or incorrect
//condition of win
	if(currentWord.letterArr.join("") === currentWord.holderArr.join("") && guesses >= 1){
		
			this.wins++;
			c++;
			console.log("You got it Right!!! Next Word >>>\n");
			this.initGame(this,this.wordArr,c);

	}
//condition of loss
	else if(currentWord.letterArr.join("") !== currentWord.holderArr.join("") && guesses == 0){
			
			this.losses++;
			c++;
			console.log("Oops..better luck on Next Word >>>\n");
			this.initGame(this,this.wordArr,c);
			
			
	}
	//else still guessing
	else{

		

		inquirer.prompt([
		{
			name: "name",
			message: "Guess a Letter:",
			validate:function(value){
				if(value.length === 1 && isNaN(value)){
					return true;
				}
				return false;	
			}

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
					console.log(chalk.hex("#66ff00").bold("CORRECT")+"\n");
					guessed.push(ans.name);
					this.gamePlay(currentWord, c);

				}
				else{
					guesses--;
					console.log(currentWord.holderArr.join(" ")+"\n");
					console.log(chalk.hex("#FF6600").bold("INCORRECT")+"\n");
					console.log("Guesses remaining: "+guesses);
					guessed.push(ans.name);
					this.gamePlay(currentWord, c);
				}

				

			}.bind(this));//bind user to callback

		}

} 
//export start function and user constructor function
module.exports = {

	User: User,
	start:start	
}