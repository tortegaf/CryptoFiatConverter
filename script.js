document.getElementById("from-amount").addEventListener("input", async () => {
  const fromCurrency = document
    .getElementById("from-currency")
    .value.toUpperCase();
  const toCurrency = document.getElementById("to-currency").value.toUpperCase();
  const amount = parseFloat(document.getElementById("from-amount").value);

  if (!fromCurrency || !toCurrency || isNaN(amount)) {
    document.getElementById("to-amount").value = "";
    return;
  }

  let result = 0;

  try {
    if (isFiat(fromCurrency) && isFiat(toCurrency)) {
      result = await convertFiatToFiat(fromCurrency, toCurrency, amount);
    } else if (!isFiat(fromCurrency) && !isFiat(toCurrency)) {
      result = await convertCryptoToCrypto(fromCurrency, toCurrency, amount);
    } else {
      result = await convertBetweenFiatAndCrypto(
        fromCurrency,
        toCurrency,
        amount
      );
    }

    const formattedResult = formatResult(result);
    document.getElementById("to-amount").value = formattedResult;
  } catch (error) {
    document.getElementById("to-amount").value = `Error: ${error.message}`;
  }
});

function isFiat(currency) {
  return currency.length === 3;
}

async function convertFiatToFiat(fromCurrency, toCurrency, amount) {
  const apiKey = "2001CA4C-3D17-47FE-8162-809E92CFA51C";
  const response = await fetch(
    `https://rest.coinapi.io/v1/exchangerate/${fromCurrency}/${toCurrency}?apikey=${apiKey}`
  );
  const data = await response.json();

  if (response.ok && data.rate) {
    return amount * data.rate;
  } else {
    throw new Error(
      `Error retrieving exchange rate: ${data.error || "Unknown error"}`
    );
  }
}

async function convertCryptoToCrypto(fromCurrency, toCurrency, amount) {
  const apiKey = "2001CA4C-3D17-47FE-8162-809E92CFA51C";
  const response = await fetch(
    `https://rest.coinapi.io/v1/exchangerate/${fromCurrency}/${toCurrency}?apikey=${apiKey}`
  );
  const data = await response.json();
  return amount * data.rate;
}

async function convertBetweenFiatAndCrypto(fromCurrency, toCurrency, amount) {
  if (isFiat(fromCurrency)) {
    const fiatToCrypto = await convertFiatToFiat(fromCurrency, "USD", amount);
    return await convertCryptoToCrypto("BTC", toCurrency, fiatToCrypto);
  } else {
    const cryptoToFiat = await convertCryptoToCrypto(
      fromCurrency,
      "BTC",
      amount
    );
    return await convertFiatToFiat("USD", toCurrency, cryptoToFiat);
  }
}

function formatResult(result) {
  const strResult = result.toString();
  let formattedResult;

  if (strResult.includes("e+")) {
    const [base, exponent] = strResult.split("e+");
    formattedResult = `${base} × 10^${exponent}`;
  } else if (strResult.length > 20) {
    formattedResult = strResult.slice(0, 20);
  } else {
    formattedResult = strResult;
  }

  return formattedResult;
}
