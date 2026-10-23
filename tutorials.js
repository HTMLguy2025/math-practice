// Tutorial registry — which tutorials exist, which activity belongs to which,
// and the lookups the rest of the app uses. The lessons themselves are plain
// data in tutorial-content-*.js (see MPTutorials.define); the animated player
// lives in tutorial-player.js.
//
// Adding a lesson: write it with MPTutorials.define(...), add its id to READY
// below, and add the content file to tutorial.html. dev/check-activities.js
// verifies that every activity maps to a topic and that READY matches the
// lessons that are actually defined.
(() => {
    'use strict';

    // Every topic, in the order the hub shows them. `group` matches the launcher.
    const TOPICS = [
        // Simple operations
        { id: 'add-small',          group: 'Simple Operations', title: 'Adding small numbers',            blurb: 'Put two small groups together, using a ten-frame.' },
        { id: 'add-big',            group: 'Simple Operations', title: 'Adding bigger numbers',           blurb: 'Add in columns and carry when you need to.' },
        { id: 'subtract-small',     group: 'Simple Operations', title: 'Subtracting small numbers',       blurb: 'Take a few away and see what is left.' },
        { id: 'subtract-big',       group: 'Simple Operations', title: 'Subtracting bigger numbers',      blurb: 'Subtract in columns and borrow when you need to.' },
        { id: 'multiply-small',     group: 'Simple Operations', title: 'Multiplying small numbers',       blurb: 'Equal groups and times tables.' },
        { id: 'multiply-big',       group: 'Simple Operations', title: 'Multiplying bigger numbers',      blurb: 'Break big numbers into easy pieces.' },
        { id: 'divide-small',       group: 'Simple Operations', title: 'Dividing small numbers',          blurb: 'Share things out equally.' },
        { id: 'divide-big',         group: 'Simple Operations', title: 'Dividing bigger numbers',         blurb: 'Long division, one step at a time.' },
        { id: 'decimals',           group: 'Simple Operations', title: 'Working with decimals',           blurb: 'Line up the decimal point and keep going.' },
        { id: 'negatives',          group: 'Simple Operations', title: 'Working with negative numbers',   blurb: 'Numbers below zero, and the rules for signs.' },

        // Level 1
        { id: 'counting-numberline', group: 'Level 1', title: 'Counting on a number line',    blurb: 'Hop forward and backward to find any number.' },
        { id: 'odd-even',            group: 'Level 1', title: 'Odd and even numbers',         blurb: 'Can you share it fairly into pairs?' },
        { id: 'comparing',           group: 'Level 1', title: 'Comparing numbers',            blurb: 'Which number is bigger? Use < , > and =.' },
        { id: 'place-value',         group: 'Level 1', title: 'Place value',                  blurb: 'Tens, ones and hundreds: what each digit is worth.' },
        { id: 'clock-hour',          group: 'Level 1', title: 'Telling time: hour and half hour', blurb: 'Read a clock when it is o’clock or half past.' },

        // Level 2
        { id: 'skip-counting',       group: 'Level 2', title: 'Skip counting',                blurb: 'Count by 2s, 5s, 10s and 100s.' },
        { id: 'clock-5min',          group: 'Level 2', title: 'Telling time to 5 minutes',    blurb: 'Read the minute hand around the clock.' },
        { id: 'money-count',         group: 'Level 2', title: 'Counting money',               blurb: 'Add up coins and bills.' },
        { id: 'money-add-subtract',  group: 'Level 2', title: 'Adding and subtracting money', blurb: 'Dollars and cents, line by line.' },
        { id: 'graphs-bar-picture',  group: 'Level 2', title: 'Reading bar and picture graphs', blurb: 'Find the answers hiding in a graph.' },

        // Level 3
        { id: 'fractions-numberline', group: 'Level 3', title: 'Fractions on a number line',  blurb: 'Where does a fraction live between 0 and 1?' },
        { id: 'fractions-like',       group: 'Level 3', title: 'Adding and subtracting fractions with the same bottom', blurb: 'When the bottoms match, work with the tops.' },
        { id: 'fractions-simplify',   group: 'Level 3', title: 'Simplifying fractions',       blurb: 'Make a fraction smaller without changing its value.' },
        { id: 'rounding',             group: 'Level 3', title: 'Rounding numbers',            blurb: 'Round to the nearest 10 or 100.' },
        { id: 'clock-elapsed',        group: 'Level 3', title: 'Elapsed time',                blurb: 'How much time has gone by?' },

        // Level 4
        { id: 'prime-composite',      group: 'Level 4', title: 'Prime and composite numbers', blurb: 'Which numbers can only be made one way?' },
        { id: 'area-perimeter',       group: 'Level 4', title: 'Area and perimeter',          blurb: 'Inside space and the distance around.' },
        { id: 'circles',              group: 'Level 4', title: 'Circles: area and circumference', blurb: 'Using pi to measure round shapes.' },
        { id: 'angles',               group: 'Level 4', title: 'Measuring angles',            blurb: 'How wide is the corner?' },
        { id: 'symmetry',             group: 'Level 4', title: 'Lines of symmetry',           blurb: 'Fold a shape into matching halves.' },
        { id: 'shapes',               group: 'Level 4', title: 'Naming 2D shapes',            blurb: 'Count sides and look at the angles.' },
        { id: 'graphs-pie',           group: 'Level 4', title: 'Reading pie graphs',          blurb: 'Each slice is a share of the whole.' },
        { id: 'fractions-convert',    group: 'Level 4', title: 'Mixed numbers and improper fractions', blurb: 'Switch between the two ways to write them.' },
        { id: 'fractions-solving',    group: 'Level 4', title: 'Fractions as decimals',       blurb: 'Divide the top by the bottom, even with powers.' },

        // Level 5
        { id: 'fractions-unlike',          group: 'Level 5', title: 'Adding and subtracting with different bottoms', blurb: 'Find a common bottom first.' },
        { id: 'fractions-multiply-divide', group: 'Level 5', title: 'Multiplying and dividing fractions', blurb: 'Top times top, bottom times bottom, and flip to divide.' },
        { id: 'fractions-equations',       group: 'Level 5', title: 'Fraction equations',           blurb: 'Find the missing fraction.' },
        { id: 'fractions-nested',          group: 'Level 5', title: 'A fraction divided by a whole number', blurb: 'Turn a stacked fraction into a decimal.' },
        { id: 'convert-fraction-decimal',  group: 'Level 5', title: 'Fractions and decimals',       blurb: 'Two ways to write the same amount.' },
        { id: 'percents',                  group: 'Level 5', title: 'Percents',                     blurb: 'Out of one hundred, with fractions and decimals.' },
        { id: 'pemdas',                    group: 'Level 5', title: 'Order of operations',          blurb: 'Which part of the problem do you do first?' },
        { id: 'coordinates',               group: 'Level 5', title: 'Coordinate planes',            blurb: 'Read points as across and up.' },
        { id: 'volume',                    group: 'Level 5', title: 'Volume of a box',              blurb: 'How much fits inside?' },
    ];

    // Topics whose lesson has been written (tutorial-content-*.js). Every topic now
    // has one; dev/check-activities.js fails if a topic is missing its lesson.
    const READY = new Set(TOPICS.map(t => t.id));   // every topic has a lesson

    // Scene kinds the player can draw (tutorial-player.js and tutorial-scenes.js).
    const KINDS = ['tenframe', 'numberline', 'sequence', 'clock', 'fractionbar',
        'lines', 'columns', 'longmult', 'longdiv', 'stack', 'array', 'share', 'takeaway', 'pairs', 'arrays', 'coins', 'bargraph', 'picturegraph',
        'piegraph', 'grid100', 'fracline', 'placevalue', 'rect', 'circle', 'angle', 'symmetry', 'polygon',
        'coordplane', 'prism'];

    // Activity -> topic, by the same ids the points tiers use (see activities.js).
    const TOPIC_OF = {
        'choice:oddeven': 'odd-even',
        'choice:compare:2': 'comparing',
        'choice:compare:3': 'comparing',
        'choice:skipcount': 'skip-counting',
        'choice:prime': 'prime-composite',

        'clock:read:hour': 'clock-hour',
        'clock:read:5min': 'clock-5min',
        'clock:elapsed': 'clock-elapsed',

        'conversions:frac-to-decimal': 'convert-fraction-decimal',
        'conversions:decimal-to-frac': 'convert-fraction-decimal',
        'conversions:frac-to-percent': 'percents',
        'conversions:percent-to-frac': 'percents',
        'conversions:decimal-to-percent': 'percents',
        'conversions:percent-to-decimal': 'percents',

        'fractions:add-like': 'fractions-like',
        'fractions:subtract-like': 'fractions-like',
        'fractions:simplify': 'fractions-simplify',
        'fractions:add-like-negative': 'negatives',
        'fractions:subtract-like-negative': 'negatives',
        'fractions:add-equation': 'fractions-equations',
        'fractions:subtract-equation': 'fractions-equations',
        'fractions:multiply-equation': 'fractions-equations',
        'fractions:divide-equation': 'fractions-equations',
        'fractions:add-unlike': 'fractions-unlike',
        'fractions:subtract-unlike': 'fractions-unlike',
        'fractions:convert': 'fractions-convert',
        'fractions:simple-fractions': 'fractions-solving',
        'fractions:simple-fractions-negative': 'negatives',
        'fractions:simple-fractions-exponent': 'fractions-solving',
        'fractions:multiply': 'fractions-multiply-divide',
        'fractions:divide': 'fractions-multiply-divide',
        'fractions:multiply-negative': 'negatives',
        'fractions:divide-negative': 'negatives',
        'fractions:nested': 'fractions-nested',
        'fractions:nested-negative': 'negatives',
        'fractions:nested-exponent': 'fractions-nested',

        'geometry:area-square': 'area-perimeter',
        'geometry:area-rectangle': 'area-perimeter',
        'geometry:area-triangle': 'area-perimeter',
        'geometry:perimeter-square': 'area-perimeter',
        'geometry:perimeter-rectangle': 'area-perimeter',
        'geometry:perimeter-triangle': 'area-perimeter',
        'geometry:area-circle': 'circles',
        'geometry:perimeter-circle': 'circles',
        'geometry:angles': 'angles',
        'geometry:symmetry': 'symmetry',
        'geometry:classify-shapes': 'shapes',
        'geometry:coordinates': 'coordinates',
        'geometry:volume': 'volume',

        'graphs:bar': 'graphs-bar-picture',
        'graphs:picture': 'graphs-bar-picture',
        'graphs:bar:scaled': 'graphs-bar-picture',
        'graphs:picture:scaled': 'graphs-bar-picture',
        'graphs:pie': 'graphs-pie',

        'money:standard': 'money-count',
        'money:bills': 'money-count',
        'money:large': 'money-count',
        'money:add-small': 'money-add-subtract',
        'money:add-medium': 'money-add-subtract',
        'money:add-large': 'money-add-subtract',
        'money:subtract-small': 'money-add-subtract',
        'money:subtract-medium': 'money-add-subtract',
        'money:subtract-large': 'money-add-subtract',

        'numberline:count-forward': 'counting-numberline',
        'numberline:count-backward': 'counting-numberline',
        'numberline:count-from': 'counting-numberline',
        'numberline:ordering': 'counting-numberline',
        'numberline:fractions': 'fractions-numberline',
        'numberline:negative': 'negatives',

        'placevalue:tens-ones': 'place-value',
        'placevalue:multiples-of-10': 'place-value',
        'placevalue:hundreds-tens-ones': 'place-value',

        'pemdas': 'pemdas',
        'rounding:10': 'rounding',
        'rounding:100': 'rounding',
    };

    const PRACTICE_TOPIC = {
        add:      { 1: 'add-small',      2: 'add-big',      3: 'add-big' },
        subtract: { 1: 'subtract-small', 2: 'subtract-big', 3: 'subtract-big' },
        multiply: { 1: 'multiply-small', 2: 'multiply-big', 3: 'multiply-big' },
        divide:   { 1: 'divide-small',   2: 'divide-big',   3: 'divide-big' },
    };

    // Topics that are done by looking or in your head. Every other topic can need
    // a pencil, so its exercises show the "You might need some paper" note.
    const PAPER_FREE = new Set([
        'add-small', 'subtract-small', 'multiply-small', 'divide-small', 'negatives',
        'counting-numberline', 'odd-even', 'comparing', 'place-value', 'skip-counting', 'rounding',
        'clock-hour', 'clock-5min', 'money-count', 'graphs-bar-picture', 'graphs-pie',
        'fractions-numberline', 'fractions-like', 'angles', 'symmetry', 'shapes', 'coordinates',
    ]);
    const needsPaper = (topicIds) => topicIds.some(id => !PAPER_FREE.has(id));

    const byId = {};
    TOPICS.forEach(t => { byId[t.id] = t; });

    // ---------- lessons ----------
    const lessons = {};
    const define = (id, lesson) => {
        if (!byId[id]) throw new Error('Unknown tutorial topic: ' + id);
        lessons[id] = lesson;
    };

    // ---------- lookups ----------
    // Topics for an exercise page, most relevant first. Several can apply, for
    // example a simple-operation page with negatives switched on.
    const topicsFor = (page, params) => {
        const out = [];
        const add = (id) => { if (id && !out.includes(id)) out.push(id); };

        if (page === 'practice') {
            const mode = params.get('mode') || 'multiply';
            const digits = Number((params.get('digits') || '1').split(',')[0]);
            add((PRACTICE_TOPIC[mode] || {})[digits]);
            if (params.get('negatives') === '1') add('negatives');
            if (params.get('decimals') === '1') add('decimals');
            return out;
        }
        MPActivities.tierIds(page, params).forEach(id => add(TOPIC_OF[id]));
        return out;
    };

    const topicsForHref = (href) => {
        const u = new URL(href, 'http://local/');
        return topicsFor(MPActivities.pageOf(u.pathname), u.searchParams);
    };

    // The lessons a player can open right now.
    const ready = (id) => READY.has(id);
    const readyTopicsFor = (page, params) => topicsFor(page, params).filter(ready);

    // ---------- "watched" marks ----------
    const SEEN_KEY = 'mpTutorialsSeen';
    const seenMap = () => {
        try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch (e) { return {}; }
    };
    const markSeen = (id) => {
        try {
            const m = seenMap();
            m[id] = Date.now();
            localStorage.setItem(SEEN_KEY, JSON.stringify(m));
        } catch (e) {}
    };
    const isSeen = (id) => !!seenMap()[id];

    const api = {
        TOPICS, READY, KINDS, TOPIC_OF, PRACTICE_TOPIC,
        topic: (id) => byId[id] || null,
        lesson: (id) => lessons[id] || null,
        define, ready, topicsFor, topicsForHref, readyTopicsFor, PAPER_FREE, needsPaper,
        markSeen, isSeen,
        url: (id, embed) => 'tutorial.html?topic=' + encodeURIComponent(id) + (embed ? '&embed=1' : ''),
    };

    globalThis.MPTutorials = api;
    if (typeof module !== 'undefined') module.exports = api;
})();
