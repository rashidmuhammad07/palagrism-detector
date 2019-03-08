let fs = require('fs');

const palagrismDetector = (synFile, file1, file2, tuple = 3) => {
	let input1 = fs.readFileSync(file1, 'utf8').split('\r\n');
	let input2 = fs.readFileSync(file2, 'utf8').split('\r\n');
	let synonyms = fs.readFileSync(synFile, 'utf8').split('\r\n');
	let tupleArrayInput1 = tupleSeparator(input1, tuple);
	let tupleArrayInput2 = tupleSeparator(input2, tuple);
	let totalTuples = tupleArrayInput1.length;
	let matchedTuples = 0;
	let wholeTupleMatched = false;

	for (let i = 0; i < tupleArrayInput1.length; i++) {
		if (tupleArrayInput2.indexOf(tupleArrayInput1[i]) !== -1) {
			wholeTupleMatched = true;
		} else {
			let inputOneWords = tupleArrayInput1[i].split(' ');
			for ( let k = 0 ; k < tupleArrayInput2.length; k++) {
				let inputTwoWords = tupleArrayInput2[k].split(' ');
				wholeTupleMatched = stringComparer(inputOneWords, inputTwoWords, synonyms);
				if (wholeTupleMatched === true) {
					break;
				}
			}
		}

		if (wholeTupleMatched === true) {
			matchedTuples++;
			wholeTupleMatched = false;
		}
	}

	let percentage = `${Math.round(matchedTuples/totalTuples * 100) || 0}%`;
	console.log(percentage);
	return percentage;
}

const tupleSeparator = (input, tuple) => {
	let result = [];

	for ( let i = 0; i < input.length; i++) {
		let inputWords = input[i].split(' ');
		for ( let j = 0; j < inputWords.length; j++) {
  			if (inputWords.slice(j, j + tuple).length === tuple) {
   				result.push(inputWords.slice(j, j + tuple).join(' '));
 			}
		}
	}

	return result;
}

const stringComparer = (sentence1, sentence2, synonyms) => {
   let matched = false;
   let tracker = {'key': 0};

   if (sentence1.length === sentence2.length) {
     for (let i = 0; i < sentence1.length; i++) {
       if (sentence1[i] === sentence2[i]) {
         tracker['key']++;
         tracker['key'] === sentence1.length ? matched = true : null;
       } else {
         matched = synonymsChecker(sentence1[i], sentence2[i], synonyms);
       }
     }
   }

   return matched;
 }

const synonymsChecker = (sentence1Word, sentence2Word, synonyms) => {
  let matched = false;
  let relevantSynonyms = synonyms.filter(item => item.split(' ').indexOf(sentence1Word) !== -1);
  
  if (relevantSynonyms.length > 0) {
  	if (relevantSynonyms[0].split(' ').indexOf(sentence2Word) !== -1) {
  		matched = true;
  	}
  }

  return matched;
}


//palagrismDetector('synonyms.txt', 'input1.txt', 'input2.txt');
 palagrismDetector('synonyms.txt', 'input1.txt', 'input2.txt', 4);





