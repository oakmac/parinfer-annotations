/* eslint-env mocha */

const assert = require('assert')
const parinferAnnotations = require('../parinfer-annotations.js')

// TODO
// We need test cases for all of these conditions:
// - only one error line
// - only one tabStop line
// - diff chars must be adjacent with '-'s before '+'s
// - diff lines must be directly below a code line
// - diff line starts with '-', which cannot come after '+' which previous diff line ends with
// - diff line can only extend one character past the previous line length (to annotate the 'newline' char)
// - cursor cannot be over a diff annotation
// - tabStop does not point to open paren
// - tabStop is dependent on a proceeding '^'
// - tabStop cannot come after another '>'
// - parenTrail cannot currently be printed when a cursor is present
// - parenTrail must point to close-parens only

// -----------------------------------------------------------------------------
// Cursors
// -----------------------------------------------------------------------------

const zeroCursors =
  '(defn foo\n' +
  '  [a b]\n' +
  '  )'

const oneCursor =
  '(defn foo\n' +
  '  [a b]\n' +
  '  |)'

const multipleCursors =
  '(defn foo\n' +
  '|[a b]\n' +
  '|)'

// TODO: cursor over diff line

function testCursors () {
  it('no cursors is fine', function () {
    var result = parinferAnnotations.textToData(zeroCursors)
    assert.strictEqual(result.validText, true)
  })

  it('one cursor is fine', function () {
    var result = parinferAnnotations.textToData(oneCursor)
    assert.strictEqual(result.validText, true)
  })

  it('cannot have more than one cursor', function () {
    var result = parinferAnnotations.textToData(multipleCursors)
    assert.strictEqual(result.validText, false)
    assert.strictEqual(result.error.code, 1000)
  })

  // TODO: cursor over diff line
}

// -----------------------------------------------------------------------------
// Test Cases
// -----------------------------------------------------------------------------

const test1Text = '(defn sum [a b]\n' +
                  '  (+ a b))'

const test1Data = {
  text: test1Text,
  options: {},
  validText: true
}

// -----------------------------------------------------------------------------
// Run the tests
// -----------------------------------------------------------------------------

function testTextToData () {
  it('no annotations is fine', function () {
    assert.deepStrictEqual(parinferAnnotations.textToData(test1Text), test1Data)
  })
}

describe('cursors', testCursors)
describe('text --> data', testTextToData)
