"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { sepolia } from "wagmi/chains";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.ALCHEMY_ID || "", // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || "",

    // Required
    appName: "Cirql Protocol",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)

    chains: [sepolia],
  })
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <body className={inter.className}>{children}</body>
        </ConnectKitProvider>
      </WagmiConfig>
    </html>
  );
}
