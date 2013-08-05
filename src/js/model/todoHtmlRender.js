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
/// <reference path="../model/todo.ts" />
var TodoTxtJs;
(function (TodoTxtJs) {
    function todoHtmlContentsRenderer(contents, options) {
        contents = ko.utils.unwrapObservable(contents);
        if (!options) {
            options = { shortUrls: false };
        }

        if (!contents) {
            return undefined;
        }

        if (contents instanceof TodoTxtJs.Todo) {
            return toHtml(contents.contents());
        }

        if (typeof (contents) !== "string") {
            throw "Contents should be a string";
        }

        return toHtml(contents);

        function toHtml(contents) {
            var formattedMessage = contents;

            if (formattedMessage) {
                // TODO: Need to find a better way of doing this.
                var contextRegex = /(?:\W|^)(@)([\S_]+[A-Za-z0-9_](?!\S))/ig;
                formattedMessage = formattedMessage.replace(contextRegex, ' <span class="todo-view-contextFlag" onclick="event.stopPropagation(); todoTxtView.addFilter(\'@$2\')">$1</span><span class="todo-view-context" onclick="event.stopPropagation(); todoTxtView.addFilter(\'@$2\')">$2</span>');

                var projectRegex = /(?:\W|^)(\+)([\S_]+[A-Za-z0-9_](?!\S))/ig;
                formattedMessage = formattedMessage.replace(projectRegex, ' <span class="todo-view-projectFlag" onclick="event.stopPropagation(); todoTxtView.addFilter(\'+$2\')">$1</span><span class="todo-view-project" onclick="event.stopPropagation(); todoTxtView.addFilter(\'+$2\')">$2</span>');

                var urlRegex = /(\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[\-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$])/ig;
                if (options.shortUrls) {
                    formattedMessage = formattedMessage.replace(urlRegex, '<a class="todo-view-link_short" href="$1" target="_blank"><abbr title="$1">Link</abbr></a>');
                } else {
                    formattedMessage = formattedMessage.replace(urlRegex, '<a class="todo-view-link_full" href="$1" target="_blank">$1</a>');
                }
            }

            return formattedMessage;
        }
    }
    TodoTxtJs.todoHtmlContentsRenderer = todoHtmlContentsRenderer;
})(TodoTxtJs || (TodoTxtJs = {}));
//@ sourceMappingURL=todoHtmlRender.js.map
