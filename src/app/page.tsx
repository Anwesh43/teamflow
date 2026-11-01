"use client";

import { useCopilotAction, useCoAgent } from "@copilotkit/react-core";
import { useEffect, useState } from "react";
import { AgentState as AgentStateSchema } from "@/mastra/agents";
import { z } from "zod";
import { TasksCreatorToolResult } from "@/mastra/tools/taskCreatorTool";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import HomePage from "@/components/HomePage";
import AssistantChat from "@/components/AssistantChat";
import { CheckCircle2, Clock, Loader2, User } from "lucide-react";

type TasksCreatorToolResultType = z.infer<typeof TasksCreatorToolResult>;
// import useTasks from "./hooks/useTasks";
import { authHelper } from "./lib/appwrite";

// import { Task } from "@/models/Task";

// import {
//   Card,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

const authHelperObj = authHelper()

//type AgentState = z.infer<typeof AgentStateSchema>;

const PRIORITY_STYLES: Record<string, string> = {
  P1: "bg-red-50 text-red-700 ring-red-200",
  P2: "bg-amber-50 text-amber-700 ring-amber-200",
  P3: "bg-blue-50 text-blue-700 ring-blue-200",
};

function TasksCard({
  themeColor,
  result,
  status
}: {
  themeColor: string,
  result: TasksCreatorToolResultType | null | undefined,
  status: "inProgress" | "executing" | "complete"
}) {
  if (status !== "complete") {
    return (
      <div className="my-2 flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" style={{ color: themeColor }} />
        Reading your PRD and drafting tasks...
      </div>
    )
  }

  const tasks = Array.isArray(result) ? result : [];

  return (
    <div className="my-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" style={{ color: themeColor }} />
          <h3 className="text-sm font-semibold text-gray-900">Tasks created from your PRD</h3>
        </div>
        <span className="text-xs text-gray-500">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
      </div>
      <ul className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <li className="px-4 py-3" key={task.title}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-gray-900">{task.title}</p>
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${PRIORITY_STYLES[task.priority?.toUpperCase()] ?? "bg-gray-50 text-gray-700 ring-gray-200"}`}>
                {task.priority}
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-gray-600">{task.description}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{task.time}h</span>
              {task.assignedTo && <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{task.assignedTo}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// const UserTasksCard = (task: Task) => {
//   return (
//     <Card className="p-4">
//       <CardTitle>{task.title}</CardTitle>
//       <CardHeader>{task.priority}</CardHeader>
//       <CardDescription>
//         <div>{task.description}</div>
//       </CardDescription>
//       <CardFooter>{task.timeEstimate} hours</CardFooter>
//     </Card>
//   )
// }

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#6366f1");
  const [showChat, setShowChat] = useState(false);
  const { setState } = useCoAgent<AgentStateSchema>({
    name: "tasksAgent",
    initialState: {
      userId: ""
    }
  })
  const router = useRouter();
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    authHelperObj.getCurrentUser().then((user) => {
      setUserId(user.$id)
      setUserName(user.name)
      setState({
        userId: user.$id
      })
    }).catch((err) => {
      console.error("LOGIN_ERROR", err)
      router.push("/login")
    })
  }, [])
  // 🪁 Frontend Actions: https://docs.copilotkit.ai/guides/frontend-actions
  useCopilotAction({
    name: "setThemeColor",
    parameters: [{
      name: "themeColor",
      description: "The theme color to set. Make sure to pick nice colors.",
      required: true,
    }],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });
  useCopilotAction({
    name: "taskCreatorTool",
    description: `Get tasks from PRD. Always use the userId from the current user context when calling this tool.`,
    available: "frontend",
    parameters: [
      { name: "prdText", type: "string", required: true },
      { name: "userId", type: "string", required: true },
    ],
    render: ({ args, result, status }) => {
      console.log("ARGS", args)
      return <TasksCard
        themeColor={themeColor}
        result={result}
        status={status}
      />
    }
  });
  return (
    <>
      <Navigation showChat={showChat} onChatToggle={() => setShowChat(!showChat)} />
      {!showChat ? (
        <HomePage userName={userName} />
      ) : (
        <AssistantChat userName={userName} userId={userId} themeColor={themeColor} />
      )}
    </>
  );
}

// function YourMainContent({ themeColor, userId }: { themeColor: string, userId: string }) {

//   console.log("USERId", userId)

//   // Make userId available to the backend tools via context
//   useCopilotReadable({
//     description: `The current user ID is: ${userId}. Always use this userId when calling taskCreatorTool.`,
//     value: userId,
//   });

//   // 🪁 Shared State: https://docs.copilotkit.ai/coagents/shared-state
//   const { state } = useCoAgent<AgentState>({
//     name: "tasksAgent",
//     initialState: {
//       tasks: [
//       ],
//     },
//   })

//   //🪁 Generative UI: https://docs.copilotkit.ai/coagents/generative-ui
//   // useCopilotAction({
//   //   name: "weatherTool",
//   //   description: "Get the weather for a given location.",
//   //   available: "frontend",
//   //   parameters: [
//   //     { name: "location", type: "string", required: true },
//   //   ],
//   //   render: ({ args, result, status }) => {
//   //     return <WeatherCard
//   //       location={args.location}
//   //       themeColor={themeColor}
//   //       result={result}
//   //       status={status}
//   //     />
//   //   },
//   // });

//   useCopilotAction({
//     name: "taskCreatorTool",
//     description: `Get tasks from PRD. Always use the userId from the current user context when calling this tool.`,
//     available: "frontend",
//     parameters: [
//       { name: "prdText", type: "string", required: true },
//       { name: "userId", type: "string", required: true },
//     ],
//     render: ({ args, result, status }) => {
//       console.log("ARGS", args)
//       return <TasksCard
//         themeColor={themeColor}
//         result={result}
//         status={status}
//       />
//     }
//   });

//   useCopilotAction({
//     name: "updateWorkingMemory",
//     available: "frontend",
//     render: ({ args }) => {
//       return <div style={{ backgroundColor: themeColor }} className="rounded-2xl max-w-md w-full text-white p-4">
//         <p>✨ Memory updated</p>
//         <details className="mt-2">
//           <summary className="cursor-pointer text-white">See updates</summary>
//           <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }} className="overflow-x-auto text-sm bg-white/20 p-4 rounded-lg mt-2">
//             {JSON.stringify(args, null, 2)}
//           </pre>
//         </details>
//       </div>
//     },
//   });
//   console.log("STATE_TASKS", state)
//   const { tasks: tasksUIObj } = useTasks()
//   return (
//     <div
//       className="h-screen w-screen flex flex-col transition-colors duration-300"
//     >
//       <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-2xl w-full">
//         <hr className="border-white/20 my-6" />
//         <div className="flex flex-col gap-3">
//           {tasksUIObj.map((task: Task) => (
//             <UserTasksCard
//               key={task.title}
//               timeEstimate={task.timeEstimate}
//               description={task.description}
//               title={task.title} priority={task.priority}></UserTasksCard>))}
//         </div>
//         {state.proverbs?.length === 0 && <p className="text-center text-white/80 italic my-8">
//           No proverbs yet. Ask the assistant to add some!
//         </p>}
//       </div>
//     </div>
//   );
// }

// Weather card component where the location and themeColor are based on what the agent
// sets via tool calls.
