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

/// <reference path="../../src/typings/jasmine/jasmine.d.ts" />
/// <reference path="../../src/Models/token.ts" />

namespace TodoTxt.Models.Specs
{
    describe('Models.Token', () =>
    {
        describe('Construction', () =>
        {
            it('defaults to Token type', () =>
            {
                var target = new Token();
                expect(target.type).toBe(TokenType.text);
            });

            it('defaults to text empty string', () =>
            {
                var target = new Token();
                expect(target.text).toBe('');
            });

            it('correctly sets Token type', () =>
            {
                var target = new Token(TokenType.completed);
                expect(target.type).toBe(TokenType.completed);
            });

            it('correctly sets Token type', () =>
            {
                var target = new Token(TokenType.completed, 'bob');
                expect(target.text).toBe('bob');
            });

            it('defaults subType to empty string', () =>
            {
                var target = new Token();
                expect(target.id).toBe('');
            });

            it('correctly sets Token subType', () =>
            {
                var target = new Token(TokenType.metadata, 'bob', 'sub');
                expect(target.id).toBe('sub');
            });
        });
    });
}