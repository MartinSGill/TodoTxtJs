////////////////////////////////////////////////////////////////////////////
// Main View Model
////////////////////////////////////////////////////////////////////////////

function TodoTxtViewModel()
{
    var self = this;
    var apiPath = document.location.pathname.replace('todotxt.html', '');

    var todoManager = new TodoManager();

    /************************************************
     * Inner Constructors
     ***********************************************/

    self.title = ko.observable("TodoTxt WebApp");
    self.version = ko.observable("0.8");

    self.allTodos = ko.computed(function() { return todoManager.all(); } );

    self.priorities = ko.observableArray([]);
    self.projects = ko.computed(function() { return todoManager.allProjects(); } );
    self.contexts = ko.computed(function() { return todoManager.allContexts(); } );

    self.showCompleted = ko.observable(false);

    self.newPriorityFilter = ko.observable(undefined);

    ////////////////////////////////////////////////////////////////////////////
    // Options
    ////////////////////////////////////////////////////////////////////////////

    function Options()
    {
        var self = this;

        var storageConstants = {
            browser:"browser"//,
            //server:"server",
            //dropbox:"dropbox"
        };

        ///////////////////////////
        // Options
        ///////////////////////////

        self.storageOptions = ko.observableArray([
            { name:storageConstants.browser, tip:"Store in browser LocalStorage. (This means your Todos are saved on your own computer.)" }//,
            //{ name:storageConstants.server, tip:"Store data on the server."}
        ]
        );
        self.storageInfo = ko.observable(self.storageOptions()[0]);
        self.storage = ko.computed(function ()
        {
            return self.storageInfo().name;
        });

        self.themes = ko.observableArray([
                                                  { name: "Simple", source: "css/simple.css", info:"light and rounded/simple theme." },
                                                  { name: "Blocky", source: "css/blocky.css", info: "darker blockier theme." }
                                              ]);

        self.theme = ko.observable();

        ///////////////////////////
        // Control
        ///////////////////////////
        self.showStorageControls = ko.computed(function ()
        {
            return self.storage() === storageConstants.server;
        });
        self.showImport = ko.computed(function ()
        {
            return self.storage() === storageConstants.browser;
        });
        self.showExport = ko.computed(function ()
        {
            return self.storage() === storageConstants.browser;
        });

        self.save = function ()
        {
            localStorage.TodoTxtJsOptions = ko.toJSON(self);
        };

        self.load = function ()
        {
            if (localStorage.TodoTxtJsOptions)
            {
                var options = JSON.parse(localStorage.TodoTxtJsOptions);
                if (options.hasOwnProperty("storage"))
                {
                    for (var i = 0; i < self.storageOptions().length; i++)
                    {
                        if (self.storageOptions()[i].name === options.storage)
                        {
                            self.storageInfo(self.storageOptions()[i]);
                            break;
                        }
                    }
                }

                if (options.hasOwnProperty("theme"))
                {
                    self.theme(options.theme);
                }
                else
                {
                    self.theme = ko.observable(self.themes()[0]);
                }
            }
        };
    }

    self.options = new Options();

    self.toggleToolbox = function (element)
    {
        var selected = false;
        var menuItem = $(element).parent();
        self.options.save();
        if (menuItem.hasClass("selected"))
        {

            if (menuItem[0].id === 'options')
            {
                self.options.save();
            }
            selected = true;
        }
        else
        {
            if (menuItem[0].id === 'export')
            {
                self.exporting.fillExportBox();
            }
        }

        $(".menuItem").removeClass("selected");
        $(".menuItem .toolBox").hide();

        if (!selected)
        {
            menuItem.addClass("selected");
            $(".toolBox", menuItem).show();
        }
    };

    ////////////////////////////////////////////////////////////////////////////
    // Import / Export
    ////////////////////////////////////////////////////////////////////////////

    function Importing()
    {
        var self = this;
        self.$dropTarget = null;
        var entered = 0;

        function dragEnter(event)
        {
            entered++;
            console.info("dragEnter");
            event.preventDefault();
            self.$dropTarget.addClass("dragOver");
        }

        function dragLeave(event)
        {
            entered--;
            console.info("dragLeave");
            event.stopPropagation();
            if (entered === 0)
            {
                self.$dropTarget.removeClass("dragOver");
            }
        }

        function dragOver(event)
        {
            console.info("dragOver");
            event.dataTransfer.dropEffect = "link";
            event.preventDefault();
        }

        function drop(event)
        {
            console.info("drop");
            event.preventDefault();
            self.$dropTarget.removeClass("dropOver");

            var files = event.dataTransfer.files;

            if (files.length > 0)
            {
                var file = files[0];
                var reader = new FileReader();

                reader.onloadend = function (event)
                {
                    todoManager.removeAll();
                    var todos = event.target.result.match(/^(.+)$/mg);
                    todoManager.loadFromStringArray(todos);
                };

                reader.readAsText(file, 'UTF-8');
            }
        }

        $(document).ready(function() {
            // Get jQuery events to support dataTransfer props
            jQuery.event.props.push('dataTransfer');
            self.$dropTarget = $("#fileUpload");

            self.$dropTarget.on('dragenter', dragEnter);
            self.$dropTarget.on('dragover', dragOver);
            self.$dropTarget.on('dragleave', dragLeave);
            self.$dropTarget.on('drop', drop);

            $dropTargetChild = self.$dropTarget.find("span");
            $dropTargetChild.on('dragenter', dragEnter);
            $dropTargetChild.on('dragover', dragOver);
            $dropTargetChild.on('dragleave', dragLeave);
            $dropTargetChild.on('drop', drop);
        });
    }

    function Exporting()
    {
        var self = this;
        self.exportText = ko.observable("");

        self.buildExportText = function ()
        {
            var todos = todoManager.exportToStringArray();
            return todos.join("\n");
        };

        self.fillExportBox = function ()
        {
            self.exportText(self.buildExportText());
        };

        self.download = function()
        {
            var data = "data:text;charset=utf-8,";
            data += encodeURI(self.exportText());

            window.location.href = data;
        };
    }

    self.importing = new Importing(self);
    self.exporting = new Exporting(self);

    ////////////////////////////////////////////////////////////////////////////
    // Filters
    ////////////////////////////////////////////////////////////////////////////

    self.filters = ko.observable("");

    self.filtered = ko.computed(function ()
    {
        return self.filters() && self.filters().length > 0;
    });

    self.clearFilters = function ()
    {
        self.filters("");
    };

    self.addFilter = function(newFilter)
    {
        var result = self.filters().trim();
        if (self.filters().length > 0)
        {
            result += " ";
        }
        result += newFilter;
        self.filters(result);
    };

    ////////////////////////////////////////////////////////////////////////////
    // Display
    ////////////////////////////////////////////////////////////////////////////

    self.isDisplayed = function (todo)
    {
        if (!self.showCompleted() && todo.completed())
        {
            return false;
        }

        var testText = todo.text().toLowerCase();
        var filters = self.filters().split(/\s/);
        var result = true;
        if (self.filtered())
        {
            for (var i = 0; i < filters.length && result; i++)
            {
                result = testText.indexOf(filters[i].toLowerCase()) >= 0;
            }
        }

        return result;
    };

    ////////////////////////////////////////////////////////////////////////////
    // TODO Management
    ////////////////////////////////////////////////////////////////////////////

    self.newTodoText = ko.observable("");

    self.addNewTodo = function ()
    {
        todoManager.add(new Todo(self.newTodoText()));
        self.newTodoText("");
    };

    self.save = function ()
    {
        switch (self.options.storage())
        {
            case 'dropbox':
                self.lastUpdated("saving...");
                $.ajax({
                    url:apiPath + 'api/putTodoFile.php',
                    type:'post',
                    data:JSON.stringify({ text:self.exporting.buildExportText() }),
                    success:function()
                    {
                        self.lastUpdated(new Date());
                    }
                });
                break;

            case 'browser':
                localStorage.todos = self.exporting.buildExportText();
                break;

            case 'server':
                self.lastUpdated("saving...");
                $.ajax({
                    url:apiPath + "api/setTodos",
                    data:null,
                    success:function()
                    {
                        self.lastUpdated(new Date());
                    },
                    error:function (/*xhr, ajax, thrownError*/)
                    {
                    }});
                break;
        }
    };

    self.load = function ()
    {
        self.options.load();
        if (typeof(Storage) !== "undefined")
        {
            switch (self.options.storage())
            {
                case 'dropbox':
                    self.lastUpdated("updating...");
                    $.ajax({
                        url:apiPath + "api/getTodoFile.php",
                        data:null,
                        success:function (data)
                        {
                            self.lastUpdated(new Date());
                        },
                        error:function (a, b, c)
                        {
                            console.write(a, b, c);
                        }});
                    break;

                case 'browser':
                    if (localStorage.todos)
                    {
                        todoManager.removeAll();
                        var todos = localStorage.todos.match(/^(.+)$/mg);
                        todoManager.loadFromStringArray(todos);
                    }
                    break;

                case 'server':
                    self.lastUpdated("updating...");
                    $.ajax({
                        url:apiPath + "api/getTodos",
                        type:'post',
                        data:null,
                        success:function (data)
                        {
                            self.lastUpdated(new Date());
                        },
                        error:function (/*xhr, ajax, thrownError*/)
                        {
                        }});
                    break;
            }
        }
    };

    $(window).unload(self.save);

    self.lastUpdated = ko.observable(undefined);
    self.refresh = function ()
    {
        self.load();
    };

    self.pageReady = ko.observable(false);
    $(document).ready(function ()
    {
        self.pageReady(true);
    });

    //////////////////////////////////////////////////////////
    // Subscriptions
    //////////////////////////////////////////////////////////
    self.options.theme.subscribe(function(newValue)
    {
        $(document.head).find("[rel=stylesheet]").attr('href', newValue.source);
    });


    //////////////////////////////////////////////////////////
    // Keyboard shortcuts
    //////////////////////////////////////////////////////////

    $(document).bind('keydown', 'n', function(event)
    {
        event.preventDefault();
        $(".addTodo Input").focus();
    });

    self.load();
}

ko.bindingHandlers.todo = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var template = $(element);
        var viewer = template.find(".display");
        var trigger = template.find(".message");
        var editor = template.find(".edit");
        var input = template.find(".edit input");

        ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
        {
            // not currently required
        });

        var toggle = function(edit)
        {
            if (edit)
            {
                viewer.hide();
                editor.show();
            }
            else
            {
                viewer.show();
                editor.hide();
            }
        };

        template.find(".priority").click(function(event)
        {
            todoTxtView.addFilter('(' + ko.utils.unwrapObservable(valueAccessor()).priority() + ')');
        });

        // Clicking on the text
        trigger.click(function(event)
        {
            toggle(true);
            input.val(ko.utils.unwrapObservable(valueAccessor()).text());
            input.focus();
        });

        // Keys
        input.keyup(function (event)
        {
            // ENTER
            if (event.keyCode === 13)
            {
                toggle(false);
                ko.utils.unwrapObservable(valueAccessor()).text(input.val());
            }

            // ESC
            if (event.keyCode === 27)
            {
                toggle(false);
            }
        });

        input.blur(function (event)
        {
            toggle(false);
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor, bindingContext)
    {
    }
};

var todoTxtView = new TodoTxtViewModel();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);
$(document.head).find("[rel=stylesheet]").attr('href', todoTxtView.options.theme().source);
