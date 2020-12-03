class Transaction {
  constructor(amount, description, id) {
    this.amount = amount;
    this.description = description;
    this.id = id;
  }
  get date() {
    let today = new Date();
    const months = [
      "Jan.",
      "Feb.",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug.",
      "Sept.",
      "Oct.",
      "Nov.",
      "Dec.",
    ];
    const dd = today.getDate();
    const mm = months[today.getMonth()];
    const yyyy = today.getFullYear();
    return `${mm} ${dd}, ${yyyy}`;
  }
}

class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.id = 0;
  }

  totalIncome() {
    let income = 0;
    this.incomeList.forEach((transaction) => {
      income += parseInt(transaction.amount);
    });
    return income;
  }

  totalExpense() {
    let expense = 0;
    this.expenseList.forEach((transaction) => {
      expense += parseInt(transaction.amount);
    });
    return Math.abs(expense);
  }

  addNewTransaction(amount, description) {
    let newTransaction = new Transaction(amount, description, this.id++);
    if (amount > 0) {
      this.incomeList.push(newTransaction);
    } else if (amount < 0) {
      this.expenseList.push(newTransaction);
    }
  }

  removeTransaction(id) {
    id = parseInt(id);
    this.incomeList = this.incomeList.filter((transaction) => {
      return transaction.id !== id;
    });
    this.expenseList = this.expenseList.filter((transaction) => {
      return transaction.id !== id;
    });
  }

  redrawTransaction(listName, list) {
    listName.innerHTML = "";

    list.forEach((transaction) => {
      listName.insertAdjacentHTML(
        "beforeend",
        ` <div class="item" data-transaction-id="${transaction.id}">
        <div class="item__description">${transaction.description}</div>
        <div class="right">
          <div class="item__value">${
            listName.className === "income__list" ? "+" : "-"
          } $${Math.abs(transaction.amount).toFixed(2)}</div>
          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
        <div class="item__date">${transaction.date}</div>
      </div>`
      );

      if (listName.className == "expenses__list") {
        let txnValuesList = document.querySelectorAll(
          ".container .expenses__list .item__value"
        );
        const currTxn = txnValuesList[txnValuesList.length - 1];
        let expensePercentage = this.getIndividualExpensePercentage(
          transaction
        );

        currTxn.insertAdjacentHTML(
          `afterend`,
          `<div class="item__percentage">
          ${this.totalIncome() === 0 ? "" : expensePercentage}
        </div>`
        );
      }
    });
  }

  updateInterface() {
    const income = document.querySelector(".container .income__list");
    const expense = document.querySelector(".container .expenses__list");
    this.redrawTransaction(income, this.incomeList);
    this.redrawTransaction(expense, this.expenseList);

    const incomeValue = document.querySelector(".budget__income--value");
    const expenseValue = document.querySelector(".budget__expenses--value");
    incomeValue.textContent = `+ $${this.totalIncome().toFixed(2)}`;
    expenseValue.textContent = `- $${this.totalExpense().toFixed(2)}`;

    const budgetValue = document.querySelector(".budget__value");
    budgetValue.textContent = this.getTotalExpensePercentage();

    const totalExpensePercentage = document.querySelector(
      ".budget__expenses--percentage"
    );
    if (this.totalExpense() === 0) {
      totalExpensePercentage.textContent = `0%`;
    }
    if (this.totalIncome() === 0) {
      totalExpensePercentage.textContent = "";
    } else {
      totalExpensePercentage.textContent = `${(
        (this.totalExpense() / this.totalIncome()) *
        100
      ).toFixed(2)}%`;
    }
  }

  getTotalExpensePercentage() {
    return `${
      this.totalIncome() - this.totalExpense() >= 0 ? `+` : `-`
    } $${Math.abs(this.totalIncome() - this.totalExpense()).toFixed(2)}`;
  }

  getIndividualExpensePercentage(transaction) {
    return (
      ((Math.abs(transaction.amount) / this.totalIncome()) * 100).toFixed(2) +
      "%"
    );
  }
}

const newTransactionList = new TransactionList();

const addBtn = document.querySelector(".add__btn");
const description = document.querySelector(".add__description");
const amount = document.querySelector(".add__value");
const container = document.querySelector(".container");

addBtn.addEventListener("click", (event) => {
  if (amount.value !== "" && description.value !== "") {
    newTransactionList.addNewTransaction(amount.value, description.value);
    newTransactionList.updateInterface();
    description.value = "";
    amount.value = "";
  }
});

container.addEventListener("click", (event) => {
  if (event.target.nodeName === "BUTTON" || event.target.nodeName === "I") {
    const id =
      event.target.parentNode.parentNode.parentNode.parentElement.dataset
        .transactionId;
    newTransactionList.removeTransaction(id);
    newTransactionList.updateInterface();
  }
});
