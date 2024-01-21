"use client";
import Actions from "@/components/actions";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

export default function Home() {
  const account = useAccount();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold center">cirql protocol</h1>
      <p className="text-sm mt-2">
        a vault to enable p2p lending while maximizing yield
      </p>

      <section className="mt-5">
        {account ? (
          <div className="flex-col items-center justify-between">
            <p className="text-sm mt-2 center ml-20 pl-10">
              Your address: {account.address}
            </p>
            <Actions />
          </div>
        ) : (
          <div className="mt-2">
            <ConnectKitButton />
          </div>
        )}
      </section>
    </main>
  );
}
