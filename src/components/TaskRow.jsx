import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TaskRow({ task, onToggle, onDelete, onSave }) {
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState(task.title);
  const [description, setDescription] = React.useState(task.description || "");

  const handleSave = () => {
    onSave(task, { title, description });
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(task);
  };

  const handleToggle = () => {
    onToggle(task);
  };

  return (
    <div className="flex flex-col gap-3 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 w-full">
      {editing ? (
        <div className="flex flex-col gap-3 w-full">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Task title"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Description (optional)"
          />
          <Button className="w-full md:w-auto" onClick={handleSave}>
            Save
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-semibold text-gray-800">{task.title}</span>
              <div className="flex flex-wrap items-center gap-2">
                {task.completed && (
                  <Badge variant="secondary" className="max-w-full truncate">
                    Done
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleToggle}>
                {task.completed ? "Uncomplete" : "Complete"}
              </Button>
              <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button variant="destructive" className="w-full sm:w-auto" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 mt-2 break-words">{task.description}</p>
          )}
        </>
      )}
    </div>
  );
}
