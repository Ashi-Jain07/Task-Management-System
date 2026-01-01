import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import { CheckCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

const Dashboard = () => {

    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login')
    }

    return (
        <>
            <div className="flex flex-col md:flex-row items-center md:justify-between mx-5 mt-5">
                <div className="flex items-center gap-2">
                    <div className="inline-block p-2 bg-indigo-600 rounded-full ">
                        <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 ">
                        TaskFlow
                    </h1>
                </div>

                <div className="flex items-center gap-5">
                    <h2 className="md:text-2xl text-lg mt-3 md:mt-0 font-semibold text-gray-700">Welcome back, <b>{userName}!</b> </h2>
                    <button className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full bg-blue-700" title="Logout" onClick={handleLogout}>
                        <LogOut className="w-5 h-5 text-white" />
                    </button>
                </div>

            </div>

            <div>
                {
                    userRole === 'admin' ? (
                        <AdminDashboard />
                    ) : (
                        <UserDashboard />
                    )
                }
            </div>
        </>
    )
}

export default Dashboard;