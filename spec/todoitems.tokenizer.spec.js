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

describe('TodoItems.Tokenizer', function(){
    describe('tokenize', function(){
        var tt = TodoTxtJs.TodoItems;
        var tokenize = tt.Tokenizer.tokenize;

        it('returns an empty token array for empty text', function(){
            var actual = tokenize('');
            expect(actual.length).toBe(0);
        });

        it('returns single token for pure text', function(){
            var actual = tokenize('This is a pure text todo');
            expect(actual.length).toBe(1);
        });

        it('returns correct text token for pure text', function(){
            var expected = 'This is a pure text todo';
            var actual = tokenize(expected)[0];
            expect(actual.text).toBe(expected);
            expect(actual.type).toBe(tt.TokenType.text);
        });

        it('returns correct completed token for completed marker', function(){
            var actual = tokenize('x 2015-05-15 some')[0];
            expect(actual.type).toBe(tt.TokenType.completed);
            expect(actual.text).toBe('2015-05-15');
        });

        it('does not return completed marker if it is the only token', function(){
            var actual = tokenize('x 2015-05-15')[0];
            expect(actual.type).not.toBe(tt.TokenType.completed);
        });

        it('only returns completed token when marker at start of text', function(){
            var actual = tokenize('Some leading text x 2015-05-15')[0];
            expect(actual.type).not.toBe(tt.TokenType.completed);
        });

        it('returns correct completed token and text', function(){
            var actual = tokenize('x 2015-05-15 Some other text');

            expect(actual[0].text).toBe('2015-05-15');
            expect(actual[0].type).toBe(tt.TokenType.completed);

            expect(actual[1].text).toBe('Some other text');
            expect(actual[1].type).toBe(tt.TokenType.text);
        });

        it('does not consider a date by itself as a createDate', function(){
            var actual = tokenize('2015-05-15')[0];
            expect(actual.type).not.toBe(tt.TokenType.createDate);
        });

        it('returns createDate token with correct text value', function(){
            var actual = tokenize('2015-05-15 Do some stuff')[0];
            expect(actual.type).toBe(tt.TokenType.createDate);
            expect(actual.text).toBe('2015-05-15');
        });

        it('returns text after create token', function(){
            var actual = tokenize('2015-05-15 Do some stuff')[1];
            expect(actual.type).toBe(tt.TokenType.text);
            expect(actual.text).toBe('Do some stuff');
        });

        it('only returns createDate token if clearly a date', function(){
            var actual = tokenize('2015-05-15a')[0];
            expect(actual.type).not.toBe(tt.TokenType.createDate);
        });

        it('only returns createDate token when marker at start of text', function(){
            var actual = tokenize('Some leading 2015-05-15')[0];
            expect(actual.type).not.toBe(tt.TokenType.createDate);
        });

        it('returns completed, createDate and text', function(){
            var actual = tokenize('x 2015-05-10 2015-05-15 Some text');
            expect(actual[0].type).toBe(tt.TokenType.completed);
            expect(actual[1].type).toBe(tt.TokenType.createDate);
            expect(actual[2].type).toBe(tt.TokenType.text);
        });

        it('returns priority', function(){
            var actual = tokenize('(A) Do some stuff')[0];
            expect(actual.type).toBe(tt.TokenType.priority);
            expect(actual.text).toBe('A');
        });

        it('does not consider lowercase letters a priority', function(){
            var actual = tokenize('(a) Do some stuff')[0];
            expect(actual.type).toBe(tt.TokenType.text);
        });

        it('is only a priority at the start of text', function(){
            var actual = tokenize('Do (A) some stuff')[0];
            expect(actual.type).toBe(tt.TokenType.text);
        });

        it('returns completed, createDate, priority and text', function(){
            var actual = tokenize('x 2015-05-10 2015-05-15 (A) Some text');
            expect(actual[0].type).toBe(tt.TokenType.completed);
            expect(actual[1].type).toBe(tt.TokenType.createDate);
            expect(actual[2].type).toBe(tt.TokenType.priority);
            expect(actual[3].type).toBe(tt.TokenType.text);
        });

        it('finds a project at beginning of text', function(){
            var actual = tokenize('+project do some stuff')[0];
            expect(actual.type).toBe(tt.TokenType.project);
            expect(actual.text).toBe('project');
        });

        it('finds a project at middle of text', function(){
            var actual = tokenize('do some +project stuff')[1];
            expect(actual.type).toBe(tt.TokenType.project);
            expect(actual.text).toBe('project');
        });

        it('finds a project at end of text', function(){
            var actual = tokenize('do some stuff +project')[1];
            expect(actual.type).toBe(tt.TokenType.project);
            expect(actual.text).toBe('project');
        });

        it('finds all projects in text', function(){
            var actual = tokenize('do +projectA then +projectB then +projectC');

            expect(actual[1].type).toBe(tt.TokenType.project);
            expect(actual[1].text).toBe('projectA');

            expect(actual[3].type).toBe(tt.TokenType.project);
            expect(actual[3].text).toBe('projectB');

            expect(actual[5].type).toBe(tt.TokenType.project);
            expect(actual[5].text).toBe('projectC');
        });

        it('finds a context at beginning of text', function(){
            var actual = tokenize('@context do some stuff')[0];
            expect(actual.type).toBe(tt.TokenType.context);
            expect(actual.text).toBe('context');
        });

        it('finds a context at middle of text', function(){
            var actual = tokenize('do some @context stuff')[1];
            expect(actual.type).toBe(tt.TokenType.context);
            expect(actual.text).toBe('context');
        });

        it('finds a context at end of text', function(){
            var actual = tokenize('do some stuff @context')[1];
            expect(actual.type).toBe(tt.TokenType.context);
            expect(actual.text).toBe('context');
        });

        it('finds all contexts in text', function(){
            var actual = tokenize('do @contextA then @contextB then @contextC');

            expect(actual[1].type).toBe(tt.TokenType.context);
            expect(actual[1].text).toBe('contextA');

            expect(actual[3].type).toBe(tt.TokenType.context);
            expect(actual[3].text).toBe('contextB');

            expect(actual[5].type).toBe(tt.TokenType.context);
            expect(actual[5].text).toBe('contextC');
        });

        it('returns completed, createDate, priority, project, context & text', function(){
            var actual = tokenize('x 2015-05-10 2015-05-15 (A) Some +project text in a @context');
            expect(actual[0].type).toBe(tt.TokenType.completed);
            expect(actual[1].type).toBe(tt.TokenType.createDate);
            expect(actual[2].type).toBe(tt.TokenType.priority);
            expect(actual[3].type).toBe(tt.TokenType.text);
            expect(actual[4].type).toBe(tt.TokenType.project);
            expect(actual[5].type).toBe(tt.TokenType.text);
            expect(actual[6].type).toBe(tt.TokenType.context);
        });

        it('finds metadata at start of text', function(){
            var actual = tokenize('meta:data and some stuff')[0];
            expect(actual.type).toBe(tt.TokenType.metadata);
            expect(actual.id).toBe('meta');
            expect(actual.text).toBe('data');
        });

        it('finds metadata at end of text', function(){
            var actual = tokenize('some stuff meta:data')[1];
            expect(actual.type).toBe(tt.TokenType.metadata);
            expect(actual.id).toBe('meta');
            expect(actual.text).toBe('data');
        });

        it('finds metadata at middle of text', function(){
            var actual = tokenize('some stuff meta:data some other stuff')[1];
            expect(actual.type).toBe(tt.TokenType.metadata);
            expect(actual.id).toBe('meta');
            expect(actual.text).toBe('data');
        });
    });
});