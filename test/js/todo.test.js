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

        "test Simplest Todo Constructor": function()
        {
            var target = new Todo("Hello World");
            assert.equals(false, target.completed());
            assert.equals();
            refute.defined(target.completedDate());
            refute.defined(target.contents());
            refute.defined(target.createdDate());
            refute.defined(target.priority());
            assert.equals(0, target.projects().length);
            assert.equals(0, target.contexts().length);
        }

    });
