const display = document.querySelector("#display");
const expression = document.querySelector("#expression");
const error = document.querySelector("#error");
const historyPanel = document.querySelector("#history-panel");
const historyList = document.querySelector("#history-list");
const emptyHistory = document.querySelector("#empty-history");
const memoryStatus = document.querySelector("#memory-status");

let currentValue = "0";
let storedValue = null;
let pendingOperation = null;
let replaceDisplay = false;
let memoryValue = 0;
let history = [];

const operationSymbols = {
    add: "+",
    subtract: "−",
    multiply: "×",
    divide: "÷",
    power: "xʸ"
};

function formatNumber(value) {
    return String(value).replace(".", ",");
}

function render() {
    display.textContent = formatNumber(currentValue);
    memoryStatus.textContent = memoryValue === 0 ? "" : "M";
}

function clearError() {
    error.textContent = "";
}

function showError(message) {
    error.textContent = message;
}

function inputDigit(digit) {
    clearError();

    if (replaceDisplay || currentValue === "0") {
        currentValue = digit;
        replaceDisplay = false;
    } else if (currentValue.replace("-", "").replace(".", "").length < 15) {
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

    if (currentValue === "-")
        currentValue = "0";

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
    expression.textContent = `${formatNumber(currentValue)} ${operationSymbols[operation]}`;
    replaceDisplay = true;
}

async function calculate(operation, firstNumber, secondNumber = null) {
    let response;

    try {
        response = await fetch("/Calculator/Calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstNumber, secondNumber, operation })
        });
    } catch {
        throw new Error("No se ha podido conectar con el servidor.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok)
        throw new Error(data.error ?? "No se ha podido completar la operación.");

    return data.result;
}

function addHistory(calculation, result) {
    history.unshift({ calculation, result: formatNumber(result) });
    history = history.slice(0, 20);
    renderHistory();
}

function renderHistory() {
    historyList.replaceChildren();
    emptyHistory.hidden = history.length > 0;

    history.forEach(item => {
        const entry = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.historyValue = String(item.result).replace(",", ".");
        button.innerHTML = `<span>${item.calculation}</span><strong>${item.result}</strong>`;
        entry.append(button);
        historyList.append(entry);
    });
}

async function applyBinaryOperation() {
    if (pendingOperation === null || storedValue === null)
        return;

    const secondValue = Number(currentValue);
    const symbol = operationSymbols[pendingOperation];
    const calculation = `${formatNumber(storedValue)} ${symbol} ${formatNumber(secondValue)}`;

    try {
        const result = await calculate(pendingOperation, storedValue, secondValue);
        expression.textContent = `${calculation} =`;
        currentValue = String(result);
        storedValue = null;
        pendingOperation = null;
        replaceDisplay = true;
        addHistory(calculation, result);
        render();
    } catch (exception) {
        showError(exception.message);
    }
}

async function applyUnaryOperation(operation, label) {
    clearError();
    const value = Number(currentValue);
    const calculation = `${label}(${formatNumber(currentValue)})`;

    try {
        const result = await calculate(operation, value);
        expression.textContent = `${calculation} =`;
        currentValue = String(result);
        replaceDisplay = true;
        addHistory(calculation, result);
        render();
    } catch (exception) {
        showError(exception.message);
    }
}

function useMemory(action) {
    clearError();

    switch (action) {
        case "clear":
            memoryValue = 0;
            break;
        case "recall":
            currentValue = String(memoryValue);
            replaceDisplay = true;
            break;
        case "add":
            memoryValue += Number(currentValue);
            break;
        case "subtract":
            memoryValue -= Number(currentValue);
            break;
    }

    render();
}

async function handleButton(button) {
    if (button.dataset.digit !== undefined) {
        inputDigit(button.dataset.digit);
        return;
    }

    if (button.dataset.memory) {
        useMemory(button.dataset.memory);
        return;
    }

    switch (button.dataset.action) {
        case "decimal": inputDecimal(); break;
        case "clear": clearCalculator(); break;
        case "backspace": backspace(); break;
        case "sign": toggleSign(); break;
        case "equals": await applyBinaryOperation(); break;
        case "toggle-history": historyPanel.classList.toggle("visible"); break;
        case "clear-history": history = []; renderHistory(); break;
    }

    if (button.dataset.binary)
        selectBinaryOperation(button.dataset.binary);

    if (button.dataset.unary)
        await applyUnaryOperation(button.dataset.unary, button.textContent.trim());
}

document.body.addEventListener("click", async event => {
    const button = event.target.closest("button");

    if (button)
        await handleButton(button);

    const historyButton = event.target.closest("[data-history-value]");

    if (historyButton) {
        currentValue = historyButton.dataset.historyValue;
        replaceDisplay = true;
        render();
    }
});

document.addEventListener("keydown", async event => {
    if (/^[0-9]$/.test(event.key))
        inputDigit(event.key);
    else if (event.key === "." || event.key === ",")
        inputDecimal();
    else if (event.key === "Enter" || event.key === "=")
        await applyBinaryOperation();
    else if (event.key === "Escape")
        clearCalculator();
    else if (event.key === "Backspace")
        backspace();
    else if ({ "+": "add", "-": "subtract", "*": "multiply", "/": "divide", "^": "power" }[event.key])
        selectBinaryOperation({ "+": "add", "-": "subtract", "*": "multiply", "/": "divide", "^": "power" }[event.key]);
    else
        return;

    event.preventDefault();
});

render();
renderHistory();
