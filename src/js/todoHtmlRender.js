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

function todoHtmlContentsRenderer(contents)
{
    "use strict";

    contents = ko.utils.unwrapObservable(contents);

    if (!contents)
    {
        return undefined;
    }

    if (contents instanceof Todo)
    {
        return toHtml(contents.contents());
    }

    if (typeof(contents) !== "string")
    {
        throw "Contents should be a string";
    }

    return toHtml(contents);

    function toHtml(contents)
    {
        var formattedMessage = contents;

        if (formattedMessage)
        {
            // TODO: Need to find a better way of doing this.
            var contextRegex = /(?:\s|^)(@)(\w+)(?=\W|$)/g;
            formattedMessage = formattedMessage.replace(contextRegex,
                                                        '<span class="contextFlag" onclick="event.stopPropagation(); todoTxtView.addFilter(\'@$2\')">$1</span><span class="context" onclick="event.stopPropagation(); todoTxtView.addFilter(\'@$2\')">$2</span>');

            var projectRegex = /(?:\s|^)(\+)(\w+)(?=\W|$)/g;
            formattedMessage = formattedMessage.replace(projectRegex,
                                                        '<span class="projectFlag" onclick="event.stopPropagation(); todoTxtView.addFilter(\'+$2\')">$1</span><span class="project" onclick="event.stopPropagation(); todoTxtView.addFilter(\'+$2\')">$2</span>');

            var urlRegex = /(\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[\-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$])/ig;
            formattedMessage = formattedMessage.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
        }

        return formattedMessage;
    }
}
