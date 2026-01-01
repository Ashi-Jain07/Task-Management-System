export async function verifyAccessToken() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/verifyToken`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return res.ok;
    } catch (err) {
        console.error("Token verification error:", err);
        return false;
    }
}