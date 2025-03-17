const display = document.querySelector('.result');
const secDisplay = document.querySelector('.secondary-display');
const buttons = document.querySelectorAll('button');

let firstNumber = '';
let secondNumber = '';
let operator = '';
let shouldResetDisplay = false;

function updateDisplay(value) {
    if (shouldResetDisplay) {
        display.textContent = '';
        shouldResetDisplay = false;
    }
    display.textContent += value;
}

function updateSecondaryDisplay(value) {
    secDisplay.textContent = value;
}

function resetCalculator() {
    firstNumber = '';
    secondNumber = '';
    operator = '';
    display.textContent = '0';
    secDisplay.textContent = '0';
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Do you really want to do that? Seriously? You can't divide by zero!";
    }
    return a / b;
}

function operate() {
    let a = parseFloat(firstNumber);
    let b = parseFloat(secondNumber);
    let result = 0;

    switch (operator) {
        case "+":
            result = add(a, b);
            break;
        case "-":
            result = subtract(a, b);
            break;
        case "*":
            result = multiply(a, b);
            break;
        case "/":
            result = divide(a, b);
            break;
        default:
            return;
    }

    display.textContent = result.toFixed(8).replace(/\.?0+$/, '');
    firstNumber = result.toString();
    secondNumber = '';
    operator = '';
    shouldResetDisplay = true;
}

function backspace() {
    display.textContent = display.textContent.slice(0, -1);
    if (display.textContent === '') {
        display.textContent = '0';
    }
}

function calculatePercentage() {
    const currentValue = parseFloat(display.textContent);
    display.textContent = (currentValue / 100).toString;
}

function invertSign() {
    const currentValue = parseFloat(display.textContent);
    display.textContent = (-currentValue).toString();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonValue = button.textContent;

        if (!isNaN(buttonValue) || buttonValue === '.') {
            if (shouldResetDisplay) {
                display.textContent = '';
                shouldResetDisplay = false;
            }
            if (display.textContent === '0' && buttonValue !== '.') {
                display.textContent = '';
            }
            updateDisplay(buttonValue);
        } else if (['+', '-', '*', '/'].includes(buttonValue)) {
            if (operator !== '') {
                operate();
            }
            firstNumber = display.textContent;
            operator = buttonValue;
            shouldResetDisplay = true;
            updateSecondaryDisplay(`${firstNumber} ${operator}`);
        } else if (buttonValue === '=') {
            if (firstNumber !== '' && operator !== '') {
                secondNumber = display.textContent;
                operate();
                updateSecondaryDisplay(`= ${firstNumber} ${operator} ${secondNumber}`);
            }
        } else if (buttonValue === 'C') {
            resetCalculator();
        } else if(button.classList.contains('backspace')){
            backspace();
        } else if(button.classList.contains('inversion')){
            invertSign();
        } else if(button.classList.contains('percent')){
            calculatePercentage();
        }
    });
});

resetCalculator();