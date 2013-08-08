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
/// <reference path="../utils/datetime.ts" />
/// <reference path="../utils/events.ts" />
var TodoTxtJs;
(function (TodoTxtJs) {
    var Todo = (function () {
        function Todo(source) {
            this.index = 0;
            this._priority = null;
            this._createDate = null;
            this._completed = false;
            this._completedDate = null;
            this._contents = null;
            this._projects = [];
            this._contexts = [];
            if (source !== undefined && typeof (source) !== 'string') {
                throw "argument is not a string.";
            }

            this._text = ko.observable(source);
            this.initialiseComputedProperties();

            this.parse();
        }
        Todo.prototype.initialiseComputedProperties = function () {
            var _this = this;
            this.text = ko.computed({
                owner: this,
                read: function () {
                    return _this._text();
                },
                write: function (value) {
                    _this._text(value);
                    _this.parse();
                }
            });

            this.createdDate = ko.computed({
                owner: this,
                read: function () {
                    _this.parse();
                    return _this._createDate;
                },
                write: function (value) {
                    _this._createDate = value;
                    _this.render();
                }
            });

            this.priority = ko.computed({
                owner: this,
                read: function () {
                    _this.parse();
                    return _this._priority;
                },
                write: function (value) {
                    _this._priority = value;
                    _this.render();
                }
            });

            this.priorityScore = ko.computed({
                owner: this,
                read: function () {
                    _this.parse();
                    if (_this._priority) {
                        return _this._priority.charCodeAt(0) - 64;
                    } else {
                        return 100;
                    }
                }
            });

            this.completed = ko.computed({
                owner: this,
                read: function () {
                    _this.parse();
                    return _this._completed;
                },
                write: function (value) {
                    _this._completed = value;
                    if (_this._completed) {
                        TodoTxtJs.Events.onComplete();
                        _this._completedDate = DateTime.toISO8601Date(new Date());
                    } else {
                        _this._completedDate = undefined;
                    }

                    _this.render();
                }
            });

            this.completedDate = ko.computed({
                owner: this,
                read: function () {
                    _this.parse();
                    return _this._completedDate;
                },
                write: function (value) {
                    _this._completedDate = value;
                    _this.render();
                }
            });

            this.projects = ko.computed({
                owner: this,
                read: function () {
                    _this.parse();
                    return _this._projects;
                }
            });

            this.contexts = ko.computed({
                owner: this,
                read: function () {
                    _this.parse();
                    return _this._contexts;
                }
            });

            this.contents = ko.computed({
                owner: this,
                read: function () {
                    _this.parse();
                    return _this._contents;
                }
            });
        };

        Todo.findFlags = /**
        * Extracts all the flagged elements of a
        * @param text The text to examine
        * @param flag The flag character to search for (e.g. @ or +)
        * @return Array of lowercase matches, or undefined
        */
        function (text, flag) {
            flag = flag.replace(/[\-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            var regex = new RegExp("(?:\\W|^)" + flag + "([\\S_]+[A-Za-z0-9_](?!\\S))", 'g');
            var result = [];
            var match = regex.exec(text);
            while (match !== null) {
                result.push(match[1].toLowerCase());
                match = regex.exec(text);
            }

            return result;
        };

        /**
        * Parse text to extract Todo data.
        * @remarks This is quite a complex and hence slow method. It should only be
        *          called from computed values to ensure that the knockout framework
        *          can correctly do change detection and prevent it being called
        *          unnecessarily.
        */
        Todo.prototype.parse = function () {
            // Matches:
            // 1: Completed ( == 'x' )
            // 2: Completed Date
            // 3: Priority
            // 4: Contents
            var parsingRegex = /^(?:(x) (?:((?:19|20)[0-9]{2}[\- \/.](?:0[1-9]|1[012])[\- \/.](?:0[1-9]|[12][0-9]|3[01])) )?)?(?:(?:\(([A-Z])\)) )?(?:((?:19|20)[0-9]{2}[\- \/.](?:0[1-9]|1[012])[\- \/.](?:0[1-9]|[12][0-9]|3[01])) )?(.+)$/;

            this._priority = null;
            this._createDate = null;
            this._completed = false;
            this._completedDate = null;
            this._contents = null;
            this._projects = [];
            this._contexts = [];

            if (this._text() === undefined) {
                return;
            }

            var match = parsingRegex.exec(this._text());
            if (match !== null) {
                if (match[1] === 'x') {
                    this._completed = true;

                    if (match[2]) {
                        this._completedDate = match[2];
                    }
                }

                if (match[3]) {
                    this._priority = match[3];
                }

                if (match[4]) {
                    this._createDate = match[4];
                }

                if (match[5]) {
                    this._contents = match[5];
                }

                this._projects = Todo.findFlags(this._contents, '+');
                this._contexts = Todo.findFlags(this._contents, '@');
            }
        };

        Todo.prototype.render = function () {
            var result = '';
            if (this._completed) {
                result += 'x ';
                if (this._completedDate) {
                    result += this._completedDate + ' ';
                }
            }

            if (this._priority) {
                result += '(' + this._priority + ') ';
            }

            if (this._createDate) {
                result += this._createDate + ' ';
            }

            if (this._contents) {
                result += this._contents;
            }

            this._text(result);
        };
        return Todo;
    })();
    TodoTxtJs.Todo = Todo;
})(TodoTxtJs || (TodoTxtJs = {}));
//# sourceMappingURL=todo.js.map
