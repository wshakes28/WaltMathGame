// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');


let questionAmount = 0
// Equations

let equationsArray = []
let playerGuessArray = []
let bestScoreArray = []

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer
let timePlayed = 0
let baseTime = 0
let penaltyTime = 0
let finalTime = 0
let finalTimeDisplay = '0.0'

// Refresh Splash Page Best Scores

function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
   const bestScoreEl = bestScore
   bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`
  })

}

// Update Best Score Array

function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select Best Score to Update
    if(questionAmount == score.questions) {
      // Return Best Score as a number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore)
      // Update if final score is less or replacing zero
      if(savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay
      }
    }
  }) 
  bestScoresToDOM()
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))

}

//Check Local Storage for best score, and set bestScoreArray value

function getSavedBestScores() {
  if(localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores)
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay }
    ]
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
  }
  bestScoresToDOM()
}

// Play Again
function playAgain() {

  gamePage.addEventListener('click', startTimer)
  scorePage.hidden = true
  splashPage.hidden = false
  equationsArray = []
  playerGuessArray = []
  valueY = 0


}

// Shows Scores
function showScorePage() {
  gamePage.hidden = true
  scorePage.hidden = false
}

// Format & Display Time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1)
  penaltyTime = penaltyTime.toFixed(1)
  baseTime = timePlayed.toFixed(1)

  finalTimeEl.textContent = `Final Time: ${finalTimeDisplay}s`
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`
  baseTimeEl.textContent = `Base Time: ${baseTime}s`

  updateBestScore()
  //Scroll to top

  itemContainer.scrollTo({top: 0, behavior: 'instant'})
  
  showScorePage()
  

}

// Stop Timer, Process Results, go to Score Page
function checkTime() {
  console.log("Time Played: ", timePlayed)
  if (playerGuessArray.length == questionAmount) {
    console.log("Player Guess Array: ", playerGuessArray)
    clearInterval(timer)


    // Check for Wrong Guesses then add Penalty Time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct Guess, No Penalty

      } else {
        // InCorrect Guess, Add Penalty
        penaltyTime += 0.5
      }
    })
    finalTime = timePlayed + penaltyTime

    console.log("Time Played: ", timePlayed, "Penalty Time: ", penaltyTime, "Final Time: ", finalTime)
    scoresToDOM()

  }
}

// Add a tenth of a second to the time played
function addTime() {
  timePlayed += 0.1
  checkTime()

}

// Start timer when game page is clicked
function startTimer() {
  //Reset Times
  timePlayed = 0
  penaltyTime = 0
  finalTime = 0
  timer = setInterval(addTime, 100)
  gamePage.removeEventListener('click', startTimer)

}

// Scroll
let valueY = 0

// Scroll and Select user guess to player guess Array
function select(guessedTrue) {

  // Scroll 80 px
  valueY += 80
  itemContainer.scroll(0, valueY)
  // Add guesses to player guess Array
  return guessedTrue ? playerGuessArray.push("true") : playerGuessArray.push("false")
}


// Display Game Page
function showGamePage() {

  setTimeout(() => {
    countdownPage.hidden = true
    gamePage.hidden = false
  }, 5000)

}


// Populate DOM with Equations
function equationsToDom() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement("div")
    item.classList.add("item")
    // Equation Text
    const equationText = document.createElement("h1")
    equationText.textContent = equation.value
    item.appendChild(equationText)
    itemContainer.appendChild(item)
  })

}


// Get Random Number
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount)
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations
  console.log("Correct Equations: ", correctEquations)
  console.log("Wrong Equations: ", wrongEquations)
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`
    equationObject = { value: equation, evaluated: 'true' }
    equationsArray.push(equationObject)
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`
    const formatChoice = getRandomInt(3)
    const equation = wrongFormat[formatChoice]
    equationObject = { value: equation, evaluated: 'false' }
    equationsArray.push(equationObject)
  }
  shuffle(equationsArray)

}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations()
  equationsToDom()

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

function startCountDown() {
  setTimeout(() => {
    countdown.textContent = 3
  }, 1000)

  setTimeout(() => {
    countdown.textContent = 2
  }, 2000)

  setTimeout(() => {
    countdown.textContent = 1
  }, 3000)

  setTimeout(() => {
    countdown.textContent = "GO!"
  }, 4000)

}
function showCountDown() {
  countdownPage.hidden = false
  splashPage.hidden = true
  startCountDown()
  populateGamePage()
  showGamePage()
}

// Get Value from selected Radio input

function getRadioValue() {
  let radioValue
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value

    }

  })
  return radioValue
}

function selectQuestionAmount(e) {
  e.preventDefault()
  questionAmount = getRadioValue()
  console.log('Question Amount: ', questionAmount)
  if (questionAmount) {
    showCountDown()
  }

}


startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label
    radioEl.classList.remove("selected-label")
    // Add it back if radio El is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label")
    }
  })
})

startForm.addEventListener('submit', selectQuestionAmount)
gamePage.addEventListener('click', startTimer)

// On Load
getSavedBestScores()
