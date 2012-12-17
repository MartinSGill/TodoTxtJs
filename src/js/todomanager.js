
function TodoManager()
{
    "use strict";
    var self = this;

    var nextIndex = 0;
    var data = ko.observableArray([]);

    self.all = function()
    {
        return data().sort(sorter);
    };

    self.allProjects = function()
    {
        var hash = {};
        for (var i = 0; i < data().length; i++)
        {
            var projects = data()[i].projects();
            for (var j = 0; j < projects.length; j++)
            {
                hash[projects[j]] = true;
            }
        }

        var result = [];
        for(var name in hash)
        {
            if (hash.hasOwnProperty(name))
            {
                result.push(name);
            }
        }

        return result;
    };

    self.allContexts = function()
    {
        var hash = {};
        for (var i = 0; i < data().length; i++)
        {
            var contexts = data()[i].contexts();
            for (var j = 0; j < contexts.length; j++)
            {
                hash[contexts[j]] = true;
            }
        }

        var result = [];
        for(var name in hash)
        {
            if (hash.hasOwnProperty(name))
            {
                result.push(name);
            }
        }

        return result;
    };

    function sorter(left, right)
    {
        if (left.completed() !== right.completed())
        {
            if (left.completed() && !right.completed())
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }

        if (left.priorityScore() !== right.priorityScore())
        {
            return left.priorityScore() < right.priorityScore() ? -1 : 1;
        }

        // Run out of significant values so use file order.
        return left.index < right.index ? -1 : 1;
    }

    self.removeAll = function()
    {
        data.removeAll();
        nextIndex = 0;
    };

    self.add = function(newTodo)
    {
        if (typeof(newTodo) === 'string')
        {
            newTodo = new Todo(newTodo);
        }

        if (!newTodo instanceof Todo)
        {
            throw "Argument is invalid. Must be Todo or string";
        }

        newTodo.index = nextIndex++;

        data.push(newTodo);
    };

    self.loadFromStringArray = function(newData)
    {
        if (!newData instanceof Array)
        {
            throw "Argument isn't an array.";
        }

        self.removeAll();
        for (var i = 0; i < newData.length; i++)
        {
            var obj = newData[i];
            if (!obj instanceof String)
            {
                throw "Argument elements are not strings";
            }

            self.add(obj);
        }
    };

    self.exportToStringArray = function()
    {
        var sorted = ko.observableArray(data());
        sorted.sort(function(left, right) { return left.index - right.index; });

        var result = [];
        for (var i = 0; i < sorted().length; i++)
        {
            result.push(sorted()[i].text());
        }

        return result;
    };
}
