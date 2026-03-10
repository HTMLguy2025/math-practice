const LastQuesNum1 = document.querySelector('#previousQuestionNum1');
const LastQuesNum2 = document.querySelector('#previousQuestionNum2');
const LastQuesAnswer = document.querySelector('#previousQuestionAnswer');
const LastQuesOperator = document.querySelector("#previousQuestionOperator");
const factNumberOne = document.querySelector("#factNum1");
const factNumberTwo = document.querySelector("#factNum2");
const Operator = document.querySelector("#operator");
const multiplyButton = document.querySelector("#multiplyButton");
const addButton = document.querySelector("#addButton");
const subtractButton = document.querySelector("#subtractButton");
const checkButton = document.querySelector("#checkmark");
const DisplayedSelectedAnswer = document.querySelector("#displayedSelectedAnswer");
const DeleteButton = document.querySelector("#deleteButton");
const NegativeButton = document.querySelector("#negativeButton");
const QuestionsAnswered = document.querySelector("#questionsAnswered");
const QuestionsCorrect = document.querySelector("#questionscorrect");
const TopScore = document.querySelector("#topScore");
const FinishButton = document.querySelector("#finishButton");

const getTopScore = () => {
    const value = localStorage.getItem('topScore');
    console.log('[TopScore] Loaded from storage:', value);
    return value;
}

const setTopScore = (value) => {
    localStorage.setItem('topScore', value);
    console.log('[TopScore] Saved to storage:', value, '| Verify read-back:', localStorage.getItem('topScore'));
}

var selectedAnswer = ""
var previousQuestionNum1 = "5"
var previousQuestionNum2 = "5"
var previousQuestionAnswer = "25"
var previousQuestionOperator = "times"
var currentQuestionNum1 = "4"
var currentQuestionNum2 = "4"
var answer = "16"
var currentQuestionOperator = "times"
var switchOperatorCheckPressed = 0
var questionsCorrect = 0
var questionsAnswered = 0

const renderAnswer = () => {
    DisplayedSelectedAnswer.innerHTML = selectedAnswer + '<span class="cursor"></span>';
}

const showMessage = (msg) => {
    DisplayedSelectedAnswer.innerHTML = msg;
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

        if (currentQuestionOperator == "times") {
            Operator.innerHTML = "x";
            currentQuestionNum1 = Math.ceil(Math.random() * 10);
            currentQuestionNum2 = Math.ceil(Math.random() * 10);
            answer = currentQuestionNum1 * currentQuestionNum2;
        } else if (currentQuestionOperator == "plus") {
            Operator.innerHTML = "+";
            currentQuestionNum1 = Math.ceil(Math.random() * 10);
            currentQuestionNum2 = Math.ceil(Math.random() * 10);
            answer = currentQuestionNum1 + currentQuestionNum2;
        } else if (currentQuestionOperator == "minus") {
            Operator.innerHTML = "-";
            currentQuestionNum1 = Math.ceil(Math.random() * 10);
            currentQuestionNum2 = Math.ceil(Math.random() * 10);
            answer = currentQuestionNum1 - currentQuestionNum2;
        }

        if (previousQuestionOperator == "times") LastQuesOperator.innerHTML = "x";
        else if (previousQuestionOperator == "plus") LastQuesOperator.innerHTML = "+";
        else if (previousQuestionOperator == "minus") LastQuesOperator.innerHTML = "-";

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
            if (switchOperatorCheckPressed < 1) {
                console.log(previousQuestionNum1 + " " + previousQuestionOperator + " " + previousQuestionNum2 + " = " + previousQuestionAnswer + " - incorrect");
                questionsAnswered++;
            }
            if (switchOperatorCheckPressed > 0) {
                switchOperatorCheckPressed--;
            }
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

    multiplyButton.addEventListener('click', () => {
        currentQuestionOperator = "times";
        switchOperatorCheckPressed = 2;
        showMessage("Click checkmark twice");
        console.log("Mode changed to multiplication");
    });

    addButton.addEventListener('click', () => {
        currentQuestionOperator = "plus";
        switchOperatorCheckPressed = 2;
        showMessage("Click checkmark twice");
        console.log("Mode changed to addition");
    });

    subtractButton.addEventListener('click', () => {
        currentQuestionOperator = "minus";
        switchOperatorCheckPressed = 2;
        showMessage("Click checkmark twice");
        console.log("Mode changed to subtraction");
    });

    NegativeButton.addEventListener('click', () => {
        appendToAnswer("-");
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
        
    });

    document.addEventListener('keyup', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            appendToAnswer(e.key);
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
