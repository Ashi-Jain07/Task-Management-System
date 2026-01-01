import { useEffect, useState } from "react";
import { getAllUsersApi } from "../api/user.api";
import { createTaskApi } from "../api/task.api";

const AssignTaskForm = ({ onCancel, loadTasks }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: {
      name: '',
      _id: ''
    },
    status: 'pending'
  });
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userPagination, setUserPagination] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.assignedTo?._id) {
      setError("Please select a user to assign the task");
      setLoading(false);
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      assignedTo: formData.assignedTo._id
    }

    try {

      await createTaskApi(payload);
      loadTasks();
      onCancel();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1)
  }, [])

  return (
    <div className="fixed inset-0 text-black flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-6">Create New Task</h3>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                placeholder="Enter Task Title"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                placeholder="Enter Task Description"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows=""
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="relative w-full mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Select User</label>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="border px-3 py-2 w-full text-left rounded-[5px]"
              >
                {formData.assignedTo.name || "Select User"}
              </button>

              {open && (
                <div className="absolute flex flex-col items-start z-10 bg-white border w-full max-h-40 overflow-auto rounded-[5px]">
                  {users.map(user => (
                    <button
                      key={user._id}
                      className="px-2 py-2 w-full text-start hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, assignedTo: user });
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

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>


            <div className="flex gap-3">
              <button
                type="submit"
                className={`flex-1  text-white py-2 rounded-lg font-semibold transition ${loading ? 'bg-gray-400' : 'hover:bg-indigo-700 bg-indigo-600 cursor-pointer'}`}
                disabled={loading}
              >
                {loading ? 'Creating Task...' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 cursor-pointer text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskForm;