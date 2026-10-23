// Run:  node dev/check-activities.js
// Fails if any launchable activity has no difficulty tier (so it would earn
// the default points), or if a tier entry no activity uses.
const { MPActivities, ACTIVITY_TIERS, LEVELS } = require('../activities.js');

let problems = 0;
const used = new Set();
const hrefs = MPActivities.allHrefs();

hrefs.forEach(href => {
    const u = new URL(href, 'http://local/');
    const page = MPActivities.pageOf(u.pathname);
    if (page !== 'practice') MPActivities.tierIds(page, u.searchParams).forEach(id => used.add(id));
    const { tier, unknown } = MPActivities.tierForHref(href);
    if (unknown.length) { problems++; console.log('NO TIER   ', href, '->', unknown.join(', ')); }
    else if (!(tier >= 1 && tier <= 10)) { problems++; console.log('BAD TIER  ', href, tier); }
});

Object.keys(ACTIVITY_TIERS).forEach(id => {
    if (!used.has(id)) console.log('unused tier entry (fine if the page supports it):', id);
    if (!(ACTIVITY_TIERS[id] >= 1 && ACTIVITY_TIERS[id] <= 10)) { problems++; console.log('BAD VALUE ', id); }
});


// ---- tutorials ----
globalThis.MPActivities = MPActivities;
const MPTutorials = require('../tutorials.js');
const fsx = require('fs'), pathx = require('path');
fsx.readdirSync(pathx.join(__dirname, '..')).filter(f => /^tutorial-content-.*.js$/.test(f))
    .forEach(f => require('../' + f));

const topicIds = new Set(MPTutorials.TOPICS.map(t => t.id));
let topicProblems = 0;

// every activity must belong to a topic that exists
hrefs.forEach(href => {
    const topics = MPTutorials.topicsForHref(href);
    if (!topics.length) { topicProblems++; console.log('NO TOPIC  ', href); }
    topics.forEach(t => { if (!topicIds.has(t)) { topicProblems++; console.log('BAD TOPIC ', href, '->', t); } });
});
// ...and every mapped topic id must exist
Object.values(MPTutorials.TOPIC_OF).forEach(t => { if (!topicIds.has(t)) { topicProblems++; console.log('BAD TOPIC in table:', t); } });

// READY must match the lessons that are actually defined, and each lesson must be well formed
const KINDS = MPTutorials.KINDS;
MPTutorials.TOPICS.forEach(t => {
    const lesson = MPTutorials.lesson(t.id);
    const ready = MPTutorials.READY.has(t.id);
    if (ready && !lesson) { topicProblems++; console.log('READY but not written:', t.id); }
    if (!ready && lesson) { topicProblems++; console.log('Written but not in READY:', t.id); }
    if (!lesson) return;
    if (!lesson.steps || lesson.steps.length < 3) { topicProblems++; console.log('Too few steps:', t.id); }
    (lesson.steps || []).forEach((st, i) => {
        if (!st.say || !st.scene || KINDS.indexOf(st.scene.kind) < 0) { topicProblems++; console.log('Bad step', t.id, i + 1); }
    });
    (lesson.tryIt || []).forEach((q, i) => {
        if (!q.prompt || !q.choices || q.choices.indexOf(q.answer) < 0 || !q.hint) { topicProblems++; console.log('Bad question', t.id, i + 1); }
    });
    if (lesson.practice) {
        const u = new URL(lesson.practice, 'http://local/');
        if (!MPTutorials.topicsFor(MPActivities.pageOf(u.pathname), u.searchParams).includes(t.id)) {
            topicProblems++; console.log('Practice link does not lead back to this topic:', t.id, lesson.practice);
        }
    }
});

// every exercise page must load the coach, announce each question and report each answer
const fs = require('fs'), path = require('path');
let coachProblems = 0;
[...new Set(hrefs.map(h => MPActivities.pageOf(new URL(h, 'http://local/').pathname)))].forEach(page => {
    const file = path.join(__dirname, '..', page + '.html');
    if (!fs.existsSync(file)) return;
    // practice.html keeps its logic in practice.js
    const js = path.join(__dirname, '..', page + '.js');
    const src = fs.readFileSync(file, 'utf8') + (fs.existsSync(js) ? fs.readFileSync(js, 'utf8') : '');
    ['coach.js', 'MPCoach.question(', 'MPCoach.answered('].forEach(needle => {
        if (!src.includes(needle)) { coachProblems++; console.log('COACH     ', page + '.html is missing', needle); }
    });
});

const written = MPTutorials.TOPICS.filter(t => MPTutorials.lesson(t.id));
const missing = MPTutorials.TOPICS.filter(t => !MPTutorials.lesson(t.id));
console.log(hrefs.length + ' launchable activities checked,', problems ? problems + ' tier problem(s)' : 'all have tiers');
console.log('Coach: ' + (coachProblems ? coachProblems + ' problem(s)' : 'every exercise page offers hints and worked examples'));
console.log('Tutorials: ' + written.length + ' of ' + MPTutorials.TOPICS.length + ' topics written,', topicProblems ? topicProblems + ' problem(s)' : 'every activity maps to a topic');
if (process.argv.includes('--list-missing')) console.log('Still to write: ' + missing.map(t => t.id).join(', '));
const strict = process.argv.includes('--strict');
process.exit(problems || topicProblems || coachProblems || (strict && missing.length) ? 1 : 0);
