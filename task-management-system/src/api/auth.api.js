import api from "./axiosInstance";

// LOGIN API
export const loginApi = async ({ email, password }) => {
    try {
        const res = await api.post("/login", { email, password });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Login failed" };
    }
};

// REGISTER API
export const registerApi = async ({ name, email, password, confirmPassword }) => {
    try {
        const res = await api.post("/register", {
            name,
            email,
            password,
            confirmPassword
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Registration failed" };
    }
};