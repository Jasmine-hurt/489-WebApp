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

	if (!currentFlashcard) return;

	term = currentFlashcard.term;
	fullDefinition = currentFlashcard.description;

    const allWords = fullDefinition.split(" ");

    // random between 1 and 5
    const interval = Math.floor(Math.random() * 4) + 2

    //missingWords = allWords.filter((_, i) => i % interval === 0);
    missingWords = allWords.filter((_, i) => i % interval === 0).map(word => {
        const match = word.match(/^(.+?)([.,!?]+)?$/);
        return match ? match[1] : word;
    });


	// Build a list of incorrect distractors
	const uniqueWords = [...new Set(allWords.map(w => w.replace(/[.,!?]/g, "")))];
	distractingWords = uniqueWords
		.filter(word => !missingWords.includes(word))
		.sort(() => Math.random() - 0.5)
		.slice(0, 3);

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
        const plainWord = match[1];

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
    // merge both arrays of missing words and distracting words and shuffle them
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    //const wordOptions = [...missingWords, ...distractingWords].sort(() => Math.random() - 0.5);
    const wordOptions = missingWords.concat(distractingWords).sort(() => Math.random() - 0.5);

    // clear previous word bank options
    wordBank.innerHTML = "";

    wordOptions.forEach(word => {
        // create draggable button for each word
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
  
        if (userAnswer === correctAnswer) {
            blankWord.classList.add("correct");
      } else {
        blankWord.classList.add("incorrect");
        }
    });
  
    tryAgainButton.classList.remove("d-none");
    nextTermButton.classList.remove("d-none");
  });

tryAgainButton.addEventListener("click", () => {
    buildDefinition();
    buildWordBank();
    tryAgainButton.classList.add("d-none");
    nextTermButton.classList.add("d-none");
});

nextTermButton.addEventListener("click", () => {
	currentIndex = (currentIndex + 1) % flashcards.length;
	loadFlashcard();
});

loadFlashcard();