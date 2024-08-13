const fiatApiKey = "fddfd8da0235038e086e6be0"; // Clave de ExchangeRateAPI

async function convertCurrency() {
  const amount = document.getElementById("amount").value;
  const fromCurrency = document.getElementById("fromCurrency").value;
  const toCurrency = document.getElementById("toCurrency").value;

  if (
    fromCurrency !== "BTC" &&
    fromCurrency !== "ETH" &&
    toCurrency !== "BTC" &&
    toCurrency !== "ETH"
  ) {
    // Lógica para monedas fiat usando ExchangeRateAPI
    const url = `https://v6.exchangerate-api.com/v6/${fiatApiKey}/latest/${fromCurrency}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const rate = data.rates[toCurrency];
      const result = amount * rate;
      document.getElementById(
        "result"
      ).textContent = `${amount} ${fromCurrency} = ${result.toFixed(
        2
      )} ${toCurrency}`;
    } catch (error) {
      document.getElementById("result").textContent =
        "Error fetching the exchange rate.";
    }
  } else {
    document.getElementById("result").textContent =
      "Conversion between fiat and crypto not yet implemented.";
  }
}
