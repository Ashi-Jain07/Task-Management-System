import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth.api";

const Login = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await loginApi({ email, password });

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("userRole", data.user.role);
            localStorage.setItem("userName", data.user.name);

            navigate("/dashboard");

        } catch (error) {
            setError(`Login failed, ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full mt-5">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-indigo-600 rounded-full mb-4">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to continue to TaskFlow</p>
                </div>

                <div className="bg-white rounded-xl shadow-xl p-8 md:w-112.5m mb-5">
                    <form onSubmit={handleLogin}>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="pass" className="block text-gray-700 font-semibold mb-2">Password</label>
                            <input
                                type="password"
                                id="pass"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full text-white py-3 rounded-lg font-semibold transition shadow-lg  ${loading ? 'bg-gray-600' : 'hover:shadow-xl hover:bg-indigo-700 bg-indigo-600'}`}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to='/register'
                                className="text-indigo-600 font-semibold hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                        <Link
                            to="/"
                            className="text-gray-500 hover:text-gray-700 mt-4"
                        >
                            ← Back to Home
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;