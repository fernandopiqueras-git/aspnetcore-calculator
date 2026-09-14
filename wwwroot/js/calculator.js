const display = document.querySelector("#display");
const expression = document.querySelector("#expression");
const error = document.querySelector("#error");

let currentValue = "0";
let storedValue = null;
let pendingOperation = null;
let replaceDisplay = false;

const operationSymbols = {
    add: "+",
    subtract: "−",
    multiply: "×",
    divide: "÷",
    power: "xʸ"
};

function render() {
    display.textContent = currentValue.replace(".", ",");
}

function clearError() {
    error.textContent = "";
}

function inputDigit(digit) {
    clearError();

    if (replaceDisplay || currentValue === "0") {
        currentValue = digit;
        replaceDisplay = false;
    } else {
        currentValue += digit;
    }

    render();
}

function inputDecimal() {
    clearError();

    if (replaceDisplay) {
        currentValue = "0.";
        replaceDisplay = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    render();
}

function clearCalculator() {
    currentValue = "0";
    storedValue = null;
    pendingOperation = null;
    replaceDisplay = false;
    expression.textContent = "";
    clearError();
    render();
}

function backspace() {
    if (replaceDisplay)
        return;

    currentValue = currentValue.length > 1
        ? currentValue.slice(0, -1)
        : "0";

    render();
}

function toggleSign() {
    if (currentValue !== "0")
        currentValue = currentValue.startsWith("-")
            ? currentValue.slice(1)
            : `-${currentValue}`;

    render();
}

function selectBinaryOperation(operation) {
    clearError();
    storedValue = Number(currentValue);
    pendingOperation = operation;
    expression.textContent = `${currentValue.replace(".", ",")} ${operationSymbols[operation]}`;
    replaceDisplay = true;
}

async function calculate(operation, firstNumber, secondNumber = null) {
    const response = await fetch("/Calculator/Calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstNumber,
            secondNumber,
            operation
        })
    });

    const data = await response.json();

    if (!response.ok)
        throw new Error(data.error ?? "Unable to complete the calculation.");

    return data.result;
}

async function applyBinaryOperation() {
    if (pendingOperation === null || storedValue === null)
        return;

    const secondValue = Number(currentValue);
    const symbol = operationSymbols[pendingOperation];

    try {
        const result = await calculate(pendingOperation, storedValue, secondValue);
        expression.textContent = `${storedValue} ${symbol} ${secondValue} =`;
        currentValue = String(result);
        storedValue = null;
        pendingOperation = null;
        replaceDisplay = true;
        render();
    } catch (exception) {
        error.textContent = exception.message;
    }
}

async function applyUnaryOperation(operation, label) {
    clearError();
    const value = Number(currentValue);

    try {
        const result = await calculate(operation, value);
        expression.textContent = `${label}(${currentValue.replace(".", ",")}) =`;
        currentValue = String(result);
        replaceDisplay = true;
        render();
    } catch (exception) {
        error.textContent = exception.message;
    }
}

document.querySelector(".keypad").addEventListener("click", async event => {
    const button = event.target.closest("button");

    if (!button)
        return;

    if (button.dataset.digit !== undefined) {
        inputDigit(button.dataset.digit);
        return;
    }

    switch (button.dataset.action) {
        case "decimal":
            inputDecimal();
            break;
        case "clear":
            clearCalculator();
            break;
        case "backspace":
            backspace();
            break;
        case "sign":
            toggleSign();
            break;
        case "equals":
            await applyBinaryOperation();
            break;
        case "pi":
            currentValue = String(Math.PI);
            replaceDisplay = true;
            render();
            break;
    }

    if (button.dataset.binary)
        selectBinaryOperation(button.dataset.binary);

    if (button.dataset.unary)
        await applyUnaryOperation(button.dataset.unary, button.textContent.trim());
});

render();
