package com.example.android.currency.currencyconverter;

import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import android.os.Handler;
import android.os.Looper;

public class MainActivity extends AppCompatActivity {
  private EditText amountEditText;
  private Spinner fromSpinner, toSpinner;
  private TextView resultTextView;
  private Button convertButton, resetButton, mapButton;
  private ArrayList<Currency> currencies;
  private ArrayAdapter<String> currencyAdapter;
  private HashMap<String, Double> currencyRates;
  private ArrayList<String> currencyCodes = new ArrayList<>();

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    initializeViews();
    fetchCurrencyData();
    setupButtonListeners();
  }

  private void initializeViews() {
    amountEditText = findViewById(R.id.amountEditText);
    fromSpinner = findViewById(R.id.fromSpinner);
    toSpinner = findViewById(R.id.toSpinner);
    resultTextView = findViewById(R.id.resultTextView);
    convertButton = findViewById(R.id.convertButton);
    resetButton = findViewById(R.id.resetButton);
    mapButton = findViewById(R.id.mapButton);
  }

  private void fetchCurrencyData() {
    currencies = new ArrayList<>();
    currencyRates = new HashMap<>();

    // Add PLN as base currency
    currencies.add(new Currency("PLN", "Polish Zloty", 1.0));
    currencyRates.put("PLN", 1.0);

    new Thread(() -> {
      try {
        URL url = new URL("https://api.nbp.pl/api/exchangerates/tables/a/?format=json");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        BufferedReader reader = new BufferedReader(
            new InputStreamReader(conn.getInputStream())
        );
        StringBuilder response = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
          response.append(line);
        }
        reader.close();

        JSONArray jsonArray = new JSONArray(response.toString());
        JSONObject table = jsonArray.getJSONObject(0);
        JSONArray rates = table.getJSONArray("rates");

        for (int i = 0; i < rates.length(); i++) {
          JSONObject rate = rates.getJSONObject(i);
          String code = rate.getString("code");
          String currency = rate.getString("currency");
          double mid = rate.getDouble("mid");

          Currency curr = new Currency(code, currency, mid);
          currencies.add(curr);
          currencyRates.put(code, mid);
        }

        new Handler(Looper.getMainLooper()).post(this::setupSpinners);

      } catch (Exception e) {
        e.printStackTrace();
        new Handler(Looper.getMainLooper()).post(() ->
            Toast.makeText(MainActivity.this,
                "Error fetching currency data",
                Toast.LENGTH_LONG).show()
        );
      }
    }).start();
  }

  private void setupSpinners() {
    for (Currency currency : currencies) {
      currencyCodes.add(currency.getCode());
    }

    currencyAdapter = new ArrayAdapter<>(
        this,
        android.R.layout.simple_spinner_item,
        currencyCodes
    );
    currencyAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

    fromSpinner.setAdapter(currencyAdapter);
    toSpinner.setAdapter(currencyAdapter);

    // Set default selections to PLN and EUR
    fromSpinner.setSelection(currencyCodes.indexOf("PLN"));
    toSpinner.setSelection(currencyCodes.indexOf("EUR"));
  }

  private void setupButtonListeners() {
    convertButton.setOnClickListener(v -> convertCurrency());
    resetButton.setOnClickListener(v -> resetFields());
  }

  private void convertCurrency() {
    try {
      double amount = Double.parseDouble(amountEditText.getText().toString());
      String fromCurrency = fromSpinner.getSelectedItem().toString();
      String toCurrency = toSpinner.getSelectedItem().toString();

      double fromRate = currencyRates.get(fromCurrency);
      double toRate = currencyRates.get(toCurrency);
      double result = amount * (toRate / fromRate);

      resultTextView.setText(String.format("%.2f %s", result, toCurrency));
    } catch (NumberFormatException e) {
      Toast.makeText(this, "Please enter a valid amount", Toast.LENGTH_SHORT).show();
    }
  }

  private void resetFields() {
    amountEditText.setText("");
    fromSpinner.setSelection(currencyCodes.indexOf("PLN"));
    toSpinner.setSelection(currencyCodes.indexOf("EUR"));
    resultTextView.setText("0.00");
  }
}