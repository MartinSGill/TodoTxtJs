/*******************************************************************************
 * Copyright (C) 2013-2015 Martin Gill
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

/// <reference path="../src/typings/tsd.d.ts" />

describe('TodoManager', function () {
    describe('Add Todos', function () {
        it('can store a string todo', function () {
            var data = '(A) Hello World';
            var target = new TodoTxtJs.TodoManager();
            target.add(data);
            var todo = target.getAt(0);

            expect(todo).not.toBe(null);
            expect(todo.priority()).toBe('A');
            expect(todo.index).toBe(0);
        });

        it('can store an object todo ', function () {
            var data = '(A) Hello World';
            var expected = new TodoTxtJs.Todo(data);
            var target = new TodoTxtJs.TodoManager();
            target.add(expected);
            var actual = target.getAt(0);

            expect(actual).not.toBe(null);
            expect(actual).toBe(expected);
        });

        it('resets object todo index', function () {
            var data = '(A) Hello World';
            var expected = new TodoTxtJs.Todo(data);
            expected.index = 5; // Give it a random number
            var target = new TodoTxtJs.TodoManager();
            target.add(expected);
            var actual = target.getAt(0);

            expect(actual.index).toBe(0);
        });

        it('does not add an empty string to stored objects', function () {
            var data = '   ';
            var target = new TodoTxtJs.TodoManager();
            target.add(data);
            var actual = target.getAt(0);

            expect(actual).toBe(null);
        });

        it('increments index for empty entries', function () {
            var dataA = '(A) Hello World';
            var dataB = '(B) Hello World';
            var target = new TodoTxtJs.TodoManager();
            target.add(dataA);
            target.add('');
            target.add(dataB);
            var actualA = target.getAt(0);
            var actualB = target.getAt(1);

            expect(actualA.priority()).toBe('A');
            expect(actualB.priority()).toBe('B');
            expect(actualA.index).toBe(0);
            expect(actualB.index).toBe(2);
        });
    });

    describe('importing & exporting todos', function () {
        it('preserves gaps when exporting', function () {
            var dataA = '(A) Hello World';
            var dataB = '(B) Hello World';
            var target = new TodoTxtJs.TodoManager();
            target.add(dataA);
            target.add('');
            target.add(dataB);
            var actual = target.exportToStringArray();

            expect(actual.length).toBe(3);
            expect(actual[1]).toBe('');
        });

        it('succeeds at import/export round-trip', function () {
            var data = ['(A) Hello World', '(B) Hello World', '(C) Hello World'];
            var target = new TodoTxtJs.TodoManager();
            target.loadFromStringArray(data);
            var actual = target.exportToStringArray();

            expect(actual.length).toBe(3);
            expect(actual).toEqual(data);
        });

        it('succeeds at import/export with gaps', function () {
            var data = ['(A) Hello World', '', '', '(B) Hello World', '', '(C) Hello World'];
            var target = new TodoTxtJs.TodoManager();
            target.loadFromStringArray(data);
            var actual = target.exportToStringArray();

            expect(actual.length).toBe(6);
            expect(actual).toEqual(data);
        });
    });
});
