const term = "Easy Term";
const definition = "This should be easy!!";

let wordRevealIndex = 0;
let definitionWords = definition.split(" ");
let isShowingDefinition = false;

const cardText = document.getElementById("card-text");
const revealButton = document.getElementById("tap-to-reveal");
const backToTermButton = document.getElementById("back-to-term");
const tryAgainButton = document.getElementById("try-again");
const nextTermButton = document.getElementById("next-term");

cardText.innerText = term;

revealButton.addEventListener("click", () => {
    // full definition is already revealed and user decides to come back to term
    if (wordRevealIndex >= definitionWords.length && !isShowingDefinition) {
        cardText.innerText = definition;
        isShowingDefinition = true;
        backToTermButton.classList.remove("d-none");
        tryAgainButton.classList.remove("d-none");
        nextTermButton.classList.remove("d-none");
        return;
    }
    
    if (!isShowingDefinition) {
        isShowingDefinition = true;
        backToTermButton.classList.remove("d-none");
    }

    cardText.innerText = definitionWords.slice(0, wordRevealIndex + 1).join(" ");
    wordRevealIndex++;

    if (wordRevealIndex >= definitionWords.length) {
        tryAgainButton.classList.remove("d-none");
        nextTermButton.classList.remove("d-none");
    }
});

tryAgainButton.addEventListener("click", () => {
    wordRevealIndex = 0;
    isShowingDefinition = false;
    cardText.innerText = term;
    backToTermButton.classList.add("d-none");
    tryAgainButton.classList.add("d-none");
    nextTermButton.classList.add("d-none");
});

backToTermButton.addEventListener("click", () => {
    cardText.innerText = term;
    isShowingDefinition = false;
    backToTermButton.classList.add("d-none");
    tryAgainButton.classList.add("d-none");
    nextTermButton.classList.add("d-none");
})