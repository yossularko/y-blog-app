import Layout from "@/components/layout";
import AuthProvider from "@/store/AuthContext";
import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export default function App({ Component, pageProps }: AppProps) {
  const { isCustomLayout } = pageProps;
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          font-family: ${inter.style.fontFamily}, sans-serif;
        }`,
        }}
      />
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Layout isCustomLayout={isCustomLayout}>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}
