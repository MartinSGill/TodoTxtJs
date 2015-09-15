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
/// <reference path="../../src/js/model/todo/item.ts" />

namespace TodoTxtJs.TodoItems.Specs
{
    describe('TodoItems.Item', () =>
    {
        var tt = TodoTxtJs.TodoItems;

        describe('constructor', () =>
        {
            it('constructs a valid class', () =>
            {
                var tokens = [new tt.Token(tt.TokenType.text, 'This is some text')];
                expect(new tt.Item(tokens)).not.toBe(null);
            });

            it('throws if no tokens given', () =>
            {
                expect(() =>
                {
                    new tt.Item(null)
                }).toThrow();
            });

            it('initializes index to zero', () =>
            {
                var tokens = [new tt.Token(tt.TokenType.text, 'This is some text')];
                expect(new tt.Item(tokens).index).toBe(0);
            });
        });

        describe('completed', () =>
        {
            var tokensComplete = [
                new tt.Token(tt.TokenType.completed, '2015-05-01'),
                new tt.Token(tt.TokenType.text, 'This is some text')
            ];

            var tokensNotComplete = [
                new tt.Token(tt.TokenType.text, 'This is some text')
            ];

            it('correctly indicates completed todo', () =>
            {
                var target = new tt.Item(tokensComplete);
                expect(target.completed()).toBe(true);
            });

            it('correctly indicates not completed todo', () =>
            {
                var target = new tt.Item(tokensNotComplete);
                expect(target.completed()).toBe(false);
            });

            it('correctly returns complete date', () =>
            {
                var target = new tt.Item(tokensComplete);
                expect(target.completedDate()).toBe('2015-05-01');
            });

            it('correctly returns null for completed date when not complete', () =>
            {
                var target = new tt.Item(tokensNotComplete);
                expect(target.completedDate()).toBe(null);
            });
        });

        describe('priority', () =>
        {
            it('correctly returns priority', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.priority, 'A'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.priority()).toBe('A');
            });

            it('correctly returns null if no priority set', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.priority()).toBe(null);
            });
        });

        describe('create date', () =>
        {
            it('correctly returns create date', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.createDate, '2015-05-15'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.createDate()).toBe('2015-05-15');
            });

            it('correctly returns null if no create date set', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.createDate()).toBe(null);
            });
        });

        describe('projects', () =>
        {
            it('correctly returns project', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.project, 'project'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.projects().length).toBe(1);
            });

            it('correctly returns project text', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.project, 'project'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.projects()[0]).toBe('project');
            });

            it('correctly returns empty array for no projects', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.projects().length).toBe(0);
            });

            it('correctly returns multiple projects', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.project, 'projectA'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.project, 'projectB'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.project, 'projectC'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.projects().length).toBe(3);
            });

            it("correctly returns multiple projects' text", () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.project, 'projectA'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.project, 'projectB'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.project, 'projectC'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.projects()).toContain('projectA');
                expect(target.projects()).toContain('projectB');
                expect(target.projects()).toContain('projectC');
            });

        });

        describe('contexts', () =>
        {
            it('correctly returns context', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.context, 'context'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.contexts().length).toBe(1);
            });

            it('correctly returns context text', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.context, 'context'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.contexts()[0]).toBe('context');
            });

            it('correctly returns empty array for no contexts', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.contexts().length).toBe(0);
            });

            it('correctly returns multiple contexts', () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.context, 'contextA'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.context, 'contextB'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.context, 'contextC'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.contexts().length).toBe(3);
            });

            it("correctly returns multiple contexts' text", () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.context, 'contextA'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.context, 'contextB'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.context, 'contextC'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.contexts()).toContain('contextA');
                expect(target.contexts()).toContain('contextB');
                expect(target.contexts()).toContain('contextC');
            });

        });

        describe('metadata', () =>
        {
            it("correctly returns multiple metadata entries", () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Metadata.GenericMetadata('metadataA', 'A'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Metadata.GenericMetadata('metadataB', 'B'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Metadata.GenericMetadata('metadataC', 'C'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.metadata().length).toBe(3);
            });

            it("correctly returns empty array for no metadata entries", () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.metadata().length).toBe(0);
            });

            it("correctly returns metadata value", () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Metadata.GenericMetadata('metadataA', 'A'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Metadata.GenericMetadata('metadataB', 'B'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Metadata.GenericMetadata('metadataC', 'C'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.metadataValue('metadataB')).toBe('B');
            });

            it("correctly returns first metadata value found", () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Metadata.GenericMetadata('metadataA', 'A'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Metadata.GenericMetadata('metadataA', 'B'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Metadata.GenericMetadata('metadataA', 'C'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.metadataValue('metadataA')).toBe('A');
            });

            it("correctly returns null for no metadata value", () =>
            {
                var tokens = [
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.text, 'This is some text'),
                    new tt.Token(tt.TokenType.text, 'This is some text')
                ];
                var target = new tt.Item(tokens);
                expect(target.metadataValue('bob')).toBe(null);
            });
        });
    });
}