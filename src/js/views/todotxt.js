var TodoTxtJs;
(function (TodoTxtJs) {
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
    /// <reference path="../defs/knockout.d.ts" />
    /// <reference path="../defs/jquery.d.ts" />
    /// <reference path="../defs/jqueryui.d.ts" />
    /// <reference path="../utils/datetime.ts" />
    /// <reference path="../utils/events.ts" />
    /// <reference path="../model/todo.ts" />
    /// <reference path="../model/todomanager.ts" />
    /// <reference path="../views/options.ts" />
    /// <reference path="../views/importing.ts" />
    /// <reference path="../views/exporting.ts" />
    (function (View) {
        var Main = (function () {
            function Main() {
                var _this = this;
                this.save = function () {
                    Main._highlightNotice();
                    _this.notice("Saving Todos to " + _this.options.storage());
                    _this.spinner(true);

                    var onSuccess = function () {
                        _this.lastUpdated("Last Saved: " + DateTime.toISO8601DateTime(new Date()));
                        _this.notice("Last Saved: " + DateTime.toISO8601DateTime(new Date()));
                        _this.spinner(false);
                        setTimeout(_this._normalNotice, 1000);
                        TodoTxtJs.Events.onSaveComplete(_this.options.storage());
                    };

                    var onError = function (error) {
                        _this.notice("Error: [" + error + "]");
                        _this.lastUpdated("Error: [" + error + "]");
                        Main._highlightNotice(true);
                        setTimeout(_this._normalNotice, 2000);
                        _this.spinner(false);
                        TodoTxtJs.Events.onError("Error Saving (" + _this.options.storage() + ") : [" + error + "]");
                    };

                    _this.options.storageInfo().save(_this.exporting.buildExportText(), onSuccess, onError);
                };
                this._normalNotice = function () {
                    var notice = $("#notice");
                    notice.find("#notice-text").effect("transfer", { to: $("#target") }, 1000);
                    notice.removeClass("notice-highlight");
                    _this.lastUpdated(_this.notice());
                    _this.notice("");
                };
                this._todoManager = new TodoTxtJs.TodoManager();

                this.version = ko.observable("0.9.6");
                this.title = ko.observable("TodoTxtJs");
                this.allTodos = ko.computed({ owner: this, read: this._getAllTodos });
                this.priorities = ko.observableArray([]);
                this.projects = ko.computed({ owner: this, read: this._getAllProjects });
                this.contexts = ko.computed({ owner: this, read: this._getAllContexts });

                this.newPriorityFilter = ko.observable(undefined);
                this.showHelp = ko.observable(false);

                this.options = new View.Options();

                this.importing = new View.Importing(this._todoManager);
                this.exporting = new View.Exporting(this._todoManager);

                this.filters = ko.observable("");
                this.showCompleted = ko.observable(false);
                this.showShortUrls = ko.observable(true);
                this.showCreatedDate = ko.observable(true);

                this.filtered = ko.computed({ owner: this, read: this._getIsFiltered });

                this.newTodoText = ko.observable("");
                this.spinner = ko.observable(false);

                this.lastUpdated = ko.observable(undefined);
                this.notice = ko.observable(undefined);
                this.pageReady = ko.observable(false);
                $(document).ready(function () {
                    _this.pageReady(true);
                });

                this._InitializeAutoComplete();
                this._InitializeKeyboardShortCuts();

                $(window).unload(this.save);
                this.load();
            }
            Main.prototype.removeTodo = function (element) {
                var index = parseInt($(element).parents(".todo").find(".todo-view-index").text(), 10);
                TodoTxtJs.Events.onRemove();
                this._todoManager.remove(index);
            };

            Main.prototype.refresh = function () {
                this.load();
            };

            Main.prototype.load = function () {
                var _this = this;
                Main._highlightNotice();
                this.options.load();

                var onSuccess = function (data) {
                    _this._todoManager.loadFromStringArray(data);
                    _this.notice("Loaded " + DateTime.toISO8601DateTime(new Date()));
                    _this.spinner(false);
                    setTimeout(_this._normalNotice, 1000);
                    TodoTxtJs.Events.onLoadComplete(_this.options.storage());
                };

                var onError = function (error) {
                    _this.notice("Loaded " + DateTime.toISO8601DateTime(new Date()));
                    Main._highlightNotice(true);
                    _this.spinner(false);
                    setTimeout(function () {
                        return _this._normalNotice;
                    }, 2000);
                    TodoTxtJs.Events.onError("Error Loading (" + _this.options.storage() + ") : [" + error + "]");
                };

                if (typeof (Storage) !== "undefined") {
                    this._todoManager.removeAll();
                    this.spinner(true);
                    this.notice("Loading Todos from " + this.options.storage());
                    this.options.storageInfo().load(onSuccess, onError);
                }
            };

            Main.prototype.addNewTodo = function () {
                var todo = new TodoTxtJs.Todo(this.newTodoText());
                if (this.options.addCreatedDate()) {
                    if (!todo.createdDate()) {
                        var date = new Date();
                        todo.createdDate(DateTime.toISO8601Date(date));
                    }
                }

                TodoTxtJs.Events.onNew();
                this._todoManager.add(todo);
                this.newTodoText("");
            };

            Main.prototype.newTodoAutoCompleteValues = function () {
                var result = [];
                var contexts = this._todoManager.allContexts();
                var projects = this._todoManager.allProjects();

                for (var i = 0; i < contexts.length; i++) {
                    result.push("@" + contexts[i]);
                }

                for (var j = 0; j < projects.length; j++) {
                    result.push("+" + projects[j]);
                }

                return result;
            };

            Main.prototype._getIsFiltered = function () {
                return this.filters() && this.filters().length > 0;
            };

            Main.prototype.clearFilters = function () {
                this.filters("");
            };

            Main.prototype.addFilterFromElement = function (newFilter) {
                var filterText = $(newFilter).text();
                if (this.filters().indexOf(filterText.toLowerCase()) > -1) {
                    return;
                }

                var result = this.filters().trim();
                if (this.filters().length > 0) {
                    result += " ";
                }
                result += filterText;
                this.filters(result);
            };

            Main.prototype.addFilter = function (newFilter) {
                if (this.filters().indexOf(newFilter.toLowerCase()) > -1) {
                    return;
                }

                var result = this.filters().trim();
                if (this.filters().length > 0) {
                    result += " ";
                }
                result += newFilter;
                this.filters(result);
            };

            ////////////////////////////////////////////////////////////////////////////
            // Options
            ////////////////////////////////////////////////////////////////////////////
            Main.prototype.toggleToolbox = function (element) {
                var selected = false;
                var menuItem = $(element).parent();
                this.options.save();
                if (menuItem.hasClass("selected")) {
                    if (menuItem[0].id === 'options') {
                        this.options.save();
                    }
                    selected = true;
                } else {
                    if (menuItem[0].id === 'export') {
                        this.exporting.fillExportBox();
                    }
                }

                $(".menuItem").removeClass("selected");
                $(".menuItem .toolbox").hide();

                if (!selected) {
                    menuItem.addClass("selected");
                    $(".toolbox", menuItem).show();
                }
            };

            Main.prototype.isDisplayed = function (todo) {
                if (!this.showCompleted() && todo.completed()) {
                    return false;
                }

                var testText = todo.text().toLowerCase();
                var filters = this.filters().split(/\s/);
                var result = true;
                if (this.filtered()) {
                    for (var i = 0; i < filters.length && result; i++) {
                        result = testText.indexOf(filters[i].toLowerCase()) >= 0;
                    }
                }

                return result;
            };

            Main.prototype.onClick_ShowHelp = function (data, event) {
                this.showHelp(!this.showHelp());
            };

            Main._highlightNotice = function (isError) {
                var notice = $("#notice");
                notice.addClass("notice-highlight");

                if (isError) {
                    notice.addClass("notice-error");
                } else {
                    notice.removeClass("notice-error");
                }
            };

            Main.prototype._getAllTodos = function () {
                return this._todoManager.all();
            };

            Main.prototype._getAllProjects = function () {
                var hash = {};
                for (var i = 0; i < this.allTodos().length; i++) {
                    if (this.isDisplayed(this.allTodos()[i])) {
                        var projects = this.allTodos()[i].projects();
                        for (var j = 0; j < projects.length; j++) {
                            hash[projects[j]] = true;
                        }
                    }
                }

                var result = [];
                for (var name in hash) {
                    if (hash.hasOwnProperty(name)) {
                        result.push(name);
                    }
                }

                return result.sort();
            };

            Main.prototype._getAllContexts = function () {
                var hash = {};
                for (var i = 0; i < this.allTodos().length; i++) {
                    if (this.isDisplayed(this.allTodos()[i])) {
                        var contexts = this.allTodos()[i].contexts();
                        for (var j = 0; j < contexts.length; j++) {
                            hash[contexts[j]] = true;
                        }
                    }
                }

                var result = [];
                for (var name in hash) {
                    if (hash.hasOwnProperty(name)) {
                        result.push(name);
                    }
                }

                return result.sort();
            };

            Main._split = function (val) {
                return val.split(/\s+/);
            };

            Main.prototype._extractLast = function (term) {
                return Main._split(term).pop();
            };

            Main.prototype._InitializeKeyboardShortCuts = function () {
                $(document).bind('keydown', 'n', function (event) {
                    event.preventDefault();
                    $(".addTodo Input").focus();
                });

                $(document).bind('keydown', '?', function (event) {
                    event.preventDefault();
                    this.onClick_ShowHelp();
                });
            };

            Main.prototype._InitializeAutoComplete = function () {
                var _self = this;
                $("#newTodoInput").bind("keydown", function (event) {
                    if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
                        event.preventDefault();
                    }
                }).autocomplete({
                    minLength: 1,
                    source: function (request, response) {
                        // delegate back to autocomplete, but extract the last term
                        response(($.ui.autocomplete).filter(_self.newTodoAutoCompleteValues(), _self._extractLast(request.term)));
                    },
                    focus: function () {
                        // prevent value inserted on focus
                        return false;
                    },
                    select: function (event, ui) {
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

                $("#filters").bind("keydown", function (event) {
                    if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
                        event.preventDefault();
                    }
                }).autocomplete({
                    minLength: 1,
                    source: function (request, response) {
                        // delegate back to autocomplete, but extract the last term
                        response(($.ui.autocomplete).filter(_self.newTodoAutoCompleteValues(), _self._extractLast(request.term)));
                    },
                    focus: function () {
                        // prevent value inserted on focus
                        return false;
                    },
                    select: function (event, ui) {
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
            };
            return Main;
        })();
        View.Main = Main;
    })(TodoTxtJs.View || (TodoTxtJs.View = {}));
    var View = TodoTxtJs.View;
})(TodoTxtJs || (TodoTxtJs = {}));

var todoTxtView = new TodoTxtJs.View.Main();
ko.applyBindings(todoTxtView, document.head);
ko.applyBindings(todoTxtView);
//# sourceMappingURL=todotxt.js.map
