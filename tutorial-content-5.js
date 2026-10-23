// Lessons: fractions-unlike, fractions-multiply-divide, fractions-equations,
// fractions-nested, convert-fraction-decimal, percents, pemdas, coordinates, volume.

MPTutorials.define('fractions-unlike', {
    practice: 'fractions.html?exercise=add-unlike,subtract-unlike',
    steps: [
        { say: 'Let\u2019s add 1/2 + 1/3. These fractions have different bottoms, so we can not add the tops yet. The pieces are different sizes.',
          scene: { kind: 'fractionbar', items: [
              { parts: 2, fill: 1, label: [1, 2], color: 'a' }, { op: '+' },
              { parts: 3, fill: 1, label: [1, 3], color: 'b' }] } },
        { say: 'First, find a bottom number that both 2 and 3 go into. 6 works, because 2 \u00d7 3 = 6. This is called a common bottom.',
          scene: { kind: 'lines', lines: ['{y:2 and 3 both go into 6}', 'the common bottom is {c:6}', '[1/2] + [1/3] = [3/6] + [2/6]'] } },
        { say: 'Rewrite 1/2 with a bottom of 6. We multiplied 2 by 3 to get 6, so multiply the top by 3 too. 1/2 = 3/6.',
          scene: { kind: 'fractionbar', items: [
              { parts: 2, fill: 1, label: [1, 2], color: 'a' }, { op: '=' },
              { parts: 6, fill: 3, label: [3, 6], color: 'a', pop: true }] } },
        { say: 'Now rewrite 1/3. We multiplied 3 by 2 to get 6, so multiply the top by 2 too. 1/3 = 2/6.',
          scene: { kind: 'fractionbar', items: [
              { parts: 3, fill: 1, label: [1, 3], color: 'b' }, { op: '=' },
              { parts: 6, fill: 2, label: [2, 6], color: 'b', pop: true }] } },
        { say: 'The pieces are now the same size, so we can add the tops: 3/6 + 2/6 = 5/6.',
          scene: { kind: 'fractionbar', eq: '3/6 + 2/6 = 5/6', items: [
              { parts: 6, fill: 3, label: [3, 6], color: 'a' }, { op: '+' },
              { parts: 6, fill: 2, label: [2, 6], color: 'b' }, { op: '=' },
              { parts: 6, fill: 5, label: [5, 6], color: 'c', pop: true }] } },
        { say: 'Subtracting works the same way. For 3/4 \u2212 1/2, use a common bottom of 4. 1/2 = 2/4. Then 3/4 \u2212 2/4 = 1/4.',
          scene: { kind: 'lines', lines: ['{y:[3/4] \u2212 [1/2]}', '[1/2] = {b:[2/4]}', '[3/4] \u2212 [2/4] = {c:[1/4]}'] } },
        { say: 'Always check the answer. If you can divide the top and bottom by the same number, simplify. 1/6 + 1/3 = 1/6 + 2/6 = 3/6, which simplifies to 1/2.',
          scene: { kind: 'lines', lines: ['{y:[1/6] + [1/3]}', '[1/6] + {b:[2/6]} = [3/6]', 'simplify: {c:[1/2]}'] } },
    ],
    tryIt: [
        { prompt: 'What is 1/2 + 1/4?', choices: ['3/4', '2/6', '1/6'], answer: '3/4',
          hint: 'Use a common bottom of 4. 1/2 = 2/4, and 2/4 + 1/4 = 3/4.' },
        { prompt: 'What is 1/3 + 1/6?', choices: ['1/2', '2/9', '2/6'], answer: '1/2',
          hint: 'Use a common bottom of 6. 1/3 = 2/6, so 2/6 + 1/6 = 3/6, which simplifies to 1/2.' },
        { prompt: 'What is 2/3 \u2212 1/2?', choices: ['1/6', '1/1', '1/3'], answer: '1/6',
          hint: 'Use a common bottom of 6. 2/3 = 4/6 and 1/2 = 3/6, so 4/6 \u2212 3/6 = 1/6.' },
    ],
});

MPTutorials.define('fractions-multiply-divide', {
    practice: 'fractions.html?exercise=multiply,divide',
    steps: [
        { say: 'To multiply fractions, multiply the tops, and multiply the bottoms. Let\u2019s try 1/2 \u00d7 1/3. That means half of a third.',
          scene: { kind: 'lines', lines: ['{y:[1/2] \u00d7 [1/3]}', 'tops: {b:1 \u00d7 1 = 1}', 'bottoms: {a:2 \u00d7 3 = 6}', '{c:[1/6]}'] } },
        { say: 'You can see why. Cut a whole into thirds, then cut one third in half. The little piece is 1/6 of the whole.',
          scene: { kind: 'fractionbar', items: [
              { parts: 3, fill: 1, label: [1, 3], color: 'b' }, { op: '\u2192' },
              { parts: 6, fill: 1, label: [1, 6], color: 'c', pop: true }] } },
        { say: 'Another one: 2/3 \u00d7 3/4. Tops: 2 \u00d7 3 = 6. Bottoms: 3 \u00d7 4 = 12. That is 6/12, which simplifies to 1/2.',
          scene: { kind: 'lines', lines: ['{y:[2/3] \u00d7 [3/4]}', 'tops: {b:2 \u00d7 3 = 6}', 'bottoms: {a:3 \u00d7 4 = 12}', '[6/12] = {c:[1/2]}'] } },
        { say: 'Now dividing. Dividing by a fraction is the same as multiplying by its flip. The flip of 1/4 is 4/1, which is 4.',
          scene: { kind: 'lines', lines: ['{y:flip a fraction}', '[1/4]  \u2192  {b:[4/1]}', '[2/3]  \u2192  {b:[3/2]}', '[5/1]  \u2192  {b:[1/5]}'] } },
        { say: 'Why does that work? Dividing 1/2 by 1/4 asks how many quarters fit in a half. There are 2.',
          scene: { kind: 'fractionbar', items: [
              { parts: 2, fill: 1, label: [1, 2], color: 'a' }, { op: '=' },
              { parts: 4, fill: 2, label: [2, 4], color: 'c', pop: true }] } },
        { say: 'To divide, flip the second fraction and multiply. 1/2 \u00f7 1/4 becomes 1/2 \u00d7 4/1. Tops: 1 \u00d7 4 = 4. Bottoms: 2 \u00d7 1 = 2. 4/2 = 2.',
          scene: { kind: 'lines', lines: ['{y:[1/2] \u00f7 [1/4]}', '[1/2] \u00d7 {b:[4/1]}', '[4/2] = {c:2}'] } },
        { say: 'One more: 2/3 \u00f7 4/5. Flip the second fraction: 5/4. Multiply: 2 \u00d7 5 = 10 and 3 \u00d7 4 = 12. 10/12 simplifies to 5/6.',
          scene: { kind: 'lines', lines: ['{y:[2/3] \u00f7 [4/5]}', '[2/3] \u00d7 {b:[5/4]}', '[10/12] = {c:[5/6]}'] } },
    ],
    tryIt: [
        { prompt: 'What is 1/2 \u00d7 1/5?', choices: ['1/10', '2/7', '1/7'], answer: '1/10',
          hint: 'Tops: 1 \u00d7 1 = 1. Bottoms: 2 \u00d7 5 = 10. That is 1/10.' },
        { prompt: 'What is 3/4 \u00d7 2/3?', choices: ['1/2', '5/7', '6/7'], answer: '1/2',
          hint: 'Tops: 3 \u00d7 2 = 6. Bottoms: 4 \u00d7 3 = 12. 6/12 simplifies to 1/2.' },
        { prompt: 'What is 3/4 \u00f7 1/2?', choices: ['3/2', '3/8', '1/4'], answer: '3/2',
          hint: 'Flip the second fraction and multiply: 3/4 \u00d7 2/1 = 6/4, which simplifies to 3/2.' },
    ],
});

MPTutorials.define('fractions-equations', {
    practice: 'fractions.html?exercise=add-equation,subtract-equation,multiply-equation,divide-equation',
    steps: [
        { say: 'In a fraction equation, one part is missing and we have to find it. Here is one: 1/5 + ? = 3/5.',
          scene: { kind: 'fractionbar', items: [
              { parts: 5, fill: 1, label: [1, 5], color: 'a' }, { op: '+' },
              { parts: 5, fill: 0, label: '?', color: 'b' }, { op: '=' },
              { parts: 5, fill: 3, label: [3, 5], color: 'c' }] } },
        { say: 'Use the opposite operation. The opposite of adding is subtracting. So the missing piece is 3/5 \u2212 1/5 = 2/5.',
          scene: { kind: 'lines', lines: ['{y:[1/5] + ? = [3/5]}', '? = [3/5] \u2212 [1/5]', '? = {c:[2/5]}'] } },
        { say: 'Check it: 1/5 + 2/5 = 3/5. It works!',
          scene: { kind: 'fractionbar', eq: '1/5 + 2/5 = 3/5', items: [
              { parts: 5, fill: 1, label: [1, 5], color: 'a' }, { op: '+' },
              { parts: 5, fill: 2, label: [2, 5], color: 'b', pop: true }, { op: '=' },
              { parts: 5, fill: 3, label: [3, 5], color: 'c' }] } },
        { say: 'If the missing number is being subtracted, like 4/5 \u2212 ? = 1/5, the missing part is what you take away. Subtract the answer from the start: 4/5 \u2212 1/5 = 3/5.',
          scene: { kind: 'lines', lines: ['{y:[4/5] \u2212 ? = [1/5]}', '? = [4/5] \u2212 [1/5]', '? = {c:[3/5]}'] } },
        { say: 'For multiplying, use dividing. If 1/2 \u00d7 ? = 1/6, then ? = 1/6 \u00f7 1/2. Flip and multiply: 1/6 \u00d7 2/1 = 2/6 = 1/3.',
          scene: { kind: 'lines', size: 'small', lines: ['{y:[1/2] \u00d7 ? = [1/6]}', '? = [1/6] \u00f7 [1/2]', '= [1/6] \u00d7 {b:[2/1]}', '= [2/6] = {c:[1/3]}'] } },
        { say: 'For dividing, use multiplying. If ? \u00f7 1/2 = 3, then ? = 3 \u00d7 1/2 = 3/2.',
          scene: { kind: 'lines', lines: ['{y:? \u00f7 [1/2] = 3}', '? = 3 \u00d7 [1/2]', '? = {c:[3/2]}'] } },
        { say: 'Remember: adding and subtracting undo each other. Multiplying and dividing undo each other. Use the opposite to find the missing part.',
          scene: { kind: 'lines', lines: ['{b:+}  \u2194  {b:\u2212}', '{a:\u00d7}  \u2194  {a:\u00f7}', '{y:use the opposite}'] } },
    ],
    tryIt: [
        { prompt: 'Find ?:  2/7 + ? = 5/7', choices: ['3/7', '7/7', '3/14'], answer: '3/7',
          hint: 'Subtract: 5/7 \u2212 2/7 = 3/7.' },
        { prompt: 'Find ?:  5/6 \u2212 ? = 1/6', choices: ['4/6', '1/6', '6/6'], answer: '4/6',
          hint: 'Subtract the answer from the start: 5/6 \u2212 1/6 = 4/6.' },
        { prompt: 'Find ?:  1/3 \u00d7 ? = 1/9', choices: ['1/3', '3', '1/6'], answer: '1/3',
          hint: 'Divide: 1/9 \u00f7 1/3 = 1/9 \u00d7 3/1 = 3/9 = 1/3.' },
    ],
});

MPTutorials.define('fractions-nested', {
    practice: 'fractions.html?exercise=nested,nested-exponent',
    steps: [
        { say: 'Sometimes a fraction is divided by a whole number, like 3/4 divided by 5. It looks like a fraction stacked on top of a number.',
          scene: { kind: 'lines', lines: ['{y:a fraction divided by a whole number}', '[(3/4)/5]'] } },
        { say: 'Remember that a fraction bar means divide. So this is 3/4 \u00f7 5. And any whole number is a fraction with 1 on the bottom: 5 = 5/1.',
          scene: { kind: 'lines', lines: ['[(3/4)/5]  means  [3/4] \u00f7 5', '5 = [5/1]'] } },
        { say: 'Divide by flipping. The flip of 5/1 is 1/5. So 3/4 \u00f7 5 = 3/4 \u00d7 1/5.',
          scene: { kind: 'lines', lines: ['[3/4] \u00f7 [5/1]', '[3/4] \u00d7 {b:[1/5]}'] } },
        { say: 'Multiply the tops: 3 \u00d7 1 = 3. Multiply the bottoms: 4 \u00d7 5 = 20. The answer is 3/20.',
          scene: { kind: 'lines', lines: ['[3/4] \u00d7 [1/5]', 'tops: {b:3 \u00d7 1 = 3}', 'bottoms: {a:4 \u00d7 5 = 20}', '{c:[3/20]}'] } },
        { say: 'As a decimal, that is 3 \u00f7 20. 20 does not fit into 3, so write 0 and a decimal point and add zeros. 20 fits into 30 once, and then into 100 five times. So 3/20 = 0.15.',
          scene: { kind: 'longdiv', divisor: 20, dividend: 3, extra: 2, upto: 2, done: true } },
        { say: 'Another one: 2/3 divided by 4. 2/3 \u00d7 1/4 = 2/12, which simplifies to 1/6. As a decimal, 1 \u00f7 6 = 0.1666\u2026, about 0.17.',
          scene: { kind: 'lines', size: 'small', lines: ['{y:[(2/3)/4]}', '[2/3] \u00d7 [1/4] = [2/12]', '= {c:[1/6]}', '\u2248 0.17'] } },
    ],
    tryIt: [
        { prompt: 'What is 1/2 divided by 3?', choices: ['1/6', '3/2', '1/5'], answer: '1/6',
          hint: '1/2 \u00f7 3 = 1/2 \u00d7 1/3 = 1/6.' },
        { prompt: 'What is 2/5 divided by 2?', choices: ['1/5', '4/5', '2/7'], answer: '1/5',
          hint: '2/5 \u00f7 2 = 2/5 \u00d7 1/2 = 2/10 = 1/5.' },
        { prompt: 'What is 3/4 divided by 3?', choices: ['1/4', '9/4', '3/12'], answer: '1/4',
          hint: '3/4 \u00f7 3 = 3/4 \u00d7 1/3 = 3/12 = 1/4.' },
    ],
});

MPTutorials.define('convert-fraction-decimal', {
    practice: 'conversions.html?exercise=frac-to-decimal,decimal-to-frac',
    steps: [
        { say: 'A fraction and a decimal can name the same amount. 1/2 and 0.5 are the same. So are 3/4 and 0.75.',
          scene: { kind: 'lines', lines: ['[1/2] = {c:0.5}', '[3/4] = {c:0.75}', '[1/5] = {c:0.2}'] } },
        { say: 'To change a fraction to a decimal, divide the top by the bottom. 3/4 means 3 \u00f7 4 = 0.75.',
          scene: { kind: 'grid100', fill: 75, lines: ['0.75', '75 out of 100'], eq: '3 \u00f7 4 = 0.75' } },
        { say: 'Let\u2019s try 2/5. 2 \u00f7 5 = 0.4. In the hundred square, 40 squares are filled.',
          scene: { kind: 'grid100', fill: 40, color: 'b', lines: ['0.4', '40 out of 100'], eq: '2 \u00f7 5 = 0.4' } },
        { say: 'To change a decimal to a fraction, read it as place value. 0.7 is seven tenths, so it is 7/10. 0.25 is twenty-five hundredths, so it is 25/100.',
          scene: { kind: 'lines', lines: ['0.7 = seven {b:tenths} = [7/10]', '0.25 = twenty-five {b:hundredths} = [25/100]'] } },
        { say: 'Then simplify. 25/100: divide the top and bottom by 25 to get 1/4. So 0.25 = 1/4.',
          scene: { kind: 'lines', lines: ['[25/100]', '\u00f7 {b:25}  top and bottom', '{c:[1/4]}'] } },
        { say: 'Some are worth knowing by heart: 0.5 is 1/2, 0.25 is 1/4, 0.75 is 3/4, 0.2 is 1/5 and 0.1 is 1/10.',
          scene: { kind: 'lines', size: 'small', lines: ['0.5 = {c:[1/2]}', '0.25 = {c:[1/4]}', '0.75 = {c:[3/4]}', '0.2 = {c:[1/5]}', '0.1 = {c:[1/10]}'] } },
    ],
    tryIt: [
        { prompt: 'Write 1/4 as a decimal.', choices: ['0.25', '0.14', '4.1'], answer: '0.25', hint: '1 \u00f7 4 = 0.25.' },
        { prompt: 'Write 0.6 as a fraction. Simplify it.', choices: ['3/5', '6/5', '1/6'], answer: '3/5',
          hint: '0.6 = 6/10. Divide the top and bottom by 2 to get 3/5.' },
        { prompt: 'Write 0.08 as a fraction. Simplify it.', choices: ['2/25', '8/10', '1/8'], answer: '2/25',
          hint: '0.08 = 8/100. Divide the top and bottom by 4 to get 2/25.' },
    ],
});

MPTutorials.define('percents', {
    practice: 'conversions.html?exercise=frac-to-percent,percent-to-frac,decimal-to-percent,percent-to-decimal',
    steps: [
        { say: 'Percent means \u201cout of 100\u201d. 25% means 25 out of every 100. Look at the hundred square: 25 squares are filled.',
          scene: { kind: 'grid100', fill: 25, lines: ['25%', '25 out of 100'] } },
        { say: 'As a fraction, 25% is 25/100, which simplifies to 1/4. So 25% = 1/4.',
          scene: { kind: 'lines', lines: ['25% = [25/100]', '= {c:[1/4]}'] } },
        { say: 'To change a percent to a decimal, move the decimal point two places to the left. 25% becomes 0.25. And 7% becomes 0.07.',
          scene: { kind: 'lines', lines: ['25%  \u2192  {c:0.25}', '7%  \u2192  {c:0.07}', '{y:move the point 2 places left}'] } },
        { say: 'To change a decimal to a percent, move the point two places to the right. 0.4 becomes 40%. And 0.03 becomes 3%.',
          scene: { kind: 'lines', lines: ['0.4  \u2192  {c:40%}', '0.03  \u2192  {c:3%}', '{y:move the point 2 places right}'] } },
        { say: 'To change a fraction to a percent, make the bottom 100, or divide and then move the point. 3/5: multiply the top and bottom by 20 to get 60/100. That is 60%.',
          scene: { kind: 'lines', lines: ['{y:[3/5]}', '\u00d7 {b:20}  top and bottom', '[60/100] = {c:60%}'] } },
        { say: 'Or divide first. 1/8 is 1 \u00f7 8, which long division gives as 0.125. Move the point two places right: 12.5%.',
          scene: { kind: 'longdiv', divisor: 8, dividend: 1, extra: 3, upto: 3, done: true } },
        { say: 'Some are worth knowing by heart: 50% is 1/2, 25% is 1/4, 75% is 3/4, 10% is 1/10, and 100% is the whole thing.',
          scene: { kind: 'lines', size: 'small', lines: ['50% = {c:[1/2]}', '25% = {c:[1/4]}', '75% = {c:[3/4]}', '10% = {c:[1/10]}', '100% = {c:1 whole}'] } },
    ],
    tryIt: [
        { prompt: 'Write 50% as a decimal.', choices: ['0.5', '5', '0.05'], answer: '0.5', hint: 'Move the point two places left: 50% = 0.50 = 0.5.' },
        { prompt: 'Write 0.35 as a percent.', choices: ['35%', '3.5%', '0.35%'], answer: '35%', hint: 'Move the point two places right: 0.35 = 35%.' },
        { prompt: 'Write 3/4 as a percent.', choices: ['75%', '34%', '25%'], answer: '75%', hint: '3/4 = 75/100, which is 75%.' },
    ],
});

MPTutorials.define('pemdas', {
    practice: 'pemdas.html',
    steps: [
        { say: 'When a problem has more than one operation, the order matters. Look at 2 + 3 \u00d7 4. If you go left to right you get 20. But the correct answer is 14.',
          scene: { kind: 'lines', lines: ['{y:2 + 3 \u00d7 4}', 'left to right: 5 \u00d7 4 = 20  \u2717', 'correct: {c:14}  \u2713'] } },
        { say: 'There is a set order. The memory trick is PEMDAS. P is for parentheses, E is for exponents, M and D are for multiplying and dividing, and A and S are for adding and subtracting.',
          scene: { kind: 'lines', size: 'small', lines: ['{y:P}arentheses  ( )', '{y:E}xponents  x\u00b2', '{y:M}ultiply and {y:D}ivide', '{y:A}dd and {y:S}ubtract'] } },
        { say: 'Multiply and divide are done together, left to right. Add and subtract are done together, left to right. They share a level.',
          scene: { kind: 'lines', lines: ['{b:\u00d7  \u00f7}  same level, left to right', '{a:+  \u2212}  same level, left to right'] } },
        { say: 'Back to 2 + 3 \u00d7 4. Multiplying comes before adding. 3 \u00d7 4 = 12, then 2 + 12 = 14.',
          scene: { kind: 'lines', lines: ['{y:2 + 3 \u00d7 4}', 'first: {b:3 \u00d7 4 = 12}', 'then: 2 + 12 = {c:14}'] } },
        { say: 'Parentheses come first. In (2 + 3) \u00d7 4, add inside the parentheses first. 2 + 3 = 5. Then 5 \u00d7 4 = 20.',
          scene: { kind: 'lines', lines: ['{y:(2 + 3) \u00d7 4}', 'first: {b:(2 + 3) = 5}', 'then: 5 \u00d7 4 = {c:20}'] } },
        { say: 'Exponents come before multiplying. In 3 + 2^2 \u00d7 5, do 2 squared first, which is 4. Then 4 \u00d7 5 = 20. Then 3 + 20 = 23.',
          scene: { kind: 'lines', lines: ['{y:3 + 2^2 \u00d7 5}', '2^2 = {b:4}', '4 \u00d7 5 = {b:20}', '3 + 20 = {c:23}'] } },
        { say: 'With the same level, go left to right. In 20 \u00f7 4 \u00d7 2, divide first because it comes first. 20 \u00f7 4 = 5, then 5 \u00d7 2 = 10.',
          scene: { kind: 'lines', lines: ['{y:20 \u00f7 4 \u00d7 2}', '20 \u00f7 4 = {b:5}', '5 \u00d7 2 = {c:10}'] } },
    ],
    tryIt: [
        { prompt: 'What is 5 + 2 \u00d7 3?', choices: ['11', '21', '30'], answer: '11', hint: 'Multiply first: 2 \u00d7 3 = 6. Then 5 + 6 = 11.' },
        { prompt: 'What is (5 + 2) \u00d7 3?', choices: ['11', '21', '30'], answer: '21', hint: 'Parentheses first: 5 + 2 = 7. Then 7 \u00d7 3 = 21.' },
        { prompt: 'What is 10 \u2212 2^2 + 1?', choices: ['7', '5', '3'], answer: '7', hint: 'Exponent first: 2^2 = 4. Then 10 \u2212 4 = 6, and 6 + 1 = 7.' },
    ],
});

MPTutorials.define('coordinates', {
    practice: 'geometry.html?exercise=coordinates',
    steps: [
        { say: 'A coordinate plane is a grid with two number lines. The flat one going sideways is the x-axis. The tall one going up and down is the y-axis. They cross at 0, called the origin.',
          scene: { kind: 'coordplane' } },
        { say: 'A point is described by two numbers in parentheses, like (3, 2). The first number is x. It tells us how far to go across. The second number is y. It tells us how far to go up or down.',
          scene: { kind: 'coordplane', points: [{ x: 3, y: 2, label: '(3, 2)', color: 'd' }] } },
        { say: 'Start at the origin. Go across 3 to the right, then up 2. That is where (3, 2) lives.',
          scene: { kind: 'coordplane', walk: { x: 3, y: 2 } } },
        { say: 'A negative x means go left. A negative y means go down. For (\u22122, \u22123): go across 2 to the left, then down 3.',
          scene: { kind: 'coordplane', walk: { x: -2, y: -3 } } },
        { say: 'Always say x first, then y. The point (2, 4) is not the same as (4, 2).',
          scene: { kind: 'coordplane', points: [{ x: 2, y: 4, label: '(2, 4)', color: 'a' }, { x: 4, y: 2, label: '(4, 2)', color: 'b' }] } },
        { say: 'To read a point, find how far across it is, and then how far up or down. This point is across 4 and down 1, so it is (4, \u22121).',
          scene: { kind: 'coordplane', walk: { x: 4, y: -1 } } },
    ],
    tryIt: [
        { prompt: 'Which point is across 3 and up 4?', choices: ['(3, 4)', '(4, 3)', '(\u22123, 4)'], answer: '(3, 4)', hint: 'x is across and y is up. So it is (3, 4).' },
        { prompt: 'Which point is across 2 to the left and up 1?', choices: ['(\u22122, 1)', '(2, \u22121)', '(1, \u22122)'], answer: '(\u22122, 1)', hint: 'Left is a negative x, so x = \u22122. Up is positive y, so y = 1.' },
        { prompt: 'The point (0, 5) is where?', choices: ['On the y-axis, up 5', 'On the x-axis, across 5', 'At the origin'], answer: 'On the y-axis, up 5',
          hint: 'x = 0 means no moves across. y = 5 means up 5. So it sits on the y-axis.' },
    ],
});

MPTutorials.define('volume', {
    practice: 'geometry.html?exercise=volume',
    steps: [
        { say: 'Volume is how much space is inside a 3D shape. We measure it with unit cubes, little cubes that are 1 unit on every edge. Here is a box that is 4 long, 3 wide and 1 tall.',
          scene: { kind: 'prism', l: 4, w: 3, h: 1 } },
        { say: 'The bottom layer has 4 \u00d7 3 = 12 cubes. That is the area of the base.',
          scene: { kind: 'prism', l: 4, w: 3, h: 1, eq: '4 \u00d7 3 = 12 cubes' } },
        { say: 'Stack on a second layer. Now there are 2 layers of 12, which is 24 cubes.',
          scene: { kind: 'prism', l: 4, w: 3, h: 2, eq: '12 + 12 = 24 cubes' } },
        { say: 'With a third layer there are 3 layers of 12, which is 36 cubes. The volume of the box is 36 cubic units.',
          scene: { kind: 'prism', l: 4, w: 3, h: 3, eq: '3 layers \u00d7 12 = 36 cubes' } },
        { say: 'A shortcut: volume = length \u00d7 width \u00d7 height. For this box, 4 \u00d7 3 \u00d7 3 = 36.',
          scene: { kind: 'lines', lines: ['{y:volume = length \u00d7 width \u00d7 height}', '{a:4} \u00d7 {b:3} \u00d7 {c:3} = 36', '36 cubic units'] } },
        { say: 'Another box: 5 long, 2 wide, 4 tall. 5 \u00d7 2 = 10, then 10 \u00d7 4 = 40 cubic units.',
          scene: { kind: 'prism', l: 5, w: 2, h: 4, eq: '5 \u00d7 2 \u00d7 4 = 40' } },
    ],
    tryIt: [
        { prompt: 'A box is 2 long, 3 wide and 4 tall. What is its volume?', scene: { kind: 'prism', l: 2, w: 3, h: 4 },
          choices: ['9', '24', '12'], answer: '24', hint: '2 \u00d7 3 = 6, and 6 \u00d7 4 = 24 cubic units.' },
        { prompt: 'A box is 5 long, 5 wide and 2 tall. What is its volume?', choices: ['50', '20', '12'], answer: '50',
          hint: '5 \u00d7 5 = 25, and 25 \u00d7 2 = 50 cubic units.' },
        { prompt: 'The base of a box has 10 cubes. It is 3 layers tall. What is its volume?', choices: ['30', '13', '300'], answer: '30',
          hint: '10 cubes in each layer \u00d7 3 layers = 30.' },
    ],
});
