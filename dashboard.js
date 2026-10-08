// =========================
// INVESTMENT STORAGE
// =========================

function getInvestments() {
    const data = localStorage.getItem("investments");

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Data investasi rusak:", error);
        return [];
    }
}


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
// FORMAT TANGGAL
// =========================

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// =========================
// OPEN MODAL
// =========================

function openInvestmentForm() {
    document
        .getElementById("investmentModal")
        .classList.add("active");

    // Isi tanggal hari ini
    const dateInput =
        document.getElementById("investmentDate");

    if (!dateInput.value) {
        dateInput.value =
            new Date().toISOString().split("T")[0];
    }
}


// =========================
// CLOSE MODAL
// =========================

function closeInvestmentForm() {
    document
        .getElementById("investmentModal")
        .classList.remove("active");
}


// =========================
// UPDATE SEMUA DASHBOARD
// =========================

function updateDashboard() {
    updatePortfolio();
    updateTransactions();
    updateTargetProgress();
    updateWeeklyInvestment();
    updateInvestmentChart();
}


// =========================
// UPDATE PORTFOLIO
// =========================

function updatePortfolio() {

    const investments = getInvestments();

    let total = 0;

    investments.forEach(function(investment) {
        total += Number(investment.amount) || 0;
    });

    const portfolio =
        document.getElementById("totalPortfolio");

    const totalInvestment =
        document.getElementById("totalInvestment");

    if (portfolio) {
        portfolio.textContent =
            formatRupiah(total);
    }

    if (totalInvestment) {
        totalInvestment.textContent =
            formatRupiah(total);
    }
}


// =========================
// UPDATE RIWAYAT
// =========================

function updateTransactions() {

    const list =
        document.getElementById("transactionList");

    if (!list) {
        console.error("transactionList tidak ditemukan.");
        return;
    }

    const investments = getInvestments();

    list.innerHTML = "";

    if (investments.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                Belum ada investasi.
            </div>
        `;

        return;
    }

    investments
        .slice()
        .reverse()
        .forEach(function(investment) {

            const item =
                document.createElement("div");

            item.className = "transaction";

            const info =
                document.createElement("div");

            const note =
                document.createElement("strong");

            note.textContent =
                investment.note || "Setoran Investasi";

            const date =
                document.createElement("span");

            date.textContent =
                formatDate(investment.date);

            info.appendChild(note);
            info.appendChild(date);

            const amount =
                document.createElement("strong");

            amount.className = "amount";

            amount.textContent =
                "+" + formatRupiah(
                    Number(investment.amount) || 0
                );

            item.appendChild(info);
            item.appendChild(amount);

            list.appendChild(item);
        });
}


// =========================
// TARGET
// =========================

function getTarget() {

    const savedTarget =
        localStorage.getItem("investmentTarget");

    return savedTarget
        ? Number(savedTarget)
        : 2000000;
}


// =========================
// UPDATE TARGET
// =========================

function updateTargetProgress() {

    const investments = getInvestments();

    const target = getTarget();

    let total = 0;

    investments.forEach(function(investment) {
        total += Number(investment.amount) || 0;
    });

    let percentage = 0;

    if (target > 0) {
        percentage =
            (total / target) * 100;
    }

    const displayPercentage =
        Math.min(percentage, 100);

    const targetAmount =
        document.getElementById("targetAmount");

    const progressBar =
        document.getElementById("targetProgressBar");

    const progressText =
        document.getElementById("targetProgressText");

    if (targetAmount) {
        targetAmount.textContent =
            formatRupiah(target);
    }

    if (progressBar) {
        progressBar.style.width =
            displayPercentage + "%";
    }

    if (progressText) {
        progressText.textContent =
            Math.floor(percentage) +
            "% tercapai";
    }
}


// =========================
// INVESTASI MINGGU INI
// =========================

function updateWeeklyInvestment() {

    const investments = getInvestments();

    const now = new Date();

    const day = now.getDay();

    const daysFromMonday =
        day === 0 ? 6 : day - 1;

    const monday = new Date(now);

    monday.setDate(
        now.getDate() - daysFromMonday
    );

    monday.setHours(0, 0, 0, 0);

    let total = 0;

    investments.forEach(function(investment) {

        const investmentDate =
            new Date(
                investment.date + "T00:00:00"
            );

        if (investmentDate >= monday) {
            total +=
                Number(investment.amount) || 0;
        }
    });

    const weeklyElement =
        document.getElementById("weeklyInvestment");

    const statusElement =
        document.getElementById("weeklyStatus");

    if (weeklyElement) {
        weeklyElement.textContent =
            formatRupiah(total);
    }

    if (statusElement) {

        if (total >= 50000) {

            statusElement.textContent =
                "✓ Target tercapai";

        } else if (total > 0) {

            statusElement.textContent =
                "Belum mencapai Rp50.000";

        } else {

            statusElement.textContent =
                "Belum ada investasi";
        }
    }
}


// =========================
// FORM
// =========================

const investmentForm =
    document.getElementById("investmentForm");

if (investmentForm) {

    investmentForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const amount =
                Number(
                    document.getElementById(
                        "investmentAmount"
                    ).value
                );

            const date =
                document.getElementById(
                    "investmentDate"
                ).value;

            const note =
                document.getElementById(
                    "investmentNote"
                ).value.trim();

            if (!amount || amount < 1000) {

                alert(
                    "Masukkan jumlah investasi minimal Rp1.000."
                );

                return;
            }

            if (!date) {

                alert(
                    "Silakan pilih tanggal investasi."
                );

                return;
            }

            const investments =
                getInvestments();

            investments.push({
                id: Date.now(),
                amount: amount,
                date: date,
                note: note || "Setoran Investasi"
            });

            localStorage.setItem(
                "investments",
                JSON.stringify(investments)
            );

            closeInvestmentForm();

            investmentForm.reset();

            updateDashboard();

            alert(
                "Investasi berhasil disimpan!"
            );
        }
    );
}


// =========================
// JALANKAN SAAT HALAMAN DIBUKA
// =========================

updateDashboard();


// =========================
// CHART INVESTASI
// =========================

function updateInvestmentChart() {
    const canvas = document.getElementById("investmentChart");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");
    const investments = getInvestments();

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = Math.max(rect.width, 300);
    const height = Math.max(rect.height, 180);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Jika belum ada investasi
    if (investments.length === 0) {
        ctx.font = "13px Arial";
        ctx.fillStyle = "#999";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            "Belum ada data investasi",
            width / 2,
            height / 2
        );

        return;
    }

    // Urutkan berdasarkan tanggal
    const sorted = investments
        .slice()
        .sort(function(a, b) {
            return new Date(a.date) - new Date(b.date);
        });

    // Buat data kumulatif
    let total = 0;

    const data = sorted.map(function(investment) {
        total += Number(investment.amount) || 0;

        return {
            date: investment.date,
            amount: total
        };
    });

    const padding = {
        top: 20,
        right: 10,
        bottom: 25,
        left: 10
    };

    const chartWidth =
        width - padding.left - padding.right;

    const chartHeight =
        height - padding.top - padding.bottom;

    const maxValue =
        Math.max(...data.map(item => item.amount));

    const minValue = 0;

    // Satu titik
    if (data.length === 1) {
        const x = padding.left + chartWidth / 2;
        const y =
            padding.top +
            chartHeight -
            ((data[0].amount - minValue) /
                Math.max(maxValue, 1)) *
                chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();

        return;
    }

    function getX(index) {
        return (
            padding.left +
            (index / (data.length - 1)) *
                chartWidth
        );
    }

    function getY(value) {
        return (
            padding.top +
            chartHeight -
            ((value - minValue) /
                Math.max(maxValue, 1)) *
                chartHeight
        );
    }

    // Garis chart
    ctx.beginPath();

    data.forEach(function(item, index) {
        const x = getX(index);
        const y = getY(item.amount);

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Titik
    data.forEach(function(item, index) {
        const x = getX(index);
        const y = getY(item.amount);

        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();
    });

    // Label terakhir
    const last = data[data.length - 1];

    ctx.font = "12px Arial";
    ctx.fillStyle = "#777";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";

    ctx.fillText(
        formatRupiah(last.amount),
        width - padding.right,
        padding.top - 2
    );
}


// =========================
// JALANKAN CHART
// =========================

updateInvestmentChart();


// =========================
// RESPONSIVE CHART
// =========================

window.addEventListener(
    "resize",
    function() {
        updateInvestmentChart();
    }
);