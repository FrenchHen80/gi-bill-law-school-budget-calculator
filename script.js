// --- MHA DATA (dropdown values must match these keys) ---

// --- Helpers ---
function money(n) {
  // keep negative signs readable
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(Math.round(n));
  return sign + "$" + abs.toLocaleString("en-US");
}

function pct(part, total) {
  if (total === 0) return "—";
  return Math.round((part / total) * 100) + "%";
}

// --- Main calculate ---
function calculate() {
  // Track event (guard so it doesn't crash if gtag isn't loaded yet)
  if (typeof gtag === "function") {
    gtag("event", "calculate_click", {
      event_category: "engagement",
      event_label: "calculator used"
    });
  }

  const income = Number(document.getElementById("income").value) || 0;
  const mha = Number(document.getElementById("mha").value) || 0;
  const rent = Number(document.getElementById("rent").value) || 0;
  const expenses = Number(document.getElementById("expenses").value) || 0;

  const totalIncome = income + mha;
  const totalSpent = rent + expenses;
  const remaining = totalIncome - totalSpent;

  // Money Left output
  const resultEl = document.getElementById("result");
  resultEl.textContent = money(remaining);

  // IMPORTANT: keep your base class + status class
  // (Your HTML shows: class="value neutral")
  resultEl.className = "value neutral";
  if (remaining > 0) resultEl.className = "value positive";
  if (remaining < 0) resultEl.className = "value negative";

  // Message
  const msg = document.getElementById("message");
  msg.className = ""; // reset any previous class

  if (remaining > 0) {
    msg.textContent = "You are within budget.";
    msg.className = "good";
  } else if (remaining < 0) {
    msg.textContent = "Warning: You are overspending.";
    msg.className = "bad";
  } else {
    msg.textContent = "You are breaking even.";
    msg.className = "ok";
  }

  // Savings rate
  const savingsEl = document.getElementById("savings");
  savingsEl.className = "";

  if (totalIncome === 0) {
    savingsEl.textContent = "";
  } else {
    const rate = Math.round((remaining / totalIncome) * 100);

    if (remaining >= 0) {
      savingsEl.textContent = "Savings Rate: " + rate + "%";
    } else {
      savingsEl.textContent = "Shortfall: " + Math.abs(rate) + "% of income";
    }
  }

  // Rent advice
  const rentAdvice = document.getElementById("rentAdvice");
  rentAdvice.className = "";

  if (totalIncome === 0) {
    rentAdvice.textContent = "";
  } else {
    const rentPct = (rent / totalIncome) * 100;

    if (rentPct > 40) {
      rentAdvice.textContent = "Warning: Rent is above 40% of income.";
      rentAdvice.className = "bad";
    } else if (rentPct > 30) {
      rentAdvice.textContent = "Caution: Rent is moderately high.";
      rentAdvice.className = "ok";
    } else {
      rentAdvice.textContent = "Rent is within a healthy range.";
      rentAdvice.className = "good";
    }
  }

  // Breakdown (uses innerHTML intentionally)
  document.getElementById("breakdown").innerHTML = `
    <p>Total Income: <strong>${money(totalIncome)}</strong></p>
    <p>Total Spent: <strong>${money(totalSpent)}</strong> (${pct(totalSpent, totalIncome)} of income)</p>
    <p>Rent: <strong>${money(rent)}</strong> (${pct(rent, totalIncome)} of income)</p>
    <p>Other Expenses: <strong>${money(expenses)}</strong> (${pct(expenses, totalIncome)} of income)</p>
  `;
}

// --- Reset ---
function resetAll() {
  document.getElementById("income").value = "";
  document.getElementById("mha").value = "";
  document.getElementById("rent").value = "";
  document.getElementById("expenses").value = "";

  // Optional: reset dropdown too
  // document.getElementById("school").value = "";

  const resultEl = document.getElementById("result");
  resultEl.textContent = "";
  resultEl.className = "value neutral";

  const msg = document.getElementById("message");
  msg.textContent = "";
  msg.className = "";

  const savingsEl = document.getElementById("savings");
  savingsEl.textContent = "";
  savingsEl.className = "";

  const rentAdvice = document.getElementById("rentAdvice");
  rentAdvice.textContent = "";
  rentAdvice.className = "";

  document.getElementById("breakdown").innerHTML = "";
}

// --- Click handlers ---
document.getElementById("calcBtn").onclick = calculate;
document.getElementById("resetBtn").onclick = resetAll;

// Press Enter to calculate (from any input)
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calculate();
});

// Dropdown sets MHA
document.getElementById("school").onchange = function () {
  const school = this.value;
  const mhaInput = document.getElementById("mha");

  if (mhaData[school] !== undefined) {
    mhaInput.value = mhaData[school];

    // Add highlight
    mhaInput.classList.add("highlight");
    setTimeout(() => {
      mhaInput.classList.remove("highlight");
    }, 1000);
  }
};
