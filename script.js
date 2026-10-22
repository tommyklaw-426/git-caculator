// Advanced Scientific Calculator Logic

// State Management
let currentInput = "0";
let previousInput = null;
let currentOperator = null;
let memoryValue = 0;
let hasError = false;
let isNewInput = false;

// DOM Elements
const display = document.getElementById("display");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const themeToggleBtn = document.getElementById("theme-toggle");

// Update Display Helper
function updateDisplay(val) {
    display.textContent = val;
}

// Clear Error State on Keypress
function checkAndClearError() {
    if (hasError) {
        currentInput = "0";
        hasError = false;
        updateDisplay(currentInput);
    }
}

// Scientific & Basic Logic
function handleInput(val) {
    checkAndClearError();
    if (currentInput === "0" || isNewInput) {
        currentInput = val === "." ? "0." : val;
        isNewInput = false;
    } else {
        if (val === "." && currentInput.includes(".")) return;
        currentInput += val;
    }
    updateDisplay(currentInput);
}

function handleOperator(op) {
    checkAndClearError();
    if (currentOperator && !isNewInput) {
        calculateResult();
    }
    previousInput = currentInput;
    currentOperator = op;
    isNewInput = true;
}

function calculateResult() {
    if (!currentOperator || previousInput === null || hasError) return;

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result = 0;
    let expression = `${prev} ${getOpSymbol(currentOperator)} ${current}`;

    // Error Handling: Division by Zero
    if (currentOperator === "/" && current === 0) {
        triggerError("Cannot divide by 0");
        return;
    }

    switch (currentOperator) {
        case "+": result = prev + current; break;
        case "-": result = prev - current; break;
        case "*": result = prev * current; break;
        case "/": result = prev / current; break;
        case "^": result = Math.pow(prev, current); break;
    }

    // Handle Overflow or Math Errors
    if (!isFinite(result) || isNaN(result)) {
        triggerError("Invalid Calculation");
        return;
    }

    // Format float precision
    result = Math.round(result * 1e10) / 1e10;

    addHistoryEntry(expression, result);
    currentInput = result.toString();
    currentOperator = null;
    previousInput = null;
    isNewInput = true;
    updateDisplay(currentInput);
}

// Scientific Single-Operand Functions
function handleScientific(action) {
    checkAndClearError();
    let num = parseFloat(currentInput);
    let result = 0;
    let expr = "";

    switch (action) {
        case "percentage":
            result = num / 100;
            expr = `${num}%`;
            break;

        case "toggle-sign":
            result = num * -1;
            currentInput = result.toString();
            updateDisplay(currentInput);
            return;

        case "sqrt":
            if (num < 0) {
                triggerError("Invalid Input");
                return;
            }
            result = Math.sqrt(num);
            expr = `√(${num})`;
            break;

        case "clear":
            currentInput = "0";
            previousInput = null;
            currentOperator = null;
            hasError = false;
            updateDisplay("0");
            return;
    }

    result = Math.round(result * 1e10) / 1e10;
    addHistoryEntry(expr, result);
    currentInput = result.toString();
    isNewInput = true;
    updateDisplay(currentInput);
}

// Memory Functions (Bonus Challenge)
function handleMemory(action) {
    checkAndClearError();
    const currentNum = parseFloat(currentInput) || 0;

    switch (action) {
        case "mc":
            memoryValue = 0;
            break;
        case "mr":
            currentInput = memoryValue.toString();
            isNewInput = true;
            updateDisplay(currentInput);
            break;
        case "m-add":
            memoryValue += currentNum;
            isNewInput = true;
            break;
        case "m-sub":
            memoryValue -= currentNum;
            isNewInput = true;
            break;
    }
}

// Error Handling Function
function triggerError(message) {
    hasError = true;
    currentInput = message;
    updateDisplay(message);
}

// Interactive History Log Panel
function addHistoryEntry(expression, result) {
    const emptyMsg = historyList.querySelector(".empty-msg");
    if (emptyMsg) emptyMsg.remove();

    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `<span>${expression} =</span> <strong>${result}</strong>`;

    // Re-use Previous Results: Click to load back to main display
    li.addEventListener("click", () => {
        checkAndClearError();
        currentInput = result.toString();
        isNewInput = true;
        updateDisplay(currentInput);
    });

    historyList.prepend(li);
}

// Clear History
clearHistoryBtn.addEventListener("click", () => {
    historyList.innerHTML = '<li class="empty-msg">No calculations yet</li>';
});

// Helper Symbol Matcher
function getOpSymbol(op) {
    switch (op) {
        case "*": return "×";
        case "/": return "÷";
        case "^": return "^";
        default: return op;
    }
}

// Event Listeners for Keypad
document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const action = btn.dataset.action;
        const val = btn.dataset.val;

        if (val && !action) handleInput(val);
        else if (action === "operator") handleOperator(val);
        else if (action === "exponent") handleOperator("^");
        else if (action === "calculate") calculateResult();
        else if (btn.classList.contains("memory-btn")) handleMemory(action);
        else if (action) handleScientific(action);
    });
});

// Theme Toggle
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");
});

// Physical Keyboard Support
window.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") handleInput(e.key);
    if (e.key === ".") handleInput(".");
    if (["+", "-", "*", "/"].includes(e.key)) handleOperator(e.key);
    if (e.key === "^") handleOperator("^");
    if (e.key === "Enter" || e.key === "=") { e.preventDefault(); calculateResult(); }
    if (e.key === "Backspace" || e.key === "Escape") handleScientific("clear");
    if (e.key === "%") handleScientific("percentage");
});































































