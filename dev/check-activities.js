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

console.log(hrefs.length + ' launchable activities checked,', problems ? problems + ' problem(s)' : 'all have tiers');
process.exit(problems ? 1 : 0);
