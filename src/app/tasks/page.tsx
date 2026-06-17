"use client";

import TaskDashboard from "@/components/TaskDashboard";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authHelper } from "../lib/appwrite";

const authHelperObj = authHelper();

export default function TasksPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    authHelperObj.getCurrentUser().catch(() => {
      router.push("/login");
    });
    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navigation />
      <TaskDashboard />
    </>
  );
}