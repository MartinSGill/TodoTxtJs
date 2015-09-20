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

/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../utils/logging.ts" />
/// <reference path="../models/list.ts" />

namespace TodoTxt.Services
{
    import Item = TodoTxt.Models.Item;
    export class ListService implements ng.IServiceProvider
    {
        $get: any;
        private items: Models.List;

        constructor(...args: any[])
        {
            log.debug("init", 'ListService');
            this.items = new TodoTxt.Models.List();
            this.debugEntries();
        }

        private debugEntries()
        {
            var items = [
                'These are test cases for almost all features. Including some that have proved troublesome.',
                '(A) Priority A',
                '(B) Priority B',
                '(C) Priority C',
                '(D) Priority D',
                '(E) Priority E',
                '(F) Priority Other',
                'A simple todotxt file for testing TodoTxtJs features',
                'A todo with @context',
                'A todo with +project',
                'A todo with different case @Context',
                'A todo with different case +Project',
                '(A) Priority A due:today',
                '(B) Priority B due:today',
                '(C) Priority C due:today',
                '2013-01-01 Todo with create date',
                'Todo with due date: due:2013-01-01',
                'Todo due Tomorrow: due:tomorrow',
                'Todo due Today: due:today',
                'Single character meta-data a:b as an example',
                'Todo due Yesterday: due:yesterday',
                'Todo due Monday: due:monday',
                'Todo due Sunday: due:wed',
                'Todo with metadata meta:data key:value',
                'Todo with funky metadata v:1.2.3',
                'Todo URL http://example.com/hello/there/world',
                '2013-01-01 A todo with @every-thing +kitchen-sink http://example.com/hello/there/world due:2013-01-01',
                'x 2013-01-01 2013-01-01 A todo with @every-thing +kitchen-sink http://example.com/hello/there/world due:2013-01-01',
                'x 2013-01-01 (E) Completed todo',
                't�m� on todo @kyn�ll�',
                't�m� on toinen todo +p�iv�ll�',
                't�m� on kolmas todo @y�ll�'
            ];
            items.forEach((item) => { this.add(item); })
        }

        public all() : Models.Item[]
        {
            return this.items.all();
        }

        public add(text: string) : void
        {
            this.items.add(Item.parseString(text));
        }
    }
}