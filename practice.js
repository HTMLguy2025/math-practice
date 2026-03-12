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

const getTopScore = () => {
    const value = localStorage.getItem('topScore_' + urlMode + '_' + urlDigits);
    console.log('[TopScore] Loaded from storage:', value);
    return value;
}

const setTopScore = (value) => {
    localStorage.setItem('topScore_' + urlMode + '_' + urlDigits, value);
    console.log('[TopScore] Saved to storage:', value, '| Verify read-back:', localStorage.getItem('topScore_' + urlMode + '_' + urlDigits));
}

const params = new URLSearchParams(window.location.search);
const urlMode = params.get('mode') || 'multiply';
const urlDigits = parseInt(params.get('digits')) || 1;

const getNum = () => {
    if (urlDigits === 1) return Math.ceil(Math.random() * 10);
    if (urlDigits === 2) return Math.floor(Math.random() * 90) + 10;
    return Math.floor(Math.random() * 900) + 100;
};

const computeAnswer = (n1, n2, op) => {
    if (op === 'times') return n1 * n2;
    if (op === 'plus') return n1 + n2;
    if (op === 'minus') return n1 - n2;
    return Math.round((n1 / n2) * 100) / 100;
};

const opSymbol = { times: 'x', plus: '+', minus: '-', divide: '÷' };
const modeToOperator = { multiply: 'times', add: 'plus', subtract: 'minus', divide: 'divide' };

var selectedAnswer = "";
var currentQuestionOperator = modeToOperator[urlMode] || 'times';
var currentQuestionNum1 = getNum();
var currentQuestionNum2 = getNum();
var answer = computeAnswer(currentQuestionNum1, currentQuestionNum2, currentQuestionOperator);
var previousQuestionNum1 = getNum();
var previousQuestionNum2 = getNum();
var previousQuestionOperator = currentQuestionOperator;
var previousQuestionAnswer = computeAnswer(previousQuestionNum1, previousQuestionNum2, previousQuestionOperator);
var questionsCorrect = 0;
var questionsAnswered = 0;

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

const autoCheck = () => {
    if (selectedAnswer == answer) {
        checkButton.click();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = getTopScore();
    if (saved) {
        TopScore.innerHTML = saved;
    }

    const modeNames = { multiply: 'Multiplication', add: 'Addition', subtract: 'Subtraction' };
    const digitLabels = { 1: '1-Digit', 2: '2-Digit', 3: '3-Digit' };
    const modeIndicator = document.getElementById('modeIndicator');
    if (modeIndicator) {
        modeIndicator.textContent = (modeNames[urlMode] || 'Multiplication') + ' · ' + (digitLabels[urlDigits] || '1-Digit');
    }

    Operator.innerHTML = opSymbol[currentQuestionOperator];
    LastQuesOperator.innerHTML = opSymbol[previousQuestionOperator];
    factNumberOne.innerHTML = currentQuestionNum1;
    factNumberTwo.innerHTML = currentQuestionNum2;
    LastQuesNum1.innerHTML = previousQuestionNum1;
    LastQuesNum2.innerHTML = previousQuestionNum2;
    LastQuesAnswer.innerHTML = previousQuestionAnswer;

    registerEventListeners();
});

const registerEventListeners = () => {
    ['1','2','3','4','5','6','7','8','9','0'].forEach(digit => {
        document.querySelector(`#button${digit}`).addEventListener('click', () => {
            appendToAnswer(digit);
        });
    });

    checkButton.addEventListener('click', () => {
        const wasCorrect = selectedAnswer == answer;

        previousQuestionNum1 = currentQuestionNum1;
        previousQuestionNum2 = currentQuestionNum2;
        previousQuestionAnswer = answer;
        previousQuestionOperator = currentQuestionOperator;

        currentQuestionNum1 = getNum();
        currentQuestionNum2 = getNum();
        answer = computeAnswer(currentQuestionNum1, currentQuestionNum2, currentQuestionOperator);

        LastQuesOperator.innerHTML = opSymbol[previousQuestionOperator];
        LastQuesNum1.innerHTML = previousQuestionNum1;
        LastQuesNum2.innerHTML = previousQuestionNum2;
        LastQuesAnswer.innerHTML = previousQuestionAnswer;
        factNumberOne.innerHTML = currentQuestionNum1;
        factNumberTwo.innerHTML = currentQuestionNum2;

        if (wasCorrect) {
            spawnParticles(checkButton);
            console.log(previousQuestionNum1 + " " + previousQuestionOperator + " " + previousQuestionNum2 + " = " + previousQuestionAnswer + " - correct");
            questionsCorrect++;
            questionsAnswered++;
        } else {
            console.log(previousQuestionNum1 + " " + previousQuestionOperator + " " + previousQuestionNum2 + " = " + previousQuestionAnswer + " - incorrect");
            questionsAnswered++;
        }

        QuestionsAnswered.innerHTML = questionsAnswered;
        QuestionsCorrect.innerHTML = questionsCorrect;
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
            const currentPct = questionsCorrect / questionsAnswered;
            const saved = getTopScore();
            let saveNew = true;
            if (saved) {
                const parts = saved.split('/');
                const savedPct = parseInt(parts[0]) / parseInt(parts[1]);
                if (currentPct < savedPct) {
                    saveNew = false;
                }
            }
            if (saveNew) {
                const newTopScore = questionsCorrect + '/' + questionsAnswered;
                setTopScore(newTopScore);
                TopScore.innerHTML = newTopScore;
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
