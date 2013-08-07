/*******************************************************************************
 * Copyright (C) 2013 Martin Gill
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

/// <reference path="../defs/knockout.d.ts" />
/// <reference path="../model/todomanager.ts" />

module TodoTxtJs.View
{
    export class Exporting
    {
        public exportText: KnockoutObservable<string>;

        private _todoManager:TodoManager;

        constructor(todoManager:TodoManager)
        {
            this.exportText = ko.observable<string>("");
            this._todoManager = todoManager;
        }

        public buildExportText() : string
        {
            var todos : string[] = this._todoManager.exportToStringArray();
            return todos.join("\n");
        }

        public fillExportBox() : void
        {
            this.exportText(this.buildExportText());
        }

        public download() : void
        {
            var data = "data:text;charset=utf-8,";
            data += encodeURI(this.exportText());

            window.location.href = data;
        }
    }
}
