import Image from "next/image";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { CardanoWallet } from "@meshsdk/react";
import { useWallet, useAddress, useLovelace } from "@meshsdk/react";

export default function Home() {
  const { connected, disconnect } = useWallet();
  const [view, setView] = useState(0);
  const myAddress = useAddress();
  const rawBalance = useLovelace();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const [dataNetwork, setDataNetwork] = useState({
    supply: {
      max: "",
      total: "",
      circulating: "",
      locked: "",
      treasury: "",
      reserves: "",
    },
    stake: {
      live: "",
      active: "",
    },
  });

  const [dataBlock, setDataBlock] = useState({
    time: "",
    height: "",
    hash: "",
    slot: "",
    epoch: "",
    epoch_slot: "",
    slot_leader: "",
    size: "",
    tx_count: "",
    output: "",
    fees: "",
    block_vrf: "",
    op_cert: "",
    op_cert_counter: "",
    previous_block: "",
    next_block: "",
    confirmations: "",
  });

  const [victimBalance, setVictimBalance] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataNetwork = async () => {
      try {
        const response = await fetch("/api/network");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("NETWORK", data);
        setDataNetwork(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    const fetchDataBlock = async () => {
      try {
        const response = await fetch("/api/block");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("BLOCK", data);
        setDataBlock(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchDataNetwork();
    fetchDataBlock();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (!address) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/address/${address}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("VICTIM", data.amount[0].quantity);
      setVictimBalance(data.amount[0].quantity);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen">
      {/* NAVBAR */}
      <div className="bg-slate-800 opacity-80 border border-black py-6 px-12 flex justify-between items-center">
        <div className="flex justify-center items-center gap-8">
          <div className="flex justify-center items-center">
            <Image
              src={"/image1.png"}
              alt="picture"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <div className="text-white text-center">
            <h1 className="text-6xl font-bold">TFT-PROGRAM</h1>
            <p className="text-3xl semibold">(Coding Challenge)</p>
          </div>
        </div>
        <CardanoWallet />
      </div>

      {!connected ? (
        <div className="mt-24 flex justify-center items-center">
          <Image
            src={"/image2.png"}
            alt="picture"
            width={300}
            height={300}
            className="rounded-full"
          />
        </div>
      ) : (
        // SIDEBAR
        <div className="flex justify-center items-center">
          <div className="py-6 px-12 border-r border-black w-1/4 h-screen flex flex-col gap-6">
            <button
              className="text-3xl hover:font-bold"
              onClick={() => {
                setView(0);
              }}
            >
              Walletku
            </button>
            <button
              className="text-3xl hover:font-bold"
              onClick={() => {
                setView(1);
              }}
            >
              Kepoin Temenku
            </button>
            <button
              className="text-3xl hover:font-bold"
              onClick={() => {
                setView(2);
              }}
            >
              Kepoin Cardano
            </button>
            <button
              className="text-3xl hover:font-bold text-red-500"
              onClick={() => {
                setView(0);
                disconnect();
              }}
            >
              Logout
            </button>
          </div>
          <div className="py-6 px-12 w-3/4 h-screen">
            {view === 0 && (
              <>
                <div className="bg-slate-500 p-4 rounded-xl text-white mb-4">
                  <p>My-Address: {myAddress}</p>
                </div>
                <div className="bg-slate-500 p-4 rounded-xl text-white">
                  <p>My-Balance: {rawBalance} Lovelace</p>
                </div>
              </>
            )}
            {view === 1 && (
              <div>
                <div className="flex justify-between items-center gap-4 mb-4">
                  <input
                    className="bg-slate-200 rounded-xl py-2 px-3 border border-black font-semibold w-full"
                    type="text"
                    placeholder="Enter the victim's address"
                    onChange={handleChange}
                  />
                  <button
                    onClick={handleClick}
                    disabled={loading}
                    className="bg-red-700 hover:bg-red-500 py-2 px-3 rounded-xl font-semibold text-white"
                  >
                    {loading ? "Loading..." : "Execute"}
                  </button>
                </div>
                <div className="bg-slate-500 p-4 rounded-xl text-white">
                  <p>
                    {"Victim's Balance:"} {victimBalance} Lovelace
                  </p>
                </div>
              </div>
            )}
            {view === 2 && (
              <div>
                <div className="bg-slate-500 p-4 rounded-xl text-white mb-4">
                  {error && <p>Error: {error}</p>}
                  {!dataNetwork && <p>Loading...</p>}
                  {dataNetwork && (
                    <div>
                      <p>Reserve: {dataNetwork.supply.reserves} Lovelace</p>
                      <p>Treasury: {dataNetwork.supply.treasury} Lovelace</p>
                    </div>
                  )}
                </div>
                <div className="bg-slate-500 p-4 rounded-xl text-white">
                  {error && <p>Error: {error}</p>}
                  {dataBlock && (
                    <div>
                      <p>Block: {dataBlock.height}</p>
                      <p>Previous Block: {dataBlock.previous_block}</p>
                      <p>Hash Block: {dataBlock.previous_block}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
