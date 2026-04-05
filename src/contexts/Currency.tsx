import { createContext, useContext, useState, useEffect } from "react";

export type Currency = "DT" | "EUR" | "USD";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amountDT: number, decimals?: number) => string;
  convert: (amountDT: number) => number;
  symbol: string;
}

const RATES: Record<Currency, number> = {
  DT:  1,
  EUR: 0.30,
  USD: 0.33,
};

const SYMBOLS: Record<Currency, string> = {
  DT:  "DT",
  EUR: "€",
  USD: "$",
};

const LS_KEY = "hydroscan_currency";

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "DT",
  setCurrency: () => {},
  format: (n) => `${n.toLocaleString("fr-FR")} DT`,
  convert: (n) => n,
  symbol: "DT",
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(LS_KEY);
    return (stored as Currency) || "DT";
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, currency);
  }, [currency]);

  function convert(amountDT: number) {
    return amountDT * RATES[currency];
  }

  function format(amountDT: number, decimals = 0) {
    const val = convert(amountDT);
    const locale = currency === "DT" ? "fr-FR" : "en-US";
    return `${val.toLocaleString(locale, { maximumFractionDigits: decimals })} ${SYMBOLS[currency]}`;
  }

  function setCurrency(c: Currency) {
    setCurrencyState(c);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, convert, symbol: SYMBOLS[currency] }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
