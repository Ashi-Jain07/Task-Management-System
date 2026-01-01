import { getAllUsers, loginUser, refreshAccessToken, registerUser, verifyToken } from "../Controllers/userController.js"
import { verifyUser } from "../Middlewares/verifyUser.js";

export const userRoutes = (app) => {
    app.post('/register', registerUser);
    app.post('/login', loginUser);
    app.get('/getAllUsers', verifyUser, getAllUsers);
    app.post('/refreshToken', refreshAccessToken);
    app.get('/verifyToken', verifyToken);
};