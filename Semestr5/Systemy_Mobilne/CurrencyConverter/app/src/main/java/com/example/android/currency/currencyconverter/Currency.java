package com.example.android.currency.currencyconverter;

public class Currency {
  private String code;
  private String name;
  private double rate;

  public Currency(String code, String name, double rate) {
    this.code = code;
    this.name = name;
    this.rate = rate;
  }

  public String getCode() {
    return code;
  }

  public String getName() {
    return name;
  }

  public double getRate() {
    return rate;
  }
}

