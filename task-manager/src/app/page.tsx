"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

type TaskStatus = "pending" | "completed";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState<TaskStatus>("pending");

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Create Task
  const addTask = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      status,
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle("");
    setStatus("pending");
  };

  // Delete Task
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Start Editing
  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditStatus(task.status);
  };

  // Save Edited Task
  const saveEdit = () => {
    if (!editTitle.trim()) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingId
          ? { ...task, title: editTitle.trim(), status: editStatus }
          : task
      )
    );

    setEditingId(null);
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Task Manager
      </h1>

      {/* Create Task */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as TaskStatus)
          }
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={addTask}
          style={{
            padding: "8px 12px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          No tasks yet
        </p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              border: "1px solid #eee",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          >
            {editingId === task.id ? (
              <>
                {/* Edit Mode */}
                <div style={{ flex: 1, marginRight: "10px" }}>
                  <input
                    value={editTitle}
                    onChange={(e) =>
                      setEditTitle(e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "6px",
                      marginBottom: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />

                  <select
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(
                        e.target.value as TaskStatus
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={saveEdit}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "green",
                    }}
                  >
                    <FaSave />
                  </button>

                  <button
                    onClick={cancelEdit}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "gray",
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Normal View Mode */}
                <div>
                  <strong>{task.title}</strong>
                  <div
                    style={{
                      fontSize: "12px",
                      color:
                        task.status === "completed"
                          ? "green"
                          : "orange",
                    }}
                  >
                    {task.status}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => startEdit(task)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "red",
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </main>
  );
}
