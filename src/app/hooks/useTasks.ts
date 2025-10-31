import { Task, taskHelper } from "../lib/appwrite"
import { useState, useEffect } from "react";
import { useCopilotChatHeadless_c } from "@copilotkit/react-core";

const taskHelperObj = taskHelper()

export interface TaskUIObject {
    title: string;
    description: string;
    priority: string;
    timeEstimate: number;
    status?: string;
    assignedTo?: string;
}
const useTasks = () => {
    const [tasks, setTasks] = useState<TaskUIObject[]>([]);
    useEffect(() => {
        taskHelperObj.getTasks().then((tasks: Task[]) => {
            console.log("TASKS", tasks)
            setTasks(tasks.map((task: Task) => (task as TaskUIObject)))
        })
    }, [])
    return {
        tasks
    }
}

export default useTasks 