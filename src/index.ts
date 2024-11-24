class HangmanGame {
  private wordToGuess: string;
  private displayedWord: string[];
  private attemptsLeft: number;
  private guessedLetters: Set<string>;
  private maxAttempts: number = 6;
  private gameOver: boolean = false;

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
    this.startNewGame();
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
        this.displayMessage("You Win! 🎉", "green");
        this.gameOver = true;
      }
    } else {
      this.attemptsLeft--;

      if (this.checkLossCondition()) {
        this.displayMessage(
          `You Lose! The word was "${this.wordToGuess}".`,
          "red"
        );
        this.gameOver = true;
      }
    }

    this.updateDisplay();
  }

  public startNewGame(): void {
    this.wordToGuess = this.getRandomWord();
    this.displayedWord = Array(this.wordToGuess.length).fill("_");
    this.attemptsLeft = this.maxAttempts;
    this.guessedLetters.clear();
    this.gameOver = false;
    this.displayMessage("", "black");
    this.updateDisplay();
  }
}

const wordContainer = document.getElementById("word-container")!;
const messageElement = document.getElementById("message")!;
const attemptsElement = document.getElementById("attempts")!;
const letterButtons = document.querySelectorAll(".letter-buttons button");
const restartButton = document.getElementById("restart-button")!;
const startButton = document.getElementById("start-button")!;
const startMenu = document.getElementById("difficulty-screen")!;

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
