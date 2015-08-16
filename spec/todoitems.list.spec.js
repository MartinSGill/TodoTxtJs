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

describe('TodoItems.Item', function () {

    var tt = TodoTxtJs.TodoItems;

    describe('constructor', function () {
        it('constructs a valid class', function () {
            expect(new tt.List()).not.toBe(null);
        });

        it('initializes next index to 0', function () {
            var target = new tt.List();
            expect(target.nextIndex()).toBe(0);
        });

        it('initializes all items to empty array', function () {
            var target = new tt.List();
            expect(target.all()).toEqual([]);
        });
    });

    describe('adding items', function () {
        var item = new tt.Item([new tt.Token(tt.TokenType.text, 'This is some text')]);

        it('can add an item', function () {
            var target = new tt.List();
            expect(function() { target.add(item); }).not.toThrow();
        });

        it('increments next index after add', function () {
            var target = new tt.List();
            target.add(item);
            expect(target.nextIndex()).toBe(1);
        });

        it('add new item to all items', function () {
            var target = new tt.List();
            target.add(item);
            expect(target.all().length).toBe(1);
            expect(target.all()[0]).toEqual(item);
        });

        it('throws when not adding an Item object', function () {
            var target = new tt.List();
            expect(function(){ target.add('hello'); }).toThrow();
        });

        it('sets index for added item', function () {
            var target = new tt.List();
            target.add(new tt.Item(tt.Tokenizer.tokenize('This is a todo')));
            target.add(new tt.Item(tt.Tokenizer.tokenize('This is a todo')));

            expect(target.all()[0].index).toBe(0);
            expect(target.all()[1].index).toBe(1);
        });

        it('resets index for added item', function () {
            var target = new tt.List();
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a todo'));
            item.index = 55;
            target.add(item);

            expect(target.all()[0].index).toBe(0);
        });
    });

    describe('projects', function () {
        it('returns empty array for no projects', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a todo'));
            var target = new tt.List();
            target.add(item);
            expect(target.projects().length).toBe(0);
        });

        it('lists projects in items', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a +project'));
            var target = new tt.List();
            target.add(item);
            expect(target.projects().length).toBeGreaterThan(0);
        });

        it('lists correct project name in items', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a +project'));
            var target = new tt.List();
            target.add(item);
            expect(target.projects()[0]).toBe('project');
        });

        it('lists all only unique projects', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a +project'));
            var item2 = new tt.Item(tt.Tokenizer.tokenize('This is a +project'));
            var item3 = new tt.Item(tt.Tokenizer.tokenize('This is a +project'));
            var target = new tt.List();
            target.add(item);
            target.add(item2);
            target.add(item3);
            expect(target.projects().length).toBe(1);
        });

        it('lists all projects', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a +projectA'));
            var item2 = new tt.Item(tt.Tokenizer.tokenize('This is a +projectB'));
            var item3 = new tt.Item(tt.Tokenizer.tokenize('This is a +projectC'));
            var target = new tt.List();
            target.add(item);
            target.add(item2);
            target.add(item3);
            expect(target.projects()).toContain('projectA');
            expect(target.projects()).toContain('projectB');
            expect(target.projects()).toContain('projectC');
        });

        it('lists projects alphabetically', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a +project'));
            var item2 = new tt.Item(tt.Tokenizer.tokenize('This is a +aProject'));
            var target = new tt.List();
            target.add(item);
            target.add(item2);
            expect(target.projects()[0]).toBe('aProject');
            expect(target.projects()[1]).toBe('project');
        });

    });

    describe('contexts', function () {
        it('returns empty array for no contexts', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a todo'));
            var target = new tt.List();
            target.add(item);
            expect(target.contexts().length).toBe(0);
        });

        it('lists contexts in items', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a @context'));
            var target = new tt.List();
            target.add(item);
            expect(target.contexts().length).toBeGreaterThan(0);
        });

        it('lists correct context name in items', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a @context'));
            var target = new tt.List();
            target.add(item);
            expect(target.contexts()[0]).toBe('context');
        });

        it('lists all only unique contexts', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a @context'));
            var item2 = new tt.Item(tt.Tokenizer.tokenize('This is a @context'));
            var item3 = new tt.Item(tt.Tokenizer.tokenize('This is a @context'));
            var target = new tt.List();
            target.add(item);
            target.add(item2);
            target.add(item3);
            expect(target.contexts().length).toBe(1);
        });

        it('lists all contexts', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a @contextA'));
            var item2 = new tt.Item(tt.Tokenizer.tokenize('This is a @contextB'));
            var item3 = new tt.Item(tt.Tokenizer.tokenize('This is a @contextC'));
            var target = new tt.List();
            target.add(item);
            target.add(item2);
            target.add(item3);
            expect(target.contexts()).toContain('contextA');
            expect(target.contexts()).toContain('contextB');
            expect(target.contexts()).toContain('contextC');
        });

        it('lists contexts alphabetically', function () {
            var item = new tt.Item(tt.Tokenizer.tokenize('This is a @context'));
            var item2 = new tt.Item(tt.Tokenizer.tokenize('This is a @acontext'));
            var target = new tt.List();
            target.add(item);
            target.add(item2);
            expect(target.contexts()[0]).toBe('acontext');
            expect(target.contexts()[1]).toBe('context');
        });

    });
});
