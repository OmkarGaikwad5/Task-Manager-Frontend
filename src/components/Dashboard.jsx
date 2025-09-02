import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { api } from "../api.js";
import PushButton from "./PushButton.jsx";
import TaskRow from "./TaskRow.jsx";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [tasks, setTasks] = React.useState([]);
  const [filter, setFilter] = React.useState("all");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const load = async () => {
    try {
      const q = filter === "all" ? "" : `?status=${filter}`;
      const { data } = await api.get("/api/tasks" + q);
      setTasks(data);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  React.useEffect(() => {
    load();
  }, [filter]);

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Task title cannot be empty");

    try {
      await api.post("/api/tasks", { title, description });
      setTitle("");
      setDescription("");
      load();
      toast.success("Task added successfully!");
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  const toggle = async (t) => {
    try {
      await api.patch(`/api/tasks/${t._id}/toggle`);
      load();
      toast.success(t.completed ? "Task marked pending" : "Task completed!");
    } catch (err) {
      toast.error("Failed to toggle task");
    }
  };

  const remove = async (t) => {
    try {
      await api.delete(`/api/tasks/${t._id}`);
      load();
      toast.success("Task deleted!");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const save = async (t, updates) => {
    try {
      await api.put(`/api/tasks/${t._id}`, { ...t, ...updates });
      load();
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8 space-y-6">

      {/* Task creation form */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 rounded-2xl shadow-lg animate-fadeIn">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
          Add a New Task
        </h2>
        <form onSubmit={add} className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 w-full md:w-auto bg-white/90 border-none shadow-inner rounded-lg"
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 w-full md:w-auto bg-white/90 border-none shadow-inner rounded-lg"
          />
          <Button
            type="submit"
            className="w-full md:w-auto bg-white text-purple-600 hover:bg-white/90 hover:text-purple-700 transition-all"
          >
            Add
          </Button>
        </form>
      </div>

      {/* Filter & Push Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-xl shadow-md gap-3 animate-fadeIn">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <PushButton className="w-full sm:w-auto" />
      </div>

      {/* Task rows */}
      <div className="space-y-4">
        {tasks.map((t) => (
          <div key={t._id}>
            <TaskRow
              task={t}
              onToggle={toggle}
              onDelete={remove}
              onSave={save}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
