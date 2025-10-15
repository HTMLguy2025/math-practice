const answerSpan = document.querySelector('#answer');
const answerButton = document.querySelector('#answer-button');
const inputOne = document.querySelector('#input1');
const inputTwo = document.querySelector('#input2');

document.addEventListener('DOMContentLoaded', () => {
    
    registerEventListeners();
})


const registerEventListeners = () => {
    answerButton.addEventListener('click', () => {
        const input1 = Math.round(Math.random() * 10);
        const input2 = Math.round(Math.random() * 10);
        const answer =  input1 * input2;

        inputOne.innerHTML = input1;
        inputTwo.innerHTML = input2;
        answerSpan.innerHTML = answer;
        console.log(input1 + " x " + input2 + " = " + answer);
    });
}