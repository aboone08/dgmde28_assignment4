document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://random-word-api.herokuapp.com/word?length=5"; // https://random-word-api.herokuapp.com/home 
    let answer = "";
    let attempts = 6; //limits the amount of attempted guesses
    let debugMode = false;
    const usedLetters = new Set();
    
    const wordContainer = document.getElementById("word-container");
    const inputField = document.getElementById("guess-input");
    const submitButton = document.getElementById("submit-guess");
    const messageBox = document.getElementById("message");
    const usedLettersDisplay = document.getElementById("used-letters");
    
    /*function that uses an API for the vocabulary of words to guess or to check the user’s guess to make sure it is a valid word.
    API’s must return JSON and must be accessed using XMLHttpRequest or a promise or fetch. */
    function fetchWord() {
        fetch(API_URL)
            .then(res => res.text())
            .then(data => {
                answer = JSON.parse(data)[0].toUpperCase();
                if (debugMode) alert(`The answer is ${answer}`);
            })
            .catch(error => {
                console.error("Error fetching word:", error);
                answer = "APPLE"; // Fallback word
            });
    }
    
    //function used to validate word
    function validateWord(word) {
        return /^[A-Z]{5}$/.test(word);
    }
    
    function updateUsedLettersDisplay() {
        usedLettersDisplay.innerText = `Used Letters: ${[...usedLetters].join(", ")}`;
    }
    
    function checkGuess(guess) {
        let result = [];
        let answerArr = answer.split("");
        let guessArr = guess.split("");
        
        //For each letter in the guess, you must report one of three results: 
        guessArr.forEach((letter, i) => {
            if (letter === answerArr[i]) {
                result.push(`<span class='correct'>${letter}</span> - Correct place`); //if the letter is in the same place as in the guess word
            } else if (answerArr.includes(letter)) {
                result.push(`<span class='misplaced'>${letter}</span> - Wrong place`); // if the letter is in the answer but in a different place than in your guess word
            } else {
                result.push(`<span class='wrong'>${letter}</span> - Not in word`); //if the letter is not in the answer
            }
            usedLetters.add(letter);
        });
        
        let wordElement = document.createElement("div");
        wordElement.innerHTML = result.join("<br>");
        wordContainer.appendChild(wordElement);
        let separator = document.createElement("hr");
        wordContainer.appendChild(separator);
        
        updateUsedLettersDisplay();
        //The game ends when the user guesses the word or uses all 6 guesses.
        if (guess === answer) {
            messageBox.innerHTML = `Congratulations! You guessed ${answer}.`; 
            inputField.disabled = true;
            submitButton.disabled = true;
        } else if (--attempts === 0) {
            messageBox.innerHTML = `Game Over! The word was ${answer}.`;
            inputField.disabled = true;
            submitButton.disabled = true;
        }
    }
    
    submitButton.addEventListener("click", () => {
        let guess = inputField.value.toUpperCase();
        if (!validateWord(guess)) {
            alert("Please enter a valid 5-letter word.");
            return;
        }
        inputField.value = "";
        checkGuess(guess);
    });
    
    document.getElementById("restart").addEventListener("click", () => {
        wordContainer.innerHTML = "";
        messageBox.innerHTML = "";
        usedLettersDisplay.innerText = "Used Letters: None";
        inputField.disabled = false;
        submitButton.disabled = false;
        attempts = 6;
        usedLetters.clear();
        fetchWord();
    });
    
    document.getElementById("debug-toggle").addEventListener("change", (e) => {
        debugMode = e.target.checked;
    });
    
    fetchWord();
});
