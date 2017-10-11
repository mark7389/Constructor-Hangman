const letters = require("./letters.js");

var Word = function(str){

	this.letterArr = [];
	this.holderArr = [];
	

	this.createArr = function(){

		this.forEvery(function(c){
			
			var character = new letters(c);
			this.letterArr.push(character.char);
			this.holderArr.push(character.placeHolder);
			
		}.bind(this));//
	}
}


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

module.exports = Word;
