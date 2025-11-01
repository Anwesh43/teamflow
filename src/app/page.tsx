"use client";

import { useCopilotAction, useCoAgent } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotChat } from "@copilotkit/react-ui";
import { useEffect, useState } from "react";
import { AgentState as AgentStateSchema } from "@/mastra/agents";
import { z } from "zod";
import { TasksCreatorToolResult } from "@/mastra/tools/taskCreatorTool";
import { useRouter } from "next/navigation";

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
      <div
        className="rounded-xl shadow-xl mt-6 mb-4 max-w-md w-full"
        style={{ backgroundColor: themeColor }}
      >
        <div className="bg-white/20 p-4 w-full">
          <p className="text-white animate-pulse">Loading tasks for your PRD...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="rounded-xl shadow-xl mt-6 mb-4 max-w-md w-full"
    >
      <div className="bg-white/20 p-2 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white capitalize">Tasks for your PRD</h3>
            <p className="text-white">Tasks</p>
          </div>
          <SunIcon />
        </div>
        {result && Array.isArray(result) && result.map((task) => (
          <div className="mt-4 mb-4 pt-4 w- border-t border-white" key={task.title}>
            <div className="grid grid-rows-5 gap-2">
              <div>
                <span className="text-white text-xs">Task</span>
                <p className="text-white font-medium">{task.title}</p>
              </div>
              <div>
                <span className="text-white text-xs">Description</span>
                <p className="text-white font-medium">{task.description}%</p>
              </div>
              <div>
                <span className="text-white text-xs">Priority</span>
                <p className="text-white font-medium">{task.priority} mph</p>
              </div>
              <div>
                <span className="text-white text-xs">Time needed</span>
                <p className="text-white font-medium">{task.time}</p>
              </div>
              <div>
                <span className="text-white text-xs">Assigned To</span>
                <p className="text-white font-medium">{task.assignedTo}</p>
              </div>
            </div>
          </div>
        ))}



      </div>
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
  const { state, setState } = useCoAgent<AgentStateSchema>({
    name: "tasksAgent",
    initialState: {
      userId: ""
    }
  })
  console.log("AGENT_STATE", state)
  const router = useRouter();
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  console.log("USER_ID", userId)
  useEffect(() => {
    authHelperObj.getCurrentUser().then((user) => {
      setUserId(user.$id)
      setUserName(user.name)
      setState({
        userId
      })
    }).catch((err) => {
      console.error("LOGIN_ERROR", err)
      router.push("/register")
    })
  })
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
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      {/* <YourMainContent themeColor={themeColor} userId={userId} /> */}
      {/* <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Popup Assistant",
          initial: "👋 Hi, there! You're chatting with an agent. This agent comes with a few tools to get you started.\n\nFor example you can try:\n- **Frontend Tools**: \"Set the theme to orange\"\n- **Shared State**: \"Write a proverb about AI\"\n- **Generative UI**: \"Get the weather in SF\"\n\nAs you interact with the agent, you'll see the UI update in real-time to reflect the agent's **state**, **tool calls**, and **progress**."
        }}
      /> */}
      <CopilotChat labels={{
        title: "Popup Assistant",
        initial: `👋 Hi ${userName},  You're chatting with an tasks creating agent. This agent helps you create tasks from a PRD.\n\nFor example you can try:\n- **Create tasks from PRD**: "YOUR_PRD_TEXT"`
      }} instructions={
        `You will create tasks from PRD text provided by user having userId ${userId}`
      } />
    </main>
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






// Simple sun icon for the weather card
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-yellow-200">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" stroke="currentColor" />
    </svg>
  );
}



