import { useEffect, useState } from "react";
import api from "../utils/axios";

import { useAuth } from "../context/AuthContext";

import {
  Wallet,
  Calendar,
  IndianRupee,
  Crown,
  Gift,
  ShieldCheck,
  TicketPercent,
  ArrowRight,
  Coins,
} from "lucide-react";


const RideCoins = () => {
  // const { user } = useAuth();
  const { user, refreshProfile } = useAuth();

  const [wallet, setWallet] = useState(null);
const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const fetchWallet = async () => {
//     try {
//       const res = await api.get("/ridecoins");
//       setWallet(res.data);
//     } catch (err) {
//       console.error("Wallet fetch failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchWallet();
// }, []);
useEffect(() => {
  const fetchWallet = async () => {
    try {

      // Refresh latest user
      await refreshProfile();

      const res = await api.get("/ridecoins");

      setWallet(res.data);

    } catch (err) {
      console.error("Wallet fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  fetchWallet();
}, []);


  return (
    <div className="max-w-6xl mx-auto py-10 px-5">

      {/* Heading */}

      <div className="flex items-center gap-5 mb-10">

  {/* <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">

    <Coins
      className="text-yellow-500"
      size={34}
    /> */}
    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">

<Coins
  className="text-yellow-500"
  size={24}
/>

  </div>

  <div>

    {/* <h1 className="text-4xl font-bold text-gray-900"> */}
    <h1 className="text-3xl font-bold text-gray-900">

      RideCoins Wallet

    </h1>

    {/* <p className="text-gray-500 mt-1"> */}
    <p className="text-sm text-gray-500 mt-1">

      Earn RideCoins on every ride and enjoy exclusive rewards.

    </p>

  </div>

</div>

      {/* Balance Card */}

     <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 rounded-3xl shadow-xl p-6 text-white flex justify-between items-center">

  <div>

    {/* <p className="text-lg opacity-80"> */}
    <p className="text-base opacity-80">

      Current Balance

    </p>

    {/* <h2 className="text-6xl font-bold mt-3"> */}
    <h2 className="text-5xl font-bold mt-2">

      {user?.rideCoins ?? 0} RC

    </h2>

    {/* <p className="mt-4 opacity-80"> */}
    <p className="mt-2 text-sm opacity-80">

      1 RideCoin = ₹1

    </p>

  </div>

  <div className="flex items-center gap-6">

    <Wallet size={52} className="opacity-20"/>

    <div className="w-px h-24 bg-white/30"/>

    <div>

      <p className="opacity-80">

        Coins expire in

      </p>

      <h3 className="text-3xl font-bold mt-2">

        90 DAYS

      </h3>

      {/* <p className="opacity-80 mt-2"> */}
      <p className="text-sm opacity-80 mt-1">

        Use before they expire!

      </p>

    </div>

  </div>

</div>

  
      {/* Recent Transactions */}

<div className="bg-white rounded-3xl shadow-lg border border-gray-100 mt-10 p-6">

  {/* Heading */}

  <div className="flex justify-between items-center mb-8">

    <h2 className="text-xl font-bold text-gray-800">

      Recent Transactions

    </h2>

  </div>

  {/* <div className="max-h-72 overflow-y-auto pr-2"> */}
  <div
  className={`${
    wallet?.transactions?.length > 3
      ? "max-h-[255px] overflow-y-auto pr-2 ridecoin-scroll"
      : ""
  }`}
>

  {wallet?.transactions?.length > 0 ? (

    wallet.transactions.map((txn) => (

      <div
        key={txn._id}
        className="flex justify-between items-center py-4 border-b last:border-b-0"
      >

        {/* Left */}

        <div className="flex gap-4 items-center">

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center
            ${
              txn.transactionType === "credit"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >

            <Gift
              size={18}
              className={
                txn.transactionType === "credit"
                  ? "text-green-600"
                  : "text-red-600"
              }
            />

          </div>

          <div>

            <h3 className="font-semibold text-base">

              {txn.reason}

            </h3>

            <p className="text-sm text-gray-500">

              {txn.transactionType === "credit"
                ? "RideCoins credited"
                : "RideCoins redeemed"}

            </p>

          </div>

        </div>

        {/* Date */}

        <div className="text-center text-sm text-gray-500">

          <p>

            {new Date(txn.createdAt).toLocaleDateString()}

          </p>

          <p>

            {new Date(txn.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}

          </p>

        </div>

        {/* Coins */}

        <div className="text-right">

          <h3
            className={`font-bold text-lg ${
              txn.transactionType === "credit"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >

            {txn.transactionType === "credit" ? "+" : "-"}
            {txn.coins} RC

          </h3>

          <p className="text-xs text-gray-400">

            {txn.expiryDate
              ? `Valid till ${new Date(
                  txn.expiryDate
                ).toLocaleDateString()}`
              : "Used for ride payment"}

          </p>

        </div>

      </div>

    ))

  ) : (

    <p className="text-center text-gray-500 py-8">

      No RideCoin transactions yet.

    </p>

  )}

</div>

</div>


{/* RideCoins Rules */}

<div className="bg-white rounded-3xl shadow-lg border border-gray-100 mt-10 p-6">

  {/* Heading */}

  <div className="flex items-center gap-3 mb-8">

    <TicketPercent
      className="text-indigo-600"
      size={18}
    />

    <h2 className="text-2xl font-bold text-gray-800">
      RideCoins Rules
    </h2>

  </div>

  {/* Rules Grid */}

  <div className="grid grid-cols-4 divide-x divide-gray-200">

    {/* Rule 1 */}

    <div className="text-center px-6">

      <IndianRupee
        className="mx-auto text-indigo-600"
        size={36}
      />

      <p className="mt-5 text-gray-700">

        1 RideCoin = ₹1

      </p>

    </div>

    {/* Rule 2 */}

    <div className="text-center px-6">

      <Calendar
        className="mx-auto text-indigo-600"
        size={36}
      />

      <p className="mt-5 text-gray-700">

        Coins expire after

      </p>

      <h4 className="font-bold text-lg">

        90 Days

      </h4>

    </div>

    {/* Rule 3 */}

    <div className="text-center px-6">

      <TicketPercent
        className="mx-auto text-indigo-600"
        size={36}
      />

      <p className="mt-5 text-gray-700">

        Normal users redeem

      </p>

      <h4 className="font-bold">

        Up to 30%

      </h4>

    </div>

    {/* Rule 4 */}

    <div className="text-center px-6">

      <Crown
        className="mx-auto text-indigo-600"
        size={36}
      />

      <p className="mt-5 text-gray-700">

        Premium users redeem

      </p>

      <h4 className="font-bold">

        Up to 50%

      </h4>

    </div>

  </div>

</div>

{/* Feature Cards */}

<div className="grid md:grid-cols-3 gap-6 mt-10">

  {/* Premium */}

  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">

    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mb-6">

      <Crown
        className="text-white"
        size={30}
      />

    </div>

    <h3 className="text-2xl font-bold">

      Premium Membership

    </h3>

    <p className="mt-4 text-gray-500 leading-7">

      Premium users earn double RideCoins and can redeem up to
      50% of every ride fare.

    </p>

    <button className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition">

      Coming Soon

    </button>

  </div>

  {/* Refer */}

  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">

    <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-6">

      <Gift
        className="text-white"
        size={30}
      />

    </div>

    <h3 className="text-2xl font-bold">

      Refer & Earn

    </h3>

    <p className="mt-4 text-gray-500 leading-7">

      Invite your friends to RideShare and receive bonus
      RideCoins after they complete their first ride.

    </p>

    <button className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition">

      Coming Soon

    </button>

  </div>

  {/* Offers */}

  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">

    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-6">

      <TicketPercent
        className="text-white"
        size={30}
      />

    </div>

    <h3 className="text-2xl font-bold">

      Special Offers

    </h3>

    <p className="mt-4 text-gray-500 leading-7">

      Exciting RideCoin cashback campaigns, seasonal bonuses,
      and exclusive promotions are coming soon.

    </p>

    <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition">

      Coming Soon

    </button>

  </div>

</div>

{/* Safe & Secure */}

<div className="mt-10 rounded-3xl bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-100 p-6 flex items-center justify-between">

  <div className="flex items-center gap-5">

    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">

      <ShieldCheck
        className="text-indigo-600"
        size={34}
      />

    </div>

    <div>

      <h3 className="text-2xl font-bold text-gray-800">

        Safe & Secure

      </h3>

      <p className="text-gray-500 mt-2">

        Your RideCoins are securely stored and can only be
        redeemed for eligible RideShare payments.

      </p>

    </div>

  </div>

  <ShieldCheck
    size={90}
    className="text-indigo-100 hidden md:block"
  />

</div>

    </div>
  );
};

export default RideCoins;