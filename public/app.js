"use strict";
// import { words } from './utils';
const startMenu = document.getElementById("difficulty-screen");
const wordContainer = document.getElementById("word-container");
const messageElement = document.getElementById("message");
const attemptsElement = document.getElementById("attempts");
const letterButtons = document.querySelectorAll(".letter-buttons button");
const restartButton = document.getElementById("restart-button");
const resetStatsButton = document.getElementById("reset-stats-button");
const startButton = document.getElementById("start-button");
var GameState;
(function (GameState) {
    GameState[GameState["Menu"] = 0] = "Menu";
    GameState[GameState["Playing"] = 1] = "Playing";
    GameState[GameState["Win"] = 2] = "Win";
    GameState[GameState["Lose"] = 3] = "Lose";
})(GameState || (GameState = {}));
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
        this.state = GameState.Menu;
        this.stats = {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
        };
        this.loadStatsFromCookies();
        this.startNewGame();
    }
    getCookie(name) {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? match[2] : undefined;
    }
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
    deleteCookie(name) {
        this.setCookie(name, "", -1); // Delete cookie
    }
    saveStatsToCookies() {
        const statsString = JSON.stringify(this.stats);
        this.setCookie("hangmanStats", statsString, 30);
    }
    loadStatsFromCookies() {
        const statsString = this.getCookie("hangmanStats");
        if (statsString) {
            this.stats = JSON.parse(statsString);
        }
    }
    getRandomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)].toUpperCase();
    }
    updateDisplay() {
        this.wordContainer.textContent = this.displayedWord.join(" ");
        this.attemptsElement.textContent = `Attempts Left: ${this.attemptsLeft}`;
    }
    updateStatsDisplay() {
        const gamesPlayedElement = document.getElementById("games-played");
        const winsElement = document.getElementById("wins");
        const lossesElement = document.getElementById("losses");
        const winRateElement = document.getElementById("win-rate");
        gamesPlayedElement.textContent = this.stats.gamesPlayed.toString();
        winsElement.textContent = this.stats.wins.toString();
        lossesElement.textContent = this.stats.losses.toString();
        winRateElement.textContent = this.stats.winRate.toFixed(2);
    }
    calculateWinRate() {
        if (this.stats.gamesPlayed > 0) {
            this.stats.winRate = (this.stats.wins / this.stats.gamesPlayed) * 100;
        }
        else {
            this.stats.winRate = 0;
        }
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
                letterButtons.forEach((button) => {
                    button.classList.remove("pressed");
                    button.disabled = true;
                });
                this.gameOver = true;
                this.state = GameState.Win;
                this.stats.wins++;
                this.calculateWinRate();
                this.saveStatsToCookies();
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
                this.state = GameState.Lose;
                this.stats.losses++;
                this.calculateWinRate();
                this.saveStatsToCookies();
            }
        }
        this.updateDisplay();
        this.updateStatsDisplay();
    }
    startNewGame() {
        this.wordToGuess = this.getRandomWord();
        this.displayedWord = Array(this.wordToGuess.length).fill("_");
        this.attemptsLeft = this.maxAttempts;
        this.guessedLetters.clear();
        this.gameOver = false;
        this.stats.gamesPlayed++;
        this.state = GameState.Playing;
        this.displayMessage("", "black");
        this.updateDisplay();
    }
    resetStats() {
        this.stats = {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
        };
        this.updateStatsDisplay();
    }
}
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
    "duck",
    "pizza",
    "retoboi",
    "peanut",
    "mars",
    "easy",
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
    game.loadStatsFromCookies();
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
window.addEventListener("load", () => {
    //game.loadStatsFromCookies();
});
