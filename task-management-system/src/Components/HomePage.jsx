import { CheckCircle, Users, Calendar } from "lucide-react";
import { Link } from "react-router";

const HomePage = () => (
  <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-indigo-600 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-indigo-600">TaskFlow</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your all-in-one solution for efficient task management. Organize, prioritize, and collaborate seamlessly.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Smart Organization</h3>
          <p className="text-gray-600">Organize tasks by priority with color-coded visual system</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
          <p className="text-gray-600">Assign tasks and collaborate with your team efficiently</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Deadline Tracking</h3>
          <p className="text-gray-600">Never miss a deadline with our intuitive date management</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to='/login'
          className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
        >
          Login to Your Account
        </Link>
        <Link
          to='/register'
          className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition shadow-lg hover:shadow-xl"
        >
          Create New Account
        </Link>
      </div>
    </div>
  </div>
);

export default HomePage;