import { useState } from "react";
import { CheckCircle, Users } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { registerApi } from "../api/auth.api";

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Password and confirm password do not match');
      return;
    }
    setLoading(true);

    try {
      await registerApi(formData);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setError(`Registration failed, ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-pink-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-purple-600 rounded-full mb-4">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join TaskFlow and start managing your tasks</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Registration Successful!</h3>
              <p className="text-gray-600">Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border text-center border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full text-white py-3 rounded-lg font-semibold transition shadow-lg  ${loading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700 hover:shadow-xl cursor-pointer'}`}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {
            !success && (
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to='/login'
                    className="text-purple-600 font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
                <Link
                  to='/'
                  className="text-gray-500 hover:text-gray-700 mt-4"
                >
                  ← Back to Home
                </Link>
              </div>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default Register;