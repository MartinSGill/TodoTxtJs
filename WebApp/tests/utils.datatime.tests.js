////////////////////////////////////////////////////////////////////
// toISO8601Date
////////////////////////////////////////////////////////////////////
module("DateTime");
test("toISO8601Date - Valid String",
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
test("toISO8601DateTime - Valid String",
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

test("distance - defaults, today",
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

test("distance - today",
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

test("distance - negative",
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

test("distance - big positive",
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

test("distance - close days",
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

test("distance - close days",
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
test("dateToInformalString - today",
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

test("dateToInformalString - yesterday",
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

test("dateToInformalString - tomorrow",
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

test("dateToInformalString - -2",
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

test("dateToInformalString - +2",
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

test("dateToInformalString - +3",
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

test("dateToInformalString - +4",
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

test("dateToInformalString - +5",
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

test("dateToInformalString - +6",
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

test("dateToInformalString - +7",
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
test("informalDayToDate - today, default",
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

test("informalDayToDate - today",
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

test("informalDayToDate - today - strange capitalisation",
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

test("informalDayToDate - nonsense",
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

test("informalDayToDate - yesterday",
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

test("informalDayToDate - tomorrow",
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

test("informalDayToDate - monday, same day",
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

test("informalDayToDate - monday, later day",
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

test("informalDayToDate - mon",
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

test("informalDayToDate - tuesday",
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

test("informalDayToDate - tue",
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

test("informalDayToDate - wednesday",
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

test("informalDayToDate - wed",
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

test("informalDayToDate - thursday",
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

test("informalDayToDate - thurs",
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

test("informalDayToDate - friday",
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

test("informalDayToDate - fri",
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

test("informalDayToDate - saturday",
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

test("informalDayToDate - sat",
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

test("informalDayToDate - sunday",
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

test("informalDayToDate - sun",
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
test("weekdayToRelativeDay - monday, same day",
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

test("weekdayToRelativeDay - monday, same day, number",
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

test("weekdayToRelativeDay - monday, later day",
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

test("weekdayToRelativeDay - monday, later day, number",
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

test("weekdayToRelativeDay - mon",
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

test("weekdayToRelativeDay - tuesday",
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

test("weekdayToRelativeDay - tue",
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

test("weekdayToRelativeDay - wednesday",
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

test("weekdayToRelativeDay - wed",
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

test("weekdayToRelativeDay - thursday",
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

test("weekdayToRelativeDay - thurs",
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

test("weekdayToRelativeDay - friday",
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

test("weekdayToRelativeDay - fri",
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

test("weekdayToRelativeDay - saturday",
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

test("weekdayToRelativeDay - sat",
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

test("weekdayToRelativeDay - sunday",
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

test("weekdayToRelativeDay - sun",
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
test("relativeDayToDate - default",
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

test("relativeDayToDate - non default",
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

test("relativeDayToDate - zero",
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

test("relativeDayToDate - negative",
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

