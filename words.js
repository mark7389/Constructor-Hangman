//require letter constructor
const letters = require("./letters.js");
//word object constructor
var Word = function(str){
	//an array of letters from letter objects
	this.letterArr = [];
	//an array of placeholders from letter objects
	this.holderArr = [];
	//the str argument aka current word being played
	this.currentWord = str.toLowerCase();
	//creates the letter object arrays UP
	this.createArr = function(){
		//prototype like forEach but for strings
		this.forEvery(function(c){
			
			var character = new letters(c);
			this.letterArr.push(character.char);
			this.holderArr.push(character.placeHolder);
			
		}.bind(this));//
	}
}

//prototype looping function for string similar to forEach with arrays...
Word.prototype.forEvery = function(func){

	if(typeof func !== "function"){

		throw new TypeError("Callback should be a function!!" + " " + typeof func);
	}

	for(var i = 0; i<this.currentWord.length; i++){

		if(i == 0){

			func(this.currentWord.charAt(i).toUpperCase());

		}

		else if(this.currentWord.charAt(i) === " "){

			func(this.currentWord.charAt(i));
			func(this.currentWord.charAt(i+1).toUpperCase());
			i++;

		}

		else{

			func(this.currentWord.charAt(i));
		}
	}

}

module.exports = Word;//export word constructor
