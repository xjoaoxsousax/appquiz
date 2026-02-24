import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" });

export const metadata: Metadata = {
  title: "Passar no Código | Simulador Oficial",
  description: "Treine para o seu exame de condução com a melhor plataforma de testes de Portugal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${lexend.variable} font-sans antialiased text-slate-900 bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}
