import { useEffect, useState } from "react";
import { getAllUsersApi } from "../api/user.api";
import { getAllTasksApi } from "../api/task.api";
import Modal from "../utils/Modal";
import AssignTaskForm from "./AssignTaskForm";
import EditTaskForm from "./EditTaskForm";
import DeletePopUP from "./DeletePopUp";
import EachTask from "./EachTask";

const AdminDashboard = () => {

    const [tasks, setTasks] = useState([]);
    const [taskPage, setTaskPage] = useState(1);
    const [taskPagination, setTaskPagination] = useState(null);

    const [isCreateTask, setIsCreateTask] = useState(false);
    const [isEditTask, setIsEditTask] = useState(false);
    const [openMenuTaskId, setOpenMenuTaskId] = useState(null);
    const [task, setTask] = useState({});
    const [isDelete, setIsDelete] = useState(false);
    const [isEachTask, setIsEachTask] = useState(false);

    const [users, setUsers] = useState([]);
    const [userPage, setUserPage] = useState(1);
    const [userPagination, setUserPagination] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState("")

    useEffect(() => {
        const close = () => setOpenMenuTaskId(null);
        globalThis.addEventListener("click", close);
        return () => globalThis.removeEventListener("click", close);
    }, []);


    const loadTasks = async (page = 1) => {
        try {
            setLoading(true);

            const data = await getAllTasksApi(page, 5);

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

    const loadUsers = async (page = 1) => {
        try {
            const data = await getAllUsersApi(page, 10);

            setUsers(prev =>
                page === 1 ? data.users : [...prev, ...data.users]
            );

            setUserPagination(data.pagination);
            setUserPage(page);
        } catch (err) {
            setError(err.message);
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

    const filteredTasks = tasks.filter(task => {
        const matchUser =
            !selectedUser || task.assignedTo?._id === selectedUser._id;

        const matchPriority =
            !selectedPriority || task.priority === selectedPriority;

        return matchUser && matchPriority;
    });


    useEffect(() => {
        loadUsers(1);
        loadTasks(1);
    }, [])

    return (
        <div className="mt-16 relative w-full h-full mb-5">

            {
                isCreateTask && (
                    <Modal>
                        <AssignTaskForm onCancel={() => setIsCreateTask(false)} loadTasks={loadTasks} />
                    </Modal>
                )
            }
            {
                isEditTask && (
                    <Modal>
                        <EditTaskForm
                            task={task}
                            onCancel={() => {
                                setIsEditTask(false)
                                setTask('')
                            }}
                            loadTasks={loadTasks}
                        />
                    </Modal>
                )
            }
            {
                isDelete && (
                    <Modal>
                        <DeletePopUP
                            taskTitle={task.title}
                            taskId={task._id}
                            onCancel={() => {
                                setIsDelete(false);
                                setTask('')
                            }}
                            loadTasks={loadTasks}
                        />
                    </Modal>
                )
            }

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

                <div className="relative w-50">
                    <button
                        onClick={() => setOpen(!open)}
                        className="border px-3 py-2 w-full text-left rounded-[5px]"
                    >
                        {selectedUser?.name || "Filter Task By User"}
                    </button>

                    {open && (
                        <div className="absolute flex flex-col items-start z-10 bg-white border w-full max-h-50 overflow-auto rounded-[5px]">
                            <button
                                className="px-2 py-2 hover:bg-gray-100 cursor-pointer w-full text-start"
                                onClick={() => {
                                    setSelectedUser(null);
                                    setOpen(false);
                                }}
                            >
                                All Users
                            </button>
                            {users.map(user => (
                                <button
                                    key={user._id}
                                    className="px-2 py-2 hover:bg-gray-100 cursor-pointer w-full text-start"
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setOpen(false);
                                    }}
                                >
                                    {user.name}
                                </button>
                            ))}

                            {userPagination?.currentPage < userPagination?.totalPages && (
                                <button
                                    className="w-full py-2 text-blue-600 hover:bg-gray-50"
                                    onClick={() => loadUsers(userPage + 1)}
                                >
                                    Load more users
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setIsCreateTask(true)}
                    className={` text-white py-2.5 w-50 cursor-pointer rounded-lg font-semibold transition shadow-lg hover:shadow-xl hover:bg-indigo-700 bg-indigo-600`}
                >
                    Create Task
                </button>
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
                                            relative border cursor-pointer p-4 rounded-md flex justify-between items-center 
                                            ${task.priority === 'high' && 'bg-red-100 text-red-700 border-red-300'}
                                            ${task.priority === 'medium' && 'bg-yellow-100 text-yellow-700 border-yellow-300'}
                                            ${task.priority === 'low' && 'bg-green-100 text-green-700 border-green-300'}
                                            `}
                                        onClick={() => {
                                            setTask(task);
                                            setIsEachTask(true)
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {/* Three dots */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuTaskId(prevId => (prevId === task._id ? null : task._id))
                                                }
                                                }
                                                className="text-xl px-2 hover:cursor-pointer"
                                            >
                                                ⋮
                                            </button>

                                            {/* Dropdown */}
                                            {openMenuTaskId === task._id && (
                                                <div className="absolute left-2 top-14 bg-white text-black border rounded shadow-md z-20" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => {
                                                            setTask(task)
                                                            setIsEditTask(true);
                                                            setOpenMenuTaskId(null);
                                                        }}
                                                        className="block px-4 py-1 hover:bg-gray-100 cursor-pointer w-full text-left"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setTask(task)
                                                            setIsDelete(true)
                                                        }}
                                                        className="block px-4 py-1 hover:bg-gray-100 cursor-pointer w-full text-left text-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-semibold">{task.title}</h3>
                                                <p className="text-sm text-gray-600">Status: {task.status}</p>
                                            </div>
                                        </div>

                                        <div className="text-black">
                                            <p>Due Date:</p>
                                            <p>{formatDate(task?.dueDate)}</p>
                                        </div>

                                        <div className="text-black text-end">
                                            <p>Assigned To:</p>
                                            <p>{task?.assignedTo?.name}</p>
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

export default AdminDashboard;