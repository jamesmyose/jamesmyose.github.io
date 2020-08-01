// Knight Move Visualizer

/* Issues:
If a piece just got moved, highlighting bugs if another piece is moved too quickly after the first piece
Highlighting doesn't work with king
Highlighting only works for white pieces
Highlighting only works for one piece
Invisible Knights don't get removed after highlighting
Castling, en passant, and promotion don't work
*/

/*
var config = {
    draggable: true,
    dropOffBoard: 'snapback',
    position: '8/8/8/8/8/8/8/1N6',
    showNotation: false,
}
var board = Chessboard('myBoard', config);
*/
var startFen = '8/8/8/8/8/8/8/1N6'
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
const startNumMoves = 0
var colors = {
  0: '#6A9946',
  1: '#8AA946',
  2: '#AAB946',
  3: '#E9D846',
  4: '#E99946',
  5: '#E97946',
  6: '#E95946',
}
/*
var whiteColors = {
  0: '#78AD5B',
  1: '#78EC5B',
  2: '#F8EC5B',
  3: '#F8CC5B',
  4: '#F8BF5B',
  5: '#F86D5B',
};

var blackColors = {
  0: '#5B8432',
  1: '#5BC432',
  2: '#DAC432',
  3: '#DAA432',
  4: '#DA9732',
  5: '#DA4432',
}
*/

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square, numMoves) {
  var $square = $('#myBoard .square-' + square)

  /*
  // var background = whiteSquareGrey
  var background = whiteColors[rank]
  if ($square.hasClass('black-3c85d')) {
    // background = blackSquareGrey
    background = blackColors[rank]
  }
  */

  $square.css('background', colors[numMoves])
}

function onDrop (source, target, piece) {
  removeGreySquares()
}

function highlight (square, numMoves, piece) {

  // highlight the square they moused over
  greySquare(square, numMoves)

  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true,
    legal: false,
  })

  /*
  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    setTimeout(greySquare, 1000, moves[i].to)
  }
  */

  numMoves++
  console.log(piece)
  for (var i = 0; i < moves.length; i++) {
    game.put({type: piece, color: 'w'}, moves[i].to)
    setTimeout(highlight, 500, moves[i].to, numMoves, piece)
  }

  // work on later: visual animation for moving knight to squares
  // updateFen = game.fen().substring(0, game.fen().length - 1)
  // board.position(updateFen, true)

  // exit if there are no moves available for this square
  if (moves.length === 0) return
}

function onMouseoverSquare (square, piece) {
  // highlight (square)
}

function onSnapEnd (draggedPieceSource, square, draggedPiece, currentPosition) {
  var currentBoard = board.fen().concat(' w - - 0 1')
  game.load(currentBoard)

  // chessboard.js has different notation (e.g. white knight is wN instead of n)
  var piece = draggedPiece.substr(1).toLowerCase();

  highlight (square, startNumMoves, piece)
}

function onSnapbackEnd (draggedPiece, square) {
  var piece = draggedPiece.substr(1).toLowerCase();
  highlight (square, startNumMoves, piece)
}

var config = {
  draggable: true,
  position: startFen,
  // position: 'start',
  onDrop: onDrop,
  // onDragStart: onDragStart,
  // onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
  onSnapbackEnd: onSnapbackEnd,
}
board = Chessboard('myBoard', config)

$('#setKnight').on('click', function () {
  board.position('8/8/8/8/8/8/8/1N6')
})

$('#setStartBtn').on('click', board.start)


// Highlight Legal Moves Example from chessboardjs.com
// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js
/*
var board = null
var game = new Chess('1n6/8/8/8/8/8/8/1N6 w - - 0 1')
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onDragStart (source, piece) {

  // do not pick up pieces if the game is over
  // if (game.game_over()) return false

  // or if it's not that side's turn
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  removeGreySquares()


  // game.make_move({source: source, target: target})

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q', // NOTE: always promote to a queen for example simplicity
    })

  // illegal move
  if (move === null) return 'snapback'

}

function onMouseoverSquare (square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare (square, piece) {
  removeGreySquares()
}

function onSnapEnd (draggedPieceSource, square, draggedPiece, currentPosition) {
  // console.log(draggedPieceSource)
  // console.log(square)
  // console.log(draggedPiece)
  //game.update(board.fen())
  //board.position(game.fen())
}

var config = {
  draggable: true,
  position: '1n6/8/8/8/8/8/8/1N6',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)
*/
