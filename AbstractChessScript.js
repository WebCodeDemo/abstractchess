let evaluation = 0; // Initial evaluation
let lastTurn = 0; // var for the last turns eval change
let NUMBERTOWIN = 15;
let difficultyAdjuster = 0;
let gameCounter = 1;
let opponentScore = 0;
let playerScore = 0;

// Object to store all available tactics with their corresponding hidden amounts
const allTactics = {
    PutPinOnMinorPiece: generateRandomEffect(-2.5, 3.5),
	PutPinOnPawn: generateRandomEffect(-2.8, 3.8),
	ThreatenBackRankMate: generateRandomEffect(-1.0, 5.0),
	Deflection: generateRandomEffect(-2.5, 4.5),
	ForceDesperado: generateRandomEffect(1, 5.5),
	DiscoveredAttack: generateRandomEffect(-2.2, 4.2),
	DiscoveredCheck: generateRandomEffect(-2.8, 4.8),
	DoubleCheck: generateRandomEffect(2, 5.0),
	Check: generateRandomEffect(-3.0, 4.0),
	MateInOne: generateRandomEffect((2*NUMBERTOWIN+difficultyAdjuster), (2*NUMBERTOWIN+difficultyAdjuster+1)),
	EnPassant: generateRandomEffect(-2.0, 3.0),
	HangOneOfYourPieces: generateRandomEffect(-4.5, -1),
	OverloadOneOfOpponentsMinorPieces: generateRandomEffect(-1, 4.5),
	OverloadOneOfOpponentsMajorPieces: generateRandomEffect(-1, 5.0),
	PawnPromotion: generateRandomEffect(-2.0, 6.0),
	Underpromotion: generateRandomEffect(0, 5.5),
	UnderpromotionToBishop: generateRandomEffect(0, 5.5),
	TrapOpponentsPawn: generateRandomEffect(-3.0, 4.0),
	TrapOpponentsMinorPiece: generateRandomEffect(-3.5, 4.5),
	TrapOpponentsQueen: generateRandomEffect(-4.0, 5.0),
	BlunderYourQueen: generateRandomEffect(-6.0, -3),
	PutOpponentInZugzwang: generateRandomEffect(3, 5.2),
	QueenSacrifice: generateRandomEffect(-5.5, 6.5),
	RookSacrifice: generateRandomEffect(-4.5, 5.5),
	SacrificeMinorPiece: generateRandomEffect(-3.8, 4.8),
	SacrificePawn: generateRandomEffect(-3.0, 4.0),
	ExchangeEqualPieces: generateRandomEffect(-1, 1.0),
	OfferAnEqualTrade: generateRandomEffect(-1.3, 1),
	TradePiecesInYourFavor: generateRandomEffect(2, 4.0),
	ClaimAnImportantSquare: generateRandomEffect(-1, 3.8),
	TakeTheCenter: generateRandomEffect(-2, 4.5),
	ExpandTerritory: generateRandomEffect(-2, 4.0),
	DefendTerritory: generateRandomEffect(-1.5, 3.5),
	DevelopYourKnight: generateRandomEffect(-2.0, 3.0),
	DevelopYourRook: generateRandomEffect(-2.2, 3.2),
	AttackOpponentsPawn: generateRandomEffect(-2.8, 3.8),
	AttackOpponentsBishop: generateRandomEffect(-3.0, 4.0),
	AttackOpponentsRook: generateRandomEffect(-3.2, 4.2),
	AttackOpponentsQueen: generateRandomEffect(-3.5, 4.5),
	DefendPawn: generateRandomEffect(-2.5, 3.5),
	DefendMinorPiece: generateRandomEffect(-2.8, 3.8),
	DefendMajorPiece: generateRandomEffect(-3.0, 4.0),
	Fork: generateRandomEffect(2, 4.2),
	RoyalFork: generateRandomEffect(4, 5.0),
	XrayAttack: generateRandomEffect(-1, 4.5),
	OfferDraw: generateRandomEffect(-1.0, 1.0),
	Stalemate: generateRandomEffect(-0.1, 0.1),
	PerpetualCheck: generateRandomEffect(-0.1, 0.1),
	AcceptDraw: generateRandomEffect(-0.1, 0.1),
	MakeThreefoldRepetition: generateRandomEffect(-0.1, 0.1),

};

let availableTactics = generateRandomTactics(); // Initial set of tactics

// Function to make a move based on the selected tactic
function makeMove(buttonId) {
    const buttonIndex = parseInt(buttonId.replace("button", ""), 10) - 1; // Extract button index
    const tactic = availableTactics[buttonIndex];
	
    
    if (tactic) {
        const moveValue = allTactics[tactic];
        updateEvaluation(moveValue);
		lastTurn = moveValue;
		displayLastTurn();
        displayEvaluation();
		updateEvaluationMeter();
		
		// Generate a new set of tactics for the next turn
        availableTactics = weightedRandomTactics();
        updateButtonLabels();
		
		// Check for a draw
		if (tactic === "Stalemate" || tactic === "AcceptDraw" || tactic === "PerpetualCheck" || tactic === "MakeThreefoldRepetition") {
			drawGame();
			if (gameCounter == 2){ // if going into the second game, make it much harder
				difficultyAdjuster = 10;
			} else if (gameCounter == 3){ // if going into the third game, make it medium difficulty 
				difficultyAdjuster = 1.5;
			}
			return;
		}
        if ((evaluation+0.1) >= NUMBERTOWIN) {
			playerWinGame();
			if (gameCounter == 2){ // if going into the second game, make it much harder
				difficultyAdjuster = 10;
			} else if (gameCounter == 3){ // if going into the third game, make it medium difficulty 
				difficultyAdjuster = 1.5;
			}
            return;
			
        } else if ((evaluation-0.1) <= -NUMBERTOWIN) {
			opponentWinGame();
			if (gameCounter == 2){ // if going into the second game, make it much harder
				difficultyAdjuster = 10;
			} else if (gameCounter == 3){ // if going into the third game, make it medium difficulty 
				difficultyAdjuster = 1.5;
			}
			return;
            
        }

    } else {
        alert("Invalid move!");
    }
}

// Function to generate a random set of tactics
function generateRandomTactics() {
    const tacticsArray = Object.keys(allTactics);
    return shuffleArray(tacticsArray).slice(0, 3);
}

// Function to make some tactics more rare than others
function weightedRandomTactics() {
    const tacticsArray = Object.keys(allTactics);
    
    // Define tactic rarities (adjust these values as needed)
    const tacticRarity = {
		PutPinOnMinorPiece: 40,
		PutPinOnPawn: 45,
		ThreatenBackRankMate: 20,
		Deflection: 35,
		ForceDesperado: 25,
		DiscoveredAttack: 30,
		DiscoveredCheck: 25,
		DoubleCheck: 15,
		Check: 50,
		MateInOne: 3,
		EnPassant: 9,
		HangOneOfYourPieces: 100,
		OverloadOneOfOpponentsMinorPieces: 30,
		OverloadOneOfOpponentsMajorPieces: 25,
		PawnPromotion: 15,
		Underpromotion: 7,
		UnderpromotionToBishop: 1,
		TrapOpponentsPawn: 35,
		TrapOpponentsMinorPiece: 30,
		TrapOpponentsQueen: 20,
		BlunderYourQueen: 100,
		PutOpponentInZugzwang: 25,
		QueenSacrifice: 10,
		RookSacrifice: 15,
		SacrificeMinorPiece: 20,
		SacrificePawn: 30,
		ExchangeEqualPieces: 40,
		OfferAnEqualTrade: 45,
		TradePiecesInYourFavor: 35,
		ClaimAnImportantSquare: 40,
		TakeTheCenter: 40,
		ExpandTerritory: 100,
		DefendTerritory: 100,
		DevelopYourKnight: 100,
		DevelopYourRook: 60,
		AttackOpponentsPawn: 100,
		AttackOpponentsBishop: 100,
		AttackOpponentsRook: 70,
		AttackOpponentsQueen: 60,
		DefendPawn: 100,
		DefendMinorPiece: 100,
		DefendMajorPiece: 60,
		Fork: 40,
		RoyalFork: 15,
		XrayAttack: 35,
		OfferDraw: 100,
		Stalemate: 35,
		PerpetualCheck: 15,
		AcceptDraw: 55,
		MakeThreefoldRepetition: 30,
		
    };
    
    let selectedTactics = [];

    while (selectedTactics.length < 3) {
        // Shuffle the tacticsArray
        const shuffledArray = shuffleArray(tacticsArray);
        
        // Check the rarity for each tactic
        let allowSelection = true;
        for (const tactic of shuffledArray.slice(0, 3)) {
            if (Math.random() * 100 > tacticRarity[tactic]) {
                allowSelection = false;
                break;
            }
        }

        // If all tactics are allowed, set selectedTactics
        if (allowSelection) {
            selectedTactics = shuffledArray.slice(0, 3);
        }
    }

    return selectedTactics;
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to update button labels based on available tactics
function updateButtonLabels() {
    const buttons = document.querySelectorAll("button");
    availableTactics.forEach((tactic, index) => {
        buttons[index].textContent = tactic.replace(/([a-z])([A-Z])/g, '$1 $2');
    });
}

// Function to generate a random effect within a specified range
function generateRandomEffect(min, max) {
    return (Math.random() * (max - min) + min);
}

// Function to update the evaluation
function updateEvaluation(value) {
    evaluation += value;
}

// Function to display evaluation
function displayEvaluation() {
    const evaluationDiv = document.getElementById("evaluation");
    evaluationDiv.textContent = `Evaluation: ${evaluation.toFixed(1)}`;

}

function displayGameCounter() {
	const gameCounterDiv = document.getElementById("gameCounter");
    gameCounterDiv.textContent = `Game #${gameCounter}`;



}

// Function to display lastTurn
function displayLastTurn() {
    const lastTurnDiv = document.getElementById("lastTurn");
    lastTurnDiv.textContent = `Last Turn: ${lastTurn.toFixed(1)}`;
	
	if (lastTurn < -1) {
        lastTurnDiv.style.color = "red";
        lastTurnDiv.style.fontWeight = "bold";
    } else if (lastTurn > 1) {
        lastTurnDiv.style.color = "green";
        lastTurnDiv.style.fontWeight = "normal";
    } else {
        // Reset styles if lastTurn is zero
        lastTurnDiv.style.color = "";
        lastTurnDiv.style.fontWeight = "";
    }
}

// Function to reset the game (DEFUNCT)
function resetGame() {
    evaluation = 0;
    displayEvaluation();
	updateEvaluationMeter();
    // Reset button labels
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button, index) => {
        button.textContent = "Make Move";
    });
}

// Function to win player the game and reset
function playerWinGame() {
	alert("You have won by checkmate!");
	gameCounter = gameCounter + 1;
	playerScore = playerScore + 1;
	
    evaluation = 0;
	lastTurn = 0;
	displayLastTurn();
    displayEvaluation();
	updateEvaluationMeter();
	displayGameCounter();
    // Reset button labels
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button, index) => {
        button.textContent = `Start Game #${gameCounter}`;
    });
}

// Function to win opponent the game and reset
function opponentWinGame() {
	alert("You lost! Opponent wins by checkmate!");
	gameCounter = gameCounter + 1;
	opponentScore = opponentScore + 1;
	
    evaluation = 0;
	lastTurn = 0;
	displayLastTurn();
    displayEvaluation();
	updateEvaluationMeter();
	displayGameCounter();
    // Reset button labels
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button, index) => {
        button.textContent = `Start Game #${gameCounter}`;
    });
}

// Function to draw and reset the game
function drawGame() {
	alert("The game has ended in a draw!");
	gameCounter = gameCounter + 1;
	playerScore = playerScore + 0.5;
	opponentScore = opponentScore + 0.5;
	
    evaluation = 0;
	lastTurn = 0;
	displayLastTurn();
    displayEvaluation();
	updateEvaluationMeter();
	displayGameCounter();
    // Reset button labels
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button, index) => {
        button.textContent = `Start Game #${gameCounter}`;
    });
}


// Code to display / update the eval meter
function updateEvaluationMeter() {
    const meterDiv = document.getElementById("EvaluationMeter");
	
	
    // Ensure evaluation is within the range
	input= Math.max(-NUMBERTOWIN, Math.min(NUMBERTOWIN, evaluation));
	// Normalizes the number from 0 to +100
	input = (input+NUMBERTOWIN) * (100/(2*NUMBERTOWIN))

    // Calculate the percentage of black and white based on the evaluation
    const blackPercentage = 100-input;
    const whitePercentage = input;

    // Update the meter styles using two separate divs
	meterDiv.style.position = "relative";
	meterDiv.innerHTML = ""; // Clear previous content
	meterDiv.style.overflow = "hidden";

	const whiteBar = document.createElement("div");
	whiteBar.style.position = "absolute";
	whiteBar.style.left = "0";
	whiteBar.style.top = "0";
	whiteBar.style.bottom = "0";
	whiteBar.style.width = `${whitePercentage}%`;
	whiteBar.style.backgroundColor = "white";

	const blackBar = document.createElement("div");
	blackBar.style.position = "absolute";
	blackBar.style.left = `${whitePercentage}%`;
	blackBar.style.top = "0";
	blackBar.style.bottom = "0";
	blackBar.style.width = `${blackPercentage}%`;
	blackBar.style.backgroundColor = "black";

	meterDiv.appendChild(whiteBar);
	meterDiv.appendChild(blackBar);

	
	
}