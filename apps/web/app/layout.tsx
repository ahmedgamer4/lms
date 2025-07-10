import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/components/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { Noto_Sans_Arabic, Rubik } from "next/font/google";

const noto = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto",
});

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Next LMS",
  description: "Next LMS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <ReactQueryProvider>
      <html dir={dir} lang={locale} suppressHydrationWarning>
        <body className={`${noto.variable} ${rubik.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider locale={locale}>
              {children}
            </NextIntlClientProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
