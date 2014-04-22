/*******************************************************************************
 * Copyright (C) 2013-2014 Martin Gill
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
module("TodoManager");
test("add - string",
     function()
     {
         // Arrange
         var data = "(A) Hello World";
         var target = new TodoTxtJs.TodoManager();

         // Act
         target.add(data);
         var todo = target.getAt(0);

         // Assert
         ok(todo !== null);
         equal(todo.priority(), "A");
         equal(todo.index, 0);
     }
);

test("add - object",
     function()
     {
         // Arrange
         var data = "(A) Hello World";
         var expected = new TodoTxtJs.Todo(data);
         expected.index = 5; // Give it a random number
         var target = new TodoTxtJs.TodoManager();

         // Act
         target.add(expected);
         var actual = target.getAt(0);

         // Assert
         ok(actual !== null);
         equal(actual.priority(), expected.priority());
         equal(actual.index, 0);
     }
);

test("add - empty string",
     function()
     {
         // Arrange
         var data = "   ";
         var target = new TodoTxtJs.TodoManager();

         // Act
         target.add(data);
         var actual = target.getAt(0);

         // Assert
         ok(actual === null, "todo should have been null");
     }
);

test("add - multiple with gap",
     function()
     {
         // Arrange
         var data1 = "(A) Hello World";
         var data2 = "(B) Hello World";

         var target = new TodoTxtJs.TodoManager();

         // Act
         target.add(data1);
         target.add("");
         target.add(data2);

         var actual1 = target.getAt(0);
         var actual2 = target.getAt(1);

         // Assert
         equal(actual1.priority(), "A");
         equal(actual2.priority(), "B");
         equal(actual1.index, 0);
         equal(actual2.index, 2);
     }
);

test("add - to output array preserve gaps",
     function()
     {
         // Arrange
         var data1 = "(A) Hello World";
         var data2 = "(B) Hello World";

         var target = new TodoTxtJs.TodoManager();

         // Act
         target.add(data1);
         target.add("");
         target.add(data2);

         var actual = target.exportToStringArray();

         // Assert
         equal(actual.length, 3);
         equal(actual[1], "");
     }
);

test("add - import/export round-trip",
     function()
     {
         // Arrange
         var data = ["(A) Hello World", "(B) Hello World", "(C) Hello World"];
         var target = new TodoTxtJs.TodoManager();

         // Act
         target.loadFromStringArray(data);
         var actual = target.exportToStringArray();

         // Assert
         equal(actual.length, 3);
         deepEqual(actual, data);
     }
);

test("add - import/export round-trip with gaps",
     function()
     {
         // Arrange
         var data = ["(A) Hello World", "", "", "(B) Hello World", "", "(C) Hello World"];
         var target = new TodoTxtJs.TodoManager();

         // Act
         target.loadFromStringArray(data);
         var actual = target.exportToStringArray();

         // Assert
         equal(actual.length, 6);
         deepEqual(actual, data);
     }
);
