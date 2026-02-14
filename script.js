const mhaData = {
  udm: 2200,
  umich: 2400,
  wayne: 2100,
  msu: 1800
};
function money(n) {
  return "$" + n.toLocaleString("en-US");
}

function pct(part, total) {
  if (total === 0) return "—";
  return Math.round((part / total) * 100) + "%";
}

function calculate() {
// 🔥 TRACK EVENT
   gtag('event', 'calculate_click', {
      'event_category': 'engagement',
      'event_label': 'calculator used'
   });
  
  let income = Number(document.getElementById("income").value) || 0;
  let mha = Number(document.getElementById("mha").value) || 0;
  let rent = Number(document.getElementById("rent").value) || 0;
  let expenses = Number(document.getElementById("expenses").value) || 0;

  let totalIncome = income + mha;
  let totalSpent = rent + expenses;
  let remaining = totalIncome - totalSpent;

  let resultEl = document.getElementById("result");
  resultEl.innerText = money(remaining);

  resultEl.className = "neutral";
  if (remaining > 0) resultEl.className = "positive";
  if (remaining < 0) resultEl.className = "negative";
  
  let msg = document.getElementById("message");

 if (remaining > 0) {
    msg.innerText = "You are within budget.";
    msg.className = "good";
  } else if (remaining < 0) {
    msg.innerText = "Warning: You are overspending.";
    msg.className = "bad";
  } else {
    msg.innerText = "You are breaking even.";
    msg.className = "ok";
  }

  let savingsEl = document.getElementById("savings");

if (totalIncome === 0) {
  savingsEl.innerText = "";
} else {
  let rate = Math.round((remaining / totalIncome) * 100);

  if (remaining >= 0) {
    savingsEl.innerText = "Savings Rate: " + rate + "%";
  } else {
    savingsEl.innerText = "Shortfall: " + Math.abs(rate) + "% of income";
  }

let rentAdvice = document.getElementById("rentAdvice");

if (totalIncome === 0) {
  rentAdvice.innerText = "";
} else {
  let rentPct = (rent / totalIncome) * 100;

  if (rentPct > 40) {
    rentAdvice.innerText = "Warning: Rent is above 40% of income.";
    rentAdvice.className = "bad";
  } else if (rentPct > 30) {
    rentAdvice.innerText = "Caution: Rent is moderately high.";
    rentAdvice.className = "ok";
  } else {
    rentAdvice.innerText = "Rent is within a healthy range.";
    rentAdvice.className = "good";
  }
}

}

  document.getElementById("breakdown").innerHTML = `
    <p>Total Income: <strong>${money(totalIncome)}</strong></p>
    <p>Total Spent: <strong>${money(totalSpent)}</strong> (${pct(totalSpent, totalIncome)} of income)</p>
    <p>Rent: <strong>${money(rent)}</strong> (${pct(rent, totalIncome)} of income)</p>
    <p>Other Expenses: <strong>${money(expenses)}</strong> (${pct(expenses, totalIncome)} of income)</p>
  `;
}

function resetAll() {
    document.getElementById("income").value = "";
    document.getElementById("mha").value = "";
    document.getElementById("rent").value = "";
    document.getElementById("expenses").value = "";
    document.getElementById("rentAdvice").innerText = "";

    let resultEl = document.getElementById("result");

    resultEl.innerText = "$0";
    resultEl.className = "neutral";
}


  document.getElementById("message").innerHTML = "";
  document.getElementById("savings").innerText = "";
  document.getElementById("breakdown").innerText = "";
}

// Click handlers
document.getElementById("calcBtn").onclick = calculate;
document.getElementById("resetBtn").onclick = resetAll;

// Press Enter to calculate (from any input)
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calculate();
});
document.getElementById("school").onchange = function() {
    let school = this.value;
    let mhaInput = document.getElementById("mha");

    if (mhaData[school]) {
     mhaInput.value = mhaData[school];

    // Add highlight
     mhaInput.classList.add("highlight");

    // Remove highlight after 1 second
    setTimeout(() => {
      mhaInput.classList.remove("highlight");
    }, 1000);
  }
};




