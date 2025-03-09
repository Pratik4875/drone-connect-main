/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/api";
import { LoginType } from "@/types/login";
import { RegisterType } from "@/types/register";
import { SocialInput } from "@/types/socials";

export const loginUser = async (data: LoginType) => {
  try {
    const response = await api.post("/user/login", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendRegisterOTP = async (data: { email: string }) => {
  try {
    const response = await api.post("/user/sendotp", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (data: { email: string; otp: string }) => {
  console.log("working in verify otp");

  try {
    const response = await api.post("/user/verifyotp", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (data: RegisterType) => {
  try {
    const response = await api.post("/user/register", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendForgotOTP = async (data: { email: string }) => {
  try {
    const response = await api.post("/user/fpcheckemail", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ForgotPassword = async (data: {
  email: string;
  otp: string;
  password: string;
}) => {
  try {
    const response = await api.post("/user/resetpassword", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CheckUserLogin = async () => {
  try {
    const response = await api.get("/user/get-user", { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post(
      "/user/logout",
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const profileImageUpdate = async (data: { image: File }) => {
  try {
    const response = await api.post("/user/update-profile", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const profileGeneralInfoUpdate = async (data: any) => {
  try {
    const response = await api.put("/user/update-general-profile", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const profilePasswordUpdate = async (data: any) => {
  try {
    const response = await api.put("/user/update-password-profile", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserCompany = async () => {
  try {
    const response = await api.get("/user/company", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const companyDetailsUpdate = async (data: any) => {
  try {
    const response = await api.put("/user/update-company-details", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const companyLogoUpdate = async (data: { image: File }) => {
  try {
    const response = await api.post("/user/update-company-logo", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPilotDetails = async () => {
  try {
    const response = await api.get("/user/pilot", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPilotSocials = async () => {
  try {
    const response = await api.get("/user/socials", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPilotSocials = async (data: SocialInput) => {
  try {
    const response = await api.post("/user/socials", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePilotSocials = async (data: SocialInput) => {
  try {
    const response = await api.put("/user/socials", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePilotSocials = async (platform: string) => {
  try {
    const response = await api.delete("/user/socials", {
      data: { platform }, // Sending the platform in the request body
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPilotCertificate = async () => {
  try {
    const response = await api.get("/user/certificate", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePilotProfessional = async (data: any) => {
  try {
    const response = await api.put(`/user/update-professional-details`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPilotCertificate = async (data: any) => {
  try {
    const response = await api.post("/user/certificate", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePilotCertificate = async (data: any) => {
  try {
    const response = await api.put(`/user/certificate`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePilotCertificate = async (certificateId: string) => {
  try {
    const response = await api.delete(`/user/certificate`, {
      data: { certificateId: certificateId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPilotExperience = async () => {
  try {
    const response = await api.get("/user/expereince", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPilotExperience = async (data: any) => {
  try {
    const response = await api.post("/user/expereince", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePilotExperience = async (data: any) => {
  try {
    const response = await api.put(`/user/expereince`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePilotExperience = async (expereinceId: string) => {
  try {
    const response = await api.delete(`/user/expereince`, {
      data: { experience_id: expereinceId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const leaveCompany = async (company_id: string) => {
  try {
    const response = await api.post(
      "/user/leave-company",
      { company_id: company_id },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPost = async (data: any) => {
  try {
    const response = await api.post("/post/create", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllPost = async ({ pageParam = 1 }) => {
  try {
    const { data } = await api.get(`/post/posts?page=${pageParam}&limit=10`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (id: string) => {
  try {
    const response = await api.get(`/user/user_profile/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postID: string) => {
  try {
    const response = await api.delete(`/post/delete/${postID}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPost = async (id: string) => {
  try {
    const response = await api.get(`/post/posts/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (data: any) => {
  try {
    const response = await api.put(`/post/update/${data.postId}`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserAllPost = async (id: string, pageParam: number) => {
  try {
    const response = await api.get(`/post/${id}?page=${pageParam}&limit=10`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllPilots = async ({
  pageParam = 1,
  searchTerm = "",
  available = "yes",
  companyPilots = "no",
  selectedState = "",
  selectedCity = "",
  selectedDistrict = "",
  selectedPincode = "",
  selectedCategory = "",
}: any) => {
  try {
    const response = await api.get(`/pilot`, {
      params: {
        page: pageParam,
        limit: 20,
        name: searchTerm, // Include search term in query params
        available, // Add availability filter
        company_pilot: companyPilots, // Add company filter
        state: selectedState, // Add state filter
        city: selectedCity, // Add city filter
        district: selectedDistrict, // Add district filter
        pincode: selectedPincode, // Add pincode filter
        drone_category: selectedCategory,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllEvents = async ({
  pageParam = 1,
  searchTerm = "",
  selectedState = "",
  selectedCity = "",
}: any) => {
  try {
    const response = await api.get(`/event`, {
      params: {
        page: pageParam,
        limit: 20,
        name: searchTerm, // Include search term in query params
        state: selectedState, // Add state filter
        city: selectedCity, // Add city filter
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addEvent = async (data: any) => {
  try {
    const response = await api.post("/event/create", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserEvent = async (id: string) => {
  try {
    const response = await api.get(`/event/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEvent = async (data: any) => {
  try {
    const response = await api.put(`/event/update/${data.eventId}`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const response = await api.delete(`/event/delete/${eventId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompanyProfile = async (id: string) => {
  try {
    const response = await api.get(`/company/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllCompanyPilots = async ({
  pageParam,
  searchTerm = "",
  selectedCategory = "",
  id,
}: any) => {
  console.log("page params", pageParam);

  try {
    const response = await api.get(`/company/pilots/${id}`, {
      params: {
        page: pageParam,
        limit: 10,
        search: searchTerm, // Include search term in query params
        category: selectedCategory === "all" ? "" : selectedCategory,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPilotCompany = async (data: any) => {
  try {
    const response = await api.post(
      `/company/${data.id}/add-pilot`,
      { name: data.name, email: data.email },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPilotByEmail = async (email: string) => {
  try {
    const response = await api.get(`/company/pilot/${email}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPilotToCompany = async ({
  id,
  email,
}: {
  id: string;
  email: string;
}) => {  
  const response = await api.post(
    `/company/${id}/add-existing-pilot`,
    { email },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const deletePilotCompany = async (user_id: string) => {
  try {
    const response = await api.delete(`/company/delete-pilot/${user_id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBooking = async (data: any) => {
  try {
    const response = await api.post(`/booking/create`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getUserBookingTitles = async () => {
  try {
    const response = await api.get(`/booking/get-booking-title`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface GetBookingsParams {
  status?: string;
  title?: string;
  page?: number;
  limit?: number;
}

export const getCustomerBookings = async ({
  status,
  title,
  page = 1,
  limit = 5,
}: GetBookingsParams) => {
  const response = await api.get("/booking/get-customer-bookings", {
    params: {
      status, // Optional status filter
      title, // Optional search term
      page, // Page number for pagination
      limit, // Number of results per page
    },
    withCredentials: true, // Ensures user authentication
  });

  return response.data;
};
export const getPilotCompanyBookings = async ({
  status,
  title,
  page = 1,
  limit = 5,
}: GetBookingsParams) => {
  const response = await api.get("/booking/get-pilot-customer-bookings", {
    params: {
      status, // Optional status filter
      title, // Optional search term
      page, // Page number for pagination
      limit, // Number of results per page
    },
    withCredentials: true, // Ensures user authentication
  });

  return response.data;
};
export const assignPilot = async (data: any) => {
  try {
    const response = await api.post(`/booking/assign`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBooking = async (id: string) => {
  try {
    const response = await api.get(`/booking/get-booking/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookingComapnyPilot = async (id: string) => {
  try {
    const response = await api.get(`/booking/get-booking-company-pilot/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
type BookingStatus = "pending" | "confirmed" | "rejected";

export const updateBookingStatus = async (
  status: BookingStatus,
  bookingId: string,
  reason?: string
) => {
  const response = await api.put(
    `booking/update-booking-pilot/${bookingId}`,
    {
      status,
      rejection_reason:reason, // Include reason when rejecting
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const updateBookingStatusCompany = async (
  status: BookingStatus,
  bookingId: string,
  reason?: string,
  pilot_id?: string
) => {
  const response = await api.put(
    `booking/update-booking-company/${bookingId}`,
    {
      status,
      rejection_reason:reason, // Include reason when rejecting
      pilot_id,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const updateBookingStatusComplete = async (bookingId: string) => {
  const response = await api.put(
    `booking/${bookingId}/complete`,
    {}, // Empty object since the request body is not needed
    { withCredentials: true } // Moved to the correct position
  );
  return response.data;
};

export const addRating = async (data: any) => {
  try {
    const response = await api.post(`/review/add`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAllCompany = async ({
  pageParam = 1,
  searchTerm = "",
}: any) => {
  try {
    const response = await api.get(`/company`, {
      params: {
        page: pageParam,
        limit: 20,
        search: searchTerm, // Include search term in query params
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getUserReview = async (id: string) => {
  try {
    const response = await api.get(`/review/pilot/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAdminCompanyForverification = async ({
  pageParam = 1,
  searchTerm = "",
  status="",
}: any) => {
  try {
    const response = await api.get(`/admin/companies`, {
      params: {
        page: pageParam,
        limit: 20,
        search: searchTerm, // Include search term in query params
        status:status
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyCompany = async (data: any) => {
  try {
    const response = await api.patch(`/admin/verify-company`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unverifyCompany = async (data: any) => {
  try {
    const response = await api.patch(`/admin/unverify-company`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};