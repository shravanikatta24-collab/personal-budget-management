// ==========================================
// PERSONAL BUDGET MANAGEMENT SYSTEM
// ==========================================


// ==========================================
// LOAD SAVED TRANSACTIONS
// ==========================================

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


let editingId = null;


const form =
    document.getElementById("budget-form");


const submitButton =
    form.querySelector("button");


// ==========================================
// SAVE DATA
// ==========================================

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// ==========================================
// ADD / UPDATE TRANSACTION
// ==========================================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const type =
            document.getElementById("type").value;


        const amount =
            Number(
                document.getElementById("amount").value
            );


        const category =
            document.getElementById("category").value;


        const description =
            document.getElementById("description").value;


        const date =
            document.getElementById("date").value;


        // ==============================
        // EDIT
        // ==============================

        if (editingId !== null) {

            const transaction =
                transactions.find(
                    function(transaction) {

                        return transaction.id === editingId;

                    }
                );


            if (transaction) {

                transaction.type = type;

                transaction.amount = amount;

                transaction.category = category;

                transaction.description = description;

                transaction.date = date;

            }


            editingId = null;


            submitButton.textContent =
                "Add Transaction";

        }


        // ==============================
        // ADD
        // ==============================

        else {

            const transaction = {

                id: Date.now(),

                type: type,

                amount: amount,

                category: category,

                description: description,

                date: date

            };


            transactions.push(transaction);

        }


        // Save
        saveTransactions();


        // Update application
        updateApplication();


        // Clear form
        form.reset();

    }
);


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions() {

    const transactionList =
        document.getElementById(
            "transaction-list"
        );


    transactionList.innerHTML = "";


    if (transactions.length === 0) {

        transactionList.innerHTML =
            "<p>No transactions yet.</p>";

        return;

    }


    transactions.forEach(
        function(transaction) {

            const transactionItem =
                document.createElement("div");


            transactionItem.classList.add(
                "transaction-item"
            );


            transactionItem.innerHTML = `

                <div class="transaction-info">

                    <h4>
                        ${transaction.description}
                    </h4>

                    <p>
                        ${transaction.category}
                        •
                        ${transaction.date}
                    </p>

                </div>


                <div>

                    <strong
                        class="${transaction.type}"
                    >

                        ${
                            transaction.type === "income"
                            ? "+"
                            : "-"
                        }

                        ₹${transaction.amount}

                    </strong>


                    <button
                        class="edit-btn"
                        onclick="editTransaction(${transaction.id})"
                    >
                        Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        Delete
                    </button>

                </div>

            `;


            transactionList.appendChild(
                transactionItem
            );

        }
    );

}


// ==========================================
// EDIT TRANSACTION
// ==========================================

function editTransaction(id) {

    const transaction =
        transactions.find(
            function(transaction) {

                return transaction.id === id;

            }
        );


    if (!transaction) {

        return;

    }


    editingId = id;


    document.getElementById("type").value =
        transaction.type;


    document.getElementById("amount").value =
        transaction.amount;


    document.getElementById("category").value =
        transaction.category;


    document.getElementById("description").value =
        transaction.description;


    document.getElementById("date").value =
        transaction.date;


    submitButton.textContent =
        "Update Transaction";


    form.scrollIntoView({
        behavior: "smooth"
    });

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            function(transaction) {

                return transaction.id !== id;

            }
        );


    saveTransactions();


    updateApplication();

}


// ==========================================
// CALCULATE TOTALS
// ==========================================

function calculateTotals(list) {

    let income = 0;

    let expenses = 0;


    list.forEach(
        function(transaction) {

            if (
                transaction.type === "income"
            ) {

                income += transaction.amount;

            }

            else {

                expenses += transaction.amount;

            }

        }
    );


    return {

        income: income,

        expenses: expenses,

        savings: income - expenses

    };

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const totals =
        calculateTotals(transactions);


    document.getElementById(
        "total-income"
    ).textContent =
        "₹" + totals.income;


    document.getElementById(
        "total-expenses"
    ).textContent =
        "₹" + totals.expenses;


    document.getElementById(
        "total-savings"
    ).textContent =
        "₹" + totals.savings;


    document.getElementById(
        "balance"
    ).textContent =
        "₹" + totals.savings;

}


// ==========================================
// SMART BUDGET INSIGHTS
// ==========================================

function updateInsights() {

    const totals =
        calculateTotals(transactions);


    const totalIncome =
        totals.income;


    const totalExpenses =
        totals.expenses;


    // No income
    if (totalIncome === 0) {

        document.getElementById(
            "health-score"
        ).textContent =
            "100 / 100";


        document.getElementById(
            "health-message"
        ).textContent =
            "Add an income to analyse your budget.";


        document.getElementById(
            "biggest-category"
        ).textContent =
            "Biggest expense: —";


        document.getElementById(
            "spending-percentage"
        ).textContent =
            "Spending: 0%";


        document.getElementById(
            "saving-suggestion"
        ).textContent =
            "Suggestion: Add your income and expenses first.";

        return;

    }


    const spendingPercentage =
        (totalExpenses / totalIncome) * 100;


    // ==============================
    // HEALTH SCORE
    // ==============================

    let healthScore;


    if (spendingPercentage <= 50) {

        healthScore = 100;

    }

    else if (spendingPercentage <= 70) {

        healthScore = 85;

    }

    else if (spendingPercentage <= 90) {

        healthScore = 70;

    }

    else if (spendingPercentage <= 100) {

        healthScore = 50;

    }

    else {

        healthScore = 30;

    }


    // ==============================
    // HEALTH MESSAGE
    // ==============================

    let healthMessage;


    if (healthScore >= 85) {

        healthMessage =
            "Great! Your spending is under control.";

    }

    else if (healthScore >= 70) {

        healthMessage =
            "You're doing okay, but watch your expenses.";

    }

    else if (healthScore >= 50) {

        healthMessage =
            "Your expenses are getting high.";

    }

    else {

        healthMessage =
            "You're spending more than your income.";

    }


    document.getElementById(
        "health-score"
    ).textContent =
        healthScore + " / 100";


    document.getElementById(
        "health-message"
    ).textContent =
        healthMessage;


    // ==============================
    // BIGGEST EXPENSE
    // ==============================

    const categoryTotals = {};


    transactions.forEach(
        function(transaction) {

            if (
                transaction.type === "expense"
            ) {

                if (
                    !categoryTotals[
                        transaction.category
                    ]
                ) {

                    categoryTotals[
                        transaction.category
                    ] = 0;

                }


                categoryTotals[
                    transaction.category
                ] += transaction.amount;

            }

        }
    );


    let biggestCategory = "—";

    let biggestAmount = 0;


    for (
        let category in categoryTotals
    ) {

        if (
            categoryTotals[category]
            >
            biggestAmount
        ) {

            biggestAmount =
                categoryTotals[category];


            biggestCategory =
                category;

        }

    }


    document.getElementById(
        "biggest-category"
    ).textContent =
        "Biggest expense: " +
        biggestCategory +
        " (₹" +
        biggestAmount +
        ")";


    // ==============================
    // SPENDING %
    // ==============================

    document.getElementById(
        "spending-percentage"
    ).textContent =
        "Spending: " +
        spendingPercentage.toFixed(1) +
        "% of income";


    // ==============================
    // SUGGESTION
    // ==============================

    let suggestion;


    if (spendingPercentage <= 50) {

        suggestion =
            "Excellent! Try to maintain your current spending.";

    }

    else if (spendingPercentage <= 70) {

        suggestion =
            "Try reducing your largest expense category.";

    }

    else if (spendingPercentage <= 100) {

        suggestion =
            "Consider cutting unnecessary expenses to increase savings.";

    }

    else {

        suggestion =
            "Your expenses exceed your income. Reduce spending urgently.";

    }


    document.getElementById(
        "saving-suggestion"
    ).textContent =
        "Suggestion: " + suggestion;

}


// ==========================================
// GET START OF CURRENT WEEK
// ==========================================

function getStartOfWeek() {

    const today = new Date();

    const day = today.getDay();

    const difference =
        day === 0 ? -6 : 1 - day;


    const start =
        new Date(today);


    start.setDate(
        today.getDate() + difference
    );


    start.setHours(0, 0, 0, 0);


    return start;

}


// ==========================================
// WEEKLY REPORT
// ==========================================

function updateWeeklyReport() {

    const startOfWeek =
        getStartOfWeek();


    const weeklyTransactions =
        transactions.filter(
            function(transaction) {

                const transactionDate =
                    new Date(transaction.date);


                return (
                    transactionDate >= startOfWeek
                );

            }
        );


    const totals =
        calculateTotals(
            weeklyTransactions
        );


    document.getElementById(
        "weekly-income"
    ).textContent =
        "₹" + totals.income;


    document.getElementById(
        "weekly-expenses"
    ).textContent =
        "₹" + totals.expenses;


    document.getElementById(
        "weekly-savings"
    ).textContent =
        "₹" + totals.savings;

}


// ==========================================
// MONTHLY REPORT
// ==========================================

function updateMonthlyReport() {

    const today =
        new Date();


    const currentMonth =
        today.getMonth();


    const currentYear =
        today.getFullYear();


    const monthlyTransactions =
        transactions.filter(
            function(transaction) {

                const transactionDate =
                    new Date(transaction.date);


                return (
                    transactionDate.getMonth()
                    ===
                    currentMonth
                    &&
                    transactionDate.getFullYear()
                    ===
                    currentYear
                );

            }
        );


    const totals =
        calculateTotals(
            monthlyTransactions
        );


    document.getElementById(
        "monthly-income"
    ).textContent =
        "₹" + totals.income;


    document.getElementById(
        "monthly-expenses"
    ).textContent =
        "₹" + totals.expenses;


    document.getElementById(
        "monthly-savings"
    ).textContent =
        "₹" + totals.savings;


}


// ==========================================
// GRAPH
// ==========================================

// ==========================================
// FINANCIAL GRAPH
// ==========================================

let selectedPeriod = "weekly";

let selectedMetric = "income";


// Get transactions for selected period
function getReportTransactions() {

    const today = new Date();

    let filteredTransactions = [];


    if (selectedPeriod === "weekly") {

        const startOfWeek = getStartOfWeek();

        filteredTransactions =
            transactions.filter(function(transaction) {

                const date =
                    new Date(transaction.date);

                return date >= startOfWeek;

            });

    }

    else {

        const currentMonth =
            today.getMonth();

        const currentYear =
            today.getFullYear();


        filteredTransactions =
            transactions.filter(function(transaction) {

                const date =
                    new Date(transaction.date);

                return (
                    date.getMonth() === currentMonth &&
                    date.getFullYear() === currentYear
                );

            });

    }


    return filteredTransactions;

}


// Create graph data
function createGraphData() {

    const data = [];

    const today = new Date();


    if (selectedPeriod === "weekly") {

        const start =
            getStartOfWeek();


        for (let i = 0; i < 7; i++) {

            const date =
                new Date(start);

            date.setDate(
                start.getDate() + i
            );


            const dateString =
                date.toISOString().split("T")[0];


            let value = 0;


            transactions.forEach(
                function(transaction) {

                    if (
                        transaction.date ===
                        dateString
                    ) {

                        if (
                            selectedMetric ===
                            "income"
                        ) {

                            if (
                                transaction.type ===
                                "income"
                            ) {

                                value +=
                                    transaction.amount;

                            }

                        }

                        else if (
                            selectedMetric ===
                            "expense"
                        ) {

                            if (
                                transaction.type ===
                                "expense"
                            ) {

                                value +=
                                    transaction.amount;

                            }

                        }

                        else {

                            if (
                                transaction.type ===
                                "income"
                            ) {

                                value +=
                                    transaction.amount;

                            }

                            else {

                                value -=
                                    transaction.amount;

                            }

                        }

                    }

                }
            );


            data.push({

                label:
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            weekday: "short"
                        }
                    ),

                value: value

            });

        }

    }


    else {

        const year =
            today.getFullYear();

        const month =
            today.getMonth();

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            let value = 0;


            transactions.forEach(
                function(transaction) {

                    const date =
                        new Date(transaction.date);


                    if (
                        date.getFullYear() === year &&
                        date.getMonth() === month &&
                        date.getDate() === day
                    ) {

                        if (
                            selectedMetric ===
                            "income"
                        ) {

                            if (
                                transaction.type ===
                                "income"
                            ) {

                                value +=
                                    transaction.amount;

                            }

                        }

                        else if (
                            selectedMetric ===
                            "expense"
                        ) {

                            if (
                                transaction.type ===
                                "expense"
                            ) {

                                value +=
                                    transaction.amount;

                            }

                        }

                        else {

                            if (
                                transaction.type ===
                                "income"
                            ) {

                                value +=
                                    transaction.amount;

                            }

                            else {

                                value -=
                                    transaction.amount;

                            }

                        }

                    }

                }
            );


            data.push({

                label: day,

                value: value

            });

        }

    }


    return data;

}


// Draw graph
function updateChart() {

    const graphArea =
        document.getElementById(
            "graph-area"
        );


    const graphTitle =
        document.getElementById(
            "graph-title"
        );


    const graphTotal =
        document.getElementById(
            "graph-total"
        );


    const data =
        createGraphData();


    graphArea.innerHTML = "";


    let total = 0;

    let maximum = 0;


    data.forEach(function(item) {

        total += item.value;

        maximum =
            Math.max(
                maximum,
                Math.abs(item.value)
            );

    });


    // Avoid division by zero
    if (maximum === 0) {

        maximum = 1;

    }


    let metricName;


    if (selectedMetric === "income") {

        metricName = "Income";

    }

    else if (selectedMetric === "expense") {

        metricName = "Expenses";

    }

    else {

        metricName = "Savings";

    }


    const periodName =
        selectedPeriod === "weekly"
        ? "Weekly"
        : "Monthly";


    graphTitle.textContent =
        periodName +
        " " +
        metricName;


    graphTotal.textContent =
        "Total: ₹" +
        total;


    data.forEach(function(item) {

        const group =
            document.createElement("div");


        group.className =
            "graph-bar-group";


        const bar =
            document.createElement("div");


        bar.className =
            "graph-bar";


        if (
            selectedMetric ===
            "income"
        ) {

            bar.classList.add(
                "graph-income"
            );

        }

        else if (
            selectedMetric ===
            "expense"
        ) {

            bar.classList.add(
                "graph-expense"
            );

        }

        else {

            bar.classList.add(
                "graph-savings"
            );

        }


        const height =
            Math.abs(item.value)
            /
            maximum
            *
            220;


        bar.style.height =
            Math.max(
                height,
                item.value === 0
                ? 2
                : 5
            ) + "px";


        const value =
            document.createElement("span");


        value.className =
            "graph-bar-value";


        value.textContent =
            "₹" +
            item.value;


        bar.appendChild(value);


        const label =
            document.createElement("div");


        label.className =
            "graph-label";


        label.textContent =
            item.label;


        group.appendChild(bar);

        group.appendChild(label);


        graphArea.appendChild(group);

    });

}


// ==========================================
// GRAPH BUTTONS
// ==========================================

document.getElementById(
    "weekly-btn"
).addEventListener(
    "click",
    function() {

        selectedPeriod = "weekly";

        setActiveButton(
            "weekly-btn",
            "monthly-btn"
        );

        updateChart();

    }
);


document.getElementById(
    "monthly-btn"
).addEventListener(
    "click",
    function() {

        selectedPeriod = "monthly";

        setActiveButton(
            "monthly-btn",
            "weekly-btn"
        );

        updateChart();

    }
);


document.getElementById(
    "income-btn"
).addEventListener(
    "click",
    function() {

        selectedMetric = "income";

        setActiveMetric(
            "income-btn"
        );

        updateChart();

    }
);


document.getElementById(
    "expense-btn"
).addEventListener(
    "click",
    function() {

        selectedMetric = "expense";

        setActiveMetric(
            "expense-btn"
        );

        updateChart();

    }
);


document.getElementById(
    "savings-btn"
).addEventListener(
    "click",
    function() {

        selectedMetric = "savings";

        setActiveMetric(
            "savings-btn"
        );

        updateChart();

    }
);


// ==========================================
// BUTTON STYLING
// ==========================================

function setActiveButton(
    activeId,
    inactiveId
) {

    document.getElementById(
        activeId
    ).classList.add("active");


    document.getElementById(
        inactiveId
    ).classList.remove("active");

}


function setActiveMetric(
    activeId
) {

    const buttons = [

        "income-btn",

        "expense-btn",

        "savings-btn"

    ];


    buttons.forEach(function(id) {

        document.getElementById(
            id
        ).classList.remove("active");

    });


    document.getElementById(
        activeId
    ).classList.add("active");

}


// ==========================================
// UPDATE EVERYTHING
// ==========================================

function updateApplication() {

    displayTransactions();

    updateDashboard();

    updateInsights();

    updateWeeklyReport();

    updateMonthlyReport();
    updateChart();

}


// ==========================================
// INITIAL LOAD
// ==========================================

updateApplication();