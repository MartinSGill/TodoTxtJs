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
/// <reference path="../../src/transforms/Serializers/StringSerializer.ts" />

namespace TodoTxtJs.TodoItems.Serializers.Specs
{
    describe('TodoItems.Serializers.String', () =>
    {
        var token = TodoTxtJs.TodoItems.Token;
        var tt = TodoTxtJs.TodoItems.TokenType;
        var s = TodoTxtJs.TodoItems.Serializers;

        it('correctly serializes text', () =>
        {
            var tokens = [
                new token(tt.text, 'This is some text')
            ];
            expect(s.stringSerializer(tokens)).toBe('This is some text');
        });

        it('correctly serializes completed todo', () =>
        {
            var tokens = [
                new token(tt.completed, '2015-05-15'),
                new token(tt.text, 'This is some text')
            ];
            expect(s.stringSerializer(tokens)).toBe('x 2015-05-15 This is some text');
        });

        it('correctly serializes prioritized todo', () =>
        {
            var tokens = [
                new token(tt.priority, 'B'),
                new token(tt.text, 'This is some text')
            ];
            expect(s.stringSerializer(tokens)).toBe('(B) This is some text');
        });

        it('correctly serializes todo with create-date', () =>
        {
            var tokens = [
                new token(tt.createDate, '2015-05-15'),
                new token(tt.text, 'This is some text')
            ];
            expect(s.stringSerializer(tokens)).toBe('2015-05-15 This is some text');
        });

        it('correctly serializes todo with all leading elements', () =>
        {
            var tokens = [
                new token(tt.completed, '2015-05-15'),
                new token(tt.createDate, '2015-05-14'),
                new token(tt.priority, 'B'),
                new token(tt.text, 'This is some text')
            ];
            expect(s.stringSerializer(tokens)).toBe('x 2015-05-15 2015-05-14 (B) This is some text');
        });

        it('correctly serializes todo with a project', () =>
        {
            var tokens = [
                new token(tt.text, 'This is some text'),
                new token(tt.project, 'project')
            ];
            expect(s.stringSerializer(tokens)).toBe('This is some text +project');
        });

        it('correctly serializes todo with multiple projects', () =>
        {
            var tokens = [
                new token(tt.text, 'This is'),
                new token(tt.project, 'projectA'),
                new token(tt.text, 'This is'),
                new token(tt.project, 'projectB'),
                new token(tt.text, 'This is'),
                new token(tt.project, 'projectC')
            ];
            expect(s.stringSerializer(tokens)).toBe('This is +projectA This is +projectB This is +projectC');
        });

        it('correctly serializes todo with a context', () =>
        {
            var tokens = [
                new token(tt.text, 'This is some text'),
                new token(tt.context, 'context')
            ];
            expect(s.stringSerializer(tokens)).toBe('This is some text @context');
        });

        it('correctly serializes todo with multiple contexts', () =>
        {
            var tokens = [
                new token(tt.text, 'This is'),
                new token(tt.context, 'contextA'),
                new token(tt.text, 'This is'),
                new token(tt.context, 'contextB'),
                new token(tt.text, 'This is'),
                new token(tt.context, 'contextC')
            ];
            expect(s.stringSerializer(tokens)).toBe('This is @contextA This is @contextB This is @contextC');
        });

        it('correctly serializes todo with metadata', () =>
        {
            var tokens = [
                new token(tt.text, 'This is some text'),
                new token(tt.metadata, 'value', 'id')
            ];
            expect(s.stringSerializer(tokens)).toBe('This is some text id:value');
        });

        it('correctly serializes todo with multiple metadata', () =>
        {
            var tokens = [
                new token(tt.text, 'This is some text'),
                new token(tt.metadata, 'value', 'id'),
                new token(tt.text, 'This is some text'),
                new token(tt.metadata, 'value2', 'id2'),
                new token(tt.text, 'This is some text'),
                new token(tt.metadata, 'value3', 'id3')
            ];
            expect(s.stringSerializer(tokens)).toBe('This is some text id:value This is some text id2:value2 This is some text id3:value3');
        });

        it('correctly serializes todo with url metadata', () =>
        {
            var tokens = [
                new token(tt.text, 'This is some text'),
                new token(tt.metadata, '//example.com/somePage', 'http')
            ];
            expect(s.stringSerializer(tokens)).toBe('This is some text http://example.com/somePage');
        });
    });
}