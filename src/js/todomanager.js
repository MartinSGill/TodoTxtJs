
function TodoManager()
{
    "use strict";
    var self = this;

    var nextId = 0;
    var data = ko.observableArray([]);

    self.all = function()
    {
        return data();
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
        // return -ve if left smaller than right, 0 for equal
        var leftValue = left.id;
        var rightValue = right.id;

        // Priority
        if (left.priority())
        {
            leftValue += left.priority().charCodeAt(0);
        }

        if (right.priority())
        {
            rightValue += right.priority().charCodeAt(0);
        }

        // Completed
        if (left.completed())
        {
            leftValue -= 1000;
        }

        if (right.completed())
        {
            rightValue -= 1000;
        }

        return leftValue - rightValue;
    }

    self.removeAll = function()
    {
        data.removeAll();
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
    }

    self.loadFromStringArray = function(newData)
    {
        if (!newData instanceof Array)
        {
            throw "Argument isn't an array.";
        }

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
}
