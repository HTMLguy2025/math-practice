// Activity registry — the single source of truth for what the app offers.
//
//   LEVELS            what the launcher shows (levels, sections, links)
//   ACTIVITY_TIERS    how hard each activity is, 1 (easiest) to 10 — this is
//                     what decides how many points a correct answer earns
//   MPActivities      lookups built on those (points for a URL, all hrefs, ...)
//
// Loaded by the launcher and by every exercise page. dev/check-activities.js
// verifies that every launchable activity has a tier.

const LEVELS = {
    1: {
        label: 'Level 1',
        sections: [
            { label: 'Counting & Number Sense', options: [
                { text: 'Forward / Backward', href: 'numberline.html?exercise=count-forward,count-backward' },
                { text: 'Count From Any Number', href: 'numberline.html?exercise=count-from' },
                { text: 'Number Line', href: 'numberline.html?exercise=ordering' },
                { text: '2D Shapes', href: null },
                { text: 'Odd & Even', href: 'choice.html?exercise=oddeven' },
            ]},
            { label: 'Place Value', options: [
                { text: 'Tens & Ones', href: 'placevalue.html?exercise=tens-ones' },
            ]},
            { label: 'Comparison', options: [
                { text: 'Two-Digit Numbers', href: 'choice.html?exercise=compare&digits=2' },
            ]},
            { label: 'Measurement & Time', options: [
                { text: 'Time to Hour / Half Hour', href: 'clock.html?mode=read&precision=hour' },
            ]},
        ]
    },
    2: {
        label: 'Level 2',
        sections: [
            { label: 'Counting & Number Sense', options: [
                { text: 'Skip Counting', href: 'choice.html?exercise=skipcount' },
                { text: 'Odd & Even', href: 'choice.html?exercise=oddeven' },
                { text: 'Compare 3-Digit Numbers', href: 'choice.html?exercise=compare&digits=3' },
            ]},
            { label: 'Place Value', options: [
                { text: 'Hundreds, Tens, Ones', href: 'placevalue.html?exercise=hundreds-tens-ones' },
            ]},
            { label: 'Early Multiplication', options: [
                { text: 'Arrays', href: null },
            ]},
            { label: 'Measurement & Time', options: [
                { text: 'Time to 5 Minutes', href: 'clock.html?mode=read&precision=5min' },
            ]},
            { label: 'Counting Money', type: 'operation-group', operations: [
                { text: 'Count', options: [
                    { text: 'Coins Only', href: 'money.html?exercise=standard' },
                    { text: 'Include Bills ($1, $5)', href: 'money.html?exercise=bills' },
                    { text: 'Large Bills ($10, $20)', href: 'money.html?exercise=large' },
                ]},
                { text: 'Add', radio: true, options: [
                    { text: 'Up to $9.99', href: 'money.html?exercise=add-small' },
                    { text: 'Up to $99.99', href: 'money.html?exercise=add-medium' },
                    { text: 'Up to $999.99', href: 'money.html?exercise=add-large' },
                ]},
                { text: 'Subtract', radio: true, options: [
                    { text: 'Up to $9.99', href: 'money.html?exercise=subtract-small' },
                    { text: 'Up to $99.99', href: 'money.html?exercise=subtract-medium' },
                    { text: 'Up to $999.99', href: 'money.html?exercise=subtract-large' },
                ]},
            ]},
            { label: 'Data', options: [
                { text: 'Bar Graphs', href: 'graphs.html?type=bar' },
                { text: 'Picture Graphs', href: 'graphs.html?type=picture' },
            ]},
        ]
    },
    3: {
        label: 'Level 3',
        sections: [
            { label: 'Fractions', type: 'operation-group', operations: [
                { text: 'Add', options: [
                    { text: 'Like Denominators', href: 'fractions.html?exercise=add-like' },
                    { text: 'Negatives', href: 'fractions.html?exercise=add-like-negative' },
                    { text: 'Equations', href: 'fractions.html?exercise=add-equation' },
                ]},
                { text: 'Subtract', options: [
                    { text: 'Like Denominators', href: 'fractions.html?exercise=subtract-like' },
                    { text: 'Negatives', href: 'fractions.html?exercise=subtract-like-negative' },
                    { text: 'Equations', href: 'fractions.html?exercise=subtract-equation' },
                ]},
            ]},
            { label: 'Fraction Skills', options: [
                { text: 'Simplify', href: 'fractions.html?exercise=simplify' },
                { text: 'On a Number Line', href: 'numberline.html?exercise=fractions' },
            ]},
            { label: 'Rounding', options: [
                { text: 'To Nearest 10', href: 'rounding.html?precision=10' },
                { text: 'To Nearest 100', href: 'rounding.html?precision=100' },
            ]},
            { label: 'Measurement & Time', options: [
                { text: 'Elapsed Time', href: 'clock.html?mode=elapsed' },
                { text: 'Mass & Liquid Volume', href: null },
            ]},
            { label: 'Data', options: [
                { text: 'Scaled Bar Graphs', href: 'graphs.html?type=bar&scaled=true' },
                { text: 'Scaled Picture Graphs', href: 'graphs.html?type=picture&scaled=true' },
            ]},
        ]
    },
    4: {
        label: 'Level 4',
        sections: [
            { label: 'Fractions', type: 'operation-group', operations: [
                { text: 'Add', options: [
                    { text: 'Like Denominators', href: 'fractions.html?exercise=add-like' },
                    { text: 'Negatives', href: 'fractions.html?exercise=add-like-negative' },
                    { text: 'Equations', href: 'fractions.html?exercise=add-equation' },
                ]},
                { text: 'Subtract', options: [
                    { text: 'Like Denominators', href: 'fractions.html?exercise=subtract-like' },
                    { text: 'Negatives', href: 'fractions.html?exercise=subtract-like-negative' },
                    { text: 'Equations', href: 'fractions.html?exercise=subtract-equation' },
                ]},
            ]},
            { label: 'Fraction Skills', options: [
                { text: 'Equivalent', href: null },
                { text: 'Comparing', href: null },
                { text: 'Simplify', href: 'fractions.html?exercise=simplify' },
                { text: 'Converting Fractions', href: 'fractions.html?exercise=convert' },
            ]},
            { label: 'Solving Fractions', type: 'operation-group', operations: [
                { text: 'Simple Fractions', options: [
                    { text: 'Standard', href: 'fractions.html?exercise=simple-fractions' },
                    { text: 'Negatives', href: 'fractions.html?exercise=simple-fractions-negative' },
                    { text: 'Exponents', href: 'fractions.html?exercise=simple-fractions-exponent' },
                ]},
            ]},
            { label: 'Decimals', options: [
                { text: 'Tenths & Hundredths', href: null },
                { text: 'Comparing Decimals', href: null },
            ]},
            { label: 'Number Theory', options: [
                { text: 'Factors & Multiples', href: null },
                { text: 'Prime & Composite', href: 'choice.html?exercise=prime' },
            ]},
            { label: 'Area & Perimeter', type: 'operation-group', operations: [
                { text: 'Area', radio: true, options: [
                    { text: 'Triangle', href: 'geometry.html?exercise=area-triangle' },
                    { text: 'Square', href: 'geometry.html?exercise=area-square' },
                    { text: 'Rectangle', href: 'geometry.html?exercise=area-rectangle' },
                    { text: 'Circle', href: 'geometry.html?exercise=area-circle' },
                ]},
                { text: 'Perimeter', radio: true, options: [
                    { text: 'Triangle', href: 'geometry.html?exercise=perimeter-triangle' },
                    { text: 'Square', href: 'geometry.html?exercise=perimeter-square' },
                    { text: 'Rectangle', href: 'geometry.html?exercise=perimeter-rectangle' },
                    { text: 'Circle (Circumference)', href: 'geometry.html?exercise=perimeter-circle' },
                ]},
            ]},
            { label: 'Geometry', options: [
                { text: 'Angle Measurement', href: 'geometry.html?exercise=angles' },
                { text: 'Symmetry', href: 'geometry.html?exercise=symmetry' },
            ]},
            { label: 'Data', options: [
                { text: 'Pie Graphs', href: 'graphs.html?type=pie' },
            ]},
        ]
    },
    5: {
        label: 'Level 5',
        sections: [
            { label: 'Fractions', type: 'operation-group', operations: [
                { text: 'Add', options: [
                    { text: 'Like Denominators', href: 'fractions.html?exercise=add-like' },
                    { text: 'Unlike Denominators', href: 'fractions.html?exercise=add-unlike' },
                    { text: 'Negatives', href: 'fractions.html?exercise=add-like-negative' },
                    { text: 'Equations', href: 'fractions.html?exercise=add-equation' },
                ]},
                { text: 'Subtract', options: [
                    { text: 'Like Denominators', href: 'fractions.html?exercise=subtract-like' },
                    { text: 'Unlike Denominators', href: 'fractions.html?exercise=subtract-unlike' },
                    { text: 'Negatives', href: 'fractions.html?exercise=subtract-like-negative' },
                    { text: 'Equations', href: 'fractions.html?exercise=subtract-equation' },
                ]},
                { text: 'Multiply', options: [
                    { text: 'Standard', href: 'fractions.html?exercise=multiply' },
                    { text: 'Negatives', href: 'fractions.html?exercise=multiply-negative' },
                    { text: 'Equations', href: 'fractions.html?exercise=multiply-equation' },
                ]},
                { text: 'Divide', options: [
                    { text: 'Standard', href: 'fractions.html?exercise=divide' },
                    { text: 'Negatives', href: 'fractions.html?exercise=divide-negative' },
                    { text: 'Equations', href: 'fractions.html?exercise=divide-equation' },
                ]},
            ]},
            { label: 'Solving Fractions', type: 'operation-group', operations: [
                { text: 'Nested Fractions', options: [
                    { text: 'Standard', href: 'fractions.html?exercise=nested' },
                    { text: 'Negatives', href: 'fractions.html?exercise=nested-negative' },
                    { text: 'Exponents', href: 'fractions.html?exercise=nested-exponent' },
                ]},
            ]},
            { label: 'Decimals', options: [
                { text: 'All Operations', href: null },
                { text: 'Powers of 10', href: null },
            ]},
            { label: 'Order of Operations', options: [
                { text: 'Long Equations', href: 'pemdas.html' },
            ]},
            { label: 'Number Sense', options: [
                { text: 'Negative Numbers', href: 'numberline.html?exercise=negative' },
                { text: 'Numerical Patterns', href: null },
            ]},
            { label: 'Geometry & Graphing', options: [
                { text: 'Coordinate Planes', href: 'geometry.html?exercise=coordinates' },
                { text: 'Volume', href: 'geometry.html?exercise=volume' },
            ]},
            { label: 'Measurement', options: [
                { text: 'Converting Units', href: null },
            ]},
            { label: 'Number Conversion', type: 'conversion',
              conversionTypes: [
                { text: 'Fractions ↔ Decimals', href: 'conversions.html?exercise=frac-to-decimal,decimal-to-frac' },
                { text: 'Fractions ↔ Percents', href: 'conversions.html?exercise=frac-to-percent,percent-to-frac' },
                { text: 'Decimals ↔ Percents', href: 'conversions.html?exercise=decimal-to-percent,percent-to-decimal' },
              ],
              options: [
                { text: 'Negatives', href: null },
                { text: 'Nested Fractions', href: null },
                { text: 'Equations', href: null },
              ]
            },
        ]
    },
    simple: {
        label: 'Simple Operations',
        sections: [
            { label: 'Multiplication', options: [{ text: '1-Digit', href: 'practice.html?mode=multiply&digits=1' }, { text: '2-Digit', href: 'practice.html?mode=multiply&digits=2' }, { text: '3-Digit', href: 'practice.html?mode=multiply&digits=3' }] },
            { label: 'Addition',       options: [{ text: '1-Digit', href: 'practice.html?mode=add&digits=1' }, { text: '2-Digit', href: 'practice.html?mode=add&digits=2' }, { text: '3-Digit', href: 'practice.html?mode=add&digits=3' }] },
            { label: 'Subtraction',    options: [{ text: '1-Digit', href: 'practice.html?mode=subtract&digits=1' }, { text: '2-Digit', href: 'practice.html?mode=subtract&digits=2' }, { text: '3-Digit', href: 'practice.html?mode=subtract&digits=3' }] },
            { label: 'Division',       options: [{ text: '1-Digit', href: 'practice.html?mode=divide&digits=1' }, { text: '2-Digit', href: 'practice.html?mode=divide&digits=2' }, { text: '3-Digit', href: 'practice.html?mode=divide&digits=3' }] },
        ]
    }
};

// ---------------------------------------------------------------------------
// Difficulty tiers. One correct answer is worth its tier in points, so easier
// activities earn less and harder ones more. Keys are "<page>:<exercise>".
// Tune the numbers here — nothing else needs to change.
// ---------------------------------------------------------------------------
const ACTIVITY_TIERS = {
    // Multiple choice
    'choice:oddeven': 1,
    'choice:compare:2': 1,
    'choice:compare:3': 2,
    'choice:skipcount': 2,
    'choice:prime': 5,

    // Clocks
    'clock:read:hour': 1,
    'clock:read:5min': 2,
    'clock:elapsed': 3,

    // Number conversion
    'conversions:frac-to-decimal': 6,
    'conversions:decimal-to-frac': 6,
    'conversions:frac-to-percent': 7,
    'conversions:percent-to-frac': 7,
    'conversions:decimal-to-percent': 7,
    'conversions:percent-to-decimal': 7,

    // Fractions
    'fractions:add-like': 3,
    'fractions:subtract-like': 3,
    'fractions:simplify': 3,
    'fractions:add-like-negative': 5,
    'fractions:subtract-like-negative': 5,
    'fractions:add-equation': 5,
    'fractions:subtract-equation': 5,
    'fractions:add-unlike': 5,
    'fractions:subtract-unlike': 5,
    'fractions:convert': 6,
    'fractions:simple-fractions': 6,
    'fractions:simple-fractions-negative': 7,
    'fractions:simple-fractions-exponent': 8,
    'fractions:multiply': 7,
    'fractions:divide': 7,
    'fractions:multiply-negative': 8,
    'fractions:divide-negative': 8,
    'fractions:multiply-equation': 8,
    'fractions:divide-equation': 8,
    'fractions:nested': 8,
    'fractions:nested-negative': 9,
    'fractions:nested-exponent': 10,

    // Geometry
    'geometry:area-square': 4,
    'geometry:area-rectangle': 4,
    'geometry:perimeter-square': 4,
    'geometry:perimeter-rectangle': 4,
    'geometry:classify-shapes': 4,
    'geometry:area-triangle': 5,
    'geometry:perimeter-triangle': 5,
    'geometry:angles': 5,
    'geometry:symmetry': 5,
    'geometry:area-circle': 6,
    'geometry:perimeter-circle': 6,
    'geometry:coordinates': 6,
    'geometry:volume': 6,

    // Graphs
    'graphs:bar': 2,
    'graphs:picture': 2,
    'graphs:bar:scaled': 3,
    'graphs:picture:scaled': 3,
    'graphs:pie': 6,

    // Money
    'money:standard': 2,
    'money:bills': 2,
    'money:large': 3,
    'money:add-small': 3,
    'money:subtract-small': 3,
    'money:add-medium': 4,
    'money:subtract-medium': 4,
    'money:add-large': 5,
    'money:subtract-large': 5,

    // Number lines
    'numberline:count-forward': 1,
    'numberline:count-backward': 1,
    'numberline:count-from': 1,
    'numberline:ordering': 1,
    'numberline:fractions': 4,
    'numberline:negative': 7,

    // Place value
    'placevalue:tens-ones': 1,
    'placevalue:multiples-of-10': 1,
    'placevalue:hundreds-tens-ones': 2,

    // Order of operations
    'pemdas': 8,

    // Rounding
    'rounding:10': 3,
    'rounding:100': 3,
};

// Simple operations: each question is worth its own digit size.
const PRACTICE_TIERS = {
    add:      { 1: 1, 2: 3, 3: 5 },
    subtract: { 1: 1, 2: 3, 3: 5 },
    multiply: { 1: 2, 2: 4, 3: 6 },
    divide:   { 1: 2, 2: 4, 3: 6 },
};
const NEGATIVE_BONUS = 1;   // question uses a negative number
const DECIMAL_BONUS  = 2;   // question uses a decimal

const MPActivities = (() => {
    const DEFAULT_TIER = 3;   // used (and reported) for an activity with no entry

    const pageOf = (path) => String(path).split('/').pop().split('?')[0].replace(/\.html$/, '');

    // The tier ids an exercise page is showing. A page can show several
    // exercises at once (a comma-separated list); each is one id.
    const tierIds = (page, params) => {
        const list = (name) => (params.get(name) || '').split(',').filter(Boolean);
        switch (page) {
            case 'choice': {
                const ex = params.get('exercise') || 'oddeven';
                return [ex === 'compare' ? 'choice:compare:' + (params.get('digits') || '2') : 'choice:' + ex];
            }
            case 'clock':
                return [params.get('mode') === 'elapsed'
                    ? 'clock:elapsed'
                    : 'clock:read:' + (params.get('precision') || 'hour')];
            case 'graphs': {
                const scaled = params.get('scaled') === 'true' ? ':scaled' : '';
                const types = list('type');
                return (types.length ? types : ['bar']).map(t => 'graphs:' + t + (t === 'pie' ? '' : scaled));
            }
            case 'rounding': {
                const p = list('precision');
                return (p.length ? p : ['10']).map(x => 'rounding:' + x);
            }
            case 'pemdas':
                return ['pemdas'];
            case 'numberline':
            case 'placevalue':
            case 'money':
            case 'conversions':
            case 'geometry':
            case 'fractions': {
                const ex = list('exercise');
                return ex.map(e => page + ':' + e);
            }
            default:
                return [];
        }
    };

    // Points for one correct answer on an exercise page.
    const tierFor = (page, params) => {
        const ids = tierIds(page, params);
        const unknown = ids.filter(id => !(id in ACTIVITY_TIERS));
        const tiers = ids.filter(id => id in ACTIVITY_TIERS).map(id => ACTIVITY_TIERS[id]);
        if (!tiers.length) return { tier: DEFAULT_TIER, unknown };
        const mean = tiers.reduce((a, b) => a + b, 0) / tiers.length;
        return { tier: Math.max(1, Math.round(mean)), unknown };
    };

    // Points for one correct simple-operation question.
    const practicePoints = (mode, digits, { neg = false, dec = false } = {}) => {
        const row = PRACTICE_TIERS[mode] || PRACTICE_TIERS.multiply;
        return (row[digits] || digits)
            + (neg ? NEGATIVE_BONUS : 0)
            + (dec ? DECIMAL_BONUS : 0);
    };

    // A stable name for "what the player was doing", used for the per-activity
    // breakdown. Same activity = same key, whatever order the params came in.
    const activityKey = (page, params) => {
        const entries = [...params.entries()].filter(([k]) => k !== 'mix').sort(([a], [b]) => a.localeCompare(b));
        const q = entries.map(([k, v]) => k + '=' + v).join('&');
        return page + (q ? '?' + q : '');
    };

    // Every href the launcher offers.
    const allHrefs = () => {
        const out = [];
        Object.keys(LEVELS).forEach(k => {
            LEVELS[k].sections.forEach(sec => {
                (sec.operations || []).forEach(op => op.options.forEach(o => o.href && out.push(o.href)));
                (sec.conversionTypes || []).forEach(c => c.href && out.push(c.href));
                (sec.options || []).forEach(o => o.href && out.push(o.href));
            });
        });
        return [...new Set(out)];
    };

    // Tier for a launcher href — used by the coverage check.
    const tierForHref = (href) => {
        const u = new URL(href, 'http://local/');
        const page = pageOf(u.pathname);
        if (page === 'practice') {
            const mode = u.searchParams.get('mode');
            const digits = (u.searchParams.get('digits') || '1').split(',')[0];
            return { tier: practicePoints(mode, Number(digits)), unknown: PRACTICE_TIERS[mode] ? [] : ['practice:' + mode] };
        }
        return tierFor(page, u.searchParams);
    };

    // Readable names for ledger keys (the progress page lists what was practised).
    // Built from the launcher's own labels, so they always match what players see.
    let labelMap = null;
    const labelIndex = () => {
        if (labelMap) return labelMap;
        labelMap = {};
        const add = (href, parts) => {
            const u = new URL(href, 'http://local/');
            const key = activityKey(pageOf(u.pathname), u.searchParams);
            if (!(key in labelMap)) labelMap[key] = parts.join(' · ');
        };
        Object.keys(LEVELS).forEach(k => LEVELS[k].sections.forEach(sec => {
            (sec.operations || []).forEach(op => op.options.forEach(o => o.href && add(o.href, [sec.label, op.text, o.text])));
            (sec.conversionTypes || []).forEach(c => c.href && add(c.href, [sec.label, c.text]));
            (sec.options || []).forEach(o => o.href && add(o.href, [sec.label, o.text]));
        }));
        return labelMap;
    };

    const labelForKey = (key) => {
        const idx = labelIndex();
        if (idx[key]) return idx[key];
        // Several exercises ticked together: name each one, sharing the first one's prefix.
        const [page, q = ''] = String(key).split('?');
        const params = new URLSearchParams(q);
        for (const name of ['exercise', 'type', 'precision']) {
            const list = (params.get(name) || '').split(',');
            if (list.length < 2) continue;
            const parts = list.map(v => { const p = new URLSearchParams(params); p.set(name, v); return idx[activityKey(page, p)]; });
            if (parts.every(Boolean)) {
                return parts[0] + ' + ' + parts.slice(1).map(x => x.split(' · ').pop()).join(' + ');
            }
        }
        return page.charAt(0).toUpperCase() + page.slice(1) + (q ? ' (' + q.replace(/&/g, ', ') + ')' : '');
    };

    return { pageOf, tierIds, tierFor, practicePoints, activityKey, allHrefs, tierForHref, labelForKey };
})();

if (typeof module !== 'undefined') {
    module.exports = { LEVELS, ACTIVITY_TIERS, PRACTICE_TIERS, MPActivities };
}
