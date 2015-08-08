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

describe('DateTime Utilities', function () {

    describe('toISO8601Date', function () {
        it("validly formats dates",
            function () {
                var date = new Date(2000, 0, 1, 10, 10, 10, 100);
                var expected = '2000-01-01';
                var actual = TodoTxtJs.DateTime.toISO8601Date(date);
                expect(actual).toBe(expected);
            }
        );

    });
    describe('toISO8601DateTime', function () {
        it("validly formats data-times",
            function () {
                var date = new Date(2000, 0, 1, 10, 10, 10, 100);
                var expected = '2000-01-01 10:10:10';
                var actual = TodoTxtJs.DateTime.toISO8601DateTime(date);

                expect(actual).toBe(expected);
            }
        );

    });
    describe('distance', function () {

        it("compares to 'today' by default",
            function () {
                var date = new Date();
                var expected = 0;
                var actual = TodoTxtJs.DateTime.distance(date);

                expect(actual).toBe(expected);
            }
        );

        it("correctly gives zero distance for 'today'",
            function () {
                var date = new Date();
                var expected = 0;
                var actual = TodoTxtJs.DateTime.distance(date, date);

                expect(actual).toBe(expected);
            }
        );

        it("correctly gives negative distance",
            function () {
                var dateA = new Date(2000, 1, 1, 0, 0, 0, 0);
                var dateB = new Date(2000, 1, 11, 0, 0, 0, 0);
                var expected = -10;
                var actual = TodoTxtJs.DateTime.distance(dateA, dateB);

                expect(actual).toBe(expected);
            }
        );

        it("correctly returns a large positive distance",
            function () {
                var dateA = new Date(2014, 1, 1, 23, 59, 59, 999);
                var dateB = new Date(2000, 1, 1, 23, 59, 59, 999);
                var expected = 5114;
                var actual = TodoTxtJs.DateTime.distance(dateA, dateB);

                expect(actual).toBe(expected);
            }
        );

        it("correctly shows -1 millisecond difference as distance of -1",
            function () {
                var dateA = new Date(2000, 1, 1, 23, 59, 59, 999);
                var dateB = new Date(2000, 1, 2, 0, 0, 0, 0);
                var expected = -1;
                var actual = TodoTxtJs.DateTime.distance(dateA, dateB);

                expect(actual).toBe(expected);
            }
        );

        it("correctly shows 1 millisecond difference as distance of 1",
            function () {
                // Arrange
                var dateA = new Date(2000, 1, 1, 23, 59, 59, 999);
                var dateB = new Date(2000, 1, 2, 0, 0, 0, 0);
                var expected = 1;
                var actual = TodoTxtJs.DateTime.distance(dateB, dateA);

                expect(actual).toBe(expected);
            }
        );
    });
    describe('DateToInformalString', function () {
        it("correctly gives informal name for 'today'",
            function () {
                var date = new Date();
                var expected = 'Today';
                var actual = TodoTxtJs.DateTime.dateToInformalString(date);

                expect(actual).toBe(expected);
            }
        );

        it("correctly gives informal name for 'yesterday'",
            function () {
                var date = new Date();
                date.setHours(-24);
                var expected = 'Yesterday';
                var actual = TodoTxtJs.DateTime.dateToInformalString(date);

                expect(actual).toBe(expected);
            }
        );

        it("correctly gives informal name for 'tomorrow'",
            function () {
                var date = new Date();
                date.setDate(date.getDate() + 1);
                var expected = 'Tomorrow';
                var actual = TodoTxtJs.DateTime.dateToInformalString(date);

                expect(actual).toBe(expected);
            }
        );

        var weekdayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        it("does not return informal string for date two days in the past",
            function () {
                var date = new Date();
                date.setDate(date.getDate() - 2);
                var expected = TodoTxtJs.DateTime.toISO8601Date(date);
                var actual = TodoTxtJs.DateTime.dateToInformalString(date);

                expect(actual).toBe(expected);
            }
        );

        it("returns correct informal date for two days in the future",
            function () {
                var date = new Date();
                date.setDate(date.getDate() + 2);
                var expected = weekdayArray[date.getDay()];
                var actual = TodoTxtJs.DateTime.dateToInformalString(date);

                expect(actual).toBe(expected);
            }
        );

        it("returns correct informal date for three days in the future",
            function () {
                var date = new Date();
                date.setDate(date.getDate() + 3);
                var expected = weekdayArray[date.getDay()];
                var actual = TodoTxtJs.DateTime.dateToInformalString(date);

                expect(actual).toBe(expected);
            }
        );

        it("returns correct informal date for four days in the future",
            function () {
                var date = new Date();
                date.setDate(date.getDate() + 4);
                var expected = weekdayArray[date.getDay()];
                var actual = TodoTxtJs.DateTime.dateToInformalString(date);

                expect(actual).toBe(expected);
            }
        );

        it("returns correct informal date for five days in the future",
            function () {
                var date = new Date();
                date.setDate(date.getDate() + 5);
                var expected = weekdayArray[date.getDay()];
                var actual = TodoTxtJs.DateTime.dateToInformalString(date);

                expect(actual).toBe(expected);
            }
        );

        it("returns correct informal date for six days in the future",
            function () {
                var date = new Date();
                date.setDate(date.getDate() + 6);
                var expected = weekdayArray[date.getDay()];
                var actual = TodoTxtJs.DateTime.dateToInformalString(date);

                expect(actual).toBe(expected);
            }
        );

        it("returns correct actual date for seven days in the future",
            function () {
                var date = new Date();
                date.setDate(date.getDate() + 7);
                var expected = TodoTxtJs.DateTime.toISO8601Date(date);
                var actual = TodoTxtJs.DateTime.dateToInformalString(date);

                expect(actual).toBe(expected);
            }
        );

    });
    describe(' informalDayToDate', function () {
        it("correctly converts 'today' to date",
            function () {
                var date = new Date();
                var expected = moment(date).startOf('day').toDate();
                var target = "today";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target);

                expect(actual).toEqual(expected);
            }
        );

        it("correctly converts 'today' to date, when reference date given",
            function () {
                var date = new Date();
                var expected = moment(date).startOf('day').toDate();
                var target = "today";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, new Date());

                expect(actual).toEqual(expected);
            }
        );

        it("correctly converts 'today' to date, ignoring case",
            function () {
                var date = new Date();
                var expected = moment(date).startOf('day').toDate();
                var target = "ToDaY";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, new Date());

                expect(actual).toEqual(expected);
            }
        );

        it("correctly throws error for unrecognised string",
            function () {
                var date = new Date();
                var target = "wibble";

                expect(function () {
                    TodoTxtJs.DateTime.informalDayToDate(target, new Date());
                }).toThrow()
            }
        );

        it("gives correct date for 'yesterday'",
            function () {
                var date = new Date();
                date.setDate(date.getDate() - 1);
                var expected = moment(date).startOf('day').toDate();
                var target = "yesterday";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, new Date());

                expect(actual).toEqual(expected);
            }
        );

        it("gives correct date for 'tomorrow'",
            function () {
                var date = new Date();
                date.setDate(date.getDate() + 1);
                var expected = moment(date).startOf('day').toDate();
                var target = "tomorrow";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, new Date());

                expect(actual).toEqual(expected);
            }
        );

        it("correctly returns date for informal day for exactly one week from now",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 21, 0, 0, 0, 0);
                var target = "monday";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("correctly returns date for monday",
            function () {
                var date = new Date(2013, 0, 12, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 14, 0, 0, 0, 0);
                var target = "monday";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct date for monday - short informal form",
            function () {
                var date = new Date(2013, 0, 12, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 14, 0, 0, 0, 0);
                var target = "mon";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("correctly returns date for tuesday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 15, 0, 0, 0, 0);
                var target = "tuesday";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct date for tuesday - short informal form",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 15, 0, 0, 0, 0);
                var target = "tuesday";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("correctly returns date for wednesday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 16, 0, 0, 0, 0);
                var target = "wednesday";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct date for wednesday - short informal form",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 16, 0, 0, 0, 0);
                var target = "wed";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("correctly returns date for thursday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 17, 0, 0, 0, 0);
                var target = "thursday";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct date for thursday - short informal form",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 17, 0, 0, 0, 0);
                var target = "thurs";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("correctly returns date for friday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 18, 0, 0, 0, 0);
                var target = "friday";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct date for friday - short informal form",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 18, 0, 0, 0, 0);
                var target = "fri";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("correctly returns date for saturday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 19, 0, 0, 0, 0);
                var target = "saturday";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct date for saturday - short informal form",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 19, 0, 0, 0, 0);
                var target = "sat";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("correctly returns date for sunday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 20, 0, 0, 0, 0);
                var target = "sunday";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct date for sunday - short informal form",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = new Date(2013, 0, 20, 0, 0, 0, 0);
                var target = "sun";
                var actual = TodoTxtJs.DateTime.informalDayToDate(target, date);

                expect(actual).toEqual(expected);
            }
        );

    });
    describe('weekdayToRelativeDay', function () {
        it("returns correct distance for relative day - monday, same day",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 7;
                var target = "monday";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - monday, same day, number",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 7;
                var target = 1;
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - monday, later day",
            function () {
                var date = new Date(2013, 0, 12, 0, 0, 0, 0);
                var expected = 2;
                var target = "monday";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - monday, later day, number",
            function () {
                var date = new Date(2013, 0, 12, 0, 0, 0, 0);
                var expected = 2;
                var target = 1;
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - mon",
            function () {
                var date = new Date(2013, 0, 12, 0, 0, 0, 0);
                var expected = 2;
                var target = "mon";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - tuesday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 1;
                var target = "tuesday";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - tue",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 1;
                var target = "tuesday";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - wednesday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 2;
                var target = "wednesday";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - wed",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 2;
                var target = "wed";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - thursday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 3;
                var target = "thursday";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - thurs",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 3;
                var target = "thurs";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - friday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 4;
                var target = "friday";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - fri",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 4;
                var target = "fri";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - saturday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 5;
                var target = "saturday";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - sat",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 5;
                var target = "sat";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - sunday",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 6;
                var target = "sunday";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct distance for relative day - sun",
            function () {
                var date = new Date(2013, 0, 14, 0, 0, 0, 0);
                var expected = 6;
                var target = "sun";
                var actual = TodoTxtJs.DateTime.weekdayToRelativeDay(target, date);

                expect(actual).toEqual(expected);
            }
        );

    });
    describe(' relativeDayToDate', function () {
        it("returns correct date - default",
            function () {
                var date = new Date();
                var days = 1;
                date.setDate(date.getDate() + days);
                var expected = moment(date).startOf('day').toDate();
                var actual = TodoTxtJs.DateTime.relativeDayToDate(days);

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct date - non default",
            function () {
                var date = new Date();
                var days = 1;
                date.setDate(date.getDate() + days);
                var expected = moment(date).startOf('day').toDate();
                var actual = TodoTxtJs.DateTime.relativeDayToDate(days, new Date());

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct date - zero",
            function () {
                var date = new Date();
                var days = 0;
                date.setDate(date.getDate() + days);
                var expected = moment(date).startOf('day').toDate();
                var actual = TodoTxtJs.DateTime.relativeDayToDate(days, new Date());

                expect(actual).toEqual(expected);
            }
        );

        it("returns correct date - negative",
            function () {
                var date = new Date();
                var days = -5;
                date.setDate(date.getDate() + days);
                var expected = moment(date).startOf('day').toDate();
                var actual = TodoTxtJs.DateTime.relativeDayToDate(days, new Date());

                expect(actual).toEqual(expected);
            }
        );

    });
});