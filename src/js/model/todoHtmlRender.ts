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
/// <reference path="../lib/knockout.d.ts" />
/// <reference path="../utils/datetime.ts" />
/// <reference path="../utils/events.ts" />
/// <reference path="../model/todo.ts" />

module TodoTxtJs
{
    export class ContentRenderOptions
    {
        public shortUrls: boolean = true;
    }

    export class ContentRender
    {
        //constructor() { throw "Static: Cannot new this class"; }

        public static render(contents: string, options: ContentRenderOptions): string
        public static render(contents: Todo, options: ContentRenderOptions): string
        public static render(contents: any, options: ContentRenderOptions): string
        {
            contents = ko.utils.unwrapObservable(contents);

            if (!options || !(options instanceof ContentRenderOptions))
            {
                throw "ContentRenderOptions required.";
            }

            if (!contents)
            {
                return "";
            }
            else if (contents instanceof Todo)
            {
                return ContentRender._toHtml(contents.contents(), options);
            }
            else if (typeof (contents) !== "string")
            {
                throw "Contents should be a string";
            }

            return ContentRender._toHtml(contents, options);
        }

        private static _renderContexts(contents: string): string
        {
            var formattedMessage = contents;
            var contextRegex = /(?:\W|^)(@)([\S_]+[A-Za-z0-9_](?!\S))/ig;

            var replacement = "";
            replacement += ' <span class="todo-view-contextFlag" onclick="event.stopPropagation(); todoTxtView.addFilter(\'@$2\')">$1</span>';
            replacement += '<span class="todo-view-context" onclick="event.stopPropagation(); todoTxtView.addFilter(\'@$2\')">$2</span>';

            formattedMessage = formattedMessage.replace(contextRegex, replacement);
            return formattedMessage;
        }

        private static _renderProjects(contents: string): string
        {
            var formattedMessage = contents;
            var projectRegex = /(?:\W|^)(\+)([\S_]+[A-Za-z0-9_](?!\S))/ig;

            var replacement = "";
            replacement += ' <span class="todo-view-projectFlag" onclick="event.stopPropagation(); todoTxtView.addFilter(\'+$2\')">$1</span>';
            replacement += '<span class="todo-view-project" onclick="event.stopPropagation(); todoTxtView.addFilter(\'+$2\')">$2</span>';

            formattedMessage = formattedMessage.replace(projectRegex, replacement);
            return formattedMessage;

        }

        private static _renderUrls(contents: string, options: ContentRenderOptions): string
        {
            var formattedMessage = contents;
            var urlRegex = /(\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[\-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$])/ig;
            if (options.shortUrls)
            {
                formattedMessage = formattedMessage.replace(urlRegex, '<a class="todo-view-link_short" href="$1" target="_blank"><abbr title="$1">Link</abbr></a>');
            }
            else
            {
                formattedMessage = formattedMessage.replace(urlRegex, '<a class="todo-view-link_full" href="$1" target="_blank">$1</a>');
            }
            return formattedMessage;
        }

        private static _dueDateDistanceStyle(dueDate: Date): string
        {
            var distance = DateTime.distance(dueDate);
            if (distance <= 0)
            {
                return "todo-due-date_past";
            }
            else if (distance < 3)
            {
                return "todo-due-date_near";
            }
            else
            {
                return "todo-due-date_far";
            }
        }

        private static _renderDueDate(contents: string): string
        {
            var formattedMessage = contents;
            var dueDateRegex = /(due):((?:19|20)[0-9]{2}-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01]))/ig;
            // Presumes there will only ever be one due date in a todo entry
            var match = dueDateRegex.exec(formattedMessage);
            var date: Date = null;
            if (match)
            {
                date = new Date(match[2]);

                var replacement = "";
                replacement += '<span class="todo-metadata todo-due-date ' + ContentRender._dueDateDistanceStyle(date) + '">';
                replacement += '  <span class="todo-metadata-name">$1</span>';
                replacement += '  <span class="todo-metadata-seperator">:</span>';
                replacement += '  <span class="todo-metadata-value">' + DateTime.dateToInformalString(date) + '</span>';
                replacement += '</span>';

                formattedMessage = formattedMessage.replace(dueDateRegex, replacement);
            }

            return formattedMessage;
        }

        private static _renderMetadata(contents: string): string
        {
            var formattedMessage = contents;
            var metadataRegex = /(?:\W|^)([A-Za-z_-][\w\-]+):([\w\-]+)(?=\s|$)/g;

            var replacement = "";
            replacement += '<span class="todo-metadata">';
            replacement += '  <span class="todo-metadata-name">$1</span>';
            replacement += '  <span class="todo-metadata-seperator">:</span>';
            replacement += '  <span class="todo-metadata-value">$2</span>';
            replacement += '</span>';

            formattedMessage = formattedMessage.replace(metadataRegex, replacement);

            return formattedMessage;
        }

        private static _toHtml(contents: string, options: ContentRenderOptions)
        {
            var formattedMessage = contents;

            if (formattedMessage)
            {
                formattedMessage = ContentRender._renderContexts(formattedMessage);
                formattedMessage = ContentRender._renderProjects(formattedMessage);
                formattedMessage = ContentRender._renderUrls(formattedMessage, options);
                formattedMessage = ContentRender._renderDueDate(formattedMessage);
                formattedMessage = ContentRender._renderMetadata(formattedMessage);
            }

            return formattedMessage;
        }
    }
}
