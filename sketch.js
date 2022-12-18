// Jenn Pham, CSE 270M, Section A
// Homework 3: Blackjack strategy guide using Monte Carlo Simulation
// Monday, October 18, 2021

let deck = [];
let playerHand = [];
let dealerHand = [];
let result = [];
let prob = [];
let topIndex = 0;
let bust = false;
const TRIALS = 10000;

function setup() {
  createCanvas(800, 800);
  background(0);
  deck = createDeck();

  // Create tables
  result = create2DArray();
  prob = create2DArray();

  // Loop through all the cells in 2D
  for (let playerTotal = 20; playerTotal >= 12; playerTotal--) {
    for (let upcard = 1; upcard < 11; upcard++) {
      if (playerTotal == 20) {
        playerHand = [];
        switch (int(random(0, 2))) {
          case 0:
            playerHand.push(10);
            playerHand.push(10);
            break;
          case 1:
            playerHand.push(11);
            playerHand.push(9);
            break;
        }
      } else if (playerTotal == 19) {
        playerHand = [];
        switch (int(random(0, 2))) {
          case 0:
            playerHand.push(10);
            playerHand.push(9);
            break;
          case 1:
            playerHand.push(11);
            playerHand.push(8);
            break;
        }
      } else if (playerTotal == 18) {
        playerHand = [];
        switch (int(random(0, 3))) {
          case 0:
            playerHand.push(10);
            playerHand.push(8);
            break;
          case 1:
            playerHand.push(9);
            playerHand.push(9);
            break;
          case 2:
            playerHand.push(11);
            playerHand.push(7);
            break;
        }
      } else if (playerTotal == 17) {
        playerHand = [];
        switch (int(random(0, 3))) {
          case 0:
            playerHand.push(10);
            playerHand.push(7);
            break;
          case 1:
            playerHand.push(6);
            playerHand.push(11);
            break;
          case 2:
            playerHand.push(8);
            playerHand.push(9);
            break;
        }
      } else if (playerTotal == 16) {
        playerHand = [];
        switch (int(random(0, 4))) {
          case 0:
            playerHand.push(10);
            playerHand.push(6);
            break;
          case 1:
            playerHand.push(11);
            playerHand.push(5);
            break;
          case 2:
            playerHand.push(9);
            playerHand.push(7);
            break;
          case 3:
            playerHand.push(8);
            playerHand.push(8);
            break;
        }
      } else if (playerTotal == 15) {
        playerHand = [];
        switch (int(random(0, 4))) {
          case 0:
            playerHand.push(10);
            playerHand.push(5);
            break;
          case 1:
            playerHand.push(11);
            playerHand.push(4);
            break;
          case 2:
            playerHand.push(9);
            playerHand.push(6);
            break;
          case 3:
            playerHand.push(8);
            playerHand.push(7);
            break;
        }
      } else if (playerTotal == 14) {
        playerHand = [];
        switch (int(random(0, 5))) {
          case 0:
            playerHand.push(10);
            playerHand.push(4);
            break;
          case 1:
            playerHand.push(11);
            playerHand.push(3);
            break;
          case 2:
            playerHand.push(9);
            playerHand.push(5);
            break;
          case 3:
            playerHand.push(8);
            playerHand.push(6);
            break;
          case 4:
            playerHand.push(7);
            playerHand.push(7);
            break;
        }
      } else if (playerTotal == 13) {
        playerHand = [];
        switch (int(random(0, 5))) {
          case 0:
            playerHand.push(10);
            playerHand.push(3);
            break;
          case 1:
            playerHand.push(11);
            playerHand.push(2);
            break;
          case 2:
            playerHand.push(9);
            playerHand.push(4);
            break;
          case 3:
            playerHand.push(8);
            playerHand.push(5);
            break;
          case 4:
            playerHand.push(7);
            playerHand.push(6);
            break;
        }
      } else if (playerTotal == 12) {
        playerHand = [];
        switch (int(random(0, 6))) {
          case 0:
            playerHand.push(10);
            playerHand.push(2);
            break;
          case 1:
            playerHand.push(11);
            playerHand.push(1);
            break;
          case 2:
            playerHand.push(9);
            playerHand.push(3);
            break;
          case 3:
            playerHand.push(8);
            playerHand.push(4);
            break;
          case 4:
            playerHand.push(7);
            playerHand.push(5);
            break;
          case 5:
            playerHand.push(6);
            playerHand.push(6);
            break;
        }
      }

      dealerHand.push(upcard);

      // Declare the counts
      let sCount = 0;
      let hCount = 0;

      // Stand strategy
      for (let s = 0; s < TRIALS; s++) {
        fyShuffle(deck); // shuffle after each hand
        dealerHand.length = 1;
        dealerHand.push(deck[topIndex++]);

        // Player turn: Just stand
        let playerScore = hardTotal(playerHand);
        let dealerScore = dealerRule(dealerHand, topIndex++);

        // Check score
        if (dealerScore > 21) sCount++;
        else {
          if (playerScore > dealerScore) sCount++;
        }

        topIndex = 0;
      }

      // Hit strategy
      for (let h = 0; h < TRIALS; h++) {
        fyShuffle(deck); // shuffle after each hand
        // deal the last card to dealer
        playerHand.length = 2;
        dealerHand.length = 1;
        dealerHand.push(deck[topIndex++]);

        // Player turn: Loop until bust or at 21 or table says 's' above
        let cont = true;
        let playerScore;

        while (cont) {
          playerHand.push(deck[topIndex++]); // must deal at least one
          playerScore = hardTotal(playerHand); // compute the total

          // Check conditions: Stop if bust, AT 21, or the current index says something
          if (playerScore >= 21) {
            cont = false;
          } else if (playerScore >= 12 && playerScore < 21) {
            if (result[abs(playerScore - 20)][upcard - 1] == "s") cont = false;
          } else {
            cont = true;
          }
        }

        let dealerScore = dealerRule(dealerHand, topIndex++);

        // Check score
        if (dealerScore > 21) {
          if (playerScore <= 21) hCount++;
        } else {
          if (playerScore <= 21) {
            if (playerScore > dealerScore) hCount++;
          }
        }

        topIndex = 0;
      }

      // Compare results, put result in cell.
      if (sCount > hCount) {
        result[abs(playerTotal - 20)][upcard - 1] = "s";
        let res = sCount / TRIALS;
        prob[abs(playerTotal - 20)][upcard - 1] = Math.round(res * 100) / 100;
      } else if (sCount < hCount) {
        let res = hCount / TRIALS;
        result[abs(playerTotal - 20)][upcard - 1] = "h";
        prob[abs(playerTotal - 20)][upcard - 1] = Math.round(res * 100) / 100;
      } else {
        let res = hCount / TRIALS;
        result[abs(playerTotal - 20)][upcard - 1] = "d";
        prob[abs(playerTotal - 20)][upcard - 1] = Math.round(res * 100) / 100;
      }

      dealerHand = [];
    } // End upcard loop
  } // End playerTotal loop

  console.log(...result);
  console.log(...prob); // Print the table

  // Draw table on the canvas
  let standRed = color(255, 0, 0);
  let hitGreen = color(0, 255, 0);
  let rowNum = 9;
  let colNum = 10;

  // Draw the table
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum; j++) {
      let x = i * 40 + 30;
      let y = j * 40 + 30;

      if (result[i][j] == "s") {
        fill(standRed);
        stroke(0);
        square(y, x, 40);

        strokeWeight(1);
        fill(0);
        textAlign(CENTER, CENTER);
        text(prob[i][j], y + 20, x + 20);
      } else {
        fill(hitGreen);
        stroke(0);
        square(y, x, 40);

        strokeWeight(1);
        fill(0);
        textAlign(CENTER, CENTER);
        text(prob[i][j], y + 20, x + 20);
      }
    }
  }

  // Draw the upcards header
  for (let uc = 1; uc < 11; uc++) {
    let xStart = uc * 40 + 10;

    if (uc == 1) {
      fill(255);
      strokeWeight(1);
      textAlign(CENTER, CENTER);
      text("A", xStart, 20);
    } else {
      fill(255);
      strokeWeight(1);
      textAlign(CENTER, CENTER);
      text(uc, xStart, 20);
    }
  }

  // Draw the playerTotal header
    for (let uc = 0, pt = 20; uc < 9, pt >= 12; uc++, pt--) {
      let yStart = uc * 40 + 50;

      fill(255);
      strokeWeight(1);
      textAlign(CENTER, CENTER);
      text(pt, 15, yStart);
    }
  
}

function dealerRule(dealerHand, topIndex) {
  let dealerScore;

  while (softTotal(dealerHand) < 17) {
    dealerHand.push(deck[topIndex++]);
  }

  // Check after softTotal is over 17
  if (softTotal(dealerHand) > 21) {
    while (hardTotal(dealerHand) < 17) {
      dealerHand.push(deck[topIndex++]);
    }

    if (hardTotal(dealerHand) > 21) {
      bust = true;
      dealerScore = hardTotal(dealerHand);
    } else {
      dealerScore = hardTotal(dealerHand);
    }
  } else {
    dealerScore = softTotal(dealerHand);
  }

  return dealerScore;
}
// Create a 2D Array
function create2DArray() {
  let arr = Array(9);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = Array(10).fill("", 0);
  }

  return arr;
}

// Create the deck.
function createDeck() {
  for (let i = 1; i < 11; i++) {
    if (i != 10) {
      for (let j = 0; j < 4; j++) {
        deck.push(i);
      }
    } else {
      for (let j = 0; j < 16; j++) {
        deck.push(i);
      }
    }
  }

  return deck;
}

// Compute hard total.
function hardTotal(hand) {
  let sum = 0;
  for (let i = 0; i < hand.length; i++) {
    sum += hand[i];
  }

  return sum;
}

// Compute soft total.
function softTotal(hand) {
  let acesCount = 0;
  let sum = 0;

  for (let i = 0; i < hand.length; i++) {
    if (hand[i] == 1) {
      acesCount++;
    }
    sum += hand[i];
  }

  if (acesCount >= 1) {
    sum += 10;
  }

  return sum;
}

// Fisher-Yates shuffle algorithm.
// Game of Blackjack never uses more than 20 cards.
function fyShuffle(deck) {
  for (let i = 0; i < 20; i++) {
    let j = int(random(i, 52));

    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}
