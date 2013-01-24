/*******************************************************************************
 * Copyright (C) 2013 Martin Gill
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

////////////////////////////////////////////////////////////////////////////
// Main View Model
////////////////////////////////////////////////////////////////////////////

function TodoTxtViewModel()
{
    var self = this;
    var todoManager = new TodoManager();

    /************************************************
     * Inner Constructors
     ***********************************************/
    self.version = ko.observable("0.9.2");
    self.title = ko.observable("TodoTxtJs Web App");

    self.allTodos = ko.computed(function() { return todoManager.all(); } );

    self.priorities = ko.observableArray([]);
    self.projects = ko.computed(function()
    {
        var hash = {};
        for (var i = 0; i < self.allTodos().length; i++)
        {
            if (self.isDisplayed(self.allTodos()[i]))
            {
                var projects = self.allTodos()[i].projects();
                for (var j = 0; j < projects.length; j++)
                {
                    hash[projects[j]] = true;
                }
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

        return result.sort();
    });

    self.contexts = ko.computed(function()
    {
        var hash = {};
        for (var i = 0; i < self.allTodos().length; i++)
        {
            if (self.isDisplayed(self.allTodos()[i]))
            {
                var contexts = self.allTodos()[i].contexts();
                for (var j = 0; j < contexts.length; j++)
                {
                    hash[contexts[j]] = true;
                }
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

        return result.sort();
    });

    self.showCompleted = ko.observable(false);

    self.newPriorityFilter = ko.observable(undefined);

    ////////////////////////////////////////////////////////////////////////////
    // Options
    ////////////////////////////////////////////////////////////////////////////

    function Options()
    {
        var self = this;

        ///////////////////////////
        // Options
        ///////////////////////////

        self.storageOptions = ko.observableArray([
            new BrowserStorageProvider(),
            new DropboxStorageProvider()
        ]
        );
        self.storageInfo = ko.observable(self.storageOptions()[0]);
        self.storage = ko.computed(function ()
        {
            return self.storageInfo().name;
        });

        self.themes = ko.observableArray([
                                                  { name: "Simple", source: "css/simple.css", info:"light and rounded/simple theme." },
                                                  { name: "Blocks", source: "css/blocky.css", info: "darker more block-style theme." }
                                              ]);

        self.theme = ko.observable();

        ///////////////////////////
        // Control
        ///////////////////////////
        self.showStorageControls = ko.computed(function ()
        {
            return self.storageInfo().controls.storage;
        });

        self.showImport = ko.computed(function ()
        {
            return self.storageInfo().controls.imports;
        });

        self.showExport = ko.computed(function ()
        {
            return self.storageInfo().controls.exports;
        });

        self.save = function ()
        {
            var oldOptions = {};
            if (window.localStorage.TodoTxtJsOptions)
            {
                oldOptions = JSON.parse(window.localStorage.TodoTxtJsOptions);
            }

            window.localStorage.TodoTxtJsOptions = ko.toJSON(self);
            if (oldOptions.storage !== self.storage())
            {
                todoTxtView.load();
            }
        };

        self.load = function ()
        {
            if (window.localStorage.TodoTxtJsOptions)
            {
                var options = JSON.parse(window.localStorage.TodoTxtJsOptions);
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
            event.preventDefault();
            self.$dropTarget.addClass("dragOver");
        }

        function dragLeave(event)
        {
            entered--;
            event.stopPropagation();
            if (entered === 0)
            {
                self.$dropTarget.removeClass("dragOver");
            }
        }

        function dragOver(event)
        {
            event.dataTransfer.dropEffect = "link";
            event.preventDefault();
        }

        function drop(event)
        {
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

            var $dropTargetChild = self.$dropTarget.find("span");
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

    self.addFilterFromElement = function(newFilter)
    {
        var filterText = $(newFilter).text();
        if (self.filters().indexOf(filterText.toLowerCase()) > -1)
        {
            return;
        }

        var result = self.filters().trim();
        if (self.filters().length > 0)
        {
            result += " ";
        }
        result += filterText;
        self.filters(result);
    };

    self.addFilter = function(newFilter)
    {
        if (self.filters().indexOf(newFilter.toLowerCase()) > -1)
        {
            return;
        }

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

    self.spinner = ko.observable(false);

    self.save = function ()
    {
        highlightNotice();
        self.lastUpdated("Saving Todos to " + self.options.storage());
        self.spinner(true);


        function onSuccess()
        {
            self.lastUpdated("Last Saved: " + toISO8601DateTime(new Date()));
            self.spinner(false);
            setTimeout(normalNotice, 1000);
        }

        function onError(error)
        {
            self.lastUpdated("Error: [" + error  +  "]");
            highlightNotice(true);
            setTimeout(normalNotice, 2000);
            self.spinner(false);
        }

        self.options.storageInfo().save(self.exporting.buildExportText(), onSuccess, onError);
    };

    self.load = function ()
    {
        highlightNotice();
        self.options.load();

        function onSuccess(data)
        {
            todoManager.loadFromStringArray(data);
            self.lastUpdated("Loaded " + toISO8601DateTime(new Date()));
            self.spinner(false);
            setTimeout(normalNotice, 1000);
        }

        function onError(error)
        {
            self.lastUpdated("Error: [" + error  +  "]");
            highlightNotice(true);
            self.spinner(false);
            setTimeout(normalNotice, 2000);
        }
        if (typeof(Storage) !== "undefined")
        {
            todoManager.removeAll();
            self.spinner(true);
            self.lastUpdated("Loading Todos from " + self.options.storage());
            self.options.storageInfo().load(onSuccess, onError);
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

    self.removeTodo = function(element)
    {
        var index = parseInt($(element).parents(".todo").find(".index").text(), 10);
        todoManager.remove(index);
    };

    //////////////////////////////////////////////////////////
    // Subscriptions
    //////////////////////////////////////////////////////////
    self.options.theme.subscribe(function(newValue)
    {
        $(document.head).find("[rel=stylesheet]").attr('href', newValue.source);
    });

    //////////////////////////////////////////////////////////
    // Effects
    //////////////////////////////////////////////////////////
    function highlightNotice(isError)
    {
        var notice = $("#notice");
        notice.addClass("noticeHighlight");

        if (isError)
        {
            notice.addClass("noticeError");
        }
        else
        {
            notice.removeClass("noticeError");
        }
    }

    function normalNotice()
    {
        var notice = $("#notice");
        notice.find(".spinner").siblings().effect("transfer", { to: $("#target") }, 1000);
        notice.removeClass("noticeHighlight");
    }

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
