import api from "./api";

// ==========================
// CREATE RENTAL VEHICLE
// ==========================

// export const createRentalVehicle = async (vehicleData) => {
//   const response = await api.post("/rental-vehicles", vehicleData);
//   return response.data;
// };

// ==========================
// GET MY RENTAL VEHICLES
// ==========================

export const getMyRentalVehicles = async () => {
  const response = await api.get("/rental-vehicles/my");
  return response.data;
};

// ==========================
// UPDATE RENTAL VEHICLE
// ==========================

// export const updateRentalVehicle = async (id, vehicleData) => {
//   const response = await api.put(
//     `/rental-vehicles/${id}`,
//     vehicleData
//   );

//   return response.data;
// };
export const createRentalVehicle = async (vehicleData) => {

  const response = await api.post(
    "/rental-vehicles",
    vehicleData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateRentalVehicle = async (
  id,
  vehicleData
) => {

  const response = await api.put(
    `/rental-vehicles/${id}`,
    vehicleData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ==========================
// DELETE RENTAL VEHICLE
// ==========================

export const deleteRentalVehicle = async (id) => {
  const response = await api.delete(
    `/rental-vehicles/${id}`
  );

  return response.data;
};
// ==========================
// TOGGLE VEHICLE STATUS
// ==========================

export const toggleRentalVehicleStatus = async (id) => {
  const response = await api.put(
    `/rental-vehicles/toggle/${id}`
  );

  return response.data;
};