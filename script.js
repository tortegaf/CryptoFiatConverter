document.addEventListener("DOMContentLoaded", () => {
  populateCurrencySelectors();
});

document
  .getElementById("from-amount")
  .addEventListener("input", () => convertCurrency("from"));
document
  .getElementById("to-amount")
  .addEventListener("input", () => convertCurrency("to"));
document
  .getElementById("from-currency")
  .addEventListener("change", () => convertCurrency("from"));
document
  .getElementById("to-currency")
  .addEventListener("change", () => convertCurrency("to"));

async function populateCurrencySelectors() {
  const apiKey = "fddfd8da0235038e086e6be0";
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/codes`
  );
  const data = await response.json();

  if (response.ok && data.supported_codes) {
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    data.supported_codes.forEach(([currencyCode, currencyName]) => {
      const optionElement = document.createElement("option");
      optionElement.value = currencyCode;
      optionElement.text = `${currencyCode} - ${currencyName}`;
      fromCurrencySelect.appendChild(optionElement.cloneNode(true));
      toCurrencySelect.appendChild(optionElement);
    });

    fromCurrencySelect.value = "USD";
    toCurrencySelect.value = "EUR";
  } else {
    console.error("Failed to retrieve currency codes:", data.error);
  }
}

async function convertCurrency(direction) {
  const fromCurrency = document.getElementById("from-currency").value;
  const toCurrency = document.getElementById("to-currency").value;
  const fromAmount = parseFloat(document.getElementById("from-amount").value);
  const toAmount = parseFloat(document.getElementById("to-amount").value);

  if (direction === "from" && !isNaN(fromAmount)) {
    const result = await convertFiatToFiat(
      fromCurrency,
      toCurrency,
      fromAmount
    );
    document.getElementById("to-amount").value = formatResult(result);
  } else if (direction === "to" && !isNaN(toAmount)) {
    const result = await convertFiatToFiat(toCurrency, fromCurrency, toAmount);
    document.getElementById("from-amount").value = formatResult(result);
  }
}

async function convertFiatToFiat(fromCurrency, toCurrency, amount) {
  const apiKey = "fddfd8da0235038e086e6be0";
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}`
  );
  const data = await response.json();

  if (response.ok && data.conversion_rate) {
    return amount * data.conversion_rate;
  } else {
    throw new Error(data.error || "Unknown error");
  }
}

function formatResult(result) {
  const strResult = result.toString();
  return strResult.length > 20 ? strResult.slice(0, 20) : strResult;
}

document.addEventListener("DOMContentLoaded", function () {
  const themeToggleButton = document.getElementById("theme-toggle");

  const currentTheme = localStorage.getItem("theme") || "light-mode";
  document.body.classList.add(currentTheme);

  themeToggleButton.textContent = currentTheme === "dark-mode" ? "🌙" : "☀️";

  themeToggleButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");

    const newTheme = document.body.classList.contains("dark-mode")
      ? "dark-mode"
      : "light-mode";
    localStorage.setItem("theme", newTheme);

    this.textContent = newTheme === "dark-mode" ? "🌙" : "☀️";
  });
});
