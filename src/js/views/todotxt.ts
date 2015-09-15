/*******************************************************************************
 * Copyright (C) 2013-2015 Martin Gill
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

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../lib/jquery.jgrowl.d.ts" />
/// <reference path="../utils/datetime.ts" />
/// <reference path="../utils/events.ts" />
/// <reference path="../model/ModelFactory.ts" />
/// <reference path="../model/todo.ts" />
/// <reference path="../model/contentRender.ts" />
/// <reference path="../model/todomanager.ts" />
/// <reference path="../model/options.ts" />
/// <reference path="../views/displayOptions.ts" />
/// <reference path="../views/importing.ts" />
/// <reference path="../views/exporting.ts" />

namespace TodoTxtJs.View
{
    export class Main
    {
        public version:KnockoutObservable<string>;
        public title:KnockoutComputed<string>;
        public allTodos:KnockoutComputed<Todo[]>;
        public priorities:KnockoutComputed<string[]>;
        public projects:KnockoutComputed<string[]>;
        public contexts:KnockoutComputed<string[]>;
        public dueTodayCount:KnockoutComputed<number>;
        public dueSoonCount:KnockoutComputed<number>;
        public dueSomedayCount:KnockoutComputed<number>;

        public newPriorityFilter:KnockoutObservable<string>;

        public displayOptions:DisplayOptions;
        public options:Options;
        public importing:Importing;
        public exporting:Exporting;

        public filters:KnockoutObservable<string>;
        public filtered:KnockoutComputed<boolean>;

        public renderOptions:KnockoutComputed<any>;

        public newTodoText:KnockoutObservable<string>;
        public lastUpdated:KnockoutObservable<string>;
        public pageReady:KnockoutObservable<boolean>;

        private _title:KnockoutObservable<string>;
        private _todoManager:TodoManager;
        private static _queryStringParams:any;

        constructor()
        {
            this._todoManager = new TodoTxtJs.TodoManager();

            this._title = ko.observable<string>("TodoTxtJs");
            this.version = ko.observable<string>("1.7.0");
            this.allTodos = ko.computed({owner: this, read: this._getAllTodos});
            this.priorities = ko.computed({owner: this, read: this._getAllPriorities});
            this.projects = ko.computed({owner: this, read: this._getAllProjects});
            this.contexts = ko.computed({owner: this, read: this._getAllContexts});

            this.dueTodayCount = ko.computed({owner: this, read: this._getDueTodayCount});
            this.dueSoonCount = ko.computed({owner: this, read: this._getDueSoonCount});
            this.dueSomedayCount = ko.computed({owner: this, read: this._getDueSomedayCount});

            this.newPriorityFilter = ko.observable(undefined);

            this.displayOptions = new DisplayOptions(this._todoManager);
            this.options = ModelFactory.getOptions();
            this.renderOptions = ko.computed({owner: this, read: this._getRenderOptions});

            this.importing = new Importing(this._todoManager);
            this.exporting = new Exporting(this._todoManager);

            this.filters = ko.observable<string>("");
            this.filters.subscribe((newValue:string) =>
            {
                Main.setQueryString("filter", newValue);
            });
            this.filtered = ko.computed({owner: this, read: this._getIsFiltered});
            this.title = ko.computed(
                {
                    owner: this,
                    read : ()=>
                    {
                        if (!this.filtered())
                        {
                            return this._title();
                        } else
                        {
                            return this._title() + " (filtered)";
                        }
                    }
                });

            this.newTodoText = ko.observable<string>("");

            this.lastUpdated = ko.observable<string>(undefined);
            this.pageReady = ko.observable<boolean>(false);
            $(document).ready(() =>
            {
                this.pageReady(true);
            });

            this._initializeAutoComplete();
            this._initializeKeyboardShortCuts();
            this._initializeNotifications();
            this._initializeEvents();

            $(window).unload(this.save);
            this.load();

            this._applyQueryString();
        }

        public removeTodo(element:HTMLElement):void
        {
            var index = parseInt($(element).parents(".todo").find(".todo-view-index").text(), 10);
            TodoTxtJs.Events.onRemove();
            this._todoManager.remove(index);
            this.saveOnChange();
        }

        public formatDate(date:string):string
        {
            if (date)
            {
                var _date = new Date(date);
                return DateTime.dateToInformalString(_date);
            }
            else
            {
                return null;
            }
        }

        /**
         * Alias for load.
         */
        public refresh():void
        {
            this.load();
        }

        public save = ():void =>
        {
            var message = "Saving to " + this.options.storage();
            if (this.options.storageInfo().path)
            {
                message += " (" + this.options.storageInfo().path() + ") ";
            }
            message += "...";

            $.jGrowl(message);

            var onSuccess = () =>
            {
                this.lastUpdated("Last Saved: " + DateTime.toISO8601DateTime(new Date()));
                $.jGrowl("Saved");
                TodoTxtJs.Events.onSaveComplete(this.options.storage());
            };

            var onError = (error:string) =>
            {
                $.jGrowl(error, {header: "Error Saving", sticky: true});
                this.lastUpdated("Error: [" + error + "]");
                TodoTxtJs.Events.onError("Error Saving (" + this.options.storage() + ") : [" + error + "]");
            };

            this.options.storageInfo().save(this.exporting.getExportText(), onSuccess, onError);
            this.displayOptions.save();
        };

        public load():void
        {
            if (Main.getQueryString("defaults"))
            {
                this.options.save();
                this.displayOptions.save();
            }
            else
            {
                this.options.load();
                this.displayOptions.load();
            }

            var onSuccess = (data:string[]):void =>
            {
                this._todoManager.removeAll();
                this._todoManager.loadFromStringArray(data);
                this.lastUpdated("Last Loaded: " + DateTime.toISO8601DateTime(new Date()));
                $.jGrowl("Loaded Sucessfully");
                TodoTxtJs.Events.onLoadComplete(this.options.storage());
            };

            var onError = (error:string):void =>
            {
                $.jGrowl(error, {header: "Error loading", sticky: true});
                TodoTxtJs.Events.onError("Error Loading (" + this.options.storage() + ") : [" + error + "]");
            };

            if (typeof(Storage) !== "undefined")
            {
                var message = "Loading from " + this.options.storage();
                if (this.options.storageInfo().path)
                {
                    message += " (" + this.options.storageInfo().path() + ") ";
                }
                message += "...";

                $.jGrowl(message);
                this.options.storageInfo().load(onSuccess, onError);
            }
        }

        public logout = ():void =>
        {
            this.options.storageInfo().logout(() =>
            {
                // Reset to browser storage, it will just try to log in again
                // need to save options, or load will just use previous storage provider again.
                var oldStore = this.options.storage();
                this.options.storageInfo(this.options.storageOptions()[0]);
                this.options.save();

                $.jGrowl("You have been logged out of " + oldStore + ". Now using Browser storage.");
                this.load();
            });
        };

        public addNewTodo():void
        {
            var source = this.newTodoText();
            if (source == null || source.trim().length == 0)
            {
                return;
            }

            var todo = new TodoTxtJs.Todo(source);
            if (this.options.addCreatedDate())
            {
                if (!todo.createdDate())
                {
                    var date = new Date();
                    todo.createdDate(DateTime.toISO8601Date(date));
                }
            }

            TodoTxtJs.Events.onNew();
            this._todoManager.add(todo);
            this.newTodoText("");
            this.saveOnChange();
        }

        /**
         * Uses the save on change option to determine if
         * the current contents should be saved.
         */
        public saveOnChange():void
        {
            if (this.options.saveOnChange())
            {
                this.save();
            }
        }

        public onCompleteClick = (data:any, event:any):boolean =>
        {
            this.saveOnChange();
            // Ensure event is processed by other handlers as well
            return true;
        };

        public clearFilters():void
        {
            this.filters("");
        }

        /**
         * Adds a new filter term to the filters list, using the
         * text of the specified HTMLElement.
         * @param newFilter The HTMLElement that contains the new filter value.
         */
        public addFilterFromElement(newFilter:HTMLElement):void
        {
            var filterText = $(newFilter).text();
            if (filterText.length == 1)
            {
                filterText = '(' + filterText + ')';
            }
            this.addFilter(filterText);
        }

        /**
         * Adds a new filter term to the filters list.
         * @param newFilter The text of the new filter.
         */
        public addFilter(newFilter:string):void
        {
            if (this.filters().indexOf(newFilter.toLowerCase()) > -1)
            {
                return;
            }

            var result = this.filters().trim();
            if (this.filters().length > 0)
            {
                result += " ";
            }
            result += newFilter;
            this.filters(result);
        }

        /**
         * Determines if the given Todo object should be visible.
         * based on the current filter settings.
         * @param todo The todo object to inspect.
         * @returns true if the Todo should be visible.
         */
        public isDisplayed(todo:Todo):boolean
        {
            if (!this.displayOptions.showCompleted() && todo.completed())
            {
                return false;
            }

            var testText = todo.text();
            var testTextLower = todo.text().toLowerCase();
            var filters = this.filters().split(/\s/);
            var result = true;
            if (this.filtered())
            {
                for (var i = 0; i < filters.length && result; i++)
                {
                    // Special filters
                    var filter = filters[i];
                    switch (filter)
                    {
                        // No Context Defined
                        case "-@":
                            result = (todo.contexts().length == 0);
                            break;

                        // No Project Defined
                        case "-+":
                            result = (todo.projects().length == 0);
                            break;

                        case "isDue:none":
                            result = todo.dueDate() == null;
                            break;

                        case "isDue:today":
                            if (todo.dueDate())
                            {
                                result = DateTime.distance(todo.dueDate()) <= 0;
                            }
                            else
                            {
                                result = false;
                            }
                            break;

                        case "isDue:soon":
                            if (todo.dueDate())
                            {
                                var distance = DateTime.distance(todo.dueDate());
                                result = distance > 0 && distance <= 3;
                            }
                            else
                            {
                                result = false;
                            }
                            break;

                        case "isDue:someday":
                            if (todo.dueDate())
                            {
                                var distance = DateTime.distance(todo.dueDate());
                                result = distance > 3;
                            }
                            else
                            {
                                result = false;
                            }
                            break;

                        // Normal Filtering
                        default:
                            // Deal with case-sensitive projects/contexts
                            if (filter.match(/[@+].+/))
                            {
                                if (this.options.caseSensitive())
                                {
                                    result = testText.indexOf(filter) >= 0;
                                }
                                else
                                {
                                    result = testTextLower.indexOf(filter.toLowerCase()) >= 0;
                                }
                            }
                            // Do all other filters as case insensitive
                            else
                            {
                                result = testTextLower.indexOf(filter.toLowerCase()) >= 0;
                            }
                    }
                }
            }

            return result;
        }

        public onClick_ShowImport(/*data?: any, event?: Event*/):boolean
        {
            this.importing.onClick_ShowDialog();
            return false;
        }

        public onClick_ShowExport(/*data?: any, event?: Event*/):boolean
        {
            this.exporting.onClick_ShowDialog();
            return false;
        }

        public onClick_ShowHelp(/*data?: any, event?: Event*/):boolean
        {
            var width = Math.round(window.innerWidth * 0.8);
            var height = Math.round(window.innerHeight * 0.8);
            //this.showHelp(!this.showHelp());
            $("#help").dialog({
                dialogClass  : "helpDialog",
                modal        : true,
                buttons      : {
                    Ok: function ()
                    {
                        $(this).dialog("close");
                    }
                },
                minHeight    : 400,
                maxHeight    : height,
                height       : "auto",
                minWidth     : 800,
                maxWidth     : width,
                auto         : "auto",
                closeOnEscape: true,
                draggable    : false,
                resizable    : false
            });

            return false;
        }

        public onClick_ShowOptions(/*data?: any, event?: Event*/):boolean
        {
            var width = Math.round(window.innerWidth * 0.8);
            var height = Math.round(window.innerHeight * 0.8);
            var self = this;
            var oldStorage = this.options.storageInfo();
            $("#optionsDialog").dialog({
                dialogClass  : "optionsDialog",
                modal        : true,
                buttons      : {
                    Done: function ()
                    {
                        self.options.save();
                        if (self.options.storageInfo().name !== oldStorage.name)
                        {
                            todoTxtView.load();
                        }
                        oldStorage = self.options.storageInfo();
                        $(this).dialog("close");
                    }
                },
                close        : function (/* event, ui */)
                {
                    // Undo storage change
                    if (oldStorage.name != self.options.storageInfo().name)
                    {
                        self.options.storageInfo(oldStorage);
                    }
                },
                maxHeight    : height,
                height       : "auto",
                minWidth     : 800,
                maxWidth     : width,
                auto         : "auto",
                closeOnEscape: true,
                draggable    : false,
                resizable    : false
            });

            return false;
        }

        /**
         * Splits a list of terms into individual terms.
         * @param val the list of terms.
         */
        private static _split(val:string):string[]
        {
            return val.split(/\s+/);
        }

        /**
         * An array of all possible auto-complete values.
         */
        private _newTodoAutoCompleteValues():string[]
        {
            var result:string[] = [];
            var contexts = this._todoManager.allContexts();
            var projects = this._todoManager.allProjects();

            for (var i = 0; i < contexts.length; i++)
            {
                result.push("@" + contexts[i]);
            }

            for (var j = 0; j < projects.length; j++)
            {
                result.push("+" + projects[j]);
            }

            return result;
        }

        private _getIsFiltered():boolean
        {
            return (this.filters() && this.filters().length > 0);
        }

        private _getAllTodos():Array<Todo>
        {
            return this._todoManager.all();
        }

        private _getAllPriorities():string[]
        {
            var hash:{ [priority:string]: boolean } = {};
            for (var i = 0; i < this.allTodos().length; i++)
            {
                if (this.isDisplayed(this.allTodos()[i]))
                {
                    var priority = this.allTodos()[i].priority();
                    if (priority)
                    {
                        hash[priority] = true;
                    }
                }
            }

            var result:string[] = [];
            for (var name in hash)
            {
                if (hash.hasOwnProperty(name))
                {
                    result.push(name);
                }
            }

            return result.sort();
        }

        private _getAllProjects():string[]
        {
            var hash:{ [project:string]: boolean } = {};
            for (var i = 0; i < this.allTodos().length; i++)
            {
                if (this.isDisplayed(this.allTodos()[i]))
                {
                    var projects = this.allTodos()[i].projects();
                    var caseSensitive = this.options.caseSensitive();

                    for (var j = 0; j < projects.length; j++)
                    {
                        var project = projects[j];
                        if (!caseSensitive)
                        {
                            project = project.toLowerCase();
                        }
                        hash[project] = true;
                    }
                }
            }

            var result:string[] = [];
            for (var name in hash)
            {
                if (hash.hasOwnProperty(name))
                {
                    result.push(name);
                }
            }

            return result.sort();
        }

        private _getAllContexts():string[]
        {
            var hash:{ [context:string]: boolean } = {};
            for (var i = 0; i < this.allTodos().length; i++)
            {
                if (this.isDisplayed(this.allTodos()[i]))
                {
                    var contexts = this.allTodos()[i].contexts();
                    var caseSensitive = this.options.caseSensitive();

                    for (var j = 0; j < contexts.length; j++)
                    {
                        var context = contexts[j];
                        if (!caseSensitive)
                        {
                            context = context.toLowerCase();
                        }
                        hash[context] = true;
                    }
                }
            }

            var result:string[] = [];
            for (var name in hash)
            {
                if (hash.hasOwnProperty(name))
                {
                    result.push(name);
                }
            }

            return result.sort();
        }

        private _getDueTodayCount():number
        {
            var result = 0;
            for (var i = 0; i < this.allTodos().length; i++)
            {
                var due = this.allTodos()[i].dueDate();
                if (this.isDisplayed(this.allTodos()[i]) && due)
                {
                    var distance = DateTime.distance(due);
                    if (distance <= 0)
                    {
                        result++;
                    }
                }
            }

            return result;
        }

        private _getDueSoonCount():number
        {
            var result = 0;
            for (var i = 0; i < this.allTodos().length; i++)
            {
                var due = this.allTodos()[i].dueDate();
                if (this.isDisplayed(this.allTodos()[i]) && due)
                {
                    var distance = DateTime.distance(due);
                    if (distance > 0 && distance <= 3)
                    {
                        result++;
                    }
                }
            }

            return result;
        }

        private _getDueSomedayCount():number
        {
            var result = 0;
            for (var i = 0; i < this.allTodos().length; i++)
            {
                var due = this.allTodos()[i].dueDate();
                if (this.isDisplayed(this.allTodos()[i]) && due)
                {
                    var distance = DateTime.distance(due);
                    if (distance > 3)
                    {
                        result++;
                    }
                }
            }

            return result;
        }

        /**
         * Extracts the last term in a list of terms.
         * @param term the list of terms to process.
         * @returns the last term in the list.
         */
        private _extractLast(term:string):string
        {
            return Main._split(term).pop();
        }

        private _initializeEvents = () =>
        {
            $('.todo-view-display').click((event:JQueryEventObject) =>
            {

            })
        };

        private _initializeKeyboardShortCuts = () =>
        {
            $(document).bind('keydown', 'n', function (event)
            {
                event.preventDefault();
                $(".addTodo Input").focus();
            });

            function help(event:Event)
            {
                event.preventDefault();
                var help = $("#help");
                if (help.is(":visible"))
                {
                    help.dialog("close");
                }
                else
                {
                    this.onClick_ShowHelp();
                }
            }

            $(document).bind('keydown', 'shift+/', help);
        };

        /**
         * Get the options for rendering the HTML contents of the todo.
         * @returns an options object.
         */
        private _getRenderOptions():any
        {
            var result = new ContentRenderOptions();
            result.shortUrls = this.displayOptions.showShortUrls();

            return result;
        }

        private static _parseQueryString()
        {
            if (!Main._queryStringParams)
            {
                var params:{ [name:string]:string } = {},
                    e:RegExpExecArray,
                    a                               = /\+/g,  // Regex for replacing addition symbol with a space
                    r                               = /([^&=]+)=?([^&]*)/g,
                    d                               = function (s:any)
                    {
                        return decodeURIComponent(s.replace(a, " "));
                    },
                    q                               = window.location.search.substring(1);

                while (e = r.exec(q))
                {
                    var value:any = d(e[2]);
                    if (value === "")
                    {
                        value = true;
                    }
                    params[d(e[1])] = value;
                }

                Main._queryStringParams = params;
            }
        }

        private static _writeQueryString()
        {
            var queryString = "?";
            var location = window.location.href;
            location = location.replace(/([#?].*)/, "");
            for (var name in Main._queryStringParams)
            {
                if (Main._queryStringParams.hasOwnProperty(name))
                {
                    var nameUri = encodeURIComponent(name);
                    var value = Main._queryStringParams[name];
                    if (value !== "")
                    {
                        var valueUri = encodeURIComponent(value);
                        queryString += nameUri + '=' + valueUri;
                    }
                }
            }

            var newLocation = location + queryString;

            if (history)
            {
                history.replaceState(null, null, newLocation);
            }
        }

        public static setQueryString(name:string, value:any)
        {
            Main._parseQueryString();
            Main._queryStringParams[name] = value;
            Main._writeQueryString();
        }

        public static getQueryString(name:string)
        {
            Main._parseQueryString();
            return Main._queryStringParams[name];
        }

        private _applyQueryString()
        {
            var filters = Main.getQueryString("filter");
            if (filters && filters !== "")
            {
                this.filters(filters);
            }
        }

        /**
         * Initializes the auto-complete functionality.
         */
        private _initializeAutoComplete():void
        {
            var _self = this;
            $("#newTodoInput")
                // don't navigate away from the field on tab when selecting an item
                .bind("keydown", function (event)
                {
                    if (event.keyCode === $.ui.keyCode.TAB &&
                        $(this).data("ui-autocomplete").menu.active)
                    {
                        event.preventDefault();
                    }
                })
                .autocomplete({
                    minLength: 1,
                    source   : function (request:{ term:string }, response:(data:any) => void)
                    {
                        // delegate back to autocomplete, but extract the last term
                        response((<any>$.ui.autocomplete).filter(
                            _self._newTodoAutoCompleteValues(), _self._extractLast(request.term)));
                    },
                    focus    : function ()
                    {
                        // prevent value inserted on focus
                        return false;
                    },
                    select   : function (event:Event, ui:any)
                    {
                        var terms = Main._split(this.value);
                        // remove the current input
                        terms.pop();
                        // add the selected item
                        terms.push(ui.item.value);
                        // add placeholder to get the comma-and-space at the end
                        terms.push("");
                        _self.newTodoText(terms.join(" "));
                        return false;
                    }
                });

            $("#filters")
                // don't navigate away from the field on tab when selecting an item
                .bind("keydown", function (event)
                {
                    if (event.keyCode === $.ui.keyCode.TAB &&
                        $(this).data("ui-autocomplete").menu.active)
                    {
                        event.preventDefault();
                    }
                })
                .autocomplete({
                    minLength: 1,
                    source   : function (request:{ term:string }, response:(data:any) => void)
                    {
                        // delegate back to autocomplete, but extract the last term
                        response((<any>$.ui.autocomplete).filter(
                            _self._newTodoAutoCompleteValues(), _self._extractLast(request.term)));
                    },
                    focus    : function ()
                    {
                        // prevent value inserted on focus
                        return false;
                    },
                    select   : function (event:Event, ui:any)
                    {
                        var terms = Main._split(this.value);
                        // remove the current input
                        terms.pop();
                        // add the selected item
                        terms.push(ui.item.value);
                        // add placeholder to get the comma-and-space at the end
                        terms.push("");
                        _self.filters(terms.join(" "));
                        return false;
                    }
                });
        }

        private _initializeNotifications():void
        {
            $.jGrowl.defaults.position = 'bottom-right';
        }
    }

}

var todoTxtView:TodoTxtJs.View.Main = new TodoTxtJs.View.Main();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);
