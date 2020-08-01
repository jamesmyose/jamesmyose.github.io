// Knight Move Visualizer
/*
var config = {
    draggable: true,
    dropOffBoard: 'snapback',
    position: '8/8/8/8/8/8/8/1N6',
    showNotation: false,
}
var board = Chessboard('myBoard', config);
*/
var board = null
var game = new Chess('8/8/8/8/8/8/8/1N6 w - - 0 1')
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

function onDrop (source, target) {
  removeGreySquares()
}

function highlight (square) {
  // highlight the square they moused over
  greySquare(square)

  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  if (moves.length === 0) {
    game.remove(square)
  }

  /*
  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    setTimeout(greySquare, 1000, moves[i].to)
  }
  */

  for (var i = 0; i < moves.length; i++) {
    console.log(moves[i].to)
    game.put({type: 'n', color: 'w'}, moves[i].to)
    setTimeout(highlight, 500, moves[i].to)
  }

  // exit if there are no moves available for this square
  if (moves.length === 0) return
}

function onMouseoverSquare (square, piece) {
  // highlight (square)
}

function onSnapEnd (draggedPieceSource, square, draggedPiece, currentPosition) {
  var currentBoard = board.fen().concat(' w - - 0 1')
  game.load(currentBoard)

  highlight (square)
}

function onSnapbackEnd (piece, square) {
  highlight (square)
}

var config = {
  draggable: true,
  position: '8/8/8/8/8/8/8/1N6',
  onDrop: onDrop,
  // onDragStart: onDragStart,
  // onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
  onSnapbackEnd: onSnapbackEnd,
}
board = Chessboard('myBoard', config)


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
