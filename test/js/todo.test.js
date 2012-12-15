/*
 * Copyright (c) 2012. Martin Gill. All Rights Reserved.
 */

buster.testCase("todo Tests",
    {
        "test Default Constructor": function()
        {
            var target = new Todo();
            assert.equals(false, target.completed());
            refute.defined(target.text());
            refute.defined(target.completedDate());
            refute.defined(target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(0, target.projects().length);
            assert.equals(0, target.contexts().length);
        },

        "test Todo Constructor, just text": function()
        {
            var target = new Todo("Hello World");
            assert.equals(false, target.completed());
            assert.equals("Hello World", target.text());
            refute.defined(target.completedDate());
            assert.equals("Hello World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(0, target.projects().length);
            assert.equals(0, target.contexts().length);
        },

        "test Todo Constructor, text with priority": function()
        {
            var target = new Todo("(A) Hello World");
            assert.equals(false, target.completed());
            assert.equals("(A) Hello World", target.text());
            refute.defined(target.completedDate());
            assert.equals("Hello World", target.contents());
            refute.defined(target.createdDate());
            refute.equals("A", target.priority());
            assert.equals(0, target.projects().length);
            assert.equals(0, target.contexts().length);
        },

        "test Todo Constructor, completed todo, no date": function()
        {
            var target = new Todo("x Hello World");
            assert.equals(true, target.completed());
            assert.equals("x Hello World", target.text());
            refute.defined(target.completedDate());
            assert.equals("Hello World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(0, target.projects().length);
            assert.equals(0, target.contexts().length);
        },

        "test Todo Constructor, completed todo, with date": function()
        {
            var target = new Todo("x 10-12-2013 Hello World");
            assert.equals(true, target.completed());
            assert.equals("x 10-12-2013 Hello World", target.text());
            assert.equals("10-12-2013", target.completedDate());
            assert.equals("Hello World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(0, target.projects().length);
            assert.equals(0, target.contexts().length);
        },

        "test Todo Constructor, completed todo, with date, one project": function()
        {
            var target = new Todo("x 10-12-2013 Hello +World");
            assert.equals(true, target.completed());
            assert.equals("x 10-12-2013 Hello World", target.text());
            assert.equals("10-12-2013", target.completedDate());
            assert.equals("Hello +World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(1, target.projects().length);
            assert.equals("world", target.projects()[0]);
            assert.equals(0, target.contexts().length);
        },

        "test Todo Constructor, completed todo, with date, one context": function()
        {
            var target = new Todo("x 10-12-2013 Hello @World");
            assert.equals(true, target.completed());
            assert.equals("x 10-12-2013 Hello World", target.text());
            assert.equals("10-12-2013", target.completedDate());
            assert.equals("Hello +World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(1, target.contexts().length);
            assert.equals("world", target.contexts()[0]);
            assert.equals(0, target.projects().length);
        },

        "test Todo Constructor, mixed projects and contexts": function()
        {
            var target = new Todo("+Hello @World");
            assert.equals(true, target.completed());
            assert.equals("x 10-12-2013 Hello World", target.text());
            assert.equals("10-12-2013", target.completedDate());
            assert.equals("Hello +World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(1, target.contexts().length);
            assert.equals("world", target.contexts()[0]);
            assert.equals(1, target.projects().length);
            assert.equals("hello", target.projects()[0]);
        },

        "test Todo Constructor, nice and complicated": function()
        {
            var target = new Todo("x 10-12-2013 (D) This +todo has many +projects! (@and some @contexts).");
            assert.equals(true, target.completed());
            assert.equals("x 10-12-2013 This +todo has many +projects! (@and some @contexts).", target.text());
            assert.equals("10-12-2013", target.completedDate());
            assert.equals("This +todo has many +projects! (@and some @contexts).", target.contents());
            refute.defined(target.createdDate());
            assert.equals("D", target.priority());
            assert.equals(2, target.contexts().length);
            assert.equals("and", target.contexts()[0]);
            assert.equals("contexts", target.contexts()[1]);
            assert.equals(2, target.projects().length);
            assert.equals("todo", target.projects()[0]);
            assert.equals("projects", target.projects()[1]);
        }
    });
