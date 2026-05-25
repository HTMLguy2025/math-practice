var DAY_OFFSET = 0;
var STREAK_OVERRIDE = true;
var STREAK_OVERRIDE_VALUE = 4;
var BONUS_OVERRIDE = true;
var BONUS_OVERRIDE_VALUE = 4;






function getToday() {
    var d = new Date();
    if (DAY_OFFSET !== 0) d.setDate(d.getDate() + DAY_OFFSET);
    return d;
}
