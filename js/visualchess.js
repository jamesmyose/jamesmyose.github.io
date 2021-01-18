// Chess Move Visualizer

/* Potential Improvements:
FIXED: If a piece just got moved, highlighting bugs if another piece is moved too quickly after the first piece
FIXED: Highlighting doesn't work with king
FIXED: Highlighting only works for white pieces
Highlighting only works for one piece
FIXED: Invisible Knights don't get removed after highlighting
  FIXED: queen moves interfere with each other
Castling, en passant, and promotion don't work
  castling: putting KQkq into the fen concat bugs positions where there is no king and rook
  UNNECESSARY: en passant
FIXED: Website Looks bad on mobile
color of coordinates on bottom and left need to be the same color
FIXED: when animation is false, coloring on mouseover doesn't work
multiple kings on the same color don't work
probably need to add a line that waits until the document is loaded
font of number of moves isn't adaptive to size of board

Ideas:
Make animation with pieces for each move
DONE: add numbers to highlighted squares
color unreachable squares with a different color
color self-color occupied squares with a different color
add target square to find how many moves to that square
DONE: animation button
*/

// ---------------------------------------------------------------------------
// Setup chess.js
// ---------------------------------------------------------------------------

// var startFen = '8/8/8/8/8/8/8/1N6'
var startFen = 'start'

var board = null
var game = null
if (startFen === 'start') {
  game = new Chess()
}
else {
  game = new Chess(startFen.concat(' w - - 0 1'))
}

// ---------------------------------------------------------------------------
// Square coloring
// ---------------------------------------------------------------------------

// potentially used for unreachable squares
/*
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
*/

var timeouts = []

// options
var animation = true
var mouseover = true
var showNumbers = false

// colors for each move
var colors = {
  0: '#6A9946',
  1: '#8AA946',
  2: '#AAB946',
  3: '#E9D846',
  4: '#E99946',
  5: '#E97946',
  6: '#E95946',
  7: '#CA5966',
  8: '#AA5986'
}

// Remove color from the chessboard squares
function removeColor () {
  $('#myBoard .square-55d63').css('background', '')
}

// Remove the number of moves from each square
function removeNumbers() {
  var currentNumbers = document.getElementsByClassName('numbers')
  for (var i = 0; i < currentNumbers.length; i++) {
    currentNumbers[i].innerHTML = ''
  }
}

// Add the number moves to the square
function addNumbers (square, layer, color) {
  if (layer > 0) {
    document.getElementById(square).innerHTML = layer
    if (color === 'w') {
      document.getElementById(square).style.color = '#FFFFFF'
    }
    else {
      document.getElementById(square).style.color = '#000000'
    }
  }
}

// Add color to the square depending on the number of moves to reach the square
function addColor (square, layer) {
  var $square = $('#myBoard .square-' + square)
  if (layer > 8) {
    var r = Math.max(17, 170 - 34 * (layer - 8))
    var g = Math.max(9, 89 - (18 * (layer - 8)))
    var b = Math.max(13, 134 - (27 * (layer - 8)))
    $square.css('background', 'rgb(' + r + ',' + g + ',' + b + ')')
  }
  else {
    $square.css('background', colors[layer])
  }
}

// Remove the previous coloring and color the chessboard
function highlight (square, piece, color) {
  removeColor()
  removeNumbers()
  for (var i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i])
  }
  var arr = []
  arr.push ({square: square, layer: 0, piece: piece, color: color})

  helper(arr, 0)

  for (var i = 0; i < arr.length; i++) {
    if (animation) {
      timeouts.push(setTimeout(addColor, i * 10, arr[i].square, arr[i].layer))
      if (showNumbers) {
        timeouts.push(setTimeout(addNumbers, i * 10, arr[i].square, arr[i].layer, color))
      }
    }
    else {
      addColor(arr[i].square, arr[i].layer)
      if (showNumbers) addNumbers(arr[i].square, arr[i].layer, color)
    }
  }

  // making the unreachable squares grey

  /*
  // find squares not included in possible moves
  var missing = []
  for (var j = 0; j < game.SQUARES.length; j++) {
    var found = false
    for (var i = 0; i < arr.length; i++) {
      if (game.SQUARES[j] === arr[i].square) {
        console.log(game.SQUARES[j])
        found = true
      }
    }
    if (!found) {
      missing.push(game.SQUARES[j])
    }
  }

  // add color
  for (var i = 0; i < missing.length; i++) {
    timeouts.push(setTimeout(greySquare, i * 15, missing[i]))
  }
  */
}

/*
// Helper method to color unreachable squares grey
function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}
*/

// recursively finds all squares that the piece can reach.
function helper (arr, distance) {
  // need to make sure that at least one square was added to move on to the next layer
  // if not, then stop recursion
  var added = false

  // for each source square in the previous layer, find the possible moves from that square
  for (var i = 0; i < arr.length; i++) {
    if (distance === arr[i].layer) {

      // adding (then finding the moves) then removing the piece is needed to the square to satisfy the chess.js method
      game.put({type: arr[i].piece, color: arr[i].color}, arr[i].square)
      var moves = game.moves({
        square: arr[i].square,
        verbose: true,
        legal: false,
      })
      game.remove (arr[i].square)

      // make sure that the squares found aren't duplicates from the current or a previous layer
      for (var j = 0; j < moves.length; j++) {
        var duplicate = false
        for (var k = 0; k < arr.length; k++) {
          if (arr[k].square === moves[j].to) {
            duplicate = true
          }
        }

        // push to arr if not a duplicate
        // for some reason, if pawn is on the 8th rank, game.moves returns just the letter of the file as a valid move
        if (!duplicate && (moves[j].to.length > 1)) {
          arr.push({square: moves[j].to, layer: distance + 1, piece: arr[i].piece, color: arr[i].color})
          added = true
        }
      }
    }
  }

  // if at least one square is added, continue with next layer
  if (added) {
    helper (arr, distance + 1)
  }
}

// ---------------------------------------------------------------------------
// chessboard.js user interaction and triggers
// ---------------------------------------------------------------------------

// Helper method because chess.js needs extra stuff on the end of the fen
function resetGamePos (color) {
  var currentBoard = board.fen().concat(' ', color, ' - - 0 1')
  game.load(currentBoard)
}

// Helper method to make sure piece dropped or mousedover isn't the same as before
function deepCompare (piece1, piece2) {
  if (piece1.square === piece2.square && piece1.piece === piece2.piece && piece1.color === piece2.color) {
    return true
  }
  else {
    return false
  }
}

// Color the chessboard when a piece is moused over
var previousPiece = {square: null, piece: null, color: null}
function onMouseoverSquare (square, draggedPiece) {
  board.draw()
  if (mouseover) {
    if (!draggedPiece) {return}
    var piece = draggedPiece.charAt(1).toLowerCase();
    var color = draggedPiece.charAt(0);

    currentPiece = {square: square, piece: piece, color: color}

    if (!deepCompare(previousPiece, currentPiece))  {
      previousPiece = currentPiece
      resetGamePos(color)

      highlight (square, piece, color)
    }
  }
}

// Color the chessboard when a piece is dropped
function onSnapEnd (draggedPieceSource, square, draggedPiece, currentPosition) {
  // chessboard.js has different notation (e.g. white knight is wN instead of n)
  var piece = draggedPiece.charAt(1).toLowerCase();
  var color = draggedPiece.charAt(0);

  currentPiece = {square: square, piece: piece, color: color}

  // this should probably be included just for mobile
  /*
  if (!deepCompare(previousPiece, currentPiece))  {
    previousPiece = currentPiece
    resetGamePos(color)

    highlight (square, piece, color)
  }
  */

  resetGamePos(color)
  previousPiece = currentPiece

  highlight (square, piece, color)
}

// Color the chessboard when a piece is dropped off the board and snaps back
function onSnapbackEnd (draggedPiece, square) {
  var piece = draggedPiece.charAt(1).toLowerCase();
  var color = draggedPiece.charAt(0);

  currentPiece = {square: square, piece: piece, color: color}

  if (!deepCompare(previousPiece, currentPiece))  {
    previousPiece = currentPiece
    resetGamePos(color)

    highlight (square, piece, color)
  }
}

// ---------------------------------------------------------------------------
// Setup chessboard.js
// ---------------------------------------------------------------------------

// config to pass to chessboard.js
var config = {
  draggable: true,
  position: startFen,
  // onDrop: onDrop,
  // onDragStart: onDragStart,
  // onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
  onSnapbackEnd: onSnapbackEnd,
  sparePieces: false,
  dropOffBoard: 'trash'
}

// init chessboard.js
board = Chessboard('myBoard', config)
numberText()
changeFontSize()

// on startup, numberText would move some of the numbers down by a row, so a board reset on startup is needed.
board.clear(false)
game.clear()
removeColor()
removeNumbers()
resetStart()

// Need to add a div (as a place to put the number text) to each of the squares after the board is built
function numberText() {
  for (var i = 0; i < game.SQUARES.length; i++) {
    var div = document.createElement('div')
    div.innerHTML = ''
    div.className = 'numbers'
    div.id = game.SQUARES[i]
    document.getElementsByClassName('square-' + game.SQUARES[i])[0].appendChild(div)
  }
}

// Need to change the font of the numbers after the board is built
function changeFontSize() {
  squareWidth = document.getElementsByClassName('numbers')[0].offsetWidth

  var elements = document.getElementsByClassName("numbers")
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.fontSize = (3/4) * squareWidth + 'px';
  }
}

// ---------------------------------------------------------------------------
// User Interaction in Main Text and Options
// ---------------------------------------------------------------------------

// change position to one knight (button)
$('#setKnight').on('click', function () {
  removeColor()
  removeNumbers()

  // set both board and game
  board.position('8/8/8/8/8/8/8/1N6')
  resetGamePos('w')
  previousPiece = {square: null, piece: null, color: null}
})

// change position start (button)
$('#setStartBtn').on('click', resetStart)
function resetStart() {
  removeColor()
  removeNumbers()

  // set both board and game
  board.start()
  resetGamePos('w')
  previousPiece = {square: null, piece: null, color: null}
}

// toggle color animation (button)
$('#animationBtn').on('click', changeAnimationText)
function changeAnimationText() {
  animation = !animation

  // if going from no animation to animation, trigger highlighting
  resetGamePos(previousPiece.color)
  if (animation && (previousPiece.square !== null) && game.get(previousPiece.square) !== null) {
    highlight(previousPiece.square, previousPiece.piece, previousPiece.color)
  }
}

// toggle animation trigger (button)
$('#mouseover').on('click', function(){
  mouseover = !mouseover
})

// Previously used to clear board
/*
// clear board (button)
$('#clearBoardBtn').on('click', clear)
function clear() {
  // clear board using animation
  board.clear(true)

  // clear game to avoid errors
  game.clear()

  // prevent leftover color
  removeColor()

  removeNumbers()
}
*/

// toggling whether the number of moves are shown on the colored squared
$('#showNumbers').on('click', toggleNumbers)
function toggleNumbers() {
  var text = document.getElementById('showNumbersChecked').checked
  if (text === false) {
    showNumbers = false
  }
  if (text === true) {
    showNumbers = true
  }

  resetGamePos(previousPiece.color)
  if (previousPiece.square !== null && game.get(previousPiece.square) !== null) {
    highlight(previousPiece.square, previousPiece.piece, previousPiece.color)
  }
}

// toggling whether the number of moves are shown on the colored squared
function changePosText(fen, square, piece, numbers){
  // change show numbers button text
  var text = document.getElementById('showNumbersChecked').checked
  if (numbers) {
    showNumbers = true
    if (text === false) {
      document.getElementById('showNumbersChecked').checked = true
    }
  }
  else {
    showNumbers = false
    if (text === true) {
      document.getElementById('showNumbersChecked').checked = false
    }
  }

  // set both board and game
  board.position(fen)
  resetGamePos('w')

  // highlight piece movement
  highlight(square, piece, 'w')

  previousPiece = {square: square, piece: piece, color: 'w'}
}

// Setting example positions
$('#knightMovement').on('click', function(){
  changePosText('8/8/8/8/3N4/8/8/8', 'd4', 'n', true)
})

$('#startKnightMovement').on('click', function(){
  changePosText('4k3/8/8/8/8/3q4/8/1N6', 'b1', 'n', true)
})

// Unused open and closed position examples
/*
$('#openPosition').on('click', function(){
  changePosText('r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq', 'c1', 'b', false)
})

$('#closedPosition').on('click', function(){
  changePosText('r1b1kbnr/pp3ppp/1qn1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R', 'e2', 'b', false)
})
*/

$('#rookFile').on('click', function(){
  changePosText('r3kb1r/p2nqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR3R', 'd1', 'r', false)
})

$('#goodBishop').on('click', function(){
  changePosText('3r1rk1/pp1qn1bp/2p1b1p1/2Pp4/N2Pp3/1P2P3/PB1QB1PP/1KR2R2', 'e2', 'b', false)
})

$('#badBishop').on('click', function(){
  changePosText('3r1rk1/pp1qn1bp/2p1b1p1/2Pp4/N2Pp3/1P2P3/PB1QB1PP/1KR2R2', 'b2', 'b', false)
})
