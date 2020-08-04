// Knight Move Visualizer

/* Issues:
If a piece just got moved, highlighting bugs if another piece is moved too quickly after the first piece
Highlighting doesn't work with king
Highlighting only works for white pieces, FIXED
Highlighting only works for one piece
Invisible Knights don't get removed after highlighting
  queen moves interfere with each other
Castling, en passant, and promotion don't work
Website Looks bad on mobile

Ideas:
Make animation for each move
add numbers to highlighted squares
color squares that cant be reached with a different color
add target square to find how many moves to that square
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
//const startLayer = 0
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

function addToArray (square, piece, color) {
  var arr = []
  const startLayer = 0
  arr.push ({square: square, layer: startLayer, piece: piece, color: color})
  helper (arr, startLayer)

  for (var i = 0; i < arr.length; i++) {
    greySquare(arr[i].square, arr[i].layer)
  }
}

function helper (arr, distance) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].layer === distance) {

      game.put({type: arr[i].piece, color: arr[i].color}, arr[i].square)
      var moves = game.moves({
        square: arr[i].square,
        verbose: true,
        legal: false,
      })
      game.remove (arr[i].square)

      // need to make this push unique
      for (var j = 0; j < moves.length; j++) {
        arr.push({square: moves[j].to, layer: distance + 1, piece: arr[i].piece, color: arr[i].color})
      }
    }
  }
  helper (arr, distance + 1)
  console.log(arr)
}

/*
function highlight (square, layer, piece, color) {

  // highlight the square they moused over
  greySquare(square, layer)

  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true,
    legal: false,
  })

  // highlight the possible squares for this piece
  // for (var i = 0; i < moves.length; i++) {
    // setTimeout(greySquare, 1000, moves[i].to)
  // }

  layer++
  for (var i = 0; i < moves.length; i++) {
    game.put({type: piece, color: color}, moves[i].to)
    // function doesn't work without delay because it runs the top path all the way through before any others
    setTimeout(highlight, 1, moves[i].to, layer, piece, color)

  }

  // work on later: visual animation for moving knight to squares
  // updateFen = game.fen().substring(0, game.fen().length - 1)
  // board.position(updateFen, true)

  // exit if there are no moves available for this square
  if (moves.length === 0) return
}
*/

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
