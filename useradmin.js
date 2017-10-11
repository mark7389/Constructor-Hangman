const word = require("./words.js");
const fs = require("fs");
const inquirer = require("inquirer");

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
module.exports = {

	User: User,
	start:start
};