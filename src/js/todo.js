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

function Todo(text)
{
    "use strict";
    var self = this;

    if (text !== undefined && typeof(text) !== 'string')
    {
        throw "argument is not a string.";
    }

    // Set defaults
    var _priority = null;
    var _createDate = null;
    var _completed = false;
    var _completedDate = null;
    var _contents = null;
    var _projects = [];
    var _contexts = [];
    var _text = ko.observable(text);
    self.index = 0;

    self.text = ko.computed(
        {
            read: function()
            {
                return _text();
            },
            write: function(value)
            {
                _text(value);
                parse();
            }
        }
    );


    /**
     * Extracts all the flagged elements of a
     * @param text The text to examine
     * @param flag The flag character to search for (e.g. @ or +)
     * @return Array of lowercase matches, or undefined
     */
    function findFlags(text, flag)
    {
        flag = flag.replace(/[\-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        var regex = new RegExp("(?:\\W|^)" + flag + "([\\S_]+[A-Za-z0-9_](?!\\S))", 'g');
        var result = [];
        var match = regex.exec(text);
        while (match !== null)
        {
            result.push(match[1].toLowerCase());
            match = regex.exec(text);
        }

        return result;
    }

    /**
     * Parse text to extract Todo data.
     */
    function parse()
    {
        // Matches:
        // 1: Completed ( == 'x' )
        // 2: Completed Date
        // 3: Priority
        // 4: Contents
        var parsingRegex = /^(?:(x) (?:((?:19|20)[0-9]{2}[\- \/.](?:0[1-9]|1[012])[\- \/.](?:0[1-9]|[12][0-9]|3[01])) )?)?(?:(?:\(([A-Z])\)) )?(?:((?:19|20)[0-9]{2}[\- \/.](?:0[1-9]|1[012])[\- \/.](?:0[1-9]|[12][0-9]|3[01])) )?(.+)$/;

        _priority = null;
        _createDate = null;
        _completed = false;
        _completedDate = null;
        _contents = null;
        _projects = [];
        _contexts = [];

        if (_text() === undefined)
        {
            return;
        }

        var match = parsingRegex.exec(_text());
        if (match !== null)
        {
            if (match[1] === 'x')
            {
                _completed = true;

                if (match[2])
                {
                    _completedDate = match[2];
                }
            }

            if (match[3])
            {
                _priority = match[3];
            }

            if (match[4])
            {
                _createDate = match[4];
            }

            if (match[5])
            {
                _contents = match[5];
            }

            _projects = findFlags(_contents, '+');
            _contexts = findFlags(_contents, '@');
        }
    }

    function render()
    {
        var result = '';
        if (_completed)
        {
            result += 'x ';
            if (_completedDate)
            {
                result += _completedDate + ' ';
            }
        }

        if (_priority)
        {
            result += '(' + _priority + ') ';
        }

        if (_createDate)
        {
            result += _createDate + ' ';
        }

        if (_contents)
        {
            result += _contents;
        }

        _text(result);
    }

    self.createdDate = ko.computed(
        {
            read: function()
            {
                parse();
                return _createDate;
            },
            write: function(value)
            {
                _createDate = value;
                render();
            }
        });

    self.priority = ko.computed(
        {
            read: function()
            {
                parse();
                return _priority;
            },
            write: function(value)
            {
                _priority = value;
                render();
            }
        });

    self.priorityScore = ko.computed(
        {
            read: function()
            {
                parse();
                if (_priority)
                {
                    return _priority.charCodeAt(0) - 64;
                }
                else
                {
                    return 100;
                }
            }
        });

    self.completed = ko.computed(
        {
            read: function()
            {
                parse();
                return _completed;
            },
            write: function(value)
            {
                _completed = value;
                if (_completed)
                {
                    _completedDate = toISO8601Date(new Date());
                }
                else
                {
                    _completedDate = undefined;
                }

                render();
            }
        });

    self.completedDate = ko.computed(
        {
            read: function()
            {
                parse();
                return _completedDate;
            },
            write: function(value)
            {
                _completedDate = value;
                render();
            }
        });

    self.projects = ko.computed(
        {
            read: function()
            {
                parse();
                return _projects;
            }
        });

    self.contexts = ko.computed(
        {
            read: function()
            {
                parse();
                return _contexts;
            }
        });

    self.contents = ko.computed(
    {
        read: function()
        {
            parse();
            return _contents;
        }
    });

    parse();
}

