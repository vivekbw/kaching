"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }
});

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="light">
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </NextThemeProvider>
  );
} 