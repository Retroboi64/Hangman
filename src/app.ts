// import { words } from './utils';

const startMenu = document.getElementById("difficulty-screen")!;
const wordContainer = document.getElementById("word-container")!;
const messageElement = document.getElementById("message")!;
const attemptsElement = document.getElementById("attempts")!;
const letterButtons = document.querySelectorAll(".letter-buttons button");
const restartButton = document.getElementById("restart-button")!;
const resetStatsButton = document.getElementById("reset-stats-button")!;
const startButton = document.getElementById("start-button")!;


enum GameState {
  Menu,
  Playing,
  Win,
  Lose,
}

interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
}

class HangmanGame {
  private wordToGuess: string;
  private displayedWord: string[];
  private attemptsLeft: number;
  private guessedLetters: Set<string>;
  private maxAttempts: number = 6;
  private gameOver: boolean = false;
  public state: GameState;
  private stats: GameStats;

  constructor(
    private words: string[],
    private wordContainer: HTMLElement,
    private messageElement: HTMLElement,
    private attemptsElement: HTMLElement
  ) {
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

  private getCookie(name: string): string | undefined {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : undefined;
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  private deleteCookie(name: string): void {
    this.setCookie(name, "", -1); // Delete cookie
  }

  public saveStatsToCookies(): void {
    const statsString = JSON.stringify(this.stats); 
    this.setCookie("hangmanStats", statsString, 30); 
  }

  public loadStatsFromCookies(): void {
    const statsString = this.getCookie("hangmanStats");
    if (statsString) {
      this.stats = JSON.parse(statsString);
    }
  }
  private getRandomWord(): string {
    return this.words[
      Math.floor(Math.random() * this.words.length)
    ].toUpperCase();
  }

  private updateDisplay(): void {
    this.wordContainer.textContent = this.displayedWord.join(" ");
    this.attemptsElement.textContent = `Attempts Left: ${this.attemptsLeft}`;
  }

  private updateStatsDisplay(): void {
    const gamesPlayedElement = document.getElementById("games-played")!;
    const winsElement = document.getElementById("wins")!;
    const lossesElement = document.getElementById("losses")!;
    const winRateElement = document.getElementById("win-rate")!;

    gamesPlayedElement.textContent = this.stats.gamesPlayed.toString();
    winsElement.textContent = this.stats.wins.toString();
    lossesElement.textContent = this.stats.losses.toString();
    winRateElement.textContent = this.stats.winRate.toFixed(2);

  }

  private calculateWinRate(): void {
    if (this.stats.gamesPlayed > 0) {
      this.stats.winRate = (this.stats.wins / this.stats.gamesPlayed) * 100;
    } else {
      this.stats.winRate = 0;
    }
  }

  private checkWinCondition(): boolean {
    return !this.displayedWord.includes("_");
  }

  private checkLossCondition(): boolean {
    return this.attemptsLeft <= 0;
  }

  private displayMessage(message: string, color: string): void {
    this.messageElement.textContent = message;
    this.messageElement.style.color = color;
  }

  public handleLetterGuess(letter: string): void {
    if (this.guessedLetters.has(letter) || this.gameOver) return;

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
          (button as HTMLButtonElement).disabled = true;
        });
        this.gameOver = true;
        this.state = GameState.Win;
        this.stats.wins++;
        this.calculateWinRate();
        this.saveStatsToCookies();
      }
    } else {
      this.attemptsLeft--;

      if (this.checkLossCondition()) {
        this.displayMessage(
          `You Lose! The word was "${this.wordToGuess}".`,
          "red"
        );
        letterButtons.forEach((button) => {
          button.classList.remove("pressed");
          (button as HTMLButtonElement).disabled = true;
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

  public startNewGame(): void {
    this.wordToGuess = this.getRandomWord();
    this.displayedWord = Array(this.wordToGuess.length).fill("_");
    this.attemptsLeft = this.maxAttempts;
    this.guessedLetters.clear();
    this.gameOver = false;
    this.state = GameState.Playing;
    this.displayMessage("", "black");
    this.updateDisplay();
  }

  public resetStats(): void {
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

const game = new HangmanGame(
  words,
  wordContainer,
  messageElement,
  attemptsElement
);

letterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const letter = (button as HTMLButtonElement).dataset.letter!;
    game.handleLetterGuess(letter);

    button.classList.add("pressed");
    (button as HTMLButtonElement).disabled = true;
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
    (button as HTMLButtonElement).disabled = false;
  });
});

window.addEventListener("load", () => {
  //game.loadStatsFromCookies();
});

