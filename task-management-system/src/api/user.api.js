import api from "./axiosInstance";

export const getAllUsersApi = async (page = 1, limit = 10) => {
    try {
        const res = await api.get(`/getAllUsers?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch users"
        );
    }
};