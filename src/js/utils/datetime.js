var DateTime;
(function (DateTime) {
    function leadingZero(value, count) {
        if(!count) {
            count = 1;
        }
        var result = "";
        if(value < count * 10) {
            for(var i = 0; i < count; i++) {
                result += "0";
            }
        }
        result += value;
        return result;
    }
    function toISO8601Date(date) {
        var result = date.getFullYear() + "-";
        result += leadingZero(date.getMonth() + 1) + "-";
        result += leadingZero(date.getDate());
        return result;
    }
    DateTime.toISO8601Date = toISO8601Date;
    function toISO8601DateTime(date) {
        var result = toISO8601Date(date) + " ";
        result += leadingZero(date.getHours()) + ":";
        result += leadingZero(date.getMinutes()) + ":";
        result += leadingZero(date.getSeconds());
        return result;
    }
    DateTime.toISO8601DateTime = toISO8601DateTime;
})(DateTime || (DateTime = {}));
//@ sourceMappingURL=datetime.js.map
