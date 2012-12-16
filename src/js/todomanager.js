
function TodoManager()
{
    "use strict";
    var self = this;

    var nextIndex = 0;
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
        // Order by "score" from highest to lowest.
        // Default order:
        // Completed -> Priority -> index

        var leftScore = 0;
        var rightScore = 0;

        // Completed
        var completedWeight = -5000;
        if (left.completed())
        {
            leftScore += completedWeight;
        }
        if (right.completed())
        {
            rightScore += completedWeight;
        }

        // Priority
        var priorityWeight = 1000;
        if (left.priority())
        {
            leftScore += priorityWeight + Math.abs(priorityWeight - left.priority().charCodeAt(0));
        }

        if (right.priority())
        {
            rightScore += priorityWeight + Math.abs(priorityWeight - right.priority().charCodeAt(0));
        }

        // The lower the index (i.e. the earlier in the file) the higher the score has to be.
        leftScore += nextIndex - left.index;
        rightScore += nextIndex - right.index;

        return leftScore === rightScore ? 0 : (leftScore > rightScore ? -1 : 1);
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
            todo.index = nextIndex++;
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
