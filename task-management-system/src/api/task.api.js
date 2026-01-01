import api from "./axiosInstance";

// Get my tasks
export const getMyTasksApi = async (page = 1, limit = 5) => {
    try {
        const res = await api.get(`/getMyTasks?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch tasks" };
    }
};

// Get all tasks (admin)
export const getAllTasksApi = async (page = 1, limit = 5) => {
    try {
        const res = await api.get(`/getAllTasks?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch all tasks" };
    }
};

// Create task
export const createTaskApi = async (payload) => {
    try {
        const res = await api.post("/createTask", payload);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to create task" };
    }
};

// Update task
export const updateTaskApi = async (taskId, payload) => {
    try {
        const res = await api.put(`/updateTask/${taskId}`, payload);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update task" };
    }
};

// Delete task
export const deleteTaskApi = async (taskId) => {
    try {
        const res = await api.delete(`/deleteTask/${taskId}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete task" };
    }
};

// Update status
export const updateTaskStatusApi = async (taskId, status) => {
    try {
        const res = await api.patch(`/updateTaskStatus/${taskId}`, { status });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update status" };
    }
};

// Update priority
export const updateTaskPriorityApi = async (taskId, priority) => {
    try {
        const res = await api.patch(`/updateTaskPriority/${taskId}`, { priority });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update priority" };
    }
};