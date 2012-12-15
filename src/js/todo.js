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

    self.text = ko.observable(text);
    self.index = undefined;

    // Matches:
    // 1: Completed ( == 'x' )
    // 2: Completed Date
    // 3: Priority
    // 4: Contents
    var parsingRegex = /^(?:(x) (?:((?:19|20)[0-9]{2}[\- \/.](?:0[1-9]|1[012])[\- \/.](?:0[1-9]|[12][0-9]|3[01])) )?)?(?:(?:\(([A-Z])\)) )?(.+)$/;

    // Set defaults
    var priority;
    var completed = false;
    var completedDate;
    var contents;
    var projects = [];
    var contexts = [];

    /**
     * Extracts all the flagged elements of a
     * @param text The text to examine
     * @param flag The flag character to search for (e.g. @ or +)
     * @return array of lowercase matches, or undefined
     */
    function findFlags(text, flag)
    {
        flag = flag.replace(/[\-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        var regex = new RegExp("(?:\\s|^)" + flag + "(\\w+)\\b", 'g');
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
        priority = undefined;
        completed = false;
        completedDate = undefined;
        contents = undefined;
        projects = [];
        contexts = [];

        if (self.text() === undefined)
        {
            return;
        }

        var match = parsingRegex.exec(self.text());
        if (match !== null)
        {
            if (match[1] === 'x')
            {
                completed = true;

                if (match[2])
                {
                    completedDate = match[2];
                }
            }

            if (match[3])
            {
                priority = match[3];
            }

            if (match[4])
            {
                contents = match[4];
            }

            projects = findFlags(contents, '+');
            contexts = findFlags(contents, '@');
        }
    }

    function render()
    {
        var result = '';
        if (completed)
        {
            result += 'x ';
            if (completedDate)
            {
                result += completedDate + ' ';
            }
        }

        if (priority)
        {
            result += '(' + priority + ') ';
        }

        if (contents)
        {
            result += contents;
        }

        self.text(result);
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
                return priority;
            },
            write: function(value)
            {
                priority = value;
                render();
            }
        });

    self.completed = ko.computed(
        {
            read: function()
            {
                parse();
                return completed;
            },
            write: function(value)
            {
                completed = value;
                render();
            }
        });

    self.completedDate = ko.computed(
        {
            read: function()
            {
                parse();
                return completedDate;
            },
            write: function(value)
            {
                completedDate = value;
                render();
            }
        });

    self.projects = ko.computed(
        {
            read: function()
            {
                parse();
                return projects;
            }
        });

    self.contexts = ko.computed(
        {
            read: function()
            {
                parse();
                return contexts;
            }
        });

    self.contents = ko.computed(
    {
        read: function()
        {
            parse();
            return contents;
        }
    });
}

