/*
 * Copyright (c) 2012. Martin Gill. All Rights Reserved.
 */

buster.testCase("todo Tests",
    {
        "test Default Constructor": function()
        {
            var target = new Todo();
            assert.equals(target.completed(), false);
            refute.defined(target.text());
            refute.defined(target.completedDate());
            refute.defined(target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(target.projects().length, 0);
            assert.equals(target.contexts().length, 0);
        },

        "test Todo Constructor, just text": function()
        {
            var target = new Todo("Hello World");
            assert.equals(target.completed(), false);
            assert.equals("Hello World", target.text());
            refute.defined(target.completedDate());
            assert.equals("Hello World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(target.projects().length, 0);
            assert.equals(target.contexts().length, 0);
        },

        "test Todo Constructor, text with priority": function()
        {
            var target = new Todo("(A) Hello World");
            assert.equals(target.completed(), false);
            assert.equals("(A) Hello World", target.text());
            refute.defined(target.completedDate());
            assert.equals("Hello World", target.contents());
            refute.defined(target.createdDate());
            assert.equals(target.priority(), "A");
            assert.equals(target.projects().length, 0);
            assert.equals(target.contexts().length, 0);
        },

        "test Todo Constructor, completed todo, no date": function()
        {
            var target = new Todo("x Hello World");
            assert.equals(target.completed(), true);
            assert.equals("x Hello World", target.text());
            refute.defined(target.completedDate());
            assert.equals("Hello World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(target.projects().length, 0);
            assert.equals(target.contexts().length, 0);
        },

        "test Todo Constructor, completed todo, with date": function()
        {
            var target = new Todo("x 2013-12-10 Hello World");
            assert.equals(target.completed(), true);
            assert.equals("x 2013-12-10 Hello World", target.text());
            assert.equals(target.completedDate(), "2013-12-10");
            assert.equals("Hello World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(target.projects().length, 0);
            assert.equals(target.contexts().length, 0);
        },

        "test Todo Constructor, completed todo, with date, one project": function()
        {
            var target = new Todo("x 2013-12-10 Hello +World");
            assert.equals(target.completed(), true);
            assert.equals("x 2013-12-10 Hello +World", target.text());
            assert.equals(target.completedDate(), "2013-12-10");
            assert.equals("Hello +World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(target.projects().length, 1);
            assert.equals(target.projects()[0], "world");
            assert.equals(target.contexts().length, 0);
        },

        "test Todo Constructor, completed todo, with date, one context": function()
        {
            var target = new Todo("x 2013-12-10 Hello @World");
            assert.equals(target.completed(), true);
            assert.equals("x 2013-12-10 Hello @World", target.text());
            assert.equals(target.completedDate(), "2013-12-10");
            assert.equals("Hello @World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(target.contexts().length, 1);
            assert.equals(target.contexts()[0], "world");
            assert.equals(target.projects().length, 0);
        },

        "test Todo Constructor, mixed projects and contexts": function()
        {
            var target = new Todo("+Hello @World");
            assert.equals(target.completed(), false);
            assert.equals("+Hello @World", target.text());
            refute.defined(target.completedDate());
            assert.equals("+Hello @World", target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(target.contexts().length, 1);
            assert.equals(target.contexts()[0], "world");
            assert.equals(target.projects().length, 1);
            assert.equals(target.projects()[0], "hello");
        },

        "test Todo Constructor, nice and complicated": function()
        {
            var target = new Todo("x 2013-12-10 (D) This +todo has many +projects! (@and some @contexts).");
            assert.equals(target.completed(), true);
            assert.equals("x 2013-12-10 (D) This +todo has many +projects! (@and some @contexts).", target.text());
            assert.equals(target.completedDate(), "2013-12-10");
            assert.equals("This +todo has many +projects! (@and some @contexts).", target.contents());
            refute.defined(target.createdDate());
            assert.equals(target.priority(), "D");
            assert.equals(target.contexts().length, 2);
            assert.equals(target.contexts()[0], "and");
            assert.equals(target.contexts()[1], "contexts");
            assert.equals(target.projects().length, 2);
            assert.equals(target.projects()[0], "todo");
            assert.equals(target.projects()[1], "projects");
        }
    });
