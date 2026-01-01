import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAccessToken } from "./verifyAccessToken";
import { refreshAccessToken } from './refreshAccessToken'

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshAccessToken();
        }, 14 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const checkToken = async () => {
            const valid = await verifyAccessToken();

            if (!valid) {
                const refreshed = await refreshAccessToken();
                if (!refreshed) {
                    localStorage.clear();
                    navigate("/login");
                } else {
                    setIsValid(true);
                }
            } else {
                setIsValid(true);
            }
        };

        checkToken();
    }, [navigate]);


    if (isValid === null) {
        return (
            <div className='w-full h-full min-h-screen flex justify-center items-center'>
                <p className='w-[500px] h-[500px]' >loading...</p>
            </div>
        );
    }

    return children;
};