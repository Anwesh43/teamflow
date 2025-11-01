import { taskHelper } from "../lib/appwrite"
import { useState, useEffect } from "react";
import { Task } from "@/models/Task";

const taskHelperObj = taskHelper()


const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
        taskHelperObj.getTasks().then((tasks) => {
            console.log("TASKS", tasks)
            setTasks(tasks)
        })
    }, [])
    return {
        tasks,
    }
}

export default useTasks 