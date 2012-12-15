
function TodoManager()
{
    "use strict";
    var self = this;

    var nextId = 0;
    var data = ko.observableArray([]);

    self.all = function()
    {
        return data;
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
        var leftValue = left.index;
        var rightValue = right.index;

        // Priority
        var priorityWeight = 1000;
        if (left.priority())
        {
            leftValue += priorityWeight + Math.abs(priorityWeight - left.priority().charCodeAt(0));
        }

        if (right.priority())
        {
            rightValue += priorityWeight + Math.abs(priorityWeight - right.priority().charCodeAt(0));
        }

        // Completed
        var completedWeight = -5000;
        if (left.completed())
        {
            leftValue += completedWeight;
        }

        if (right.completed())
        {
            rightValue += completedWeight;
        }

        // return -ve if left smaller than right, +ve if right smaller than left, 0 for equal
        var result = leftValue === rightValue ? 0 : (leftValue > rightValue ? -1 : 1);
        return result;
    }

    self.removeAll = function()
    {
        data.removeAll();
        nextId = 0;
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

        newTodo.id = nextId++;
        data.push(newTodo);
        data.sort(sorter);
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

            var todo = new Todo(obj);
            todo.index = nextId++;
            data().push(todo);
        }

        data.sort(sorter);
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
