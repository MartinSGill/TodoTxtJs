/***************************************************************
 *
 * Todo Object
 *
 **************************************************************/

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

    function extractProjects(text)
    {
        self.projects = [];

        var regex = /(?:\s|^)\+(\w+)(?=\s|$)/g;
        match = regex.exec(self.message);
        while (match !== null)
        {
            self.projects.push(match[1].toLowerCase());
            match = regex.exec(self.message);
        }
    }

    function extractContexts(text)
    {
        self.contexts = [];

        var regex = /(?:\s|^)@(\w+)(?=\s|$)/g;
        match = regex.exec(self.message);
        while (match !== null)
        {
            self.contexts.push(match[1].toLowerCase());
            match = regex.exec(self.message);
        }
    }


    self.toString = function()
    {
        result = "";
        if (self.completed())
        {
            result += "x ";
            result += self.completedDate() + " ";
        }

        if (self.Priority !== null)
        {
            result += "(" + self.priority + ") ";
        }

        result += self.message;
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

/**************************************************************
 *
 * Main View Model
 *
 *************************************************************/

function TodoTxtViewModel()
{

    /************************************************
     * Normal Properties
     ***********************************************/

    var self = this;

    /************************************************
     * Inner Constructors
     ***********************************************/

    function Importing(parent)
    {
        var self = this;
        self.importingTodos = ko.observable(false);
        self.importText = ko.observable("");

        self.showImportBox = function()
        {
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

    /************************************************
     * Observables
     ***********************************************/

    self.importing              = new Importing(self);

    self.allTodos               = ko.observableArray([]);
    self.priorities             = ko.observableArray([]);
    self.projects               = ko.observableArray([]);
    self.contexts               = ko.observableArray([]);

    self.showCompleted          = ko.observable(true);

    self.newPriorityFilter      = ko.observable();

    /************************************************
     * Computed
     ***********************************************/

    self.isDisplayed = function(todo)
    {
        if (!self.showCompleted() && todo.completed())
        {
            return false;
        }

        return true;
    };

    /************************************************
     * Functions
     ***********************************************/

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
}

var TodoTxtView = new TodoTxtViewModel();
ko.applyBindings(TodoTxtView);

// Test Data
TodoTxtView.addTodo(new Todo("(A) This is a +project for @home"));
TodoTxtView.addTodo(new Todo("(A) This is a +project +anotherProject for @home"));
TodoTxtView.addTodo(new Todo("(A) This is a +project for @home, @email"));
TodoTxtView.addTodo(new Todo("x 2012-12-12 (A) This is a +project2 for @home"));
TodoTxtView.addTodo(new Todo("x 2012-12-12 (A) This is a +project3 for @home"));
