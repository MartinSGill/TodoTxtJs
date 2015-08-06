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

/// <reference path="../../../typings/tsd.d.ts" />

module TodoTxtJs
{
    enum Weekdays
    {
        sun = 0,
        mon = 1,
        tue = 2,
        wed = 3,
        thurs = 4,
        fri = 5,
        sat = 6,
        sunday = 0,
        monday = 1,
        tuesday = 2,
        wednesday = 3,
        thursday = 4,
        friday = 5,
        saturday = 6
    }

    export class DateTime
    {
        /**
         * Converts date to ISO date format;
         * @param date the date to format.
         * @returns {string}
         */
        public static toISO8601Date(date : Date) : string
        {
            var _moment = moment(date);
            return _moment.format("YYYY-MM-DD");
        }

        /**
         * Converts date to ISO date & time format
         * @param date the date to format
         * @returns {string}
         */
        public static toISO8601DateTime(date : Date) : string
        {
            var _moment = moment(date);
            return _moment.format("YYYY-MM-DD HH:mm:ss");
        }

        /**
         * Compares two dates and gives the distance between them
         * in days. Negative means the date has passed.
         *
         * @param date The date of interest.
         * @param other The date to compare to, defaults to now.
         * @remarks Not overly accurate atm.
         */
        public static distance(date: Date, other?: Date): number;
        public static distance(date: string, other?: Date): number;
        public static distance(date: any, other?: Date): number
        {
            var left: moment.Moment;
            var right: moment.Moment = moment(other);

            if (date instanceof Date || (typeof(date) === "string"))
            {
                left = moment(date);
            }
            else
            {
                throw "Invalid Date";
            }

            if (!other)
            {
                right = moment();
            }

            return left.startOf('day').diff(right.startOf('day'), 'days');
        }

        public static dateToInformalString(date: Date) : string
        {
            var distance = DateTime.distance(date);
            switch (distance)
            {
                case -1:
                    return "Yesterday";
                    break;
                case 0:
                    return "Today";
                    break;
                case 1:
                    return "Tomorrow";
                    break;
                default:
                    if (distance > 1 && distance < 7)
                    {
                        var weekday :string = Weekdays[date.getDay()];
                        weekday = weekday[0].toUpperCase() + weekday.slice(1);
                        return weekday;
                    }
                    else
                    {
                        return DateTime.toISO8601Date(date);
                    }
            }
        }

        /**
         * Takes an informal day name and returns an actual date.
         * @param informal One of today, yesterday, or a weekday name.
         * @param other The date to base this off, defaults to today.
         * @returns {Date}
         */
        public static informalDayToDate(informal: string, other?: Date) : Date
        {
            var _informal = informal.toLowerCase();
            var _other: Date;
            _other = (other instanceof Date) ? moment(other).startOf('day').toDate() : DateTime.today();
            var days = 0;

            switch(_informal)
            {
                case "today":
                    days = 0;
                    break;
                case "yesterday":
                    days = -1;
                    break;
                case "tomorrow":
                    days = 1;
                    break;
                default:
                    if (/(?:mon|tues|wednes|thurs|fri|satur|sun)day|(?:mon|tue|wed|thur|fri|sat|sun)/.test(_informal))
                    {
                        days = DateTime.weekdayToRelativeDay(_informal, _other);
                    }
                    else
                    {
                        throw "unknown: " + informal;
                    }
            }

            return DateTime.relativeDayToDate(days, _other);
        }

        /**
         * Takes a relative day and applies it to date specified.
         * @param days The number of days (can be negative).
         * @param other The date to apply this to. Defaults to today.
         */
        public static relativeDayToDate(days: string, other?: Date) : Date;
        public static relativeDayToDate(days: number, other?: Date ) : Date;
        public static relativeDayToDate(days: any, other?: Date) : Date
        {
            if (typeof days === "string")
            {
                days = parseInt(<string>days)
            }
            else if (typeof days === "number")
            {
                days = <number>days;
            }
            else { throw "Invalid Type"; }

            var _other;
            _other = other instanceof Date ? moment(other).startOf('day') : moment().startOf('day');
            var _result = _other.add('days', <number>days);
            return _result.toDate();
        }

        /**
         * Returns to normalised date for Today.
         * @returns {Date}
         */
        public static today() : Date
        {
            return moment().startOf('day').toDate();
        }

        /**
         * Given a weekday, returns the number of days until that day.
         * e.g. if today is Monday, and weekday is Wednesday, the result
         * is 2.
         * @param weekday Weekday as number (same as Date.getDay() or string).
         * @param other The date to compare to. Defaults to today.
         */
        public static weekdayToRelativeDay(weekday: string, other?: Date) : number;
        public static weekdayToRelativeDay(weekday: number, other?: Date): number;
        public static weekdayToRelativeDay(weekday: any, other?: Date): number
        {
            var _weekday: Weekdays;
            if (typeof weekday === "string")
            {
                _weekday = Weekdays[<string>weekday];
            }
            else if (typeof weekday === "number")
            {
                _weekday = <number>weekday;
            }
            else
            {
                throw "invalid type for weekday";
            }

            var _other: Date;
            _other = (other instanceof Date) ? moment(other).startOf('day').toDate() : DateTime.today();
            var result: number = 0;

            if (_weekday == _other.getDay())
            {
                result = 7;
            }
            else if (_weekday < _other.getDay())
            {
                result = (_weekday + 7) - _other.getDay();
            }
            else // _weekday > _other.getDay()
            {
                result = _weekday - _other.getDay();
            }

            return result;
        }
    }
}
