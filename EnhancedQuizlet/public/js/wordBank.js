const flashcards = window.flashcards || [];

let currentIndex = 0;
let term = "";
let fullDefinition = "";
let missingWords = [];
let distractingWords = [];

const termText = document.getElementById("term-text");
const definitionContainer = document.getElementById("definition-text");
const wordBank = document.getElementById("word-bank");

const tryAgainButton = document.getElementById("try-again");
const submitButton = document.getElementById("submit");
const nextTermButton = document.getElementById("next-term");

function loadFlashcard() {
	// Grab term/definition from flashcards
	const currentFlashcard = flashcards[currentIndex];

    // array is empty, exit
	if (!currentFlashcard) return;

    // storing the term and def.
	term = currentFlashcard.term;
	fullDefinition = currentFlashcard.description;

    // split the full definition into individual words and separate punctuation
    const allWords = fullDefinition.split(" ");
    const punctuationRegex = /^(.+?)([.,!?]+)?$/;

    // randomly choose 1-5 unique word positions to blank
    const blankCount = Math.min(Math.floor(Math.random() * 5) + 1, allWords.length);
    const blankIndices = new Set();
    while (blankIndices.size < blankCount) {
        const index = Math.floor(Math.random() * allWords.length);
        blankIndices.add(index);
    }

    // extract lowercase words without punctuation and add to selectedWords
    const selectedWords = new Set();
    [...blankIndices].forEach(i => {
        const word = allWords[i];
        const match = word.match(punctuationRegex);
        const clean = (match ? match[1] : word).toLowerCase();
        selectedWords.add(clean);
    });

    // mark all occurrences of selected words as blanks
    missingWords = [];
    allWords.forEach(word => {
        const match = word.match(punctuationRegex);
        const clean = (match ? match[1] : word).toLowerCase();
        if (selectedWords.has(clean)) {
            missingWords.push(clean);
        }
    });

function loadFlashcard() {
	// Grab term/definition from flashcards
	const currentFlashcard = flashcards[currentIndex];

    // array is empty, exit
	if (!currentFlashcard) return;

    // storing the term and def.
	term = currentFlashcard.term;
	fullDefinition = currentFlashcard.description;

    // split the full definition into individual words and separate punctuation
    const allWords = fullDefinition.split(" ");
    const punctuationRegex = /^(.+?)([.,!?]+)?$/;

    // randomly choose 1-5 unique word positions to blank
    const blankCount = Math.min(Math.floor(Math.random() * 5) + 1, allWords.length);
    const blankIndices = new Set();
    while (blankIndices.size < blankCount) {
        const index = Math.floor(Math.random() * allWords.length);
        blankIndices.add(index);
    }

    // extract lowercase words without punctuation and add to selectedWords
    const selectedWords = new Set();
    [...blankIndices].forEach(i => {
        const word = allWords[i];
        const match = word.match(punctuationRegex);
        const clean = (match ? match[1] : word).toLowerCase();
        selectedWords.add(clean);
    });

    // mark all occurrences of selected words as blanks
    missingWords = [];
    allWords.forEach(word => {
        const match = word.match(punctuationRegex);
        const clean = (match ? match[1] : word).toLowerCase();
        if (selectedWords.has(clean)) {
            missingWords.push(clean);
        }
    });

	// Build a list of incorrect distractors
	const uniqueWords = [...new Set(allWords.map(w => w.replace(/[.,!?]/g, "").toLowerCase()))];
    const normalizedMissingSet = new Set(missingWords);
    distractingWords = uniqueWords
		.filter(word => !normalizedMissingSet.has(word))
		.sort(() => Math.random() - 0.5)
		.slice(0, 3);

	termText.textContent = term;
	buildDefinition();
	buildWordBank();

	tryAgainButton.classList.add("d-none");
	nextTermButton.classList.add("d-none");
}

	termText.textContent = term;
	buildDefinition();
	buildWordBank();

	tryAgainButton.classList.add("d-none");
	nextTermButton.classList.add("d-none");
}

function buildDefinition() {
    // split definition sentence into words
    const definitionWords = fullDefinition.split(" ");

    // clear out previous definition
    definitionContainer.innerHTML = "";

    // loop through each word in the sentence
    definitionWords.forEach(fullWord => {
        const span = document.createElement("span");
  
        // separate the word from its punctuation ("description!!" --> "description" + "!!")
        const match = fullWord.match(/^(.+?)([.,!?]+)?$/);
        const plainWord = (match[1] || "").toLowerCase();

        // if not punctuation, use ""
        const punctuation = match[2] || "";
    
        // check if the word is meant to be blank (needs to be filled by the user)
        if (missingWords.includes(plainWord)) {
            span.className = "blank";
            span.setAttribute("data-answer", plainWord);
            
            span.innerHTML = `
            <span class="blank-word">______</span>
            <span class="blank-punctuation">${punctuation}</span>`;
        
            // allow to accept drops
            span.ondragover = event => event.preventDefault();
            span.ondrop = handleDrop;
        } else {
            // word with punctuation
            span.textContent = fullWord;
    }
    
    // add word or blank to the display
    definitionContainer.appendChild(span);
    definitionContainer.append(" ");
  });
}

function buildWordBank() {
    // clear previous word bank options
    wordBank.innerHTML = "";

    // combine both correct and incorrect words
    const allOptions = [...missingWords, ...distractingWords];
    
    // count how many times each word should appear
    const wordCount = {};
    allOptions.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
        /*
        EX: allOptions = ['thing', 'thing', 'the']
        wordCount['thing'] = (undefined || 0) + 1 => 1
        wordCount['thing'] = (1 || 0) + 1 => 2
        wordCount['the'] = (undefined || 0) + 1 => 1
        */
    });

    // create array with correct frequency of each word
    const wordOptions = Object.entries(wordCount) // EX: turns { thing: 2, the: 1 } into [ ['thing', 2], ['the', 1] ]
        .flatMap(([word, count]) => Array(count).fill(word)) // flatMap: [ ['thing', 'thing'], ['the'] ] -->  ['thing', 'thing', 'the']
        .sort(() => Math.random() - 0.5);

    // create draggable button for each word
    wordOptions.forEach(word => {
        const wordButton = document.createElement("div");
        wordButton.textContent = word;
        wordButton.className = "word-bank-option";
        wordButton.setAttribute("draggable", "true");

        wordButton.ondragstart = dragEvent => {
            // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
            dragEvent.dataTransfer.setData("text/plain", word);
            wordButton.classList.add("dragging");
        };

        // this runs after the drag ends, resets the appearance of the button
        wordButton.ondragend = () => wordButton.classList.remove("dragging");

        // add the word to the word bank container
        wordBank.appendChild(wordButton);
    });
}

function handleDrop(event) {
    // allow a drop to happen
    event.preventDefault();

    // get the word being dragged
    const droppedWord = event.dataTransfer.getData("text/plain");
    
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    // expands list into individual elements
    const wordBankOption = [...wordBank.children].find(
        // return the first word bank option where the text inside matches the dragged word
        option => option.textContent === droppedWord
    );
  
    // find nearest blank container where the word is being dropped
    const blankConatiner = event.target.closest(".blank");
    if (!blankConatiner) return;
  
    // get the space inside the blank where the word goes
    const blankWordSpace = blankConatiner.querySelector(".blank-word");
  
    // check if the blank space exist and contains ______ (hasn't been filled yet)
    if (blankWordSpace && blankWordSpace.textContent.startsWith("______")) {
        blankWordSpace.textContent = droppedWord;
        blankConatiner.setAttribute("data-user", droppedWord);

        // remove the word from the bank
        if (wordBankOption) wordBankOption.remove();
    }
}

submitButton.addEventListener("click", () => {
    const blanks = document.querySelectorAll("span.blank");
    let allBlanksFilled = true;
  
    // check if all blanks have been filled
    blanks.forEach(blank => {
        const user = blank.getAttribute("data-user");
        if (!user) {
            allBlanksFilled = false;
        }
    });
  
    // show warning if any blanks are unfilled
    if (!allBlanksFilled) {
        const alertBox = document.getElementById("alert-message-missing-words");
        alertBox.classList.remove("d-none");
      
        setTimeout(() => {
            alertBox.classList.add("d-none");
        }, 3000);
      
        return;
      }
  
    // check answers and mark them as correct or incorrect
    blanks.forEach(blank => {
        const correctAnswer = blank.getAttribute("data-answer");
        const userAnswer = blank.getAttribute("data-user");
        const blankWord = blank.querySelector(".blank-word");
  
        if (userAnswer?.toLocaleLowerCase() === correctAnswer?.toLocaleLowerCase()) {
            blankWord.classList.add("correct");
      } else {
        blankWord.classList.add("incorrect");
        }
    });
  
    tryAgainButton.classList.remove("d-none");
    nextTermButton.classList.remove("d-none");
  });

tryAgainButton.addEventListener("click", () => {
    loadFlashcard();
});

nextTermButton.addEventListener("click", () => {
	currentIndex = (currentIndex + 1) % flashcards.length;
	loadFlashcard();
});

loadFlashcard();