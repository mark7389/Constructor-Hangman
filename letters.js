//the letter constructor
var Letter = function(char){
	//made of a letter
	this.char = char;

	if(char === " "){

		this.placeHolder = " ";

	}
	else{
		//and a placeholder
		this.placeHolder = "_";
	}
	
}

module.exports = Letter;//export constructor function