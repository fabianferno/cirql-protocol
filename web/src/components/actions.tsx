import {
  CirqlContractAddress,
  CirqlContractABI,
  DAI_address,
  ERC20ABI,
  PoolAddress,
  PoolABI,
} from "@/utils/constants";
import { useContractWrite, useAccount } from "wagmi";

export default function Actions() {
  const account = useAccount();
  const {
    write: approve,
    isLoading: approveLoading,
    isError: approveError,
    data: approveData,
  } = useContractWrite({
    address: DAI_address,
    abi: ERC20ABI,
    functionName: "approve",
    args: [
      account.address,
      // A very large number
      11579208923731619542357098500868,
    ],
  });

  const {
    write: deposit,
    isLoading: depositLoading,
    isError: depositError,
    data: depositData,
  } = useContractWrite({
    address: CirqlContractAddress,
    abi: CirqlContractABI,
    functionName: "_deposit",
    args: [
      // Amt of assets
      100,
    ],
  });

  const {
    write: lend,
    isLoading: lendLoading,
    isError: lendError,
    data: lendData,
  } = useContractWrite({
    address: CirqlContractAddress,
    abi: CirqlContractABI,
    functionName: "_lend",
    args: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", 10],
  });

  const {
    write: borrow,
    isLoading: borrowLoading,
    isError: borrowError,
    data: borrowData,
  } = useContractWrite({
    address: PoolAddress,
    abi: PoolABI,
    functionName: "borrow",
    args: [DAI_address, 10, 2, 0, CirqlContractAddress],
  });

  return (
    <div className="flex justify-between mt-2">
      <button
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl"
        onClick={() => {
          approveLoading ? () => {} : approve();
        }}
      >
        Approve
      </button>
      <button
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl"
        onClick={
          depositLoading
            ? () => {}
            : () => {
                deposit();
              }
        }
      >
        Deposit (100 DAI)
      </button>
      <button
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl"
        onClick={
          lendLoading
            ? () => {}
            : () => {
                lend();
              }
        }
      >
        Lend to Vitalik (10 DAI)
      </button>
      <button
        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl"
        onClick={
          borrowLoading
            ? () => {}
            : () => {
                borrow();
              }
        }
      >
        Borrow (10 DAI)
      </button>
    </div>
  );
}
