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
/// <reference path="../../src/models/metadata/url.ts" />

namespace TodoTxt.Models.Metadata.Specs
{
    describe('Models.Metadata', () =>
    {
        describe('Url', () =>
        {
            it('constructs a correct url object', () =>
            {
                expect(new Url('http', '//www.example.com')).not.toBe(null);
            });

            it('throws for an incorrect sub type', () =>
            {
                expect(() =>
                {
                    new Url('due', '20150515');
                }).toThrow()
            });

            it('throws for an incorrect url value', () =>
            {
                expect(() =>
                {
                    new Url('http', '2015-05-15');
                }).toThrow()
            });

            it('recognises https', () =>
            {
                expect(new Url('https', '//www.example.com')).not.toBe(null);
            });

            it('recognises telnet', () =>
            {
                expect(new Url('telnet', '//www.example.com')).not.toBe(null);
            });

            it('recognises parametrised URLs', () =>
            {
                expect(new Url('http', '//www.example.com/index.html?param=value&param2=value2')).not.toBe(null);
            });
        });
    });
}