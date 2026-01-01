import Task from "../Models/taskModel.js";
import mongoose from "mongoose";
import User from "../Models/userModel.js";

//Create Task API (Admin only)
export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, assignedTo, priority } = req.body;
        const assignedBy = req.user.userId;
        const userRole = req.user.userRole;

        if (userRole !== "admin") {
            return res.status(403).json({ message: "Only admins can create tasks" });
        }

        if (!title || !description || !assignedTo) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        if (!["low", "medium", "high"].includes(priority)) {
            return res.status(400).json({ message: "Invalid priority value" });
        }

        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            return res.status(400).json({ message: "Invalid assignedTo userId" });
        }

        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
            return res.status(404).json({ message: "Assigned user not found" });
        }

        const task = await Task.create({
            title,
            description,
            dueDate,
            assignedTo,
            assignedBy,
            priority
        });

        return res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to create task", error: err.message });
    }
};

// Get Tasks assigned to logged-in user (Paginated)
export const getMyTasks = async (req, res) => {
    try {
        const userId = req.user.userId;

        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const [tasks, totalTasks] = await Promise.all([
            Task.find({ assignedTo: userId })
                .populate("assignedBy", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Task.countDocuments({ assignedTo: userId })
        ]);

        return res.status(200).json({
            tasks,
            pagination: {
                totalTasks,
                totalPages: Math.ceil(totalTasks / limit),
                currentPage: page
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch tasks",
            error: err.message
        });
    }
};

// Get All Tasks (Admin only, Paginated)
export const getAllTasks = async (req, res) => {
    try {
        const { userRole } = req.user;

        if (userRole !== "admin") {
            return res.status(403).json({ message: "Only admins can see all tasks" });
        }

        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const [tasks, totalTasks] = await Promise.all([
            Task.find()
                .populate("assignedBy", "name email")
                .populate("assignedTo", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Task.countDocuments()
        ]);

        return res.status(200).json({
            tasks,
            pagination: {
                totalTasks,
                totalPages: Math.ceil(totalTasks / limit),
                currentPage: page
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch tasks",
            error: err.message
        });
    }
};

//Edit Task API (Admin only)
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userRole = req.user.userRole;

        if (userRole !== "admin") {
            return res.status(403).json({ message: "Only admins can update tasks" });
        }

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid taskId" });
        };

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            req.body,
            { new: true }
        );

        return res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to update task", error: err.message });
    }
};

//Update Task Status API (For assigned users)
export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const userId = req.user.userId;
        const userRole = req.user.userRole;

        if (!["pending", "in-progress", "completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid taskId" });
        };

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(403).json({ message: "Task not found" });
        }

        console.log('task.assignedTo', task.assignedTo);
        console.log('userId', userId);


        if (task.assignedTo.toString() !== userId.toString() && userRole !== "admin") {
            return res.status(403).json({ message: "You are not allowed to update this task status" });
        }

        task.status = status;
        await task.save();

        return res.status(200).json({
            message: "Task status updated",
            task
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to update status", error: err.message });
    }
};

//Update Task Priority API (For assigned users)
export const updateTaskPriority = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { priority } = req.body;
        const userId = req.user.userId;
        const { userRole } = req.user;

        if (!["low", "medium", "high"].includes(priority)) {
            return res.status(400).json({ message: "Invalid priority value" });
        }

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid taskId" });
        };

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(403).json({ message: "Task not found" });
        }

        if (task.assignedTo.toString() !== userId.toString() && userRole !== "admin") {
            return res.status(403).json({ message: "You are not allowed to update this task status" });
        }

        task.priority = priority;
        await task.save();

        return res.status(200).json({
            message: "Task priority updated",
            task
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to update priority", error: err.message });
    }
};

//DELETE TASK API (Admin only)
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userRole = req.user.userRole;

        if (userRole !== "admin") {
            return res.status(403).json({ message: "Only admins can delete tasks" });
        }

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid taskId" });
        };

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete task", error: err.message });
    }
};