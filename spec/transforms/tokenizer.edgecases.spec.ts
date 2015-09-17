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
/// <reference path="../../src/transforms/tokenizer.ts" />

namespace TodoTxt.Transforms.Tokenizer.Specs
{
    import TokenType = Models.TokenType;

    describe('Models.Tokenizer', () =>
    {
        describe('tokenize', () =>
        {
            describe('edge cases', () =>
            {
                it('correctly deals with non-metadata colons', () =>
                {
                    var actual = tokenize('Todo with due date: due:2013-01-01');
                    expect(actual[0].type).toBe(TokenType.text);
                    expect(actual[0].text).toBe('Todo with due date:');
                    expect(actual[1].type).toBe(TokenType.metadata);
                    expect(actual[1].text).toBe('2013-01-01');
                });

                it('correctly deals with two metadata in a row', () =>
                {
                    var actual = tokenize('Todo with metadata meta:data key:value');
                    expect(actual[0].type).toBe(TokenType.text);
                    expect(actual[0].text).toBe('Todo with metadata');
                    expect(actual[1].type).toBe(TokenType.metadata);
                    expect(actual[1].text).toBe('data');
                    expect(actual[2].type).toBe(TokenType.metadata);
                    expect(actual[2].text).toBe('value');
                });
            });
        });
    });
}