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

    function MenuEntry(name, checked)
    {
        var self = this;
        self.name = ko.observable(name);
        self.checked = ko.observable(checked);
    }

    function compareMenuEntry(left, right)
    {
        return left.name() == right.name() ? 0 : (left.name() < right.name() ? -1 : 1);
    }

    /************************************************
     * Observables
     ***********************************************/

    self.importing              = new Importing(self);

    self.allTodos               = ko.observableArray([]);
    self.priorities             = ko.observableArray([]);
    self.projects               = ko.observableArray([]);
    self.contexts               = ko.observableArray([]);

    self.displayCompleted       = ko.observable(true);
    self.displayEverythingElse  = ko.observable(true);

    /************************************************
     * Computed
     ***********************************************/

    self.showingAll = ko.computed(function()
        {
            if (!self.displayCompleted()) { return false; }
            if (_.find(self.priorities(), function(o) { return !o.checked(); } ) !== undefined) { return false; }
            if (_.find(self.projects(), function(o) { return !o.checked(); } ) !== undefined) { return false; }
            if (_.find(self.contexts(), function(o) { return !o.checked(); } ) !== undefined) { return false; }
            if (!self.displayEverythingElse) { return false; }

            return true;
        });

    function isDisplayed(name, menuEntryarray)
    {
        var found = _.find(menuEntryarray, function(o) { return o.name() === name; });
        if (found !== undefined)
        {
            return found.checked();
        }
        return false;
    }

    self.todos = ko.computed(function()
        {
            var result = [];
            for (var i = 0; i < self.allTodos().length; i++)
            {
                var todo = self.allTodos()[i];
                var display = self.displayEverythingElse();

                var subMenuDisplay = false;
                for (var k = 0; k < todo.projects.length; k++)
                {
                    subMenuDisplay = subMenuDisplay || isDisplayed(todo.projects[k], self.projects() );
                }
                display = display && subMenuDisplay;

                subMenuDisplay = false;
                for (var l = 0; l < todo.contexts.length; l++)
                {
                    subMenuDisplay = subMenuDisplay || isDisplayed(todo.contexts[l], self.contexts() );
                }
                display = display && subMenuDisplay;

                display = display && isDisplayed(todo.priority, self.priorities());

                if (todo.completed())
                {
                    display = display && self.displayCompleted();
                }

                if (display)
                {
                    result.push(todo);
                }
            }

            return result;
        })
        // using throttle otherwise computed get's confused when
        // showAllToggle is triggered.
        // this ensures all updates are made, before triggering
        // a recompute.
        .extend({throttle: 1});

    self.todoExport = ko.computed( function()
        {
            var result = [];
            for (var i = 0; i < self.allTodos().length; i++)
            {
                result.push( self.allTodos().toString() );
            }
        });


    /************************************************
     * Functions
     ***********************************************/

    function addPriority(name)
    {
        if (_.find(self.priorities(), function(menuEntry) { return menuEntry.name() === name; }) === undefined )
        {
            self.priorities.push(new MenuEntry(name, true));
            self.priorities.sort(compareMenuEntry);
        }
    }

    function addProjects(projects)
    {
        for (var i = 0; i < projects.length; i++)
        {
            var name = projects[i];
            if (_.find(self.projects(), function (menuEntry) { return menuEntry.name() === name; }) === undefined )
            {
                self.projects.push(new MenuEntry(name, true));
            }
        }

        self.projects.sort(compareMenuEntry);
    }

    function addContexts(contexts)
    {
        for (var i = 0; i < contexts.length; i++)
        {
            var name = contexts[i];
            if (_.find(self.contexts(), function (menuEntry) { return menuEntry.name() === name; }) === undefined )
            {
                self.contexts.push(new MenuEntry(name, true));
            }
        }

        self.contexts.sort(compareMenuEntry);
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

    self.showAllToggle = function()
    {
        var newSetting = !self.showingAll();

        self.displayCompleted(newSetting);
        _.each(self.priorities(), function(o) { o.checked(newSetting); });
        _.each(self.projects(), function(o) { o.checked(newSetting); });
        _.each(self.contexts(), function(o) { o.checked(newSetting); });
        self.displayEverythingElse(newSetting);
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

    self.toggleMenuItem = function(data)
    {
        data.checked( !data.checked() );
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
