// =========================
// INVESTIFY
// FINANCIAL SYSTEM
// =========================


// =========================
// ELEMENT
// =========================

const investmentModal =
    document.getElementById("investmentModal");

const addInvestmentButton =
    document.querySelector(".add-investment");

const closeModalButton =
    document.getElementById("closeModal");

const investmentForm =
    document.getElementById("investmentForm");

const dateInput =
    document.getElementById("date");

const transactionTypeInput =
    document.getElementById("transactionType");


// =========================
// CONSTANT
// =========================

const WEEKLY_TARGET = 50000;


// =========================
// FORMAT RUPIAH
// =========================

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {

        style: "currency",

        currency: "IDR",

        maximumFractionDigits: 0

    }).format(number);

}


// =========================
// GET TRANSACTIONS
// =========================

function getTransactions() {

    return JSON.parse(
        localStorage.getItem("investifyTransactions")
    ) || [];

}


// =========================
// SAVE TRANSACTIONS
// =========================

function saveTransactions(transactions) {

    localStorage.setItem(

        "investifyTransactions",

        JSON.stringify(transactions)

    );

}


// =========================
// SET DEFAULT DATE
// =========================

function setDefaultDate() {

    if (!dateInput) {
        return;
    }

    const today =
        new Date().toLocaleDateString(
            "en-CA",
            {
                timeZone: "Asia/Jakarta"
            }
        );

    dateInput.value = today;

}


// =========================
// OPEN MODAL
// =========================

if (addInvestmentButton) {

    addInvestmentButton.addEventListener(
        "click",
        function () {

            investmentModal.classList.add("active");

        }
    );

}


// =========================
// CLOSE MODAL
// =========================

if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        function () {

            investmentModal.classList.remove("active");

        }
    );

}


// =========================
// CLOSE MODAL
// CLICK OUTSIDE
// =========================

if (investmentModal) {

    investmentModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === investmentModal
            ) {

                investmentModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// =========================
// DEFAULT DATE
// =========================

setDefaultDate();


// =========================
// SAVE TRANSACTION
// =========================

if (investmentForm) {

    investmentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // =========================
            // GET FORM DATA
            // =========================

            const amount =
                Number(
                    document.getElementById(
                        "amount"
                    ).value
                );


            const transactionType =
                transactionTypeInput
                    ? transactionTypeInput.value
                    : "investment";


            const product =
                document.getElementById(
                    "product"
                ).value;


            const date =
                document.getElementById(
                    "date"
                ).value;


            const note =
                document.getElementById(
                    "note"
                ).value.trim();


            // =========================
            // VALIDATION
            // =========================

            if (
                !amount ||
                amount <= 0 ||
                !date
            ) {

                alert(
                    "Mohon isi nominal dan tanggal."
                );

                return;

            }


            // Produk wajib untuk investasi
            if (
                transactionType === "investment" &&
                !product
            ) {

                alert(
                    "Mohon pilih produk investasi."
                );

                return;

            }


            // =========================
            // CREATE TRANSACTION
            // =========================

            const transaction = {

                id: Date.now(),

                amount: amount,

                type: transactionType,

                product:
                    product || "Pengeluaran",

                date: date,

                note: note,

                createdAt:
                    new Date().toLocaleString(
                        "sv-SE",
                        {
                            timeZone:
                                "Asia/Jakarta"
                        }
                    )

            };


            // =========================
            // GET OLD TRANSACTIONS
            // =========================

            const transactions =
                getTransactions();


            // =========================
            // ADD TRANSACTION
            // =========================

            transactions.push(
                transaction
            );


            // =========================
            // SAVE
            // =========================

            saveTransactions(
                transactions
            );


            // =========================
            // RESET FORM
            // =========================

            investmentForm.reset();

            setDefaultDate();


            // =========================
            // CLOSE MODAL
            // =========================

            investmentModal.classList.remove(
                "active"
            );


            // =========================
            // UPDATE DASHBOARD
            // =========================

            calculateDashboard();


            // =========================
            // NOTIFICATION
            // =========================

            const message =
                transactionType === "expense"
                    ? "Pengeluaran berhasil dicatat!"
                    : "Investasi berhasil dicatat!";


            alert(message);

        }
    );

}


// =========================
// START OF WEEK
// =========================

function getStartOfWeek() {

    const now = new Date();


    const day =
        now.getDay();


    const difference =
        day === 0
            ? 6
            : day - 1;


    const start =
        new Date(now);


    start.setDate(
        now.getDate() -
        difference
    );


    start.setHours(
        0,
        0,
        0,
        0
    );


    return start;

}


// =========================
// CALCULATE STREAK
// =========================

function calculateStreak(
    investmentTransactions
) {

    if (
        investmentTransactions.length === 0
    ) {

        return 0;

    }


    const weeks =
        new Set();


    investmentTransactions.forEach(
        function (transaction) {

            const date =
                new Date(
                    transaction.date
                );


            const day =
                date.getDay();


            const difference =
                day === 0
                    ? 6
                    : day - 1;


            const monday =
                new Date(date);


            monday.setDate(
                date.getDate() -
                difference
            );


            monday.setHours(
                0,
                0,
                0,
                0
            );


            weeks.add(
                monday
                    .toISOString()
                    .split("T")[0]
            );

        }
    );


    const sortedWeeks =
        Array.from(weeks)
            .sort()
            .reverse();


    let streak = 0;


    let currentWeek =
        getStartOfWeek();


    for (
        let i = 0;
        i < sortedWeeks.length;
        i++
    ) {

        const weekDate =
            new Date(
                sortedWeeks[i]
            );


        const difference =
            Math.round(

                (
                    currentWeek -
                    weekDate
                ) /

                (
                    7 *
                    24 *
                    60 *
                    60 *
                    1000
                )

            );


        if (difference === 0) {

            streak++;


            currentWeek =
                new Date(

                    currentWeek.getTime() -
                    (
                        7 *
                        24 *
                        60 *
                        60 *
                        1000
                    )

                );

        } else {

            break;

        }

    }


    return streak;

}


// =========================
// FORMAT TRANSACTION DATE
// =========================

function getTransactionDate(
    transaction
) {

    if (
        transaction.createdAt
    ) {

        return new Date(

            transaction.createdAt
                .replace(" ", "T")

        );

    }


    return new Date(
        transaction.date
    );

}


// =========================
// RENDER RECENT ACTIVITY
// =========================

function renderRecentActivity(
    transactions
) {

    const activityContainer =
        document.querySelector(
            ".recent"
        );


    if (!activityContainer) {

        return;

    }


    // =========================
    // REMOVE OLD ACTIVITIES
    // =========================

    const oldActivities =
        activityContainer.querySelectorAll(
            ".activity"
        );


    oldActivities.forEach(
        function (activity) {

            activity.remove();

        }
    );


    // =========================
    // SORT BY NEWEST
    // =========================

    const recentTransactions =
        [...transactions]

            .sort(
                function (a, b) {

                    const dateA =
                        a.createdAt
                            ? new Date(
                                a.createdAt
                                    .replace(
                                        " ",
                                        "T"
                                    )
                            )
                            : new Date(
                                a.date
                            );


                    const dateB =
                        b.createdAt
                            ? new Date(
                                b.createdAt
                                    .replace(
                                        " ",
                                        "T"
                                    )
                            )
                            : new Date(
                                b.date
                            );


                    return dateB - dateA;

                }
            )

            .slice(
                0,
                5
            );


    // =========================
    // EMPTY STATE
    // =========================

    if (
        recentTransactions.length === 0
    ) {

        const empty =
            document.createElement(
                "p"
            );


        empty.className =
            "progress-text";


        empty.textContent =
            "Belum ada aktivitas.";


        activityContainer.appendChild(
            empty
        );


        return;

    }


    // =========================
    // CREATE ACTIVITIES
    // =========================

    recentTransactions.forEach(
        function (transaction) {

            const activity =
                document.createElement(
                    "div"
                );


            activity.className =
                "activity";


            const isExpense =
                transaction.type ===
                "expense";


            const activityIcon =
                isExpense
                    ? "💸"
                    : "📈";


            const activityTitle =
                isExpense
                    ? "Pengeluaran"
                    : "Investasi";


            const activityAmount =
                isExpense

                    ? "-" +
                        formatRupiah(
                            transaction.amount
                        )

                    : "+" +
                        formatRupiah(
                            transaction.amount
                        );


            const activityDescription =
                isExpense

                    ? (
                        transaction.note ||
                        "Pengeluaran"
                    )

                    : (
                        transaction.product ||
                        "Investasi"
                    );


            // =========================
            // DATE & TIME
            // =========================

            const transactionDate =
                getTransactionDate(
                    transaction
                );


            const formattedDate =
                transactionDate.toLocaleDateString(
                    "id-ID",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            const formattedTime =
                transactionDate.toLocaleTimeString(
                    "id-ID",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            // =========================
            // ACTIVITY HTML
            // =========================

            activity.innerHTML = `

                <div class="activity-icon">
                    ${activityIcon}
                </div>


                <div class="activity-info">

                    <strong>
                        ${activityTitle}
                    </strong>


                    <span>
                        ${activityDescription}
                    </span>


                    ${
                        transaction.note &&
                        !isExpense

                            ? `
                                <small
                                    class="activity-note"
                                >
                                    ${transaction.note}
                                </small>
                              `

                            : ""
                    }


                    <small>
                        ${formattedDate}
                        ·
                        ${formattedTime}
                    </small>

                </div>


                <strong
                    class="activity-amount"
                >
                    ${activityAmount}
                </strong>

            `;


            activityContainer.appendChild(
                activity
            );

        }
    );

}


// =========================
// DASHBOARD CALCULATION
// =========================

function calculateDashboard() {

    const transactions =
        getTransactions();


    // =========================
    // INVESTMENT TRANSACTIONS
    // =========================

    const investmentTransactions =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.type ===
                    "investment"
                )

                ||

                // Transaksi lama
                // dianggap investasi

                !transaction.type;

            }
        );


    // =========================
    // EXPENSE TRANSACTIONS
    // =========================

    const expenseTransactions =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.type ===
                    "expense"
                );

            }
        );


    // =========================
    // TOTAL INVESTMENT
    // =========================

    const totalDeposit =
        investmentTransactions.reduce(

            function (
                total,
                transaction
            ) {

                return total +
                    Number(
                        transaction.amount
                    );

            },

            0

        );


    // =========================
    // TOTAL EXPENSE
    // =========================

    const totalExpense =
        expenseTransactions.reduce(

            function (
                total,
                transaction
            ) {

                return total +
                    Number(
                        transaction.amount
                    );

            },

            0

        );


    // =========================
    // TOTAL PORTFOLIO
    // =========================

    const totalPortfolio =
        totalDeposit;


    // =========================
    // PROFIT
    // =========================

    const totalProfit =
        totalPortfolio -
        totalDeposit;


    // =========================
    // WEEKLY INVESTMENT
    // =========================

    const startOfWeek =
        getStartOfWeek();


    const weeklyInvestment =
        investmentTransactions.reduce(

            function (
                total,
                transaction
            ) {

                const transactionDate =
                    new Date(
                        transaction.date
                    );


                if (
                    transactionDate >=
                    startOfWeek
                ) {

                    return total +
                        Number(
                            transaction.amount
                        );

                }


                return total;

            },

            0

        );


    // =========================
    // PROGRESS
    // =========================

    const progress =
        Math.min(

            (
                weeklyInvestment /
                WEEKLY_TARGET
            ) * 100,

            100

        );


    // =========================
    // STREAK
    // =========================

    const streak =
        calculateStreak(
            investmentTransactions
        );


    // =========================
    // UPDATE PORTFOLIO
    // =========================

    const totalPortfolioElement =
        document.getElementById(
            "totalPortfolio"
        );


    if (
        totalPortfolioElement
    ) {

        totalPortfolioElement.textContent =
            formatRupiah(
                totalPortfolio
            );

    }


    // =========================
    // UPDATE CAPITAL
    // =========================

    const totalCapitalElement =
        document.getElementById(
            "totalCapital"
        );


    if (
        totalCapitalElement
    ) {

        totalCapitalElement.textContent =
            formatRupiah(
                totalDeposit
            );

    }


    // =========================
    // UPDATE PROFIT
    // =========================

    const totalProfitElement =
        document.getElementById(
            "totalProfit"
        );


    if (
        totalProfitElement
    ) {

        totalProfitElement.textContent =
            formatRupiah(
                totalProfit
            );

    }


    // =========================
    // UPDATE TOTAL DEPOSIT
    // =========================

    const totalDepositElement =
        document.getElementById(
            "totalDeposit"
        );


    if (
        totalDepositElement
    ) {

        totalDepositElement.textContent =
            formatRupiah(
                totalDeposit
            );

    }


    // =========================
    // UPDATE TOTAL EXPENSE
    // =========================

    const totalExpenseElement =
        document.getElementById(
            "totalExpense"
        );

    if (
        totalExpenseElement
    ) {

        totalExpenseElement.textContent =
            formatRupiah(
                totalExpense
        );

}


    // =========================
    // UPDATE WEEKLY PROGRESS
    // =========================

    const weeklyProgressElement =
        document.getElementById(
            "weeklyProgress"
        );


    if (
        weeklyProgressElement
    ) {

        weeklyProgressElement.textContent =
            formatRupiah(
                weeklyInvestment
            );

    }


    // =========================
    // UPDATE PERCENT
    // =========================

    const progressPercentElement =
        document.getElementById(
            "progressPercent"
        );


    if (
        progressPercentElement
    ) {

        progressPercentElement.textContent =
            Math.round(
                progress
            ) + "%";

    }


    // =========================
    // UPDATE PROGRESS BAR
    // =========================

    const progressFillElement =
        document.getElementById(
            "progressFill"
        );


    if (
        progressFillElement
    ) {

        progressFillElement.style.width =
            progress + "%";

    }


    // =========================
    // UPDATE STREAK
    // =========================

    const streakElement =
        document.getElementById(
            "streak"
        );


    if (
        streakElement
    ) {

        streakElement.textContent =
            streak +
            " minggu";

    }


    // =========================
    // PROGRESS TEXT
    // =========================

    const progressTextElement =
        document.getElementById(
            "progressText"
        );


    const remaining =
        Math.max(

            WEEKLY_TARGET -
            weeklyInvestment,

            0

        );


    if (
        progressTextElement
    ) {

        if (
            remaining === 0
        ) {

            progressTextElement.textContent =
                "Target investasi minggu ini sudah tercapai! 🔥";

        } else {

            progressTextElement.textContent =
                "Tinggal " +
                formatRupiah(
                    remaining
                ) +
                " lagi untuk mencapai target minggu ini.";

        }

    }


    // =========================
    // RECENT ACTIVITY
    // =========================

    renderRecentActivity(
        transactions
    );


    // =========================
    // DEBUG
    // =========================

    console.log(
        "Investify Dashboard:",
        {
            totalDeposit:
                totalDeposit,

            totalExpense:
                totalExpense,

            totalPortfolio:
                totalPortfolio,

            weeklyInvestment:
                weeklyInvestment,

            streak:
                streak
        }
    );

}


// =========================
// INITIALIZE
// =========================

calculateDashboard();