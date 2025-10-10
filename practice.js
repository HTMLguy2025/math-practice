const LastQuesNum1 = document.querySelector('#previousQuestionNum1');
const LastQuesNum2 = document.querySelector('#previousQuestionNum2');
const LastQuesAnswer = document.querySelector('#previousQuestionAnswer');
const LastQuesOperator = document.querySelector("#previousQuestionOperator");
const factNumberOne = document.querySelector("#factNum1");
const factNumberTwo = document.querySelector("#factNum2");
const Operator = document.querySelector("#operator");
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");
const button5 = document.querySelector("#button5");
const button6 = document.querySelector("#button6");
const button7 = document.querySelector("#button7");
const button8 = document.querySelector("#button8");
const button9 = document.querySelector("#button9");
const button0 = document.querySelector("#button0");
const multiplyButton = document.querySelector("#multiplyButton");
const addButton = document.querySelector("#addButton");
const subtractButton = document.querySelector("#subtractButton");
const checkButton = document.querySelector("#checkmark");
const DisplayedSelectedAnswer = document.querySelector("#displayedSelectedAnswer");
const DeleteButton = document.querySelector("#deleteButton");
const NegativeButton = document.querySelector("#negativeButton");

var selectedAnswer = ""

var previousQuestionNum1 = "5"

var previousQuestionNum2 = "5"

var previousQuestionAnswer = "25"

var previousQuestionOperator = "times"

var currentQuestionNum1 = "4"

var currentQuestionNum2 = "4"

var answer = "16"

var currentQuestionOperator = "times"


document.addEventListener('DOMContentLoaded', () => {
    
    registerEventListeners();
})

const registerEventListeners = () => {
    button1.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("1");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    button2.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("2");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    button3.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("3");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    button4.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("4");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    button5.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("5");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    button6.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("6");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    button7.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("7");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    button8.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("8");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    button9.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("9");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    button0.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("0");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    checkButton.addEventListener('click', () => {
        
        if (selectedAnswer == answer) {
            previousQuestionNum1 = currentQuestionNum1
            previousQuestionNum2 = currentQuestionNum2
            previousQuestionAnswer = answer
            previousQuestionOperator = currentQuestionOperator
            if (currentQuestionOperator == "times") {
                Operator.innerHTML = "x"
                currentQuestionNum1 = Math.ceil(Math.random() * 10);
                currentQuestionNum2 = Math.ceil(Math.random() * 10);
                answer = currentQuestionNum1 * currentQuestionNum2
            }

            if (currentQuestionOperator == "plus") {
                Operator.innerHTML = "+"
                currentQuestionNum1 = Math.ceil(Math.random() * 10);
                currentQuestionNum2 = Math.ceil(Math.random() * 10);
                answer = currentQuestionNum1 + currentQuestionNum2
            }

            if (currentQuestionOperator == "minus") {
                Operator.innerHTML = "-"
                currentQuestionNum1 = Math.ceil(Math.random() * 10);
                currentQuestionNum2 = Math.ceil(Math.random() * 10);
                answer = currentQuestionNum1 - currentQuestionNum2
            }

            if (previousQuestionOperator == "times") {
                LastQuesOperator.innerHTML = "x"
            }

            if (previousQuestionOperator == "plus") {
                LastQuesOperator.innerHTML = "+"
            }

            if (previousQuestionOperator == "minus") {
                LastQuesOperator.innerHTML = "-"
            }
            
            LastQuesNum1.innerHTML = previousQuestionNum1
            LastQuesNum2.innerHTML = previousQuestionNum2
            LastQuesAnswer.innerHTML = previousQuestionAnswer
            factNumberOne.innerHTML = currentQuestionNum1
            factNumberTwo.innerHTML = currentQuestionNum2
            
            console.log(previousQuestionNum1 + " " + previousQuestionOperator + " " + previousQuestionNum2 + " = " + previousQuestionAnswer + " - correct");
            selectedAnswer = ("|");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }

        else {
            previousQuestionNum1 = currentQuestionNum1
            previousQuestionNum2 = currentQuestionNum2
            previousQuestionAnswer = answer
            previousQuestionOperator = currentQuestionOperator
            if (currentQuestionOperator == "times") {
                Operator.innerHTML = "x"
                currentQuestionNum1 = Math.ceil(Math.random() * 10);
                currentQuestionNum2 = Math.ceil(Math.random() * 10);
                answer = currentQuestionNum1 * currentQuestionNum2
            }

            if (currentQuestionOperator == "plus") {
                Operator.innerHTML = "+"
                currentQuestionNum1 = Math.ceil(Math.random() * 10);
                currentQuestionNum2 = Math.ceil(Math.random() * 10);
                answer = currentQuestionNum1 + currentQuestionNum2
            }

            if (currentQuestionOperator == "minus") {
                Operator.innerHTML = "-"
                currentQuestionNum1 = Math.ceil(Math.random() * 10);
                currentQuestionNum2 = Math.ceil(Math.random() * 10);
                answer = currentQuestionNum1 - currentQuestionNum2
            }

            if (previousQuestionOperator == "times") {
                LastQuesOperator.innerHTML = "x"
            }

            if (previousQuestionOperator == "plus") {
                LastQuesOperator.innerHTML = "+"
            }

            if (previousQuestionOperator == "minus") {
                LastQuesOperator.innerHTML = "-"
            }

            LastQuesNum1.innerHTML = previousQuestionNum1
            LastQuesNum2.innerHTML = previousQuestionNum2
            LastQuesAnswer.innerHTML = previousQuestionAnswer
            factNumberOne.innerHTML = currentQuestionNum1
            factNumberTwo.innerHTML = currentQuestionNum2
            console.log(previousQuestionNum1 + " " + previousQuestionOperator + " " + previousQuestionNum2 + " = " + previousQuestionAnswer + " - incorrect");
            selectedAnswer = ("|");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });

    DeleteButton.addEventListener('click', () => {
        selectedAnswer = ("|");
        DisplayedSelectedAnswer.innerHTML = selectedAnswer
        console.log("deleted text");
    });

    multiplyButton.addEventListener('click', () => {
        currentQuestionOperator = "times"
        DisplayedSelectedAnswer.innerHTML = "Click checkmark twice"
    });

    addButton.addEventListener('click', () => {
        currentQuestionOperator = "plus"
        DisplayedSelectedAnswer.innerHTML = "Click checkmark twice"
    });

    subtractButton.addEventListener('click', () => {
        currentQuestionOperator = "minus"
        DisplayedSelectedAnswer.innerHTML = "Click checkmark twice"
    });

    NegativeButton.addEventListener('click', () => {
        if (selectedAnswer.length < 25) {
            if (selectedAnswer.includes("|")) {
                selectedAnswer = ""
            }
            selectedAnswer = selectedAnswer + ("-");
            DisplayedSelectedAnswer.innerHTML = selectedAnswer
        }
    });
}