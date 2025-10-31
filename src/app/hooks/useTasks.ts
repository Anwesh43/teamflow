import { taskHelper } from "../lib/appwrite"
import { useState, useEffect } from "react";

const taskHelperObj = taskHelper()

export interface TaskUIObject {
    title: string;
    description: string;
    priority: string;
    timeEstimate: number;
    status?: string;
    assignedTo?: string;
    userId: string;
}
const useTasks = () => {
    const [tasks, setTasks] = useState<TaskUIObject[]>([]);
    useEffect(() => {
        taskHelperObj.getTasks().then((tasks) => {
            console.log("TASKS", tasks)
            setTasks(tasks.map((task) => ({
                title: task.title,
                description: task.description,
                priority: task.description,
                userId: task.userId,
                timeEstimate: task.timeEstimate,
            })))
        })
    }, [])
    return {
        tasks
    }
}

export default useTasks 