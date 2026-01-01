import { verifyAccessToken } from "./verifyAccessToken";

export async function refreshAccessToken() {
    console.log("call refresh token");

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/refreshtoken`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) {
            console.error("Refresh token failed");
            localStorage.clear();
            globalThis.location.href = "/login";
            return false;
        }

        const data = await res.json();
        const newAccessToken = data.accessToken;
        console.log(newAccessToken);


        if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);

            // Verify the new token
            const verified = await verifyAccessToken();
            return verified;
        }

        return false;

    } catch (err) {
        console.error("Error refreshing token:", err);
        localStorage.clear();
        globalThis.location.href = "/login";
        return false;
    }
}