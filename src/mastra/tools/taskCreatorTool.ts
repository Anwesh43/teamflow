import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { Document, VectorStoreIndex, Settings } from 'llamaindex'
import { OpenAIEmbedding, OpenAI } from "@llamaindex/openai";
import { taskDbHelper } from '../../appwrite/taskDbHelper';
import { Task } from '@/models/Task';
const llamaIndexService = async (text: string): Promise<string> => {
    Settings.embedModel = new OpenAIEmbedding({
        model: "text-embedding-ada-002",
    });
    Settings.llm = new OpenAI({ model: 'gpt-4o-mini' })
    const document = new Document({ text })
    const index = await VectorStoreIndex.fromDocuments([document])
    const engine = index.asQueryEngine()
    const response = await engine.query({ query: "Return a list of tasks from the PRD provied. Each task must have title of the task, description, time it may take by default 1 day, priority which can be P1, P2 or P3 with default priority being P3. Return only the array of tasks in json format" })
    return response.toString()
}

const taskSchema = z.object({
    title: z.string(),
    description: z.string(),
    priority: z.string(),
    time: z.number(),
})

export const TasksCreatorToolResult = z.array(taskSchema)

const taskDbHelperObj = taskDbHelper()

const taskCreatorTool = createTool({
    id: 'task-creator',
    description: 'create list of tasks from PRD provided',
    inputSchema: z.object({
        prdText: z.string(),
        userId: z.string(),
    }),
    outputSchema: TasksCreatorToolResult,
    execute: async ({ context }) => {
        const resp = await llamaIndexService(context.prdText)
        console.log("RESPONSE", resp)
        const tasks = JSON.parse(resp.replaceAll("```", "").replaceAll("json", ""))
        return tasks.map((task) => ({ userId: context.userId, ...task }))
    }
})

export const saveTaskTool = createTool({
    id: 'task-saver',
    description: 'save task in db',
    inputSchema: z.object({
        title: z.string(),
        description: z.string(),
        timeEstimate: z.number(),
        priority: z.string(),
        userId: z.string(),
    }),
    outputSchema: TasksCreatorToolResult,
    execute: async ({ context }) => {
        const task: Task = {
            title: context.title,
            description: context.description,
            timeEstimate: context.timeEstimate,
            priority: context.priority,
            userId: context.userId,
        }
        await taskDbHelperObj.createTask(task)
    }
})

export default taskCreatorTool 