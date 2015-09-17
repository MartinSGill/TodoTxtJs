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
/// <reference path="../../src/transforms/serializers/html-serializer.ts" />

namespace TodoTxt.Transforms.Serializers.Specs
{
    import Token = Models.Token;
    import TokenType = Models.TokenType;

    describe('Models.Serializers.Html', () =>
    {
        it('correctly serializes text', () =>
        {
            var tokens = [
                new Token(TokenType.text, 'This is some text')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>This is some text</span>");
        });

        it('correctly serializes completed todo', () =>
        {
            var tokens = [
                new Token(TokenType.completed, '2015-05-15'),
                new Token(TokenType.text, 'This is some text')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo completed'>"
                + "<span class='completeDate'>2015-05-15</span>"
                + "This is some text</span>");
        });

        it('correctly serializes prioritized todo', () =>
        {
            var tokens = [
                new Token(TokenType.priority, 'B'),
                new Token(TokenType.text, 'This is some text')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "<span class='priorityBraceLeft'>(</span>"
                + "<span class='priority'>B</span>"
                + "<span class='priorityBraceRight'>)</span>"
                + "This is some text</span>");
        });

        it('correctly serializes todo with create-date', () =>
        {
            var tokens = [
                new Token(TokenType.createDate, '2015-05-15'),
                new Token(TokenType.text, 'This is some text')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "<span class='createDate'>2015-05-15</span>"
                + "This is some text</span>");
        });

        it('correctly serializes todo with all leading elements', () =>
        {
            var tokens = [
                new Token(TokenType.completed, '2015-05-15'),
                new Token(TokenType.createDate, '2015-05-14'),
                new Token(TokenType.priority, 'B'),
                new Token(TokenType.text, 'This is some text')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo completed'>"
                + "<span class='completeDate'>2015-05-15</span>"
                + "<span class='createDate'>2015-05-14</span>"
                + "<span class='priorityBraceLeft'>(</span>"
                + "<span class='priority'>B</span>"
                + "<span class='priorityBraceRight'>)</span>"
                + "This is some text</span>");
        });

        it('correctly serializes todo with a project', () =>
        {
            var tokens = [
                new Token(TokenType.text, 'This is some text'),
                new Token(TokenType.project, 'project')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "This is some text"
                + "<span class='projectSymbol'>+</span>"
                + "<span class='project'>project</span>"
                + "</span>");
        });

        it('correctly serializes todo with multiple projects', () =>
        {
            var tokens = [
                new Token(TokenType.text, 'This is'),
                new Token(TokenType.project, 'projectA'),
                new Token(TokenType.text, 'This is'),
                new Token(TokenType.project, 'projectB'),
                new Token(TokenType.text, 'This is'),
                new Token(TokenType.project, 'projectC')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "This is"
                + "<span class='projectSymbol'>+</span>"
                + "<span class='project'>projectA</span>"
                + "This is"
                + "<span class='projectSymbol'>+</span>"
                + "<span class='project'>projectB</span>"
                + "This is"
                + "<span class='projectSymbol'>+</span>"
                + "<span class='project'>projectC</span>"
                + "</span>");
        });

        it('correctly serializes todo with a context', () =>
        {
            var tokens = [
                new Token(TokenType.text, 'This is some text'),
                new Token(TokenType.context, 'context')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "This is some text"
                + "<span class='contextSymbol'>@</span>"
                + "<span class='context'>context</span>"
                + "</span>");
        });

        it('correctly serializes todo with multiple contexts', () =>
        {
            var tokens = [
                new Token(TokenType.text, 'This is'),
                new Token(TokenType.context, 'contextA'),
                new Token(TokenType.text, 'This is'),
                new Token(TokenType.context, 'contextB'),
                new Token(TokenType.text, 'This is'),
                new Token(TokenType.context, 'contextC')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "This is"
                + "<span class='contextSymbol'>@</span>"
                + "<span class='context'>contextA</span>"
                + "This is"
                + "<span class='contextSymbol'>@</span>"
                + "<span class='context'>contextB</span>"
                + "This is"
                + "<span class='contextSymbol'>@</span>"
                + "<span class='context'>contextC</span>"
                + "</span>");
        });

        it('correctly serializes todo with metadata', () =>
        {
            var tokens = [
                new Token(TokenType.text, 'This is some text'),
                new Token(TokenType.metadata, 'value', 'id')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "This is some text"
                + "<span class='metadata meta-id'>"
                + "<span class='meta-key'>id</span>"
                + "<span class='meta-value'>value</span>"
                + "</span>"
                + "</span>");
        });

        it('correctly serializes todo with multiple metadata', () =>
        {
            var tokens = [
                new Token(TokenType.text, 'This is some text'),
                new Token(TokenType.metadata, 'value', 'id'),
                new Token(TokenType.text, 'This is some text'),
                new Token(TokenType.metadata, 'value2', 'id2'),
                new Token(TokenType.text, 'This is some text'),
                new Token(TokenType.metadata, 'value3', 'id3')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "This is some text"
                + "<span class='metadata meta-id'>"
                + "<span class='meta-key'>id</span>"
                + "<span class='meta-value'>value</span>"
                + "</span>"
                + "This is some text"
                + "<span class='metadata meta-id2'>"
                + "<span class='meta-key'>id2</span>"
                + "<span class='meta-value'>value2</span>"
                + "</span>"
                + "This is some text"
                + "<span class='metadata meta-id3'>"
                + "<span class='meta-key'>id3</span>"
                + "<span class='meta-value'>value3</span>"
                + "</span>"
                + "</span>");
        });

        it('correctly serializes todo with url (http) metadata', () =>
        {
            var tokens = [
                new Token(TokenType.text, 'This is some text'),
                new Token(TokenType.metadata, '//example.com/somePage', 'http')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "This is some text"
                + "<span class='metadata meta-http'>"
                + "<a href='http://example.com/somePage'>http://example.com/somePage</a>"
                + "</span>"
                + "</span>");
        });

        it('correctly serializes todo with url (https) metadata', () =>
        {
            var tokens = [
                new Token(TokenType.text, 'This is some text'),
                new Token(TokenType.metadata, '//example.com/somePage', 'https')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "This is some text"
                + "<span class='metadata meta-https'>"
                + "<a href='https://example.com/somePage'>https://example.com/somePage</a>"
                + "</span>"
                + "</span>");
        });

        it('correctly serializes todo with url (ftp) metadata', () =>
        {
            var tokens = [
                new Token(TokenType.text, 'This is some text'),
                new Token(TokenType.metadata, '//example.com/somePage', 'ftp')
            ];
            expect(htmlSerializer(tokens)).toBe("<span class='todo'>"
                + "This is some text"
                + "<span class='metadata meta-ftp'>"
                + "<a href='ftp://example.com/somePage'>ftp://example.com/somePage</a>"
                + "</span>"
                + "</span>");
        });
    });
}