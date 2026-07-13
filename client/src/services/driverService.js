import api from "./api";

// =====================================
// GET DRIVER REGISTERED VEHICLES
// =====================================

export const getMyRegisteredVehicles = async () => {
  const response = await api.get("/driver/vehicles");

  return response.data;
};