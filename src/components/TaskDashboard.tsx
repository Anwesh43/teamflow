"use client";

import { useState, useEffect } from "react";
import { Task } from "@/models/Task";
import { taskHelper } from "@/app/lib/appwrite";
import { Search, Filter, CheckCircle, Clock, AlertCircle, User } from "lucide-react";

const taskHelperObj = taskHelper();

const getPriorityColor = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case "P1":
      return "bg-red-500/10 text-red-700 border-red-500/20";
    case "P2":
      return "bg-amber-500/10 text-amber-700 border-amber-500/20";
    case "P3":
      return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-700 border-gray-500/20";
  }
};

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "border-l-green-400";
    case "in_progress":
      return "border-l-blue-400";
    case "blocked":
      return "border-l-red-400";
    default:
      return "border-l-gray-300";
  }
};

const getStatusIcon = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "in_progress":
      return <Clock className="w-4 h-4 text-blue-600" />;
    case "blocked":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    default:
      return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
  }
};

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      const tasksData = await taskHelperObj.getTasks();
      setTasks(tasksData);
      setLoading(false);
    };
    loadTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (priorityFilter) {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    todo: tasks.filter((t) => !t.status || t.status === "todo").length,
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="glass rounded-3xl px-10 py-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/60 animate-spin">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="glass rounded-3xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tasks</h1>
              <p className="text-gray-600 text-sm mt-1">
                {taskStats.total} total • {taskStats.completed} completed
              </p>
            </div>
            <button className="glass-button px-4 py-2 rounded-xl font-medium">
              + Create Task
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: taskStats.total, color: "text-indigo-700" },
            { label: "Completed", value: taskStats.completed, color: "text-green-700" },
            { label: "In Progress", value: taskStats.inProgress, color: "text-amber-700" },
            { label: "To Do", value: taskStats.todo, color: "text-gray-700" },
          ].map((stat) => (
            <div key={stat.label} className={`glass ${stat.color} rounded-2xl p-5`}>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2 rounded-xl"
              />
            </div>

            {/* Filters */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="glass-input px-4 py-2 rounded-xl text-gray-700"
            >
              <option value="">All Priorities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input px-4 py-2 rounded-xl text-gray-700"
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-1 rounded-xl bg-white/40 p-1 ring-1 ring-white/70">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  viewMode === "list"
                    ? "bg-white/90 text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  viewMode === "grid"
                    ? "bg-white/90 text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Task List/Grid */}
        {filteredTasks.length === 0 ? (
          <div className="glass text-center py-12 rounded-3xl">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">
              {searchQuery || priorityFilter || statusFilter
                ? "Try adjusting your filters"
                : "Create your first task to get started"}
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/70 bg-white/40">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Time Est.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/60">
                  {filteredTasks.map((task) => (
                    <tr key={task.$id} className="hover:bg-white/50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{task.assignedTo || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{task.timeEstimate} days</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span className="text-sm text-gray-900 capitalize">
                            {task.status || "Todo"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.$id}
                className={`glass rounded-2xl border-l-4 p-6 transition hover:-translate-y-0.5 hover:bg-white/70 ${getStatusColor(
                  task.status
                )}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg flex-1">{task.title}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-4">{task.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{task.assignedTo || "Unassigned"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{task.timeEstimate} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(task.status)}
                    <span className="text-gray-700 capitalize">{task.status || "Todo"}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/70">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-white/60 rounded-lg transition">
                    Edit
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white/60 rounded-lg transition">
                    •••
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
