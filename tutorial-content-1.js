// Lessons: add-small, counting-numberline, clock-hour, fractions-like.
//
// A lesson is plain data. Each step has a short `say` caption (kept in simple
// words, a sentence or two) and a `scene` the player animates. `tryIt` is a
// few quick questions at the end; `practice` is where "Start practicing" goes.
// Scene kinds are listed in tutorial-player.js.
MPTutorials.define('add-small', {
    practice: 'practice.html?mode=add&digits=1',
    steps: [
        { say: 'Adding means putting groups together to find out how many there are in all. Let’s add 7 + 5.',
          scene: { kind: 'tenframe', a: 7, b: 5, phase: 'intro' } },
        { say: 'Here are 7 blue dots. Each dot sits in its own box on our ten-frame.',
          scene: { kind: 'tenframe', a: 7, b: 5, phase: 'a' } },
        { say: 'Now here are 5 orange dots. They are waiting to join in.',
          scene: { kind: 'tenframe', a: 7, b: 5, phase: 'b' } },
        { say: 'A ten-frame holds exactly 10 dots. We have 7, so we need 3 more to fill it. Let’s move 3 orange dots over!',
          scene: { kind: 'tenframe', a: 7, b: 5, phase: 'move' } },
        { say: 'The ten-frame is full. That is 10! And there are 2 orange dots left over.',
          scene: { kind: 'tenframe', a: 7, b: 5, phase: 'leftover' } },
        { say: '10 and 2 more makes 12. So 7 + 5 = 12!',
          scene: { kind: 'tenframe', a: 7, b: 5, phase: 'sum' } },
        { say: 'Here is another way. Start at 7 and count on 5 more: 8, 9, 10, 11, 12. Same answer!',
          scene: { kind: 'numberline', min: 6, max: 13, start: 7, hops: 5, dir: 1, counts: true } },
        { say: 'On paper we write one number under the other, with the plus sign after the bottom number, and draw a line underneath.',
          scene: { kind: 'columns', op: '+', a: '7', b: '5', upto: 0 } },
        { say: '7 + 5 = 12. We write the 2 under the line, and the 1 goes in the tens place, like the full ten-frame.',
          scene: { kind: 'columns', op: '+', a: '7', b: '5', upto: 1, done: true } },
    ],
    tryIt: [
        { prompt: 'What is 6 + 5?', choices: ['10', '11', '12'], answer: '11',
          hint: 'Start at 6 and count on 5: 7, 8, 9, 10, 11.' },
        { prompt: 'What is 8 + 4?', choices: ['11', '12', '13'], answer: '12',
          hint: '8 needs 2 more to make 10. That leaves 2 over, so 10 + 2 = 12.' },
        { prompt: 'What is 9 + 6?', choices: ['14', '15', '16'], answer: '15',
          hint: '9 needs 1 more to make 10. That leaves 5 over, so 10 + 5 = 15.' },
    ],
});

MPTutorials.define('counting-numberline', {
    practice: 'numberline.html?exercise=count-forward,count-backward',
    steps: [
        { say: 'A number line shows numbers in order, just like a ruler. Small numbers are on the left.',
          scene: { kind: 'numberline', min: 0, max: 10 } },
        { say: 'The further right you go, the bigger the number gets. Going left, the numbers get smaller.',
          scene: { kind: 'numberline', min: 0, max: 10, notes: true } },
        { say: 'Counting forward: start at 3 and hop right 4 times. Each hop adds 1. We say 4, 5, 6, 7. We land on 7!',
          scene: { kind: 'numberline', min: 0, max: 10, start: 3, hops: 4, dir: 1, counts: true } },
        { say: 'Counting backward: start at 8 and hop left 3 times. We say 7, 6, 5. We land on 5!',
          scene: { kind: 'numberline', min: 0, max: 10, start: 8, hops: 3, dir: -1, counts: true } },
        { say: 'Is a number missing? Look at the numbers beside it. In 4, 5, ?, 7 the numbers go up by 1 each time, so the missing number is 6.',
          scene: { kind: 'sequence', items: [4, 5, '?', 7], reveal: 6 } },
        { say: 'Counting from any number works the same way. Pick where you start, then hop the right way, one step at a time.',
          scene: { kind: 'numberline', min: 12, max: 20, start: 15, hops: 3, dir: 1, counts: true } },
    ],
    tryIt: [
        { prompt: 'Start at 5 and count forward 3. Where do you land?', choices: ['7', '8', '9'], answer: '8',
          hint: 'Hop 3 times to the right: 6, 7, 8.' },
        { prompt: 'Start at 9 and count backward 4. Where do you land?', choices: ['4', '5', '6'], answer: '5',
          hint: 'Hop 4 times to the left: 8, 7, 6, 5.' },
        { prompt: 'What number is missing?', scene: { kind: 'sequence', items: [10, 11, '?', 13] },
          choices: ['12', '14', '9'], answer: '12',
          hint: 'The numbers go up by 1 each time. After 11 comes 12.' },
    ],
});

MPTutorials.define('clock-hour', {
    practice: 'clock.html?mode=read&precision=hour',
    steps: [
        { say: 'A clock helps us tell the time. It has the numbers 1 to 12 around the edge.',
          scene: { kind: 'clock', show: 'none' } },
        { say: 'The short hand is the hour hand. It tells us the hour. Here it points at the 3.',
          scene: { kind: 'clock', show: 'hour', h: 3, m: 0, highlight: 'hour' } },
        { say: 'The long hand is the minute hand. When it points straight up at the 12, we say o’clock.',
          scene: { kind: 'clock', show: 'both', h: 3, m: 0, highlight: 'minute' } },
        { say: 'Short hand on the 3 and long hand on the 12. It is 3 o’clock! We write it 3:00.',
          scene: { kind: 'clock', show: 'both', h: 3, m: 0, label: '3:00' } },
        { say: 'Now watch the long hand travel halfway around, down to the 6. The short hand drifts to sit halfway between the 3 and the 4.',
          scene: { kind: 'clock', show: 'both', fromH: 3, fromM: 0, h: 3, m: 30, highlight: 'both' } },
        { say: 'Long hand on the 6 means half past. This is half past 3, and we write it 3:30.',
          scene: { kind: 'clock', show: 'both', h: 3, m: 30, label: '3:30' } },
        { say: 'Remember: look at the short hand for the hour. Then the long hand. On the 12 it is o’clock, and on the 6 it is half past.',
          scene: { kind: 'clock', show: 'both', fromH: 7, fromM: 0, h: 7, m: 30, label: '7:30' } },
    ],
    tryIt: [
        { prompt: 'What time is it?', scene: { kind: 'clock', show: 'both', h: 5, m: 0 },
          choices: ['5:00', '6:00', '5:30'], answer: '5:00',
          hint: 'The short hand is on 5 and the long hand is on 12. It is 5 o’clock.' },
        { prompt: 'What time is it?', scene: { kind: 'clock', show: 'both', h: 9, m: 30 },
          choices: ['9:00', '9:30', '6:09'], answer: '9:30',
          hint: 'The long hand is on the 6, so it is half past. The short hand is just past 9.' },
        { prompt: 'What time is it?', scene: { kind: 'clock', show: 'both', h: 12, m: 0 },
          choices: ['12:00', '12:30', '6:00'], answer: '12:00',
          hint: 'Both hands point straight up. It is 12 o’clock.' },
    ],
});

MPTutorials.define('fractions-like', {
    practice: 'fractions.html?exercise=add-like',
    steps: [
        { say: 'A fraction names part of a whole. The bottom number says how many equal parts the whole is cut into. The top number says how many of those parts we have.',
          scene: { kind: 'fractionbar', items: [{ parts: 4, fill: 1, label: [1, 4] }], callouts: true } },
        { say: 'Let’s add 1/4 and 2/4. Here they are as bars.',
          scene: { kind: 'fractionbar', items: [
              { parts: 4, fill: 1, label: [1, 4], color: 'a' }, { op: '+' },
              { parts: 4, fill: 2, label: [2, 4], color: 'b' }, { op: '=' },
              { parts: 4, fill: 0, label: '?' }] } },
        { say: 'Both bottoms are 4. That means both bars are cut into the same size parts. They are fourths!',
          scene: { kind: 'fractionbar', highlight: 'bottoms', items: [
              { parts: 4, fill: 1, label: [1, 4], color: 'a' }, { op: '+' },
              { parts: 4, fill: 2, label: [2, 4], color: 'b' }, { op: '=' },
              { parts: 4, fill: 0, label: '?' }] } },
        { say: 'When the bottoms are the same, we only add the tops. 1 + 2 = 3.',
          scene: { kind: 'fractionbar', highlight: 'tops', eq: '1 + 2 = 3', items: [
              { parts: 4, fill: 1, label: [1, 4], color: 'a' }, { op: '+' },
              { parts: 4, fill: 2, label: [2, 4], color: 'b' }, { op: '=' },
              { parts: 4, fill: 0, label: '?' }] } },
        { say: 'The bottom stays 4, because the parts are still fourths. So the answer is 3 over 4.',
          scene: { kind: 'fractionbar', highlight: 'bottoms', items: [
              { parts: 4, fill: 1, label: [1, 4], color: 'a' }, { op: '+' },
              { parts: 4, fill: 2, label: [2, 4], color: 'b' }, { op: '=' },
              { parts: 4, fill: 3, label: [3, 4], color: 'c', pop: true }] } },
        { say: 'So 1/4 + 2/4 = 3/4. Subtracting works the same way: 3/4 − 1/4 = 2/4. Take away the tops and keep the bottom.',
          scene: { kind: 'fractionbar', eq: '3 − 1 = 2', items: [
              { parts: 4, fill: 3, label: [3, 4], color: 'c' }, { op: '−' },
              { parts: 4, fill: 1, label: [1, 4], color: 'a' }, { op: '=' },
              { parts: 4, fill: 2, label: [2, 4], color: 'b', pop: true }] } },
        { say: 'One last tip: check if your answer can be made simpler. 2/4 is the same amount as 1/2.',
          scene: { kind: 'fractionbar', items: [
              { parts: 4, fill: 2, label: [2, 4], color: 'b' }, { op: '=' },
              { parts: 2, fill: 1, label: [1, 2], color: 'b', pop: true }] } },
    ],
    tryIt: [
        { prompt: 'What is 2/5 + 1/5?', choices: ['3/5', '3/10', '2/5'], answer: '3/5',
          hint: 'Add the tops: 2 + 1 = 3. The bottom stays 5.' },
        { prompt: 'What is 5/8 − 2/8?', choices: ['3/8', '7/8', '3/16'], answer: '3/8',
          hint: 'Subtract the tops: 5 − 2 = 3. The bottom stays 8.' },
        { prompt: 'What is 3/6 + 2/6?', choices: ['5/12', '5/6', '1/6'], answer: '5/6',
          hint: 'Add the tops: 3 + 2 = 5. The bottom stays 6.' },
    ],
});
