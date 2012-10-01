
////////////////////////////////////////////////////////////////////////////
// Todo Helpers
////////////////////////////////////////////////////////////////////////////

var TodoHelpers = {
    extractFlagged: function(text, flag)
    {
        var regex = new RegExp("(?:\\s|^)" + flag + "(\\w+)(?=\\s|$)", 'g');
        var result = [];
        match = regex.exec(text);
        while (match !== null)
        {
            result.push(match[1].toLowerCase());
            match = regex.exec(text);
        }

        return result;
    }
};

////////////////////////////////////////////////////////////////////////////
// Todo Class
////////////////////////////////////////////////////////////////////////////

function Todo(raw)
{
    self = this;

    function buildHtml()
    {
        formattedMessage = self.message;

        var contextRegex = /\s(@)(\w+)(?=\W|$)/g;
        formattedMessage = formattedMessage.replace(contextRegex,
                 '<span class="contextFlag">$1</span><span class="context">$2</span>');


        var projectRegex = /\s(\+)(\w+)(?=\W|$)/g;
        formattedMessage = formattedMessage.replace(projectRegex,
                 '<span class="projectFlag">$1</span><span class="project">$2</span>');

        return formattedMessage;
    }

    function extractCompleted(text)
    {
        var completedRegex = /^(x )(((19|20)[0-9]{2}[\-](0[1-9]|1[012])[\-](0[1-9]|[12][0-9]|3[01])\s)?)/;
        var match = completedRegex.exec(text);
        if (match !== null)
        {
            self.completed = ko.observable(true);
            self.completedDate = ko.observable(match[2]);
            text = $.trim(text.replace(completedRegex, ''));
        }
        else
        {
            self.completed = ko.observable(false);
            self.completedDate = ko.observable("");
        }
        return text;
    }

    function extractPriority(text)
    {
        var priorityRegex = /^\(([A-Z])\)\s/;
        match = priorityRegex.exec(text);
        if (match !== null)
        {
            self.priority = match[1];
            text = $.trim(text.replace(priorityRegex, ''));
        }
        else
        {
            self.priority = null;
        }
        return text;
    }

    function extractProjects()
    {
        self.projects = TodoHelpers.extractFlagged(self.message, '\\+');
    }

    function extractContexts()
    {
        self.contexts = TodoHelpers.extractFlagged(self.message, '@');
    }


    self.toString = function()
    {
        result = "";
        if (this.completed())
        {
            result += "x ";
            result += this.completedDate() + " ";
        }

        if (this.priority != null)
        {
            result += "(" + this.priority + ") ";
        }

        result += this.message;
        return result;
    };

    workingData = raw;
    workingData = extractCompleted(workingData);
    workingData = extractPriority(workingData);

    self.raw = raw;
    self.message = workingData;
    self.formatted = buildHtml();

    extractProjects();
    extractContexts();
}

////////////////////////////////////////////////////////////////////////////
// Main View Model
////////////////////////////////////////////////////////////////////////////

function TodoTxtViewModel()
{
    var self = this;

    /************************************************
     * Inner Constructors
     ***********************************************/

    self.title = ko.observable("TodoTxtJS");
    self.version = ko.observable("0.1");

    self.allTodos = ko.observableArray([]);

    self.priorities = ko.observableArray([]);
    self.projects = ko.observableArray([]);
    self.contexts = ko.observableArray([]);

    self.showCompleted = ko.observable(true);

    self.newPriorityFilter = ko.observable();

    ////////////////////////////////////////////////////////////////////////////
    // Import / Export
    ////////////////////////////////////////////////////////////////////////////

    self.importing = new Importing(self);
    self.exporting = new Exporting(self);

    function Importing(parent)
    {
        var self = this;
        self.importingTodos = ko.observable(false);
        self.importText = ko.observable("");

        self.showImportBox = function()
        {
            parent.exporting.exportingTodos(false);
            self.importingTodos(!self.importingTodos());
        };

        self.importTodos = function()
        {
            parent.allTodos.removeAll();
            var todos = self.importText().match(/^(.+)$/mg);
            for (var i = 0; i < todos.length; i++)
            {
                parent.addTodo(new Todo(todos[i]));
            }
            self.importingTodos(false);
        };
    }

    function Exporting(parent)
    {
        var self = this;
        self.exportingTodos = ko.observable(false);
        self.exportText = ko.observable("");

        self.buildExportText = function()
        {
            var result = "";
            for (var i = 0; i < parent.allTodos().length; i++)
            {
                if (i > 0)
                {
                    result += "\n";
                }
                result += parent.allTodos()[i].toString();
            }

            return result;
        };

        self.showExportBox = function()
        {
            parent.importing.importingTodos(false);
            self.exportingTodos(!self.exportingTodos());
            if (self.exportingTodos())
            {
                self.exportText(self.buildExportText());
            }
        };
   }

    ////////////////////////////////////////////////////////////////////////////
    // Build Helper Arrays
    ////////////////////////////////////////////////////////////////////////////

    function addPriority(name)
    {
        if (!_.find(self.priorities(), function(val) { return val === name; } ))
        {
            self.priorities.push(name);
            self.priorities.sort();
        }
    }

    function addProjects(projects)
    {
        var notSeen = _.difference(projects, self.projects());
        self.projects.push(notSeen);
        self.projects.sort();
    }

    function addContexts(contexts)
    {
        var notSeen = _.difference(contexts, self.contexts());
        self.projects.push(notSeen);
        self.projects.sort();
    }


    ////////////////////////////////////////////////////////////////////////////
    // Filters
    ////////////////////////////////////////////////////////////////////////////

    self.filters = ko.observable();

    self.filtersProject = ko.computed( function ()
    {
        return TodoHelpers.extractFlagged(self.filters(), "\\+");
    });

    self.filtersContext = ko.computed( function ()
    {
        return TodoHelpers.extractFlagged(self.filters(), "@");
    });

    self.filtered = ko.computed( function()
    {
        return self.filtersProject().length > 0 ||
               self.filtersContext().length > 0;
    });


    self.toggleCompleted = function(todo)
    {
        todo.completed(!todo.completed());
        if (todo.completed())
        {
            todo.completedDate($.datepicker.formatDate('yy-mm-dd', new Date()));
        }
        else
        {
            todo.completedDate("");
        }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Display
    ////////////////////////////////////////////////////////////////////////////

    self.isDisplayed = function(todo)
    {
        if (!self.showCompleted() && todo.completed())
        {
            return false;
        }

        var result = true;
        if (self.filtered())
        {
            result = true;
            if (self.filtersProject().length > 0)
            {
                if (_.intersection(todo.projects, self.filtersProject()).length == self.filtersProject().length)
                {
                    result = result && true;
                }
                else
                {
                    result = false;
                }
            }

            if (self.filtersContext().length > 0)
            {
                if (_.intersection(todo.contexts, self.filtersContext()).length == self.filtersContext().length)
                {
                    result = result && true;
                }
                else
                {
                    result = false;
                }
            }
        }

        return result;
    };

    var sortTodos = function(todo)
    {
        var result = 0;
        if (todo.priority === null)
        {
            result += 1000;
        }
        else
        {
            result += todo.priority.charCodeAt(0);
        }

        return result;
    };

    self.displayedTodos = ko.computed( function()
    {
        var todos = [];
        for (var i = 0; i < self.allTodos().length; i++)
        {
            if (self.isDisplayed(self.allTodos()[i]))
            {
                todos.push(self.allTodos()[i]);
            }
        }

        return _.sortBy(todos, sortTodos);
    });

    ////////////////////////////////////////////////////////////////////////////
    // TODO Management
    ////////////////////////////////////////////////////////////////////////////

    self.newTodoText = ko.observable("");

    self.addNewTodo = function()
    {
        self.addTodo(new Todo(self.newTodoText()));
        self.newTodoText("");
    };

    self.addTodo = function(todo)
    {
        self.allTodos.push(todo);

        if (todo.priority !== null)
        {
            addPriority(todo.priority);
        }

        addProjects(todo.projects);
        addContexts(todo.contexts);
    };

    self.save = function()
    {
        if(typeof(Storage) !== "undefined")
        {
            localStorage.todos = self.exporting.buildExportText();
        }
        else
        {
            // Sorry! No web storage support..
        }
    };

    self.load = function()
    {
        if(typeof(Storage) !== "undefined")
        {
            if (localStorage.todos)
            {
                self.importing.importText(localStorage.todos);
                self.importing.importTodos();
            }
        }
        else
        {
            // Sorry! No web storage support..
        }
    };

    self.load();
}

var todoTxtView = new TodoTxtViewModel();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);

