import { createContext, useContext, useState, useEffect } from "react";

export type CountryMode = "tn" | "int";

interface CountryModeContextValue {
  mode: CountryMode;
  setMode: (m: CountryMode) => void;
  isTunisia: boolean;
}

const LS_KEY = "hydroscan_country_mode";

const CountryModeContext = createContext<CountryModeContextValue>({
  mode: "tn",
  setMode: () => {},
  isTunisia: true,
});

export function CountryModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<CountryMode>(() => {
    const stored = localStorage.getItem(LS_KEY);
    return stored === "int" ? "int" : "tn";
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, mode);
  }, [mode]);

  function setMode(m: CountryMode) {
    setModeState(m);
  }

  return (
    <CountryModeContext.Provider value={{ mode, setMode, isTunisia: mode === "tn" }}>
      {children}
    </CountryModeContext.Provider>
  );
}

export function useCountryMode() {
  return useContext(CountryModeContext);
}
