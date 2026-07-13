export default function RentalStats() {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-5">

      {/* Header */}

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-lg font-bold text-gray-900">
            Rental Dashboard
          </h2>

          <p className="text-xs text-gray-500">
            Overview of your rental business
          </p>

        </div>

        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl">
          📊
        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 gap-3">

        {/* Vehicles */}

        <div className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition">

          <div className="flex justify-between items-center">

            <span className="text-2xl">
              🚗
            </span>

            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Active
            </span>

          </div>

          <h3 className="text-2xl font-bold mt-4">
            0
          </h3>

          <p className="text-sm text-gray-500">
            Vehicles Listed
          </p>

        </div>

        {/* Bookings */}

        <div className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition">

          <div className="flex justify-between items-center">

            <span className="text-2xl">
              📅
            </span>

            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Total
            </span>

          </div>

          <h3 className="text-2xl font-bold mt-4">
            0
          </h3>

          <p className="text-sm text-gray-500">
            Total Bookings
          </p>

        </div>

        {/* Earnings */}

        <div className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition">

          <div className="flex justify-between items-center">

            <span className="text-2xl">
              💰
            </span>

            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              This Month
            </span>

          </div>

          <h3 className="text-2xl font-bold mt-4">
            ₹0
          </h3>

          <p className="text-sm text-gray-500">
            Earnings
          </p>

        </div>

        {/* Rating */}

        <div className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition">

          <div className="flex justify-between items-center">

            <span className="text-2xl">
              ⭐
            </span>

            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              Average
            </span>

          </div>

          <h3 className="text-2xl font-bold mt-4">
            0.0
          </h3>

          <p className="text-sm text-gray-500">
            Rating
          </p>

        </div>

      </div>

    </div>
  );
}