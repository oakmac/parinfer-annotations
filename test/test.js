/* eslint-env mocha */

const assert = require('assert')
const parinferAnnotations = require('../parinfer-annotations.js')

// TODO
// We need test cases for all of these conditions:
// - only one tabStop line
// - diff chars must be adjacent with '-'s before '+'s
// - diff lines must be directly below a code line
// - diff line starts with '-', which cannot come after '+' which previous diff line ends with
// - diff line can only extend one character past the previous line length (to annotate the 'newline' char)
// - tabStop does not point to open paren
// - tabStop is dependent on a proceeding '^'
// - tabStop cannot come after another '>'
// - parenTrail cannot currently be printed when a cursor is present
// - parenTrail must point to close-parens only

// -----------------------------------------------------------------------------
// Cursors
// -----------------------------------------------------------------------------

const noAnnotations =
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

const cursorNotOverDiff =
  '(|defn foo\n' +
  '   ---+++\n' +
  '  [a b]\n' +
  '  )'

const cursorOverDiff =
  '(defn |foo\n' +
  '   ---+++\n' +
  '  [a b]\n' +
  '  )'

function testCursors () {
  it('no cursors is fine', function () {
    var result = parinferAnnotations.textToData(noAnnotations)
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

  it('cursor can be on a diff line, but not over it', function () {
    var result = parinferAnnotations.textToData(cursorNotOverDiff)
    assert.strictEqual(result.validText, true)
  })

  it('cursor cannot be over a diff line', function () {
    var result = parinferAnnotations.textToData(cursorOverDiff)
    assert.strictEqual(result.validText, false)
    assert.strictEqual(result.error.code, 1010)
  })
}

// -----------------------------------------------------------------------------
// Error Lines
// -----------------------------------------------------------------------------

const oneError =
  '(foo\n' +
  '  ) foo} bar|\n' +
  '       ^ error: unmatched-close-paren\n'

const multipleErrors =
  '(foo\n' +
  '  ^ error: unmatched-close-paren\n' +
  '  ) foo} bar|\n' +
  '  ^ error: unmatched-close-paren\n'

function testErrors () {
  it('no errors is fine', function () {
    var result = parinferAnnotations.textToData(noAnnotations)
    assert.strictEqual(result.validText, true)
  })

  it('valid error line', function () {
    var result = parinferAnnotations.textToData(oneError)
    assert.strictEqual(result.validText, true)
    // TODO: check for the error data here
  })

  it('cannot be more than one error line', function () {
    var result = parinferAnnotations.textToData(multipleErrors)
    assert.strictEqual(result.validText, false)
    assert.strictEqual(result.error.code, 1020)
  })
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
describe('errors', testErrors)
describe('text --> data', testTextToData)
