import api from "./api";

export const getOwnerRentalBookings = async () => {
  const response = await api.get(
    "/rental-bookings/owner"
  );

  return response.data;
};