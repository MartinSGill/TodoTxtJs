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


ko.bindingHandlers.todo = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var template = $(element);
        var viewer = template.find(".todo-view-display");
        var trigger = template.find(".todo-view-message");
        var editor = template.find(".todo-view-edit");
        var input = template.find(".todo-view-edit input");

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

