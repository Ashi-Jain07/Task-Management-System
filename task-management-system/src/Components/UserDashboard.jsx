import { useEffect, useState } from "react";
import { getMyTasksApi } from "../api/task.api";
import Modal from "../utils/Modal";
import EachTask from "./EachTask";

const UserDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [taskPage, setTaskPage] = useState(1);
    const [taskPagination, setTaskPagination] = useState(null);

    const [task, setTask] = useState({});
    const [isEachTask, setIsEachTask] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [selectedPriority, setSelectedPriority] = useState("")

    const loadTasks = async (page = 1) => {
        try {
            setLoading(true);

            const data = await getMyTasksApi(page, 5);

            setTasks(prev =>
                page === 1 ? data.tasks : [...prev, ...data.tasks]
            );

            setTaskPagination(data.pagination);
            setTaskPage(page);
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

    const filteredTasks = tasks.filter(task => !selectedPriority || task.priority === selectedPriority);

    useEffect(() => {
        loadTasks(1);
    }, [])

    return (
        <div className="mt-16 relative w-full h-full mb-5">

            {
                isEachTask && (
                    <Modal>
                        <EachTask task={task} onCancel={() => setIsEachTask(false)} loadTasks={loadTasks} />
                    </Modal>
                )
            }

            {error && (<p className="text-red-400 text-lg text-right mx-3">{error}</p>)}
            <div className="border-b border-t mx-0 border-black mt-2 flex justify-end gap-5 items-center px-5 py-2">

                <div>
                    <select className="border px-3 py-2 w-full text-left rounded-[5px]" onChange={(e) => setSelectedPriority(e.target.value)}>
                        <option value=''>Filter Task By Priority</option>
                        <option value='high'>High</option>
                        <option value='medium'>Medium</option>
                        <option value='low'>Low</option>
                    </select>
                </div>

            </div>

            <div>
                {
                    loading ? (
                        <p className="text-center text-xl mt-10">loading...</p>
                    ) : (
                        <div className="mt-10 flex-col flex gap-5 mx-10">
                            {
                                filteredTasks.map(task => (
                                    <div
                                        key={task._id}
                                        className={`
                                            relative border p-4 cursor-pointer rounded-md flex justify-between items-center 
                                            ${task.priority === 'high' && 'bg-red-100 text-red-700 border-red-300'}
                                            ${task.priority === 'medium' && 'bg-yellow-100 text-yellow-700 border-yellow-300'}
                                            ${task.priority === 'low' && 'bg-green-100 text-green-700 border-green-300'}
                                            `}

                                        onClick={() => {
                                            setTask(task)
                                            setIsEachTask(true);
                                        }}
                                    >

                                        <div>
                                            <h3 className="font-semibold">{task.title}</h3>
                                            <p className="text-sm text-gray-600">Status: {task.status}</p>
                                        </div>

                                        <div className="text-black">
                                            <p>Due Date:</p>
                                            <p>{formatDate(task?.dueDate)}</p>
                                        </div>

                                        <div className="text-black text-end">
                                            <p>Assigned By:</p>
                                            <p>{task?.assignedBy?.name}</p>
                                        </div>


                                    </div>
                                ))
                            }
                            {
                                taskPagination?.currentPage < taskPagination?.totalPages && (
                                    <div className="flex justify-center my-6">
                                        <button
                                            onClick={() => loadTasks(taskPage + 1)}
                                            className="px-4 py-2 bg-white text-black border rounded-md cursor-pointer"
                                        >
                                            Load more tasks
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default UserDashboard;