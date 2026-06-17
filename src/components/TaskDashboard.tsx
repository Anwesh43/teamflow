"use client";

import { useState, useEffect } from "react";
import { Task } from "@/models/Task";
import { taskHelper } from "@/app/lib/appwrite";
import { ChevronDown, Search, Filter, CheckCircle, Clock, AlertCircle, User } from "lucide-react";

const taskHelperObj = taskHelper();

const getPriorityColor = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case "P1":
      return "bg-red-100 text-red-800 border-red-300";
    case "P2":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "P3":
      return "bg-blue-100 text-blue-800 border-blue-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-50 border-green-200";
    case "in_progress":
      return "bg-blue-50 border-blue-200";
    case "blocked":
      return "bg-red-50 border-red-200";
    default:
      return "bg-white border-gray-200";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 animate-spin">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-600 text-sm mt-1">
                {taskStats.total} total • {taskStats.completed} completed
              </p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition">
              + Create Task
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: taskStats.total, color: "bg-blue-50 text-blue-700" },
            { label: "Completed", value: taskStats.completed, color: "bg-green-50 text-green-700" },
            { label: "In Progress", value: taskStats.inProgress, color: "bg-yellow-50 text-yellow-700" },
            { label: "To Do", value: taskStats.todo, color: "bg-gray-50 text-gray-700" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-lg p-4 border border-current border-opacity-20`}>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-l-lg font-medium transition ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-r-lg font-medium transition ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-600 shadow-sm"
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
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">
              {searchQuery || priorityFilter || statusFilter
                ? "Try adjusting your filters"
                : "Create your first task to get started"}
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
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
                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task.$id} className="hover:bg-gray-50 transition">
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
                className={`rounded-lg border-2 p-6 transition hover:shadow-lg ${getStatusColor(
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

                <div className="flex gap-2 pt-4 border-t border-gray-300 border-opacity-30">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded transition">
                    Edit
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded transition">
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
