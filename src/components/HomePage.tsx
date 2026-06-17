"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { taskHelper } from "@/app/lib/appwrite";
import { CheckCircle, Clock, AlertCircle, Zap, Plus, ListTodo, MessageSquare, TrendingUp } from "lucide-react";
import { Task } from "@/models/Task";

const taskHelperObj = taskHelper();

const getPriorityColor = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case "P1":
      return "text-red-600";
    case "P2":
      return "text-yellow-600";
    case "P3":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

export default function HomePage({ userName }: { userName: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(false);
      const tasksData = await taskHelperObj.getTasks();
      setTasks(tasksData);
    };
    loadTasks();
  }, []);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    todo: tasks.filter((t) => !t.status || t.status === "todo").length,
  };

  const recentTasks = tasks.slice(0, 5);
  const completionRate = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Welcome back, {userName}! 👋</h1>
              <p className="text-gray-600 mt-2">Here's what's happening with your tasks today</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
            >
              <Zap className="w-4 h-4" />
              Create from PRD
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{taskStats.total}</p>
              </div>
              <ListTodo className="w-8 h-8 text-indigo-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{taskStats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{taskStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">To Do</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{taskStats.todo}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completion</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{completionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full px-4 py-3 bg-white border-2 border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition text-center"
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Create Tasks from PRD
              </Link>
              <Link
                href="/tasks"
                className="block w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 font-medium transition text-center"
              >
                <ListTodo className="w-4 h-4 inline mr-2" />
                View All Tasks
              </Link>
              <Link
                href="/"
                className="block w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 font-medium transition text-center"
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Chat with AI
              </Link>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Tasks</h2>
              <Link href="/tasks" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all →
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-600 mb-4">Create your first task by uploading a PRD</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
                >
                  <Plus className="w-4 h-4" />
                  Create Task
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.$id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              task.priority?.toUpperCase() === "P1"
                                ? "bg-red-100 text-red-700"
                                : task.priority?.toUpperCase() === "P2"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-600">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {task.timeEstimate} days
                          </span>
                          <span className="text-xs text-gray-600">
                            {task.status ? (
                              <span className="capitalize">{task.status}</span>
                            ) : (
                              <span className="text-gray-500">Todo</span>
                            )}
                          </span>
                        </div>
                      </div>
                      {task.assignedTo && (
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-600 font-medium">{task.assignedTo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Creation</h3>
              <p className="text-gray-600 text-sm">Upload your PRD and let AI automatically generate tasks with priorities and estimates</p>
            </div>
            <div className="text-center">
              <ListTodo className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Smart Tracking</h3>
              <p className="text-gray-600 text-sm">Track task status, priority levels, and assignees in one beautiful dashboard</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Progress Insights</h3>
              <p className="text-gray-600 text-sm">Get completion rates, velocity metrics, and team performance analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
