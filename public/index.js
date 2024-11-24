"use strict";
class HangmanGame {
    constructor(words, wordContainer, messageElement, attemptsElement) {
        this.words = words;
        this.wordContainer = wordContainer;
        this.messageElement = messageElement;
        this.attemptsElement = attemptsElement;
        this.maxAttempts = 6;
        this.gameOver = false;
        this.wordToGuess = "";
        this.displayedWord = [];
        this.attemptsLeft = this.maxAttempts;
        this.guessedLetters = new Set();
        this.startNewGame();
    }
    getRandomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
    }
    updateDisplay() {
        this.wordContainer.textContent = this.displayedWord.join(" ");
        this.attemptsElement.textContent = `Attempts Left: ${this.attemptsLeft}`;
    }
    checkWinCondition() {
        return !this.displayedWord.includes("_");
    }
    checkLossCondition() {
        return this.attemptsLeft <= 0;
    }
    displayMessage(message, color) {
        this.messageElement.textContent = message;
        this.messageElement.style.color = color;
    }
    handleLetterGuess(letter) {
        if (this.guessedLetters.has(letter) || this.gameOver)
            return;
        this.guessedLetters.add(letter);
        if (this.wordToGuess.includes(letter)) {
            for (let i = 0; i < this.wordToGuess.length; i++) {
                if (this.wordToGuess[i] === letter) {
                    this.displayedWord[i] = letter;
                }
            }
            if (this.checkWinCondition()) {
                this.displayMessage("You Win! 🎉", "green");
                this.gameOver = true;
                letterButtons.forEach((button) => {
                    button.classList.remove("pressed");
                    button.disabled = true;
                });
            }
        }
        else {
            this.attemptsLeft--;
            if (this.checkLossCondition()) {
                this.displayMessage(`You Lose! The word was "${this.wordToGuess}".`, "red");
                letterButtons.forEach((button) => {
                    button.classList.remove("pressed");
                    button.disabled = true;
                });
                this.gameOver = true;
            }
        }
        this.updateDisplay();
    }
    startNewGame() {
        this.wordToGuess = this.getRandomWord();
        this.displayedWord = Array(this.wordToGuess.length).fill("_");
        this.attemptsLeft = this.maxAttempts;
        this.guessedLetters.clear();
        this.gameOver = false;
        this.displayMessage("", "black");
        this.updateDisplay();
    }
}
const wordContainer = document.getElementById("word-container");
const messageElement = document.getElementById("message");
const attemptsElement = document.getElementById("attempts");
const letterButtons = document.querySelectorAll(".letter-buttons button");
const restartButton = document.getElementById("restart-button");
const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("difficulty-screen");
const words = [
    "jazz",
    "lynx",
    "dermatoglyphics",
    "syzygy",
    "javascript",
    "zygote",
    "xylyl",
    "supercalifragilisticexpialidocious",
    "antidisestablishmentarianism",
    "pneumonoultramicroscopicvolcanoconiosis",
    "culver",
    "characteristic",
    "xbox",
    "wow",
    "waxen",
    "exuvial",
    "schwarzenegger",
    "axolotl",
    "expo",
    "exit",
    "nixon",
    "galaxy",
    "jam",
    "schmuck",
    "muck",
    "phonk",
    "ender",
    "sketchy",
    "fly",
    "linus",
    "mac",
    "coding",
];
const game = new HangmanGame(words, wordContainer, messageElement, attemptsElement);
letterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const letter = button.dataset.letter;
        game.handleLetterGuess(letter);
        button.classList.add("pressed");
        button.disabled = true;
    });
});
startButton.addEventListener("click", () => {
    startMenu.style.display = "none";
    const gameContainer = document.querySelector(".container");
    if (gameContainer instanceof HTMLElement) {
        gameContainer.style.display = "block";
    }
});
restartButton.addEventListener("click", () => {
    game.startNewGame();
    letterButtons.forEach((button) => {
        button.classList.remove("pressed");
        button.disabled = false;
    });
});
