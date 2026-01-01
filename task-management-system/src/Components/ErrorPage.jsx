import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className=" min-h-screen h-full text-blavk flex flex-col items-center justify-center p-6">
            <div className="text-center  flex flex-col items-center justify-cente">
                <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
                <p className="text-2xl md:text-3xl font-light text-gray-500 mt-4">
                    Oops! Page not found.
                </p>
                <p className="mt-2 text-gray-500 w-2/3 text-center">
                    The page you are looking for doesn't exist, or we are currently working on it to bring you a better experience.
                </p>
                <p className="mt-4 text-lg text-blue-600 font-semibold">
                    We will be back soon!
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-block rounded-[5px] text-xl font-Roboto-serif bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 shadow-md  transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;