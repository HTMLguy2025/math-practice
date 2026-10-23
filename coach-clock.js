// Worked examples for clock.html.
//   clock-read     {h, m, precision}
//   clock-elapsed  {startH, startM, endH, endM, elapsed, answer}
(() => {
    'use strict';

    const time = (h, m) => h + ':' + String(m).padStart(2, '0');
    const lines = (arr, extra) => Object.assign({ kind: 'lines', lines: arr }, extra || {});

    MPCoach.register('clock-read', (q) => {
        const { h, m, precision } = q;
        const five = precision !== 'hour';
        const minuteSay = m === 0 ? 'The long hand points straight up at the 12. That means 0 minutes: o’clock.'
            : m === 30 && !five ? 'The long hand points straight down at the 6. That means half past, which is 30 minutes.'
            : 'The long hand shows the minutes. Each number on the clock is 5 minutes: 1 is 5, 2 is 10, 3 is 15, and so on. It points at the ' + (m / 5) + ', so it is ' + (m / 5) + ' × 5 = ' + m + ' minutes.';
        const hourSay = m === 0 ? 'The short hand shows the hour. It points at the ' + h + ', so the hour is ' + h + '.'
            : 'The short hand shows the hour. It has moved past the ' + h + ' but has not reached the ' + (h % 12 + 1) + ' yet, so the hour is still ' + h + '.';
        return { title: 'Reading the clock: ' + time(h, m), steps: [
            { say: hourSay, scene: { kind: 'clock', h, m, show: 'both', highlight: 'hour' } },
            { say: minuteSay, scene: { kind: 'clock', h, m, show: 'both', highlight: 'minute', minuteNumbers: true } },
            { say: 'Put them together: ' + h + ' hours and ' + m + ' minutes is ' + time(h, m) + '.', scene: { kind: 'clock', h, m, show: 'both', label: time(h, m) } }] };
    });

    MPCoach.register('clock-elapsed', (q) => {
        const { startH, startM, endH, endM, elapsed, answer } = q;
        const units = elapsed / 15;
        const labels = Array.from({ length: units + 1 }, (_, i) => {
            const t = startH * 60 + startM + i * 15;
            return time((Math.floor(t / 60) - 1) % 12 + 1, t % 60);
        });
        const hrs = Math.floor(elapsed / 60), mins = elapsed % 60;
        const mid = (() => { const t = startH * 60 + startM + hrs * 60; return time((Math.floor(t / 60) - 1) % 12 + 1, t % 60); })();
        const steps = [
            { say: 'Elapsed time is how much time goes by from the start to the end. Watch the hands go from ' + time(startH, startM) + ' to ' + time(endH, endM) + '.',
              scene: { kind: 'clock', fromH: startH, fromM: startM, h: endH, m: endM, show: 'both' } },
            { say: 'Count it in jumps on a time line. Each little jump is 15 minutes.',
              scene: { kind: 'numberline', min: 0, max: units, labels, marks: [{ v: 0, color: 'a', label: 'start' }, { v: units, color: 'b', label: 'end' }] } }];
        if (hrs && mins) steps.push({ say: 'Count the whole hours first: ' + time(startH, startM) + ' to ' + mid + ' is ' + hrs + (hrs === 1 ? ' hour' : ' hours') + '. Then the minutes: ' + mid + ' to ' + time(endH, endM) + ' is ' + mins + ' minutes.',
            scene: lines(['{y:' + time(startH, startM) + ' → ' + time(endH, endM) + '}', time(startH, startM) + ' → ' + mid + ' = {b:' + hrs + ' hr}', mid + ' → ' + time(endH, endM) + ' = {b:' + mins + ' min}']) });
        else steps.push({ say: 'There are ' + units + ' jumps of 15 minutes. ' + units + ' × 15 = ' + elapsed + ' minutes' + (hrs ? ', which is ' + hrs + (hrs === 1 ? ' hour' : ' hours') + ' (60 minutes make an hour).' : '.'),
            scene: lines(['{y:' + time(startH, startM) + ' → ' + time(endH, endM) + '}', units + ' jump' + (units > 1 ? 's' : '') + ' of 15 min', units + ' × 15 = {b:' + elapsed + ' min}']) });
        steps.push({ say: 'So ' + answer + ' have passed.', scene: lines(['{y:' + time(startH, startM) + ' → ' + time(endH, endM) + '}', '{c:' + answer + '}']) });
        return { title: 'How much time passed?', steps };
    });
})();
