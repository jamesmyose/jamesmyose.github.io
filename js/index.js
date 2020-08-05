// Chess Move Visualizer

/* Issues:
FIXED: If a piece just got moved, highlighting bugs if another piece is moved too quickly after the first piece
FIXED: Highlighting doesn't work with king
FIXED: Highlighting only works for white pieces
Highlighting only works for one piece
FIXED: Invisible Knights don't get removed after highlighting
  FIXED: queen moves interfere with each other
Castling, en passant, and promotion don't work
  castling: putting KQkq into the fen concat bugs positions where there is no king and rook
  UNNECESSARY: en passant
Website Looks bad on mobile
color of coordinates on bottom and left need to be the same color
FIXED: when animation is false, coloring on mouseover doesn't work
multiple kings on the same color don't work
probably need to add a line that waits until the document is loaded

Ideas:
Make animation with pieces for each move
DONE: add numbers to highlighted squares
color unreachable squares with a different color
color self-color occupied squares with a different color
add target square to find how many moves to that square
DONE: animation button
*/

// var startFen = '8/8/8/8/8/8/8/1N6'


var startFen = "start"

var board = null
var game = null
if (startFen === 'start') {
  game = new Chess()
}
else {
  game = new Chess(startFen.concat(' w - - 0 1'))
}

// don't need:
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

// for coloring:
var timeouts = []
var animation = true
var mouseover = true
var showNumbers = false
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

function removeColor () {
  $('#myBoard .square-55d63').css('background', '')
}

function removeNumbers() {
  var currentNumbers = document.getElementsByClassName('numbers')
  for (var i = 0; i < currentNumbers.length; i++) {
    currentNumbers[i].innerHTML = ''
  }
}

function numberText() {
  for (var i = 0; i < game.SQUARES.length; i++) {
    var div = document.createElement('div')
    div.innerHTML = ''
    div.className = 'numbers'
    div.id = game.SQUARES[i]
    document.getElementsByClassName('square-' + game.SQUARES[i])[0].appendChild(div)
  }
}

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

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

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
      timeouts.push(setTimeout(addColor, i * 15, arr[i].square, arr[i].layer))
      if (showNumbers) timeouts.push(setTimeout(addNumbers, i * 15, arr[i].square, arr[i].layer, color))
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

// two helper methods for the three methods below
function resetGamePos (color) {
  var currentBoard
  if (color === 'w') {
    currentBoard = board.fen().concat(' w - - 0 1')
  }
  else {
    currentBoard = board.fen().concat(' b - - 0 1')
  }
  game.load(currentBoard)
}

// check if the piece dropped or mousedover is the same as before
function deepCompare (piece1, piece2) {
  if (piece1.square === piece2.square && piece1.piece === piece2.piece && piece1.color === piece2.color) {
    return true
  }
  else {
    return false
  }
}

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

// unnecessary when spare pieces are on the board
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

var config = {
  draggable: true,
  position: startFen,
  // onDrop: onDrop,
  // onDragStart: onDragStart,
  // onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
  onSnapbackEnd: onSnapbackEnd,
  sparePieces: true,
  dropOffBoard: 'trash'
}
board = Chessboard('myBoard', config)
numberText()

// change position to just knight (button)
$('#setKnight').on('click', function () {
  removeColor()
  removeNumbers()

  // set both board and game
  board.position('8/8/8/8/8/8/8/1N6')
  resetGamePos('w')
})

// change position start (button)
$('#setStartBtn').on('click', function() {
  removeColor()

  removeNumbers()

  // set both board and game
  board.start()
  resetGamePos('w')
})

// toggle color animation (button)
$('#animationBtn').on('click', changeAnimationText)
function changeAnimationText() {
  animation = !animation

  // change button text back and forth
  var text = document.getElementById('animationBtn').innerHTML
  if (text === 'No Animation') {
    document.getElementById('animationBtn').innerHTML = 'Animation'
  }
  else {
    document.getElementById('animationBtn').innerHTML = 'No Animation'
  }

  // if going from no animation to animation, trigger highlighting
  resetGamePos(previousPiece.color)
  if (animation && (previousPiece.square !== null) && game.get(previousPiece.square) !== null) {
    highlight(previousPiece.square, previousPiece.piece, previousPiece.color)
  }
}

// toggle animation trigger (button)
$('#mouseover').on('click', changeMouseoverText)
function changeMouseoverText() {
  mouseover = !mouseover

  // change button text back and forth
  var text = document.getElementById('mouseover').innerHTML
  if (text === 'Animation on Mouseover') {
    document.getElementById('mouseover').innerHTML = 'Animation on Drop'
  }
  else {
    document.getElementById('mouseover').innerHTML = 'Animation on Mouseover'
  }
}

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

$('#showNumbers').on('click', toggleNumbers)
function toggleNumbers() {
  showNumbers = !showNumbers

  // change button text back and forth
  var text = document.getElementById('showNumbers').innerHTML
  if (text === 'Show Number of Moves') {
    document.getElementById('showNumbers').innerHTML = 'Hide Number of Moves'
  }
  else {
    document.getElementById('showNumbers').innerHTML = 'Show Number of Moves'
  }

  resetGamePos(previousPiece.color)
  if ((previousPiece.square !== null) && game.get(previousPiece.square) !== null) {
    console.log('here')
    highlight(previousPiece.square, previousPiece.piece, previousPiece.color)
  }
}
