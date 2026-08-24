const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");

const totalSpentElement = document.getElementById("totalSpent");
const remainingElement = document.getElementById("remaining");

const monthFilter = document.getElementById("monthFilter");

// Set current month automatically
const today = new Date();

const currentMonth =
  today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0");

monthFilter.value = currentMonth;
function getCurrentMonthBudget() {
  const selectedMonth = monthFilter.value;

  if (monthlyBudgets[selectedMonth] !== undefined) {
    return monthlyBudgets[selectedMonth];
  }

  return 30000;
}
let monthlyBudgets =
  JSON.parse(localStorage.getItem("monthlyBudgets")) || {};

const budgetInput = document.getElementById("budget");
const setBudgetButton = document.getElementById("setBudget");

setBudgetButton.addEventListener("click", function () {
  const newBudget = Number(budgetInput.value);

  if (newBudget <= 0) {
    alert("Please enter a valid budget");
    return;
  }

  const selectedMonth = monthFilter.value;

  monthlyBudgets[selectedMonth] = newBudget;

  localStorage.setItem(
    "monthlyBudgets",
    JSON.stringify(monthlyBudgets)
  );

  budgetInput.value = "";

  displayExpenses();
});

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function displayExpenses() {
  expenseList.innerHTML = "";

  expenses.forEach(function (expense) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.date}</td>
      <td>${expense.name}</td>
      <td>${expense.category}</td>
      <td>${expense.type}</td>
      <td>₹${expense.amount}</td>
      <td>
        <button class="delete-btn" data-id="${expense.id}">
          Delete
        </button>
      </td>
    `;

    expenseList.appendChild(row);
  });

  const currentBudget = getCurrentMonthBudget();

  document.getElementById("monthlyBudget").textContent = `₹${currentBudget}`;

  // Apply selected month
  filterExpensesByMonth();

  // Calculate selected month's total
  updateMonthlyTotal();
}
/*-- MonthFilter--*/
function filterExpensesByMonth() {
  const selectedMonth = monthFilter.value;

  const rows = expenseList.querySelectorAll("tr");

  rows.forEach(function (row) {
    const date = row.cells[0].textContent;

    if (date.startsWith(selectedMonth)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
function updateMonthlyTotal() {
  const selectedMonth = monthFilter.value;

  let monthlyTotal = 0;

  expenses.forEach(function (expense) {
    if (expense.date.startsWith(selectedMonth)) {
      monthlyTotal += expense.amount;
    }
  });

  const currentBudget = getCurrentMonthBudget();

  totalSpentElement.textContent = `₹${monthlyTotal}`;

  const remaining = currentBudget - monthlyTotal;

  remainingElement.textContent = `₹${remaining}`;
}
monthFilter.addEventListener("change", function () {
  filterExpensesByMonth();
  updateMonthlyTotal();
});

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const expenseName = document.getElementById("expenseName").value;
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const expenseType = document.getElementById("expenseType").value;
  const date = document.getElementById("date").value;

  const expense = {
    id: Date.now(),
    name: expenseName,
    amount: amount,
    category: category,
    type: expenseType,
    date: date,
  };

  expenses.push(expense);

  localStorage.setItem("expenses", JSON.stringify(expenses));

  displayExpenses();

  expenseForm.reset();
});

expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const id = Number(event.target.dataset.id);

    expenses = expenses.filter(function (expense) {
      return expense.id !== id;
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
  }
});

displayExpenses();
