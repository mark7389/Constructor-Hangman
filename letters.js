var Letter = function(char){

	this.char = char;

	if(char === " "){

		this.placeHolder = " ";

	}
	else{

		this.placeHolder = "_";
	}
	
}

module.exports = Letter;