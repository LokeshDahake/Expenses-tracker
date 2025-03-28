// Get elements from the DOM
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expensesList = document.getElementById('expenses-list');
const totalAmount = document.getElementById('total-amount');
const monthlyIncomeInput = document.getElementById('monthly-income');
const spendingLimitInput = document.getElementById('spending-limit');
const warningMessage = document.getElementById("warning-message");


// Load expenses, income, and spending limit from local storage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let income = parseFloat(localStorage.getItem('income')) || 0;
let spendingLimit = parseFloat(localStorage.getItem('spendingLimit')) || 0;

// Set placeholders and values dynamically
function updatePlaceholders() {
    monthlyIncomeInput.placeholder = income ? income.toFixed(2) : "Monthly Income";
    spendingLimitInput.placeholder = spendingLimit ? spendingLimit.toFixed(2) : "Spending Limit";
    monthlyIncomeInput.value = income ? income.toFixed(2) : "";
    spendingLimitInput.value = spendingLimit ? spendingLimit.toFixed(2) : "";
}

// Function to render expenses
function renderExpenses() {
    expensesList.innerHTML = '';
    let totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.name} - $${expense.amount.toFixed(2)}
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        expensesList.appendChild(li);
    });

    totalAmount.textContent = totalExpenses.toFixed(2);
    handleWarnings(totalExpenses);
}

// Function to add a new expense
function addExpense() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid expense name and amount.");
        return;
    }

    let totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0) + amount;

    // Prevent adding expenses beyond total income
    if (totalExpenses > income) {
        handleWarnings(totalExpenses, true);
        return;
    }

    expenses.push({ name, amount });
    localStorage.setItem('expenses', JSON.stringify(expenses));

    renderExpenses();
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
}

// Function to delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}

// Function to handle warnings and alarms
function handleWarnings(totalExpenses, preventAdding = false) {
    if (totalExpenses > income) {
        warningMessage.textContent = "⚠️ Warning: Your expenses exceed your total income!";
        warningMessage.style.color = "red";
        warningMessage.style.display = "block";
        playAlarmSound();
        if (preventAdding) {
            alert("You cannot add more expenses as it exceeds your income.");
        }
    } else if (totalExpenses === income) {
        warningMessage.textContent = "⚠️ Caution: You have reached your total income limit!";
        warningMessage.style.color = "orange";
        warningMessage.style.display = "block";
    } else {
        warningMessage.style.display = "none";
    }
}

// Function to play sound alarm
function playAlarmSound() {
    const audio = new Audio('error.mp3'); // Replace 'error.mp3' with your sound file
    audio.play();
}


// Event listeners
addExpenseBtn.addEventListener('click', addExpense);

expensesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        deleteExpense(index);
    }
});

// Update income and spending limit dynamically
monthlyIncomeInput.addEventListener('change', () => {
    income = parseFloat(monthlyIncomeInput.value.trim()) || 0;
    localStorage.setItem('income', income);
    renderExpenses();
});

spendingLimitInput.addEventListener('change', () => {
    spendingLimit = parseFloat(spendingLimitInput.value.trim()) || 0;
    localStorage.setItem('spendingLimit', spendingLimit);
    renderExpenses();
});

// Add expense on pressing "Enter" key
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addExpense();
    }
});

// Initial setup
updatePlaceholders();
renderExpenses();
