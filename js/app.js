// ======================================================
// KEUANGANGUE
// FINANCIAL SYSTEM
// STEP 08 — TOTAL KEKAYAAN + ATUR SALDO SEKARANG
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // ELEMENT
    // ==================================================

    const investmentModal = document.getElementById("investmentModal");
    const addInvestmentButton = document.querySelector(".add-investment");
    const closeInvestmentModal = document.getElementById("closeInvestmentModal");

    const investmentForm = document.getElementById("investmentForm");

    const transactionType = document.getElementById("transactionType");
    const amountInput = document.getElementById("amount");
    const fundSource = document.getElementById("fundSource");
    const productSelect = document.getElementById("product");
    const productLabel = document.getElementById("productLabel");
    const dateInput = document.getElementById("date");
    const noteInput = document.getElementById("note");

    const balanceModal = document.getElementById("balanceModal");
    const setBalanceButton = document.getElementById("setBalanceButton");
    const closeBalanceModal = document.getElementById("closeBalanceModal");
    const saveBalanceButton = document.getElementById("saveBalanceButton");

    const initialCash = document.getElementById("initialCash");
    const initialBank = document.getElementById("initialBank");
    const initialWallet = document.getElementById("initialWallet");


    // ==================================================
    // STORAGE KEY
    // ==================================================

    const TRANSACTION_STORAGE_KEY = "investifyTransactions";
    const BALANCE_STORAGE_KEY = "investifyInitialBalance";

    const WEEKLY_TARGET = 50000;


    // ==================================================
    // FORMAT RUPIAH
    // ==================================================

    function formatRupiah(number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(number) || 0);
    }


    // ==================================================
    // TRANSACTIONS
    // ==================================================

    function getTransactions() {
        try {
            const data = localStorage.getItem(TRANSACTION_STORAGE_KEY);

            if (!data) {
                return [];
            }

            const transactions = JSON.parse(data);

            return Array.isArray(transactions) ? transactions : [];

        } catch (error) {

            console.error("Gagal membaca transaksi:", error);

            return [];
        }
    }


    function saveTransactions(transactions) {

        localStorage.setItem(
            TRANSACTION_STORAGE_KEY,
            JSON.stringify(transactions)
        );

    }


    // ==================================================
    // BALANCE
    // ==================================================

    function getInitialBalance() {

        try {

            const data = localStorage.getItem(BALANCE_STORAGE_KEY);

            if (!data) {

                return {
                    cash: 0,
                    bank: 0,
                    wallet: 0
                };

            }

            const balance = JSON.parse(data);

            return {
                cash: Number(balance.cash) || 0,
                bank: Number(balance.bank) || 0,
                wallet: Number(balance.wallet) || 0
            };

        } catch (error) {

            console.error("Gagal membaca saldo:", error);

            return {
                cash: 0,
                bank: 0,
                wallet: 0
            };

        }

    }


    function saveInitialBalance(balance) {

        localStorage.setItem(
            BALANCE_STORAGE_KEY,
            JSON.stringify({
                cash: Number(balance.cash) || 0,
                bank: Number(balance.bank) || 0,
                wallet: Number(balance.wallet) || 0
            })
        );

    }


    // ==================================================
    // TANGGAL DEFAULT
    // ==================================================

    function setDefaultDate() {

        if (!dateInput) return;

        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        dateInput.value = `${year}-${month}-${day}`;

    }


    // ==================================================
    // TRANSACTION FORM
    // ==================================================

    function updateTransactionForm() {

        if (!transactionType || !productSelect || !productLabel) {
            return;
        }

        if (transactionType.value === "expense") {

            productLabel.textContent = "Kategori Pengeluaran";

            productSelect.innerHTML = `
                <option value="">Pilih kategori</option>
                <option value="Makanan">🍜 Makanan</option>
                <option value="Transportasi">🚗 Transportasi</option>
                <option value="Belanja">🛒 Belanja</option>
                <option value="Hiburan">🎮 Hiburan</option>
                <option value="Pendidikan">📚 Pendidikan</option>
                <option value="Lainnya">📦 Lainnya</option>
            `;

        } else {

            productLabel.textContent = "Produk Investasi";

            productSelect.innerHTML = `
                <option value="">Pilih investasi</option>
                <option value="Bahana Likuid Syariah Kelas G">Bahana Likuid Syariah Kelas G</option>
                <option value="Majoris Pasar Uang Syariah Indonesia">Majoris Pasar Uang Syariah Indonesia</option>
                <option value="Trimegah Kas Syariah">Trimegah Kas Syariah</option>
                <option value="Sucorinvest Sharia Money Market Fund">Sucorinvest Sharia Money Market Fund</option>
                <option value="Lainnya">Lainnya</option>
            `;

        }

    }


    // ==================================================
    // OPEN INVESTMENT MODAL
    // ==================================================

    if (addInvestmentButton) {

        addInvestmentButton.addEventListener("click", () => {

            investmentModal.classList.add("active");

            setDefaultDate();

        });

    }


    // ==================================================
    // CLOSE INVESTMENT MODAL
    // ==================================================

    if (closeInvestmentModal) {

        closeInvestmentModal.addEventListener("click", () => {

            investmentModal.classList.remove("active");

        });

    }


    // Klik luar modal
    if (investmentModal) {

        investmentModal.addEventListener("click", (event) => {

            if (event.target === investmentModal) {

                investmentModal.classList.remove("active");

            }

        });

    }


    // ==================================================
    // TRANSACTION TYPE
    // ==================================================

    if (transactionType) {

        transactionType.addEventListener(
            "change",
            updateTransactionForm
        );

    }


    // ==================================================
    // BALANCE MODAL
    // ==================================================

    if (setBalanceButton) {

        setBalanceButton.addEventListener("click", () => {

            const currentBalance = getInitialBalance();

            if (initialCash) {
                initialCash.value = currentBalance.cash;
            }

            if (initialBank) {
                initialBank.value = currentBalance.bank;
            }

            if (initialWallet) {
                initialWallet.value = currentBalance.wallet;
            }

            balanceModal.classList.add("active");

        });

    }


    if (closeBalanceModal) {

        closeBalanceModal.addEventListener("click", () => {

            balanceModal.classList.remove("active");

        });

    }


    if (balanceModal) {

        balanceModal.addEventListener("click", (event) => {

            if (event.target === balanceModal) {

                balanceModal.classList.remove("active");

            }

        });

    }


    // ==================================================
    // SAVE CURRENT BALANCE
    // ==================================================

    if (saveBalanceButton) {

        saveBalanceButton.addEventListener("click", () => {

            const balance = {

                cash: Number(initialCash?.value) || 0,

                bank: Number(initialBank?.value) || 0,

                wallet: Number(initialWallet?.value) || 0

            };

            saveInitialBalance(balance);

            updateBalanceDisplay();

            calculateDashboard();

            balanceModal.classList.remove("active");

            alert("Saldo berhasil diperbarui!");

        });

    }


    // ==================================================
    // CURRENT BALANCE
    // ==================================================

    function getCurrentBalance() {

        const balance = getInitialBalance();

        return {

            cash: Number(balance.cash) || 0,

            bank: Number(balance.bank) || 0,

            wallet: Number(balance.wallet) || 0

        };

    }


    // ==================================================
// SUBMIT TRANSACTION
// ==================================================

if (investmentForm) {

    investmentForm.addEventListener("submit", (event) => {

        event.preventDefault();

        // ------------------------------------------
        // AMBIL DATA FORM
        // ------------------------------------------

        const amount =
            Number(amountInput?.value) || 0;

        const type =
            transactionType?.value || "investment";

        const source =
            fundSource?.value || "";

        const product =
            productSelect?.value || "";

        const date =
            dateInput?.value || "";

        const note =
            noteInput?.value || "";


        // ------------------------------------------
        // VALIDASI
        // ------------------------------------------

        if (amount <= 0) {

            alert("Masukkan jumlah yang valid.");

            return;

        }


        if (!source) {

            alert("Pilih sumber dana.");

            return;

        }


        if (!product) {

            alert("Pilih produk atau kategori.");

            return;

        }


        if (!date) {

            alert("Pilih tanggal transaksi.");

            return;

        }


        // ------------------------------------------
        // CEK MODE EDIT
        // ------------------------------------------

        const editingId =
            localStorage.getItem("investifyEditingId");

        const isEditing =
            editingId !== null &&
            editingId !== "";


        // ------------------------------------------
        // AMBIL TRANSAKSI
        // ------------------------------------------

        const transactions =
            getTransactions();

        let oldTransaction = null;

        let oldTransactionIndex = -1;


        // ------------------------------------------
        // CARI TRANSAKSI LAMA BERDASARKAN ID
        // ------------------------------------------

        if (isEditing) {

            oldTransactionIndex =
                transactions.findIndex(
                    transaction =>
                        String(transaction.id) ===
                        String(editingId)
                );


            if (oldTransactionIndex === -1) {

                alert(
                    "Transaksi yang ingin diedit tidak ditemukan."
                );

                localStorage.removeItem(
                    "investifyEditingId"
                );

                return;

            }


            oldTransaction =
                transactions[oldTransactionIndex];


            // --------------------------------------
            // PASTIKAN SUMBER DANA LAMA ADA
            // --------------------------------------

            if (!oldTransaction.fundSource) {

                alert(
                    "Transaksi lama tidak memiliki sumber dana. " +
                    "Transaksi ini belum bisa diedit dengan aman."
                );

                localStorage.removeItem(
                    "investifyEditingId"
                );

                return;

            }

        }


        // ------------------------------------------
        // CEK SALDO
        // ------------------------------------------

        const currentBalance =
            getCurrentBalance();


        const balanceForCheck = {

            cash:
                Number(currentBalance.cash) || 0,

            bank:
                Number(currentBalance.bank) || 0,

            wallet:
                Number(currentBalance.wallet) || 0

        };


        // ------------------------------------------
        // KALAU EDIT
        // KEMBALIKAN DULU SALDO TRANSAKSI LAMA
        // ------------------------------------------

        if (isEditing && oldTransaction) {

            const oldSource =
                oldTransaction.fundSource;

            const oldAmount =
                Number(oldTransaction.amount) || 0;


            balanceForCheck[oldSource] =
                (Number(balanceForCheck[oldSource]) || 0)
                + oldAmount;

        }


        // ------------------------------------------
        // CEK SALDO SUMBER DANA BARU
        // ------------------------------------------

        const availableBalance =
            Number(balanceForCheck[source]) || 0;


        if (amount > availableBalance) {

            alert(
                "Saldo " +
                source +
                " tidak mencukupi.\n\n" +
                "Saldo tersedia: " +
                formatRupiah(availableBalance)
            );

            return;

        }


        // ------------------------------------------
        // BUAT TRANSAKSI BARU
        // ------------------------------------------

        const transaction = {

            id:
                isEditing && oldTransaction
                    ? oldTransaction.id
                    : Date.now(),

            amount:
                amount,

            type:
                type,

            fundSource:
                source,

            product:
                product,

            date:
                date,

            note:
                note,

            createdAt:
                isEditing && oldTransaction
                    ? oldTransaction.createdAt
                    : new Date().toISOString()

        };


        // ------------------------------------------
        // SIMPAN / UPDATE TRANSAKSI
        // ------------------------------------------

        if (isEditing) {

            transactions[oldTransactionIndex] =
                transaction;

        } else {

            transactions.push(transaction);

        }


        // ------------------------------------------
        // UPDATE SALDO
        // ------------------------------------------

        const updatedBalance =
            getCurrentBalance();


        // ------------------------------------------
        // KALAU EDIT
        // KEMBALIKAN SALDO TRANSAKSI LAMA
        // ------------------------------------------

        if (isEditing && oldTransaction) {

            const oldSource =
                oldTransaction.fundSource;

            const oldAmount =
                Number(oldTransaction.amount) || 0;


            updatedBalance[oldSource] =
                (Number(updatedBalance[oldSource]) || 0)
                + oldAmount;

        }


        // ------------------------------------------
        // KURANGI SALDO TRANSAKSI BARU
        // ------------------------------------------

        updatedBalance[source] =
            (Number(updatedBalance[source]) || 0)
            - amount;


        // ------------------------------------------
        // SIMPAN KE LOCALSTORAGE
        // ------------------------------------------

        saveTransactions(transactions);

        saveInitialBalance(updatedBalance);


        // ------------------------------------------
        // HAPUS MODE EDIT
        // ------------------------------------------

        localStorage.removeItem(
            "investifyEditingId"
        );

        // Bersihkan index lama kalau masih ada
        localStorage.removeItem(
            "investifyEditingIndex"
        );


        // ------------------------------------------
        // RESET FORM
        // ------------------------------------------

        investmentForm.reset();

        setDefaultDate();

        updateTransactionForm();


        // ------------------------------------------
        // TUTUP MODAL
        // ------------------------------------------

        if (investmentModal) {

            investmentModal.classList.remove(
                "active"
            );

        }


        // ------------------------------------------
        // REFRESH DASHBOARD
        // ------------------------------------------

        calculateDashboard();

        if (window.refreshInvestmentChart) {
        window.refreshInvestmentChart();
    }

        if (window.refreshMonthlyStats) {
        window.refreshMonthlyStats();
    }

        // ------------------------------------------
        // PESAN
        // ------------------------------------------

        if (isEditing) {

            alert(
                "Transaksi berhasil diperbarui!"
            );

        } else {

            alert(
                "Transaksi berhasil disimpan!"
            );

        }

    });

}


    // ==================================================
    // WEEK START
    // ==================================================

    function getStartOfWeek() {

        const date = new Date();

        const day = date.getDay();

        const diff = day === 0 ? -6 : 1 - day;

        date.setDate(date.getDate() + diff);

        date.setHours(0, 0, 0, 0);

        return date;

    }


    // ==================================================
    // TRANSACTION DATE
    // ==================================================

    function getTransactionDate(transaction) {

        if (transaction.date) {

            const date = new Date(
                transaction.date + "T00:00:00"
            );

            if (!isNaN(date.getTime())) {

                return date;

            }

        }

        if (transaction.createdAt) {

            const date = new Date(transaction.createdAt);

            if (!isNaN(date.getTime())) {

                return date;

            }

        }

        return new Date();

    }


    // ==================================================
    // STREAK
    // ==================================================

    function calculateStreak(transactions) {

    const WEEKLY_TARGET = 50000;

    if (
        !Array.isArray(transactions) ||
        transactions.length === 0
    ) {
        return 0;
    }


    const investments =
        transactions.filter(function (transaction) {

            return (
                (transaction.type || "investment") ===
                "investment"
            );

        });


    if (investments.length === 0) {
        return 0;
    }


    function getWeekKey(date) {

        const d = new Date(date);

        if (isNaN(d.getTime())) {
            return null;
        }


        const day =
            d.getDay();


        const diff =
            day === 0
                ? -6
                : 1 - day;


        d.setDate(
            d.getDate() + diff
        );


        return (
            d.getFullYear() +
            "-" +
            String(
                d.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                d.getDate()
            ).padStart(2, "0")
        );

    }


    const weeklyInvestment = {};


    investments.forEach(
        function (transaction) {

            const date =
                getTransactionDate(
                    transaction
                );


            const week =
                getWeekKey(date);


            if (!week) {
                return;
            }


            weeklyInvestment[week] =
                (
                    weeklyInvestment[week] || 0
                ) +
                (
                    Number(
                        transaction.amount
                    ) || 0
                );

        }
    );


    let currentDate =
        new Date();


    let streak = 0;


    while (true) {

        const week =
            getWeekKey(
                currentDate
            );


        const amount =
            weeklyInvestment[week] || 0;


        if (
            amount >= WEEKLY_TARGET
        ) {

            streak++;

        } else {

            break;

        }


        currentDate.setDate(
            currentDate.getDate() - 7
        );

    }


    return streak;

}


    // ==================================================
    // RECENT ACTIVITY
    // ==================================================

    function renderRecentActivity(transactions) {

        const recentSection =
            document.querySelector(".recent");

        if (!recentSection) return;


        const activities =
            recentSection.querySelectorAll(".activity");


        activities.forEach(activity => {

            activity.remove();

        });


        const sorted =
            [...transactions].sort(
                (a, b) =>
                    new Date(b.createdAt || b.date) -
                    new Date(a.createdAt || a.date)
            );


        const recent =
            sorted.slice(0, 5);


        if (recent.length === 0) {

            const empty = document.createElement("div");

            empty.className = "activity";

            empty.innerHTML = `
                <div>
                    <strong>Belum ada transaksi</strong>
                    <p>Transaksi terbaru akan muncul di sini.</p>
                </div>
            `;

            recentSection.appendChild(empty);

            return;

        }


        recent.forEach(transaction => {

            const isExpense =
                transaction.type === "expense";

            const activity =
                document.createElement("div");

            activity.className = "activity";


            const sign =
                isExpense ? "-" : "+";

            const amountClass =
                isExpense ? "expense" : "income";


            activity.innerHTML = `

                <div>

                    <strong>
                        ${transaction.product || "Transaksi"}
                    </strong>

                    <p>
                        ${transaction.fundSource || "-"}
                        •
                        ${transaction.date || "-"}
                    </p>

                </div>

                <span class="${amountClass}">
                    ${sign}${formatRupiah(transaction.amount)}
                </span>

            `;


            recentSection.appendChild(activity);

        });

    }


    // ==================================================
    // BALANCE DISPLAY
    // ==================================================

    function updateBalanceDisplay() {

        const balance = getCurrentBalance();


        const cashBalance =
            document.getElementById("cashBalance");

        const bankBalance =
            document.getElementById("bankBalance");

        const walletBalance =
            document.getElementById("walletBalance");

        const totalBalance =
            document.getElementById("totalBalance");


        if (cashBalance) {

            cashBalance.textContent =
                formatRupiah(balance.cash);

        }


        if (bankBalance) {

            bankBalance.textContent =
                formatRupiah(balance.bank);

        }


        if (walletBalance) {

            walletBalance.textContent =
                formatRupiah(balance.wallet);

        }


        if (totalBalance) {

            totalBalance.textContent =
                formatRupiah(
                    balance.cash +
                    balance.bank +
                    balance.wallet
                );

        }

    }


    // ==================================================
    // MAIN DASHBOARD
    // ==================================================

    function calculateDashboard() {

        const transactions =
            getTransactions();


        // ------------------------------------------
        // INVESTMENT
        // ------------------------------------------

        const investments =
            transactions.filter(transaction =>
                transaction.type === "investment" ||
                !transaction.type
            );


        // ------------------------------------------
        // EXPENSE
        // ------------------------------------------

        const expenses =
            transactions.filter(transaction =>
                transaction.type === "expense"
            );


        // ------------------------------------------
        // TOTAL DEPOSIT
        // ------------------------------------------

        const totalDeposit =
            investments.reduce(
                (sum, transaction) =>
                    sum + Number(transaction.amount || 0),
                0
            );


        // ------------------------------------------
        // TOTAL EXPENSE
        // ------------------------------------------

        const totalExpense =
            expenses.reduce(
                (sum, transaction) =>
                    sum + Number(transaction.amount || 0),
                0
            );


        // ------------------------------------------
        // PORTFOLIO
        // ------------------------------------------

        const totalPortfolio =
            totalDeposit;


        // ------------------------------------------
        // TOTAL BALANCE
        // ------------------------------------------

        const balance =
            getCurrentBalance();


        const totalBalance =
            balance.cash +
            balance.bank +
            balance.wallet;


        // ------------------------------------------
        // TOTAL WEALTH
        // ------------------------------------------

        const totalWealth =
            totalBalance +
            totalPortfolio;


        // ------------------------------------------
        // PROFIT
        // ------------------------------------------

        const totalProfit =
            totalPortfolio -
            totalDeposit;


        // ------------------------------------------
        // WEEKLY INVESTMENT
        // ------------------------------------------

        const startOfWeek =
            getStartOfWeek();


        const weeklyInvestment =
            investments
                .filter(transaction =>
                    getTransactionDate(transaction) >=
                    startOfWeek
                )
                .reduce(
                    (sum, transaction) =>
                        sum + Number(transaction.amount || 0),
                    0
                );


        // ------------------------------------------
        // WEEKLY PROGRESS
        // ------------------------------------------

        const progress =
            Math.min(
                (weeklyInvestment / WEEKLY_TARGET) * 100,
                100
            );


        // ------------------------------------------
        // STREAK
        // ------------------------------------------

        const streak =
            calculateStreak(transactions);


        // ------------------------------------------
        // DOM UPDATE
        // ------------------------------------------

        const totalPortfolioElement =
            document.getElementById("totalPortfolio");

        const totalCapitalElement =
            document.getElementById("totalCapital");

        const totalProfitElement =
            document.getElementById("totalProfit");

        const weeklyProgressElement =
            document.getElementById("weeklyProgress");

        const progressPercentElement =
            document.getElementById("progressPercent");

        const progressFillElement =
            document.getElementById("progressFill");

        const progressTextElement =
            document.getElementById("progressText");

        const streakElement =
            document.getElementById("streak");

        const totalDepositElement =
            document.getElementById("totalDeposit");

        const totalExpenseElement =
            document.getElementById("totalExpense");

        const totalWealthElement =
            document.getElementById("totalWealth");

        const wealthBalanceElement =
            document.getElementById("wealthBalance");

        const wealthInvestmentElement =
            document.getElementById("wealthInvestment");


        if (totalPortfolioElement) {

            totalPortfolioElement.textContent =
                formatRupiah(totalPortfolio);

        }


        if (totalCapitalElement) {

            totalCapitalElement.textContent =
                formatRupiah(totalDeposit);

        }


        if (totalProfitElement) {

            totalProfitElement.textContent =
                formatRupiah(totalProfit);

        }


        if (weeklyProgressElement) {

            weeklyProgressElement.textContent =
                formatRupiah(weeklyInvestment);

        }


        if (progressPercentElement) {

            progressPercentElement.textContent =
                `${Math.round(progress)}%`;

        }


        if (progressFillElement) {

            progressFillElement.style.width =
                `${progress}%`;

        }


        if (progressTextElement) {

            progressTextElement.textContent =
                `${formatRupiah(weeklyInvestment)} dari ${formatRupiah(WEEKLY_TARGET)}`;

        }


        if (streakElement) {

    streakElement.textContent =
        `${streak} minggu`;

}


        if (totalDepositElement) {

            totalDepositElement.textContent =
                formatRupiah(totalDeposit);

        }


        if (totalExpenseElement) {

            totalExpenseElement.textContent =
                formatRupiah(totalExpense);

        }


        if (totalWealthElement) {

            totalWealthElement.textContent =
                formatRupiah(totalWealth);

        }


        if (wealthBalanceElement) {

            wealthBalanceElement.textContent =
                formatRupiah(totalBalance);

        }


        if (wealthInvestmentElement) {

            wealthInvestmentElement.textContent =
                formatRupiah(totalPortfolio);

        }


        // ------------------------------------------
        // OTHER DISPLAY
        // ------------------------------------------

        updateBalanceDisplay();

        renderRecentActivity(transactions);


        // ------------------------------------------
        // DEBUG
        // ------------------------------------------

        console.log("========== KEUANGANGUE ==========");

        console.log("Transactions:", transactions);

        console.log("Balance:", balance);

        console.log("Total Investment:", totalDeposit);

        console.log("Total Expense:", totalExpense);

        console.log("Total Wealth:", totalWealth);

        console.log("================================");

    }


    // ==================================================
    // INITIALIZE
    // ==================================================

    setDefaultDate();

    updateTransactionForm();

    calculateDashboard();

});





// ======================================================
// STEP 11 — CHART DINAMIS
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    const chartCanvas =
        document.getElementById("investmentChart");

    const chartPeriod =
        document.getElementById("chartPeriod");

    if (!chartCanvas) return;

    // Pastikan Chart.js tersedia
    if (typeof Chart === "undefined") {
        console.error("Chart.js belum berhasil dimuat.");
        return;
    }

    let investmentChart = null;


    // ==================================================
    // AMBIL TRANSAKSI
    // ==================================================

    function getChartTransactions() {

        try {

            const data =
                localStorage.getItem(
                    "investifyTransactions"
                );

            if (!data) return [];

            const transactions =
                JSON.parse(data);

            return Array.isArray(transactions)
                ? transactions
                : [];

        } catch (error) {

            console.error(
                "Gagal membaca transaksi chart:",
                error
            );

            return [];

        }

    }


    // ==================================================
    // FORMAT RUPIAH
    // ==================================================

    function chartRupiah(value) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            }
        ).format(value || 0);

    }


    // ==================================================
    // FORMAT TANGGAL LOKAL
    // ==================================================

    function getLocalDateKey(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    // ==================================================
    // BUAT DATA CHART
    // ==================================================

    function getChartData() {

        const transactions =
            getChartTransactions();

        const days =
            Number(
                chartPeriod?.value
            ) || 30;


        // ------------------------------------------
        // TANGGAL HARI INI
        // ------------------------------------------

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        // ------------------------------------------
        // TANGGAL AWAL
        // ------------------------------------------

        const startDate =
            new Date(today);

        startDate.setDate(
            startDate.getDate() -
            (days - 1)
        );


        // ------------------------------------------
        // KELOMPOKKAN INVESTASI PER TANGGAL
        // ------------------------------------------

        const dailyInvestment = {};


        transactions
            .filter(transaction =>
                transaction.type === "investment" ||
                !transaction.type
            )
            .forEach(transaction => {

                if (!transaction.date) {
                    return;
                }

                const dateKey =
                    String(
                        transaction.date
                    ).slice(0, 10);

                const amount =
                    Number(
                        transaction.amount
                    ) || 0;

                dailyInvestment[dateKey] =
                    (
                        dailyInvestment[dateKey] ||
                        0
                    ) + amount;

            });


        // ------------------------------------------
        // BUAT LABEL + DATA KUMULATIF
        // ------------------------------------------

        const labels = [];
        const values = [];

        let cumulative =
            0;


        for (
            let i = 0;
            i < days;
            i++
        ) {

            const currentDate =
                new Date(startDate);

            currentDate.setDate(
                startDate.getDate() + i
            );


            const dateKey =
                getLocalDateKey(
                    currentDate
                );


            // Tambahkan investasi hari tersebut
            cumulative +=
                dailyInvestment[dateKey] || 0;


            // Label tanggal
            labels.push(
                currentDate.toLocaleDateString(
                    "id-ID",
                    {
                        day: "numeric",
                        month: "short"
                    }
                )
            );


            // Nilai kumulatif
            values.push(
                cumulative
            );

        }


        return {
            labels,
            values
        };

    }


    // ==================================================
    // RENDER CHART
    // ==================================================

    function renderInvestmentChart() {

        const data =
            getChartData();


        // ------------------------------------------
        // HAPUS CHART LAMA
        // ------------------------------------------

        if (investmentChart) {

            investmentChart.destroy();

        }


        // ------------------------------------------
        // BUAT CHART BARU
        // ------------------------------------------

        investmentChart =
            new Chart(
                chartCanvas,
                {

                    type: "line",

                    data: {

                        labels:
                            data.labels,

                        datasets: [

                            {

                                label:
                                    "Investasi dalam Periode",

                                data:
                                    data.values,

                                borderWidth:
                                    3,

                                tension:
                                    0.35,

                                fill:
                                    true,

                                pointRadius:
                                    3,

                                pointHoverRadius:
                                    6

                            }

                        ]

                    },


                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,


                        interaction: {

                            intersect:
                                false,

                            mode:
                                "index"

                        },


                        plugins: {

                            legend: {

                                display:
                                    false

                            },


                            tooltip: {

                                callbacks: {

                                    label:
                                        function (
                                            context
                                        ) {

                                            return (
                                                " Investasi: " +
                                                chartRupiah(
                                                    context.parsed.y
                                                )
                                            );

                                        }

                                }

                            }

                        },


                        scales: {

                            x: {

                                grid: {

                                    display:
                                        false

                                },

                                ticks: {

                                    maxTicksLimit:
                                        7

                                }

                            },


                            y: {

                                beginAtZero:
                                    true,

                                ticks: {

                                    callback:
                                        function (
                                            value
                                        ) {

                                            return chartRupiah(
                                                value
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );

    }


    // ==================================================
    // FILTER PERIODE
    // ==================================================

    if (chartPeriod) {

        chartPeriod.addEventListener(
            "change",
            renderInvestmentChart
        );

    }


    // ==================================================
    // LOAD PERTAMA
    // ==================================================

    renderInvestmentChart();


    // ==================================================
    // REFRESH DARI DASHBOARD
    // ==================================================

    window.refreshInvestmentChart =
        renderInvestmentChart;

});


function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(Number(number) || 0);
}


    // ======================================================
// STEP 12 — STATISTIK BULANAN
// ======================================================

function updateMonthlyStats() {

    const investmentElement =
        document.getElementById("monthlyInvestment");

    const expenseElement =
        document.getElementById("monthlyExpense");

    const transactionsElement =
        document.getElementById("monthlyTransactions");

    const activeDaysElement =
        document.getElementById("monthlyActiveDays");

    const titleElement =
        document.getElementById("monthlyStatsTitle");


    // Kalau HTML belum ada
    if (
        !investmentElement ||
        !expenseElement ||
        !transactionsElement ||
        !activeDaysElement
    ) {
        return;
    }


    // ==================================================
    // AMBIL TRANSAKSI
    // ==================================================

    let transactions = [];

    try {

        const saved =
            localStorage.getItem(
                "investifyTransactions"
            );

        transactions =
            saved
                ? JSON.parse(saved)
                : [];

        if (!Array.isArray(transactions)) {
            transactions = [];
        }

    } catch (error) {

        console.error(
            "Gagal membaca statistik bulanan:",
            error
        );

        transactions = [];

    }


    // ==================================================
    // BULAN SEKARANG
    // ==================================================

    const now = new Date();

    const currentYear =
        now.getFullYear();

    const currentMonth =
        now.getMonth();


    // ==================================================
    // FILTER BULAN INI
    // ==================================================

    const monthlyTransactions =
        transactions.filter(transaction => {

            if (!transaction.date) {
                return false;
            }

            const dateKey =
                String(transaction.date).slice(0, 10);

            const parts =
                dateKey.split("-");

            if (parts.length !== 3) {
                return false;
            }

            const year =
                Number(parts[0]);

            const month =
                Number(parts[1]) - 1;

            return (
                year === currentYear &&
                month === currentMonth
            );

        });


    // ==================================================
    // TOTAL INVESTASI
    // ==================================================

    const investmentTotal =
        monthlyTransactions
            .filter(transaction =>
                transaction.type === "investment" ||
                !transaction.type
            )
            .reduce(
                (total, transaction) =>
                    total +
                    (
                        Number(transaction.amount) || 0
                    ),
                0
            );


    // ==================================================
    // TOTAL PENGELUARAN
    // ==================================================

    const expenseTotal =
        monthlyTransactions
            .filter(transaction =>
                transaction.type === "expense"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    (
                        Number(transaction.amount) || 0
                    ),
                0
            );


    // ==================================================
    // JUMLAH TRANSAKSI
    // ==================================================

    const transactionCount =
        monthlyTransactions.length;


    // ==================================================
    // HARI AKTIF
    // ==================================================

    const activeDays =
        new Set(
            monthlyTransactions.map(
                transaction =>
                    String(transaction.date).slice(0, 10)
            )
        ).size;


    // ==================================================
    // TAMPILKAN
    // ==================================================

    investmentElement.textContent =
        formatRupiah(investmentTotal);

    expenseElement.textContent =
        formatRupiah(expenseTotal);

    transactionsElement.textContent =
        transactionCount;

    activeDaysElement.textContent =
        activeDays;


    // ==================================================
    // JUDUL BULAN
    // ==================================================

    if (titleElement) {

        titleElement.textContent =
            now.toLocaleDateString(
                "id-ID",
                {
                    month: "long",
                    year: "numeric"
                }
            );

    }

}


// ======================================================
// LOAD AWAL
// ======================================================

updateMonthlyStats();


// ======================================================
// REFRESH SETELAH TRANSAKSI
// ======================================================

window.refreshMonthlyStats =
    updateMonthlyStats;
