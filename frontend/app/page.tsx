'use client';

import { FormEvent, useEffect, useState } from 'react';

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    setTasks(await request<Task[]>('/tasks'));
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });

    setTitle('');
    setDescription('');
    await loadTasks();
    setLoading(false);
  }

  async function toggleTask(task: Task) {
    await request<Task>(`/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: !task.completed }),
    });
    await loadTasks();
  }

  async function deleteTask(id: number) {
    await request(`/tasks/${id}`, {
      method: 'DELETE',
    });
    await loadTasks();
  }

  async function updateTask(id: number) {
    if (!editTitle.trim()) return;

    await request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    });

    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    await loadTasks();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-blue-400/20 bg-gradient-to-r from-blue-950/95 via-blue-900/95 to-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-blue-950/60 supports-[backdrop-filter]:via-blue-900/60 supports-[backdrop-filter]:to-slate-900/60">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-black tracking-tight text-blue-100 drop-shadow-lg">Tasks</h1>
          <p className="mt-2 text-lg text-blue-200/80">Stay organized, get things done</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Create Form */}
        <form
          onSubmit={createTask}
          className="mb-12 space-y-5 rounded-3xl border-2 border-blue-400/30 bg-gradient-to-br from-blue-900/40 to-blue-800/30 p-8 shadow-2xl transition-all hover:border-blue-400/50 hover:shadow-blue-900/50 backdrop-blur-sm"
        >
          <div className="mb-2">
            <label className="block text-sm font-bold text-blue-200 mb-3 uppercase tracking-wider">Add New Task</label>
            <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-300/90 mb-3 uppercase tracking-widest">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your next task?"
              className="w-full bg-blue-950/40 border-b-2 border-blue-400/40 text-2xl font-bold outline-none placeholder-blue-400/30 transition focus:placeholder-blue-400/60 pb-3 focus:border-blue-400/80 text-blue-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-300/90 mb-3 uppercase tracking-widest">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details and notes..."
              className="w-full resize-none bg-blue-950/40 border-b-2 border-blue-400/40 text-lg outline-none placeholder-blue-400/30 transition focus:placeholder-blue-400/60 pb-4 focus:border-blue-400/80 text-blue-50"
              rows={4}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 font-bold text-white transition-all hover:from-blue-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-lg shadow-lg hover:shadow-blue-500/50 uppercase tracking-wider"
          >
            {loading ? '⟳ Adding...' : '+ Add Task'}
          </button>
        </form>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="rounded-3xl border-2 border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-16 text-center transition-all hover:border-blue-400/40 backdrop-blur-sm">
              <p className="text-3xl text-blue-300 font-bold">No tasks yet</p>
              <p className="mt-3 text-lg text-blue-200/60">Create one above to get started</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-in fade-in slide-in-from-top-2 transition-all"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both',
                }}
              >
                {editingId === task.id ? (
                  <div className="space-y-4 rounded-3xl border-2 border-blue-400/30 bg-gradient-to-br from-blue-900/40 to-blue-800/30 p-8 shadow-2xl backdrop-blur-sm">
                    <div>
                      <label className="block text-xs font-semibold text-blue-300/90 mb-3 uppercase tracking-widest">Edit Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-blue-950/40 border-b-2 border-blue-400/40 text-2xl font-bold outline-none pb-3 focus:border-blue-400/80 text-blue-50"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-blue-300/90 mb-3 uppercase tracking-widest">Edit Description</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full resize-none bg-blue-950/40 border-b-2 border-blue-400/40 text-lg outline-none pb-4 focus:border-blue-400/80 text-blue-50"
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => updateTask(task.id)}
                        className="flex-1 rounded-xl border-2 border-blue-400/40 px-4 py-3 text-base font-bold transition-all hover:bg-blue-400/10 active:scale-95 text-blue-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 rounded-xl border-2 border-blue-400/40 px-4 py-3 text-base font-bold transition-all hover:bg-blue-400/10 active:scale-95 text-blue-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group rounded-3xl border-2 border-blue-400/30 bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-8 shadow-2xl transition-all hover:border-blue-400/60 hover:shadow-blue-900/50 hover:from-blue-900/50 hover:to-blue-800/40 backdrop-blur-sm">
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="pt-1 shrink-0">
                        <button
                          onClick={() => toggleTask(task)}
                          className="relative h-8 w-8 rounded-lg border-2 border-blue-400/60 transition-all hover:border-blue-300 focus:outline-none"
                          style={{
                            backgroundColor: task.completed ? '#3b82f6' : 'transparent',
                            borderColor: task.completed ? '#60a5fa' : undefined,
                          }}
                        >
                          {task.completed && (
                            <svg
                              className="absolute inset-0 h-full w-full p-1 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-2xl font-bold transition-all leading-snug break-words ${
                            task.completed
                              ? 'line-through text-blue-400/40'
                              : 'text-blue-50'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p
                            className={`mt-3 text-lg leading-relaxed transition-all break-words ${
                              task.completed
                                ? 'line-through text-blue-400/30'
                                : 'text-blue-200/75'
                            }`}
                          >
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
                        <button
                          onClick={() => {
                            setEditingId(task.id);
                            setEditTitle(task.title);
                            setEditDescription(task.description || '');
                          }}
                          className="rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:bg-blue-400/20 active:scale-95 whitespace-nowrap text-blue-300 hover:text-blue-100"
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:bg-red-500/20 active:scale-95 whitespace-nowrap text-red-300 hover:text-red-100"
                        >
                          × Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="mt-16 border-t-2 border-blue-400/20 pt-8">
            <div className="rounded-2xl bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-400/20 p-6 text-center backdrop-blur-sm">
              <p className="text-lg font-semibold text-blue-200">
                <span className="text-blue-400 font-bold">{tasks.length}</span> task{tasks.length !== 1 ? 's' : ''} •
                <span className="text-blue-400 font-bold ml-1">{tasks.filter(t => t.completed).length}</span> completed
              </p>
              <div className="mt-4 h-2 bg-blue-900/40 rounded-full overflow-hidden border border-blue-400/20">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInFromTop {
          from {
            transform: translateY(-12px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-in {
          animation: fadeIn 0.3s ease-out, slideInFromTop 0.3s ease-out;
        }

        input:focus,
        textarea:focus {
          box-shadow: none;
        }

        textarea {
          font-family: inherit;
        }
      `}</style>
    </main>
  );
}
