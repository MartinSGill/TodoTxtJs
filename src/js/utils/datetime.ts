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

module TodoTxtJs
{
    enum Weekdays
    {
        sun = 0,
        mon = 1,
        tue = 2,
        wed = 3,
        thur = 4,
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
            var result = date.getFullYear() + "-";
            result += DateTime.leadingZero(date.getMonth() + 1) + "-";
            result += DateTime.leadingZero(date.getDate());
            return result;
        }

        /**
         * Converts date to ISO date & time format
         * @param date the date to format
         * @returns {string}
         */
        public static toISO8601DateTime(date : Date) : string
        {
            var result = DateTime.toISO8601Date(date) + " ";
            result += DateTime.leadingZero(date.getHours()) + ":";
            result += DateTime.leadingZero(date.getMinutes()) + ":";
            result += DateTime.leadingZero(date.getSeconds());
            return result;
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
            var left: Date;
            var right: Date;

            if (date instanceof Date)
            {
                left = date;
            }
            else if (typeof(date) === "string")
            {
                left = new Date(date);
            }
            else
            {
                throw "Invalid Date";
            }

            if (!other)
            {
                right = new Date();
            }


            left = DateTime.normaliseDate(left);
            right = DateTime.normaliseDate(right);

            var difference = left.valueOf() - right.valueOf();
            var millisecPerDay = 86400000;
            return Math.round(difference / millisecPerDay);
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
            other ? _other = DateTime.normaliseDate(other) : _other = DateTime.today();
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
            var days: number;
            if (typeof days === "string")
            {
                days = parseInt(days)
            }
            else if (typeof days === "number")
            {
                days = days;
            }
            else { throw "Invalid Type"; }

            var _other;
            other ? _other = DateTime.normaliseDate(other) : _other = DateTime.today();
            var result = new Date(_other.valueOf());
            result.setDate( result.getDate() + days );
            return result;
        }

        /**
         * Ensures that all Date objects that represent only a day
         * value can be easily compared.
         * @param date The date to normalise.
         * @returns {Date}
         */
        private static normaliseDate(date: Date)
        {
            var result = new Date(date.valueOf());
            result.setHours(0);
            result.setMinutes(0);
            result.setSeconds(0);
            result.setMilliseconds(0);
            return result;
        }

        /**
         * Returns to normalised date for Today.
         * @returns {Date}
         */
        public static today() : Date
        {
            return DateTime.normaliseDate(new Date());
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

            var _days = 0;
            var _other: Date;
            other ? _other = DateTime.normaliseDate(other) : _other = DateTime.today();
            var result: number = 0;

            // Later this week
            if (_weekday > _other.getDay())
            {
                result = _weekday - _other.getDay();
            }
            // Next week
            else
            {
                result = _weekday + (6 - _other.getDay());
            }

            return result;
        }


        /**
         * Adds a leading zero to a string if it needs it.
         * @param value The value.
         * @param count Number of leading zeros. Defaults to one.
         * @returns {string}
         */
        private static leadingZero(value : number, count? : number) : string
        {
            if (!count)
            {
                count = 1;
            }

            var result = "";
            if (value < count * 10)
            {
                for (var i = 0; i < count; i++)
                {
                    result += "0";
                }
            }

            result += value;
            return result;
        }

    }
}
