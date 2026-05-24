var DAY_OFFSET = 0;
var STREAK_OVERRIDE = false;
var STREAK_OVERRIDE_VALUE = 0;

function getToday() {
    var d = new Date();
    if (DAY_OFFSET !== 0) d.setDate(d.getDate() + DAY_OFFSET);
    return d;
}
