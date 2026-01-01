import { createTask, deleteTask, getAllTasks, getMyTasks, updateTask, updateTaskPriority, updateTaskStatus } from "../Controllers/taskController.js"
import { verifyUser } from "../Middlewares/verifyUser.js"

export const taskRoutes = (app) => {
    app.post('/createTask', verifyUser, createTask);
    app.get('/getMyTasks', verifyUser, getMyTasks);
    app.get('/getAllTasks', verifyUser, getAllTasks);
    app.put('/updateTask/:taskId', verifyUser, updateTask);
    app.patch('/updateTaskStatus/:taskId', verifyUser, updateTaskStatus);
    app.patch('/updateTaskPriority/:taskId', verifyUser, updateTaskPriority);
    app.delete('/deleteTask/:taskId', verifyUser, deleteTask);
}