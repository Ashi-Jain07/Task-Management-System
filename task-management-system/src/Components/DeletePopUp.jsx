import { useState } from "react";
import { deleteTaskApi } from "../api/task.api";

const DeletePopUP = ({ taskTitle, taskId, onCancel, loadTasks }) => {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {

            await deleteTaskApi(taskId);
            loadTasks();
            onCancel();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-[1-px] bg-white text-black px-10 py-7">
            <h2 className="font-semibold text-2xl">Delete Task?</h2>
            <p className="mt-2 flex gap-1">
                <span>Are you sure, you want to delete</span>
                <span className="font-bold">{taskTitle}</span>
                <span>Task</span>
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="mt-4 flex gap-2">
                <button
                    className={` text-white px-4 py-2 rounded-[5px]  ${loading ? 'bg-gray-400' : 'cursor-pointer bg-red-400'}`}
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? 'Deleting' : 'Delete'}
                </button>
                <button className="border text-black px-4 py-2 rounded-[5px]" onClick={onCancel}>Cancel</button>
            </div>

        </div>
    )
}

export default DeletePopUP;