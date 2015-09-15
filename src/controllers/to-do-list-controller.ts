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

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../directives/to-do-list.ts" />
/// <reference path="../models/list-item.ts" />

namespace TodoTxt.Controllers
{
    export class ToDoListController {
        name: string;
        listItems: Models.ListItem[];

        newItemName: string;

        static $inject = [
            "$scope"
        ];
        constructor(isolateScope: Directives.IToDoListScope) {
            this.name = isolateScope.name;
            this.listItems = [];
        }

        save() {
            if (this.newItemName && this.newItemName.length > 0) {
                var newItem = new Models.ListItem(this.newItemName);
                this.listItems.push(newItem);

                this.newItemName = null;
            }
        }

        toggle(listItem: Models.ListItem): boolean {
            listItem.isComplete = !listItem.isComplete;
            return listItem.isComplete;
        }
    }
}