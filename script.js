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

    if (display.textContent === '0' && value !== '.') {
        display.textContent = '';
    }

    display.textContent += value;
    limitDisplayLength();
    adjustFontSize();
}

function updateSecondaryDisplay(value) {
    secDisplay.textContent = value;
}

function adjustFontSize() {
    const displayWidth = display.clientWidth;
    let fontSize = parseFloat(window.getComputedStyle(display).fontSize);
    
    while (display.scrollWidth > displayWidth && fontSize > 40) {
        fontSize *= 0.9;
        display.style.fontSize = `${fontSize}px`;
    }
}


function limitDisplayLength() {
    if (display.textContent.length > 12) {
        display.textContent = display.textContent.slice(0, 12);
    }
}

function resetCalculator() {
    firstNumber = '';
    secondNumber = '';
    operator = '';
    display.textContent = '0';
    secDisplay.textContent = '0';
    display.style.fontSize = '50px';
}

function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
    if (b === 0) return "Erro: LOL";
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

    if (isNaN(result)) {
        display.textContent = "Erro";
    } else if (result.toString().length > 12) {
        display.textContent = result.toExponential(10);
    } else {
        display.textContent = parseFloat(result.toFixed(8)).toString();
    }
    firstNumber = result.toString();
    secondNumber = '';
    operator = '';
    shouldResetDisplay = true;
    adjustFontSize();
}

function backspace() {
    display.textContent = display.textContent.slice(0, -1);
    if (display.textContent === '') {
        display.textContent = '0';
    }
    adjustFontSize();
}

function invertSign() {
    const currentValue = parseFloat(display.textContent);
    display.textContent = (-currentValue).toString();
    adjustFontSize();
}

function calculatePercentage() {
    let currentValue = parseFloat(display.textContent);
    
    if (operator && firstNumber !== '') {
        currentValue = (parseFloat(firstNumber) * currentValue) / 100;
    } else {
        currentValue /= 100;
    }

    display.textContent = currentValue.toString();
    shouldResetDisplay = true;
    adjustFontSize();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        let buttonValue = button.textContent;

        if (buttonValue.toLowerCase() === 'x') {
            buttonValue = '*';
        }

        if (!isNaN(buttonValue) || buttonValue === '.') {
            updateDisplay(buttonValue);
        } else if (['+', '-', '*', '/'].includes(buttonValue)) {
            if (operator !== '') operate();
            firstNumber = display.textContent;
            operator = buttonValue;
            shouldResetDisplay = true;
            updateSecondaryDisplay(`${firstNumber} ${operator === '*' ? 'x' : operator}`);
        } else if (buttonValue === '=') {
            if (firstNumber !== '' && operator !== '') {
                secondNumber = display.textContent;
                updateSecondaryDisplay(`${firstNumber} ${operator === '*' ? 'x' : operator} ${secondNumber} =`);
                operate();                
            }
        } else if (buttonValue === 'C') {
            resetCalculator();
        } else if (button.classList.contains('backspace')) {
            backspace();
        } else if (button.classList.contains('inversion')) {
            invertSign();
        } else if (button.classList.contains('percent')) {
            calculatePercentage();
        }
    });
});

const keyMap = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '.': '.',
    '+': '+',
    '-': '-',
    '*': '*',
    'x': '*',
    'X': '*',
    '/': '/',
    'Enter': '=',
    '=': '=',
    'Backspace': 'backspace',
    'Escape': 'C',
    '%': '%',
};

function simulateButtonClick(value) {
    const button = Array.from(buttons).find(btn => {
        return btn.textContent === value || btn.dataset.key === value ||
               (value === '*' && (btn.textContent.toLowerCase() === 'x' || btn.dataset.key === 'x'));
    });

    if (button) {
        button.click();
    }
}


document.addEventListener('keydown', (event) => {
    const key = event.key;
    const action = keyMap[key];

    if (action) {
        event.preventDefault();
        simulateButtonClick(action);
    }
});

resetCalculator();