const LastQuesNum1 = document.querySelector('#previousQuestionNum1');
const LastQuesNum2 = document.querySelector('#previousQuestionNum2');
const LastQuesAnswer = document.querySelector('#previousQuestionAnswer');
const LastQuesOperator = document.querySelector("#previousQuestionOperator");
const factNumberOne = document.querySelector("#factNum1");
const factNumberTwo = document.querySelector("#factNum2");
const Operator = document.querySelector("#operator");
const checkButton = document.querySelector("#checkmark");
const DisplayedSelectedAnswer = document.querySelector("#displayedSelectedAnswer");
const DeleteButton = document.querySelector("#deleteButton");
const NegativeButton = document.querySelector("#negativeButton");
const DecimalButton = document.querySelector("#decimalButton");
const QuestionsAnswered = document.querySelector("#questionsAnswered");
const QuestionsCorrect = document.querySelector("#questionscorrect");
const TopScore = document.querySelector("#topScore");
const FinishButton = document.querySelector("#finishButton");
const PracticePoints = document.querySelector("#practicePoints");
const PracticePointsRow = document.querySelector("#practicePointsRow");
const AutoCompleteCheck = document.querySelector("#autoCompleteCheck");

const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
};
const setCookie = (name, value) => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires.toUTCString() + '; path=/';
};

const toLocalDateStr = (d) =>
    d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');

const prevWeekday = (date) => {
    const d = new Date(date);
    do { d.setDate(d.getDate() - 1); } while (d.getDay() === 0 || d.getDay() === 6);
    return d;
};

// --- URL options ---
const params = new URLSearchParams(window.location.search);
const urlMode     = params.get('mode') || 'multiply';
const digitsParam = params.get('digits') || '1';
const digitsList  = digitsParam.split(',').map(Number).filter(n => [1, 2, 3].includes(n));
if (digitsList.length === 0) digitsList.push(1);
const urlDigits   = digitsList[0]; // used for display / score key

const useNegatives = params.get('negatives') === '1';
const useDecimals  = params.get('decimals') === '1';
// "Mix with regular": each enabled modifier is a coin flip per question, so
// questions range from plain through one modifier to both at once.
const mixRegular   = params.get('mixregular') === '1' && (useNegatives || useDecimals);

// Plain runs keep their historical top-score key; modified runs get their own.
const scoreKey = 'topScore_' + urlMode + '_' + urlDigits
    + (useNegatives ? '_neg' : '')
    + (useDecimals  ? '_dec' : '');

const getTopScore = () => localStorage.getItem(scoreKey);
const setTopScore = (value) => localStorage.setItem(scoreKey, value);

// A session only replaces the saved top score if it is genuinely better:
// higher accuracy wins, and on equal accuracy the longer session wins. Compared
// with cross-multiplication so 2/3 and 4/6 count as the same accuracy exactly.
const isBetterScore = (correct, answered, saved) => {
    if (!saved) return true;
    const [savedCorrect, savedAnswered] = saved.split('/').map(Number);
    if (!savedAnswered) return true;
    const lhs = correct * savedAnswered;
    const rhs = savedCorrect * answered;
    if (lhs !== rhs) return lhs > rhs;
    return answered > savedAnswered;
};

// --- Question generation ---
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const round2  = (x) => Math.round(x * 100) / 100;

const pickDigits = () => digitsList[Math.floor(Math.random() * digitsList.length)];

const pickMods = () => {
    if (!mixRegular) return { neg: useNegatives, dec: useDecimals };
    return {
        neg: useNegatives && Math.random() < 0.5,
        dec: useDecimals  && Math.random() < 0.5,
    };
};

const getNum = (d, dec) => {
    let n;
    if (d === 1)      n = Math.ceil(Math.random() * 10);
    else if (d === 2) n = randInt(10, 99);
    else              n = randInt(100, 999);
    // Decimal operands carry one non-zero tenth so the decimal is always real.
    if (dec) n = round2(n + randInt(1, 9) / 10);
    return n;
};

// "With negatives": at least one operand is negative.
const applySigns = (n1, n2) => {
    const pattern = randInt(0, 2);   // 0: first only, 1: second only, 2: both
    return {
        n1: pattern !== 1 ? -n1 : n1,
        n2: pattern !== 0 ? -n2 : n2,
    };
};

const getPair = () => {
    const d = pickDigits();
    const { neg, dec } = pickMods();
    let n1, n2;

    if (urlMode === 'divide') {
        if (dec) {
            // Decimal divisor with a whole-number quotient keeps the answer clean.
            const divisor  = getNum(d, true);
            const quotient = randInt(2, 12);
            n2 = divisor;
            n1 = round2(divisor * quotient);
        } else if (d === 1) {
            // 2-digit ÷ 1-digit that divides evenly.
            const divisor  = randInt(2, 9);
            const quotient = randInt(2, 10);
            n1 = divisor * quotient;
            n2 = divisor;
        } else {
            n1 = getNum(d, false);
            n2 = getNum(d, false);
        }
    } else {
        n1 = getNum(d, dec);
        n2 = getNum(d, dec);
    }

    if (neg) ({ n1, n2 } = applySigns(n1, n2));
    return { n1, n2, digits: d, neg, dec };
};

const computeAnswer = (n1, n2, op) => {
    if (op === 'times') return round2(n1 * n2);
    if (op === 'plus')  return round2(n1 + n2);
    if (op === 'minus') return round2(n1 - n2);
    return round2(n1 / n2);
};

// A negative second operand gets parentheses so "5 − (−3)" reads clearly.
const fmtTop    = (n) => String(n);
const fmtBottom = (n) => (n < 0 ? '(' + n + ')' : String(n));

const opSymbol = { times: 'x', plus: '+', minus: '-', divide: '÷' };
const modeToOperator = { multiply: 'times', add: 'plus', subtract: 'minus', divide: 'divide' };

var selectedAnswer = "";
var currentQuestionOperator = modeToOperator[urlMode] || 'times';
var current = getPair();
var answer = computeAnswer(current.n1, current.n2, currentQuestionOperator);
var previous = getPair();
var previousQuestionOperator = currentQuestionOperator;
var previousQuestionAnswer = computeAnswer(previous.n1, previous.n2, previousQuestionOperator);
var questionsCorrect = 0;
var questionsAnswered = 0;
var sessionPoints = 0;

const renderAnswer = () => {
    DisplayedSelectedAnswer.innerHTML = selectedAnswer + '<span class="cursor"></span>';
}

const appendToAnswer = (digit) => {
    if (selectedAnswer.length < 25) {
        selectedAnswer = selectedAnswer + digit;
        renderAnswer();
        autoCheck();
    }
}

const particleColors = ['#4fc3f7','#81c784','#ffb74d','#f06292','#ce93d8','#fff176'];

const spawnParticles = (originEl) => {
    const rect = originEl.getBoundingClientRect();
    const ox = rect.left + rect.width / 2;
    const oy = rect.top + rect.height / 2;
    const count = 28;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const angle = Math.random() * 2 * Math.PI;
        const dist = 80 + Math.random() * 140;
        const size = (6 + Math.random() * 8) + 'px';
        p.style.left = ox + 'px';
        p.style.top = oy + 'px';
        p.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
        p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        p.style.width = size;
        p.style.height = size;
        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }
};

// Auto-Complete submits as soon as the typed answer matches. On by default;
// the toggle under the check button remembers the choice.
let autoComplete = localStorage.getItem('autoComplete') !== '0';

const autoCheck = () => {
    if (autoComplete && selectedAnswer == answer) {
        checkButton.click();
    }
}

// --- Streak / daily-goal context (shared by the live display and Finish) ---
// A stored streak only stands if it was last extended today or on the previous
// weekday. The goal shown is the one in force at the start of today, so if the
// streak was already extended today we look at the count before that extension.
const getStreakContext = () => {
    const today = getToday();
    const dow = today.getDay();
    const isWeekday = dow !== 0 && dow !== 6;
    const todayStr = toLocalDateStr(today);

    const dpDate = getCookie('dailyPointsDate_' + urlMode);
    const savedDaily = dpDate === todayStr ? parseInt(getCookie('dailyPoints_' + urlMode) || '0') : 0;

    const lastStr = getCookie('streakLastDate_' + urlMode);
    let streak = parseInt(getCookie('streakCount_' + urlMode) || '0');
    const extendedToday = lastStr === todayStr;
    const lapsed = !extendedToday && lastStr !== toLocalDateStr(prevWeekday(today));
    if (lapsed) streak = 0;

    const baseStreak = extendedToday ? Math.max(0, streak - 1) : streak;
    const goal = Math.min(50 + baseStreak, 120);

    return { todayStr, isWeekday, savedDaily, streak, extendedToday, lapsed, goal, bonusAt: goal + 20 };
};

const FLAME_HTML =
    '<span class="finish-flame" aria-hidden="true">' +
        '<svg viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg" overflow="visible">' +
            '<circle class="ember-1" cx="9"  cy="5" r="1.2" fill="#ff9800"/>' +
            '<circle class="ember-2" cx="13" cy="3" r="1.0" fill="#ffcc02"/>' +
            '<circle class="ember-3" cx="8"  cy="7" r="0.9" fill="#ff6d00"/>' +
            '<g class="flame-body">' +
                '<path d="M11,30 C4,25 1,18 4,11 C6,6 9,2 11,-1 C13,2 16,6 18,11 C21,18 18,25 11,30Z" fill="#ff4500"/>' +
                '<path d="M11,27 C6,22 4,17 7,11 C9,7 11,4 11,1 C11,4 13,7 15,11 C18,17 16,22 11,27Z" fill="#ff6d00"/>' +
                '<g class="flame-inner"><path d="M11,24 C8,20 7,16 9,12 C10,10 11,8 11,8 C11,8 12,10 13,12 C15,16 14,20 11,24Z" fill="#ffd600"/></g>' +
                '<path d="M11,9 C10,6 10,3 11,0 C12,3 12,6 11,9Z" fill="#fff9c4" opacity="0.85"/>' +
            '</g>' +
        '</svg>' +
        '<span class="text-ember te-1"></span><span class="text-ember te-2"></span><span class="text-ember te-3"></span>' +
    '</span>';

const updatePracticePoints = () => {
    if (!PracticePoints) return;
    const ctx = getStreakContext();
    const total = ctx.savedDaily + sessionPoints;
    const goalMet  = ctx.isWeekday && total >= ctx.goal;
    const bonusHit = ctx.isWeekday && total >= ctx.bonusAt;

    PracticePoints.textContent = ctx.isWeekday ? total + ' / ' + ctx.goal : String(total);
    if (PracticePointsRow) {
        PracticePointsRow.classList.toggle('goal-met', goalMet && !bonusHit);
        PracticePointsRow.classList.toggle('bonus-ready', bonusHit);
    }

    FinishButton.classList.toggle('goal-met', goalMet && !bonusHit);
    FinishButton.classList.toggle('bonus-ready', bonusHit);
    const flame = FinishButton.querySelector('.finish-flame');
    if (bonusHit && !flame) FinishButton.insertAdjacentHTML('beforeend', FLAME_HTML);
    if (!bonusHit && flame) flame.remove();
};

document.addEventListener('DOMContentLoaded', () => {
    const saved = getTopScore();
    if (saved) {
        TopScore.innerHTML = saved;
    }

    const modeNames = { multiply: 'Multiplication', add: 'Addition', subtract: 'Subtraction', divide: 'Division' };
    const digitLabels = { 1: '1-Digit', 2: '2-Digit', 3: '3-Digit' };
    const modeIndicator = document.getElementById('modeIndicator');
    if (modeIndicator) {
        const digitLabel = digitsList.length > 1
            ? digitsList.map(d => digitLabels[d] || d).join(', ')
            : (digitLabels[urlDigits] || '1-Digit');
        let label = (modeNames[urlMode] || 'Multiplication') + ' · ' + digitLabel;
        const mods = [];
        if (useNegatives) mods.push('Negatives');
        if (useDecimals)  mods.push('Decimals');
        if (mods.length) label += ' · ' + mods.join(', ') + (mixRegular ? ' (mixed)' : '');
        modeIndicator.textContent = label;
    }

    Operator.innerHTML = opSymbol[currentQuestionOperator];
    LastQuesOperator.innerHTML = opSymbol[previousQuestionOperator];
    factNumberOne.innerHTML = fmtTop(current.n1);
    factNumberTwo.innerHTML = fmtBottom(current.n2);
    LastQuesNum1.innerHTML = fmtTop(previous.n1);
    LastQuesNum2.innerHTML = fmtBottom(previous.n2);
    LastQuesAnswer.innerHTML = previousQuestionAnswer;

    if (AutoCompleteCheck) {
        AutoCompleteCheck.checked = autoComplete;
        AutoCompleteCheck.addEventListener('change', () => {
            autoComplete = AutoCompleteCheck.checked;
            localStorage.setItem('autoComplete', autoComplete ? '1' : '0');
        });
    }

    updatePracticePoints();
    registerEventListeners();
});

const registerEventListeners = () => {
    ['1','2','3','4','5','6','7','8','9','0'].forEach(digit => {
        document.querySelector(`#button${digit}`).addEventListener('click', () => {
            appendToAnswer(digit);
        });
    });

    checkButton.addEventListener('click', () => {
        const checkPath = checkButton.querySelector('svg path');
        const len = checkPath.getTotalLength();
        checkPath.animate([
            { offset: 0,    strokeDasharray: `${len} ${len}`, opacity: 1,   easing: 'ease-in' },
            { offset: 0.38, strokeDasharray: `0.5 ${len}`,    opacity: 0.2, easing: 'linear' },
            { offset: 0.44, strokeDasharray: `${len} ${len}`, opacity: 0,   easing: 'ease-out' },
            { offset: 1.0,  strokeDasharray: `${len} ${len}`, opacity: 1 },
        ], { duration: 325 });

        const wasCorrect = selectedAnswer == answer;
        const answered = current;

        previous = current;
        previousQuestionAnswer = answer;
        previousQuestionOperator = currentQuestionOperator;

        current = getPair();
        answer = computeAnswer(current.n1, current.n2, currentQuestionOperator);

        LastQuesOperator.innerHTML = opSymbol[previousQuestionOperator];
        LastQuesNum1.innerHTML = fmtTop(previous.n1);
        LastQuesNum2.innerHTML = fmtBottom(previous.n2);
        LastQuesAnswer.innerHTML = previousQuestionAnswer;
        factNumberOne.innerHTML = fmtTop(current.n1);
        factNumberTwo.innerHTML = fmtBottom(current.n2);

        if (wasCorrect) {
            setTimeout(() => spawnParticles(checkButton), 325);
            questionsCorrect++;
            questionsAnswered++;
            // Harder questions are worth more: by digit count, plus a bonus per
            // modifier applied — decimals take more work than a sign flip.
            const digitPoints = { 1: 1, 2: 3, 3: 5 };
            const NEGATIVE_BONUS = 1, DECIMAL_BONUS = 2;
            sessionPoints += (digitPoints[answered.digits] || answered.digits)
                + (answered.neg ? NEGATIVE_BONUS : 0)
                + (answered.dec ? DECIMAL_BONUS : 0);
        } else {
            questionsAnswered++;
        }

        QuestionsAnswered.innerHTML = questionsAnswered;
        QuestionsCorrect.innerHTML = questionsCorrect;
        updatePracticePoints();
        selectedAnswer = "";
        renderAnswer();
    });

    DeleteButton.addEventListener('click', () => {
        selectedAnswer = "";
        renderAnswer();
    });

    NegativeButton.addEventListener('click', () => {
        appendToAnswer("-");
    });

    DecimalButton.addEventListener('click', () => {
        if (!selectedAnswer.includes('.')) {
            appendToAnswer('.');
        }
    });

    FinishButton.addEventListener('click', () => {
        if (questionsAnswered > 0) {
            if (isBetterScore(questionsCorrect, questionsAnswered, getTopScore())) {
                const newTopScore = questionsCorrect + '/' + questionsAnswered;
                setTopScore(newTopScore);
                TopScore.innerHTML = newTopScore;
            }

            const ctx = getStreakContext();
            if (ctx.isWeekday) {
                const dailyPts = ctx.savedDaily + sessionPoints;
                setCookie('dailyPoints_' + urlMode,     String(dailyPts));
                setCookie('dailyPointsDate_' + urlMode, ctx.todayStr);

                if (!ctx.extendedToday && dailyPts >= ctx.goal) {
                    let streak;
                    if (ctx.lapsed) {
                        streak = 1;
                        setCookie('bonusCount_' + urlMode, '0');
                    } else {
                        streak = ctx.streak + 1;
                    }

                    let best = parseInt(getCookie('streakBest_' + urlMode) || '0');
                    if (streak > best) best = streak;

                    setCookie('streakCount_'    + urlMode, String(streak));
                    setCookie('streakLastDate_' + urlMode, ctx.todayStr);
                    setCookie('streakBest_'     + urlMode, String(best));
                }

                const bonusEarnedDate = getCookie('bonusEarnedDate_' + urlMode);
                if (bonusEarnedDate !== ctx.todayStr && dailyPts >= ctx.bonusAt) {
                    let bonuses = parseInt(getCookie('bonusCount_' + urlMode) || '0');
                    bonuses++;
                    setCookie('bonusCount_'      + urlMode, String(bonuses));
                    setCookie('bonusEarnedDate_' + urlMode, ctx.todayStr);
                }
            }
        }

        spawnParticles(FinishButton);
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    });

    document.addEventListener('keyup', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            appendToAnswer(e.key);
        } else if (e.key === '.') {
            if (!selectedAnswer.includes('.')) appendToAnswer('.');
        } else if (e.key === '-') {
            appendToAnswer('-');
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            selectedAnswer = "";
            renderAnswer();
        } else if (e.key === 'Enter') {
            checkButton.click();
        }
    });
}
