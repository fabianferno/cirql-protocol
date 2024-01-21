export default function Actions() {
  return (
    <div className="flex justify-between mt-2">
      <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl">
        Approve
      </button>
      <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl">
        Deposit
      </button>
      <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl">
        Lend
      </button>
      <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl">
        Borrow
      </button>
    </div>
  );
}
