import { useState } from "react";
import { updateTaskPriorityApi, updateTaskStatusApi } from "../api/task.api";
import { X } from 'lucide-react'

const EachTask = ({ task, onCancel, loadTasks }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePriority = async (priority) => {
        setLoading(true);
        try {
            await updateTaskPriorityApi(task?._id, priority);
            loadTasks();
            onCancel();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatus = async (status) => {
        setLoading(true);
        try {
            await updateTaskStatusApi(task?._id, status);
            loadTasks();
            onCancel();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="bg-white w-full max-w-xl rounded-2xl border border-blue-100 shadow-xl p-6 text-slate-800">
            <div className="flex justify-end w-full">
                <X className="w-5 h-5 cursor-pointer text-end" onClick={onCancel} />
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="flex items-start justify-between gap-6">
                <div>
                    <h2 className="text-xl font-semibold text-blue-700">
                        {task?.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                        {task?.description}
                    </p>
                </div>

                <div className="flex flex-col gap-1 text-sm">
                    <span className="text-slate-500">Priority</span>
                    <select
                        disabled={loading}
                        onChange={(e) => handleChangePriority(e.target.value)}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">{task?.priority}</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-slate-500">Due Date</p>
                    <p className="font-medium text-slate-700">
                        {formatDate(task?.dueDate)}
                    </p>
                </div>

                <div>
                    <p className="text-slate-500">Status</p>
                    <select
                        disabled={loading}
                        onChange={(e) => handleChangeStatus(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">{task?.status}</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="mt-6 border-t pt-4 text-sm">
                {task?.assignedTo?.name && (
                    <p className="text-slate-600">
                        Assigned To:{" "}
                        <span className="font-medium text-slate-800">
                            {task?.assignedTo?.name}
                        </span>
                    </p>
                )}
                <p className="mt-1 text-slate-600">
                    Assigned By:{" "}
                    <span className="font-medium text-slate-800">
                        {task?.assignedBy?.name}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default EachTask;