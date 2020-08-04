// Knight Move Visualizer

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

Ideas:
Make animation with pieces for each move
add numbers to highlighted squares
color unreachable squares with a different color
color self-color occupied squares with a different color
add target square to find how many moves to that square
DONE: no animation button
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
var colors = {
  0: '#6A9946',
  1: '#8AA946',
  2: '#AAB946',
  3: '#E9D846',
  4: '#E99946',
  5: '#E97946',
  6: '#E95946',
}

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square, layer) {
  var $square = $('#myBoard .square-' + square)

  /*
  // var background = whiteSquareGrey
  var background = whiteColors[rank]
  if ($square.hasClass('black-3c85d')) {
    // background = blackSquareGrey
    background = blackColors[rank]
  }
  */

  $square.css('background', colors[layer])
}

function onDrop (source, target, piece) {
  removeGreySquares()
}

function highlight (square, piece, color) {
  removeGreySquares()
  for (var i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i])
  }
  var arr = []
  arr.push ({square: square, layer: 0, piece: piece, color: color})

  helper (arr, 0)

  for (var i = 0; i < arr.length; i++) {
    if (animation) {
      timeouts.push(setTimeout(greySquare, i * 15, arr[i].square, arr[i].layer))
    }
    else {
      greySquare(arr[i].square, arr[i].layer)
    }
  }
}

function helper (arr, distance) {
  var added = false
  for (var i = 0; i < arr.length; i++) {
    if (distance === arr[i].layer) {
      game.put({type: arr[i].piece, color: arr[i].color}, arr[i].square)
      var moves = game.moves({
        square: arr[i].square,
        verbose: true,
        legal: false,
      })
      game.remove (arr[i].square)

      // need to make this push unique

      for (var j = 0; j < moves.length; j++) {
        var duplicate = false
        for (var k = 0; k < arr.length; k++) {
          if (arr[k].square === moves[j].to) {
            duplicate = true
          }
        }

        if (!duplicate) {
          arr.push({square: moves[j].to, layer: distance + 1, piece: arr[i].piece, color: arr[i].color})
          added = true
        }
      }
    }
  }
  if (added) {
    helper (arr, distance + 1)
  }
}

function onMouseoverSquare (square, piece) {
  // highlight (square)
}

function onSnapEnd (draggedPieceSource, square, draggedPiece, currentPosition) {
  // chessboard.js has different notation (e.g. white knight is wN instead of n)
  var piece = draggedPiece.charAt(1).toLowerCase();
  var color = draggedPiece.charAt(0);

  var currentBoard
  if (color === 'w') {
    currentBoard = board.fen().concat(' w - - 0 1')
  }
  else {
    currentBoard = board.fen().concat(' b - - 0 1')
  }
  game.load(currentBoard)

  highlight (square, piece, color)
}

function onSnapbackEnd (draggedPiece, square) {
  var piece = draggedPiece.charAt(1).toLowerCase();
  var color = draggedPiece.charAt(0);
  highlight (square, piece, color)
}

var config = {
  draggable: true,
  position: startFen,
  onDrop: onDrop,
  // onDragStart: onDragStart,
  // onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
  onSnapbackEnd: onSnapbackEnd,
}
board = Chessboard('myBoard', config)

$('#setKnight').on('click', function () {
  removeGreySquares()
  board.position('8/8/8/8/8/8/8/1N6')
})

$('#setStartBtn').on('click', function() {
  removeGreySquares()
  board.start()
})
$('#animationBtn').on('click', changeText)

function changeText() {
  animation = !animation
  var text = document.getElementById('animationBtn').innerHTML
  if (text === 'No Animation') {
    document.getElementById('animationBtn').innerHTML = 'Animation'
  }
  else {
    document.getElementById('animationBtn').innerHTML = 'No Animation'
  }
}
