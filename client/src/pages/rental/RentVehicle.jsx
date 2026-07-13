import { useState } from "react";

import VehicleForm from "./components/VehicleForm";
import ListedVehicles from "./components/ListedVehicles";
import RegisteredVehicles from "./components/RegisteredVehicles";

export default function RentVehicle() {

  const [editingVehicle, setEditingVehicle] = useState(null);

  const [refresh, setRefresh] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const refreshVehicles = () => {
    setRefresh(!refresh);
  };

  return (

    <div className="max-w-7xl mx-auto py-8 px-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            Create Rental Listing

          </h1>

          <p className="text-gray-500 mt-2">

            Enter the vehicle information below to publish it for rental.

          </p>

        </div>

      </div>

      {/* MAIN */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="lg:col-span-2">

          <VehicleForm

            editingVehicle={editingVehicle}

            setEditingVehicle={setEditingVehicle}

            refreshVehicles={refreshVehicles}

             selectedVehicle={selectedVehicle}

          />

        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          {/* <ListedVehicles

            refresh={refresh}

            setEditingVehicle={setEditingVehicle}

          /> */}
          <ListedVehicles
  refresh={refresh}
  refreshVehicles={refreshVehicles}
  setEditingVehicle={setEditingVehicle}
/>

          {/* <RegisteredVehicles /> */}
          {/* <RegisteredVehicles
  setSelectedVehicle={setSelectedVehicle}
/> */}
<RegisteredVehicles
  refresh={refresh}
  setSelectedVehicle={setSelectedVehicle}
/>

        </div>

      </div>

    </div>

  );

}