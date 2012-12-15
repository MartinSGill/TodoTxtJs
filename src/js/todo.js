/*
 * Copyright (c) 2012. Martin Gill. All Rights Reserved.
 */

function Todo(text)
{
    "use strict";
    var self = this;

    if (text !== undefined && typeof(text) !== 'string')
    {
        throw "argument is not a string.";
    }

    var _text = ko.observable(text);
    parse();

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

    self.index = undefined;

    // Set defaults
    var _priority;
    var _completed = false;
    var _completedDate;
    var _contents;
    var _projects = [];
    var _contexts = [];

    /**
     * Extracts all the flagged elements of a
     * @param text The text to examine
     * @param flag The flag character to search for (e.g. @ or +)
     * @return Array of lowercase matches, or undefined
     */
    function findFlags(text, flag)
    {
        flag = flag.replace(/[\-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        var regex = new RegExp("(?:\\W|^)" + flag + "(\\w+)\\b", 'g');
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
        var parsingRegex = /^(?:(x) (?:((?:19|20)[0-9]{2}[\- \/.](?:0[1-9]|1[012])[\- \/.](?:0[1-9]|[12][0-9]|3[01])) )?)?(?:(?:\(([A-Z])\)) )?(.+)$/;

        _priority = undefined;
        _completed = false;
        _completedDate = undefined;
        _contents = undefined;
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
                _contents = match[4];
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
                return undefined;
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
                    _completedDate = $.datepicker.formatDate("yy-mm-dd", new Date());
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
}

