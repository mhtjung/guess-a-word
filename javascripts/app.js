function createRandomWord() {
  let words = ['apple', 'pear', 'banana', 'orange', 'cherry', 'mandarin']
  return () => {
    if (words.length === 0) { return undefined }
    let idx = Math.floor(Math.random() * (words.length - 1))
    return words.splice(idx, 1)[0];
  }
}

const getRandomWord = createRandomWord();

class Game {
  constructor() {
    this.alphabet = ['a','b','c','d','e','f','g','h','i',
                     'j','k','l','m','n','o','p','q','r',
                     's','t','u','v','w','x','y','z'];
    this.maxGuesses = 6
    this.currentGuess = 1;
    this.apples = document.querySelector('#apples');
    this.spacesDiv = document.querySelector('#spaces');
    this.guessDiv = document.querySelector('#guesses');
    let appleClasses = Array.from(this.apples.classList);
    appleClasses.forEach(className => this.apples.classList.remove(className));
    this.spacesSpans = [];
    this.guessSpans = [];
    this.guessedLetters = [];
    this.startGame();
  }

  startGame() {
    this.word = getRandomWord();
    if (this.word === undefined) {
      alert("Sorry, I've run out of words! Start a new game by refreshing the page!");
    }
    this.createSpacesSpans();
    this.createGuessesSpans();
    console.log(this.word);
    this.bindEvents();
  }
  isLetter(character) {
    return this.alphabet.includes(character);
  }
  createSpacesSpans() {
    while (this.spacesDiv.firstChild) { this.spacesDiv.removeChild(this.spacesDiv.firstChild)}
    let spans = []
    for (let i = 0; i < this.word.length; i++) {
      let span = document.createElement('span');
      spans.push(span);
      this.spacesDiv.appendChild(span);
    }
    this.spacesSpans = spans;
  }
  createGuessesSpans() {
    while (this.guessDiv.firstChild) { this.guessDiv.removeChild(this.guessDiv.firstChild)};
    let spans = []
    for (let i = 0; i < this.maxGuesses; i++) {
      let span = document.createElement('span');
      spans.push(span);
      this.guessDiv.appendChild(span);
    }
    this.guessSpans = spans;
  }
  getMatchingIndices(key) {
    let indices = [];
    [...this.word].forEach((letter, index) => {
      if (letter === key) {
        indices.push(index);
      }
    })
    return indices
  }
  correctGuess() {
    let guess = this.spacesSpans.map(span => span.textContent).join('')
    return guess.toLowerCase() === this.word;
  }
  removeApple() {
    if (this.currentGuess === 1) {
      this.apples.classList.add('guess_1')
    } else {
      this.apples.classList.toggle(`guess_${this.currentGuess}`, `guess_${this.currentGuess}`)
    }
  }
  handleKeyPress(event) {
    let key = event.key.toLowerCase()
    if(!this.isLetter(key) || this.currentGuess - 1 === this.maxGuesses
       || this.guessedLetters.includes(key)) { return }
    this.guessedLetters.push(key);
    if (this.word.includes(key)) {
      let indices = this.getMatchingIndices(key)
      indices.forEach(index => {
        this.spacesSpans[index].textContent = key;
      })
      this.removeApple();
      this.currentGuess += 1
    } else {
      let guessSpan = this.guessSpans[this.currentGuess - 1]
      guessSpan.textContent = key.toUpperCase();
      this.removeApple();
      this.currentGuess += 1;
    }
  }
  bindEvents() {
    document.addEventListener('keypress', this.handleKeyPress.bind(this));

  }
}

class GameManager {
  constructor() {
    this.game = new Game()
    this.playAgainBtn = document.querySelector('#replay');
    this.playAgainBtn.classList.toggle('hidden');

    this.bindEvents();
  }

  bindEvents() {
    this.playAgainBtn.addEventListener('click', () => {
      this.game = new Game();
    })

    document.addEventListener('keyup', () => {
      if (this.game.correctGuess.apply(this.game)) { 
       this.playAgainBtn.classList.toggle('hidden')
      } else if (this.game.currentGuess - 1 === this.game.maxGuesses) {
        alert("Oof! You lose!")
        this.playAgainBtn.classList.toggle('hidden');
      }
    });
  }
  
}

document.addEventListener('DOMContentLoaded', () => {
  const gameManager = new GameManager();
})