import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "@/mastra/tools";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";
import taskCreatorTool, { saveTaskTool } from '../tools/taskCreatorTool'
export const AgentStateSchema = z.object({
  userId: z.string()
});

export type AgentState = z.infer<typeof AgentStateSchema>

export const weatherAgent = new Agent({
  name: "Weather Agent",
  tools: { weatherTool },
  model: openai("gpt-4o"),
  instructions: "You are a helpful assistant.",
  memory: new Memory({
    storage: new LibSQLStore({ url: "file::memory:" }),
    options: {
      workingMemory: {
        enabled: true,
        schema: AgentStateSchema,
      },
    },
  }),
});

export const tasksAgent = new Agent({
  name: "Task Agent",
  tools: { taskCreatorTool, saveTaskTool, },
  model: openai("gpt-4o"),
  instructions: "You are a helpful assistant who will create tasks from meeting notes and PRD for an user whose userId is provided in memory. You will aslo save tasks in db. If stakeholders are provided please assign the tasks based on the stakeholder's speciality",
  memory: new Memory({
    storage: new LibSQLStore({ url: "file::memory:" }),
    options: {
      workingMemory: {
        enabled: true,
        schema: AgentStateSchema,
      },
    },
  }),
});
