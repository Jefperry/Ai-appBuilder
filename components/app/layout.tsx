import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./providers";
import "./global.css";

export const metadata: Metadata = {
  title: "CodeCraft - Turn Ideas Into Code",
  description: "AI-powered collaborative code generation. Build apps at the speed of thought.",
};

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} antialiased dark`}>
      <head>
        <link
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>"
          rel="icon"
          type="image/svg+xml"
        />
      </head>
      <body
        className={`font-sans absolute antialiased inset-0 text-white flex justify-center items-center bg-craft-bg`}
      >
        <Providers>
          <div className="flex h-full w-full overflow-hidden font-sans">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}