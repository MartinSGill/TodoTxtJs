////////////////////////////////////////////////////////////////////
// toISO8601Date
////////////////////////////////////////////////////////////////////
test("utils.datetime.toISO8601Date - Valid String",
function()
{
    // Arrange
    var date = new Date(2000, 0 ,1 , 10 , 10 ,10, 100);
    var expected = '2000-01-01';

    // Act
    var actual = TodoTxtJs.DateTime.toISO8601Date(date);

    // Assert
    strictEqual(actual, expected, "Date not rendered correctly.");
}
);

////////////////////////////////////////////////////////////////////
// toISO8601DateTime
////////////////////////////////////////////////////////////////////
test("utils.datetime.toISO8601DateTime - Valid String",
     function()
     {
         // Arrange
         var date = new Date(2000, 0 ,1 , 10 , 10 ,10, 100);
         var expected = '2000-01-01 10:10:10';

         // Act
         var actual = TodoTxtJs.DateTime.toISO8601DateTime(date);

         // Assert
         strictEqual(actual, expected, "Date not rendered correctly.");
     }
);

////////////////////////////////////////////////////////////////////
// distance
////////////////////////////////////////////////////////////////////

test("utils.datetime.distance - defaults, today",
     function()
     {
         // Arrange
         var date = new Date();
         var expected = 0;

         // Act
         var actual = TodoTxtJs.DateTime.distance(date);

         // Assert
         strictEqual(actual, expected, "incorrect distance.");
     }
);

test("utils.datetime.distance - today",
     function()
     {
         // Arrange
         var date = new Date();
         var expected = 0;

         // Act
         var actual = TodoTxtJs.DateTime.distance(date, date);

         // Assert
         strictEqual(actual, expected, "incorrect distance.");
     }
);

test("utils.datetime.distance - negative",
     function()
     {
         // Arrange
         var date1 = new Date(2000,1,1,0,0,0,0);
         var date2 = new Date(2000,1,11,0,0,0,0);
         var expected = -10;

         // Act
         var actual = TodoTxtJs.DateTime.distance(date1, date2);

         // Assert
         strictEqual(actual, expected, "incorrect distance.");
     }
);

test("utils.datetime.distance - big positive",
     function()
     {
         // Arrange
         var date1 =  new Date(2014,1,1,23,59,59,999);
         var date2 = new Date(2000,1,1,23,59,59,999);
         var expected = 5114;

         // Act
         var actual = TodoTxtJs.DateTime.distance(date1, date2);

         // Assert
         strictEqual(actual, expected, "incorrect distance.");
     }
);

test("utils.datetime.distance - close days",
     function()
     {
         // Arrange
         var date1 = new Date(2000,1,1,23,59,59,999);
         var date2 = new Date(2000,1,2,0,0,0,0);
         var expected = -1;

         // Act
         var actual = TodoTxtJs.DateTime.distance(date1, date2);

         // Assert
         strictEqual(actual, expected, "incorrect distance.");
     }
);

test("utils.datetime.distance - close days",
     function()
     {
         // Arrange
         var date1 = new Date(2000,1,1,23,59,59,999);
         var date2 = new Date(2000,1,2,0,0,0,0);
         var expected = 1;

         // Act
         var actual = TodoTxtJs.DateTime.distance(date2, date1);

         // Assert
         strictEqual(actual, expected, "incorrect distance.");
     }
);
////////////////////////////////////////////////////////////////////
// DateToInformalString
////////////////////////////////////////////////////////////////////
test("utils.datetime.dateToInformalString - today",
     function()
     {
         // Arrange
         var date = new Date();
         var expected = 'Today';

         // Act
         var actual = TodoTxtJs.DateTime.dateToInformalString(date);

         // Assert
         deepEqual(actual, expected, "Date not correctly made informal.");
     }
);

test("utils.datetime.dateToInformalString - yesterday",
     function()
     {
         // Arrange
         var date = new Date();
         date.setHours(-24);
         var expected = 'Yesterday';

         // Act
         var actual = TodoTxtJs.DateTime.dateToInformalString(date);

         // Assert
         deepEqual(actual, expected, "Date not correctly made informal.");
     }
);

test("utils.datetime.dateToInformalString - tomorrow",
     function()
     {
         // Arrange
         var date = new Date();
         date.setDate(date.getDate() + 1);
         var expected = 'Tomorrow';

         // Act
         var actual = TodoTxtJs.DateTime.dateToInformalString(date);

         // Assert
         deepEqual(actual, expected, "Date not correctly made informal.");
     }
);

var weekdayArray = ['Sunday', 'Monday', 'Tuesday','Wednesday','Thursday','Friday','Saturday'];

test("utils.datetime.dateToInformalString - -2",
     function()
     {
         // Arrange
         var date = new Date();
         date.setDate(date.getDate() - 2);
         var expected = TodoTxtJs.DateTime.toISO8601Date(date);

         // Act
         var actual = TodoTxtJs.DateTime.dateToInformalString(date);

         // Assert
         deepEqual(actual, expected, "Date not correctly made informal.");
     }
);

test("utils.datetime.dateToInformalString - +2",
     function()
     {
         // Arrange
         var date = new Date();
         date.setDate(date.getDate() + 2);
         var expected = weekdayArray[date.getDay()];

         // Act
         var actual = TodoTxtJs.DateTime.dateToInformalString(date);

         // Assert
         deepEqual(actual, expected, "Date not correctly made informal.");
     }
);

test("utils.datetime.dateToInformalString - +3",
     function()
     {
         // Arrange
         var date = new Date();
         date.setDate(date.getDate() + 3);
         var expected = weekdayArray[date.getDay()];

         // Act
         var actual = TodoTxtJs.DateTime.dateToInformalString(date);

         // Assert
         deepEqual(actual, expected, "Date not correctly made informal.");
     }
);

test("utils.datetime.dateToInformalString - +4",
     function()
     {
         // Arrange
         var date = new Date();
         date.setDate(date.getDate() + 4);
         var expected = weekdayArray[date.getDay()];

         // Act
         var actual = TodoTxtJs.DateTime.dateToInformalString(date);

         // Assert
         deepEqual(actual, expected, "Date not correctly made informal.");
     }
);

test("utils.datetime.dateToInformalString - +5",
     function()
     {
         // Arrange
         var date = new Date();
         date.setDate(date.getDate() + 5);
         var expected = weekdayArray[date.getDay()];

         // Act
         var actual = TodoTxtJs.DateTime.dateToInformalString(date);

         // Assert
         deepEqual(actual, expected, "Date not correctly made informal.");
     }
);

test("utils.datetime.dateToInformalString - +6",
     function()
     {
         // Arrange
         var date = new Date();
         date.setDate(date.getDate() + 6);
         var expected = weekdayArray[date.getDay()];

         // Act
         var actual = TodoTxtJs.DateTime.dateToInformalString(date);

         // Assert
         deepEqual(actual, expected, "Date not correctly made informal.");
     }
);

test("utils.datetime.dateToInformalString - +7",
     function()
     {
         // Arrange
         var date = new Date();
         date.setDate(date.getDate() + 7);
         var expected = TodoTxtJs.DateTime.toISO8601Date(date);

         // Act
         var actual = TodoTxtJs.DateTime.dateToInformalString(date);

         // Assert
         deepEqual(actual, expected, "Date not correctly made informal.");
     }
);

////////////////////////////////////////////////////////////////////
//  informalDayToDate
////////////////////////////////////////////////////////////////////
test("utils.datetime.informalDayToDate - today, default",
     function()
     {
         // Arrange
         var date = new Date();
         var expected = moment(date).startOf('day').toDate();
         var target = "today";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - today",
     function()
     {
         // Arrange
         var date = new Date();
         var expected = moment(date).startOf('day').toDate();
         var target = "today";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, new Date());

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - today - strange capitalisation",
     function()
     {
         // Arrange
         var date = new Date();
         var expected = moment(date).startOf('day').toDate();
         var target = "ToDaY";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, new Date());

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - nonsense",
     function()
     {
         // Arrange
         var date = new Date();
         var expected = moment(date).startOf('day').toDate();
         var target = "wibble";

         // Act
         // Assert
         throws(function() { TodoTxtJs.DateTime.informalDayToDate(target, new Date()); }, "throws correctly");
     }
);

test("utils.datetime.informalDayToDate - yesterday",
     function()
     {
         // Arrange
         var date = new Date();
         date.setDate(date.getDate() - 1);
         var expected = moment(date).startOf('day').toDate();
         var target = "yesterday";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, new Date());

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - tomorrow",
     function()
     {
         // Arrange
         var date = new Date();
         date.setDate(date.getDate() + 1);
         var expected = moment(date).startOf('day').toDate();
         var target = "tomorrow";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, new Date());

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - monday, same day",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,21,0,0,0,0);
         var target = "monday";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - monday, later day",
     function()
     {
         // Arrange
         var date = new Date(2013,0,12,0,0,0,0);
         var expected = new Date(2013,0,14,0,0,0,0);
         var target = "monday";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - mon",
     function()
     {
         // Arrange
         var date = new Date(2013,0,12,0,0,0,0);
         var expected = new Date(2013,0,14,0,0,0,0);
         var target = "mon";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - tuesday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,15,0,0,0,0);
         var target = "tuesday";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - tue",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,15,0,0,0,0);
         var target = "tuesday";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - wednesday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,16,0,0,0,0);
         var target = "wednesday";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - wed",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,16,0,0,0,0);
         var target = "wed";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - thursday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,17,0,0,0,0);
         var target = "thursday";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - thurs",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,17,0,0,0,0);
         var target = "thurs";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - friday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,18,0,0,0,0);
         var target = "friday";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - fri",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,18,0,0,0,0);
         var target = "fri";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - saturday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,19,0,0,0,0);
         var target = "saturday";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - sat",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,19,0,0,0,0);
         var target = "sat";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - sunday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,20,0,0,0,0);
         var target = "sunday";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.informalDayToDate - sun",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = new Date(2013,0,20,0,0,0,0);
         var target = "sun";

         // Act
         var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

////////////////////////////////////////////////////////////////////
// weekdayToRelativeDay
////////////////////////////////////////////////////////////////////
test("utils.datetime.weekdayToRelativeDay - monday, same day",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 7;
         var target = "monday";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - monday, same day, number",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 7;
         var target = 1;

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - monday, later day",
     function()
     {
         // Arrange
         var date = new Date(2013,0,12,0,0,0,0);
         var expected = 2;
         var target = "monday";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - monday, later day, number",
     function()
     {
         // Arrange
         var date = new Date(2013,0,12,0,0,0,0);
         var expected = 2;
         var target = 1;

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - mon",
     function()
     {
         // Arrange
         var date = new Date(2013,0,12,0,0,0,0);
         var expected = 2;
         var target = "mon";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - tuesday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 1;
         var target = "tuesday";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - tue",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 1;
         var target = "tuesday";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - wednesday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 2;
         var target = "wednesday";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - wed",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 2;
         var target = "wed";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - thursday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 3;
         var target = "thursday";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - thurs",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 3;
         var target = "thurs";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - friday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 4;
         var target = "friday";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - fri",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 4;
         var target = "fri";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - saturday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 5;
         var target = "saturday";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - sat",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 5;
         var target = "sat";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - sunday",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 6;
         var target = "sunday";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

test("utils.datetime.weekdayToRelativeDay - sun",
     function()
     {
         // Arrange
         var date = new Date(2013,0,14,0,0,0,0);
         var expected = 6;
         var target = "sun";

         // Act
         var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

         // Assert
         deepEqual(actual, expected, "Date not correct.");
     }
);

////////////////////////////////////////////////////////////////////
//  relativeDayToDate
////////////////////////////////////////////////////////////////////
test("utils.datetime.relativeDayToDate - default",
     function()
     {
         // Arrange
         var date = new Date();
         var days = 1;
         date.setDate(date.getDate() + days);
         var expected = moment(date).startOf('day').toDate();

         // Act
         var actual = TodoTxtJs.DateTime.relativeDayToDate(days);

         // Assert
         deepEqual(actual, expected, "Date not adjusted correctly.");
     }
);

test("utils.datetime.relativeDayToDate - non default",
     function()
     {
         // Arrange
         var date = new Date();
         var days = 1;
         date.setDate(date.getDate() + days);
         var expected = moment(date).startOf('day').toDate();

         // Act
         var actual = TodoTxtJs.DateTime.relativeDayToDate(days, new Date());

         // Assert
         deepEqual(actual, expected, "Date not adjusted correctly.");
     }
);

test("utils.datetime.relativeDayToDate - zero",
     function()
     {
         // Arrange
         var date = new Date();
         var days = 0;
         date.setDate(date.getDate() + days);
         var expected = moment(date).startOf('day').toDate();

         // Act
         var actual = TodoTxtJs.DateTime.relativeDayToDate(days, new Date());

         // Assert
         deepEqual(actual, expected, "Date not adjusted correctly.");
     }
);

test("utils.datetime.relativeDayToDate - negative",
     function()
     {
         // Arrange
         var date = new Date();
         var days = -5;
         date.setDate(date.getDate() + days);
         var expected = moment(date).startOf('day').toDate();

         // Act
         var actual = TodoTxtJs.DateTime.relativeDayToDate(days, new Date());

         // Assert
         deepEqual(actual, expected, "Date not adjusted correctly.");
     }
);

