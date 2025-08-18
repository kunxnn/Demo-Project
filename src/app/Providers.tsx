"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-bai-jamjuree), sans-serif",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
