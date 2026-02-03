'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { LogOut, Plus, Trash2, CheckCircle, Circle, Loader2 } from 'lucide-react';

interface TaskOwner {
  id: number;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  owner_id: number;
  owner?: TaskOwner;  // Only present for admin users
}

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTasks();
    }
  }, [user, authLoading, router]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err: any) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/tasks', { title: newTitle, description: newDesc });
      setNewTitle('');
      setNewDesc('');
      setSuccess('Task added successfully!');
      fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add task');
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      await api.put(`/tasks/${task.id}`, { ...task, is_completed: !task.is_completed });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setSuccess('Task deleted successfully!');
      fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 pb-12">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-xl font-bold text-white">Primetrade Task Manager</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">{user.email} ({user.role})</span>
              <button 
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Add Task Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <h2 className="text-lg font-semibold mb-4 text-white">Add New Task</h2>
          <form onSubmit={addTask} className="space-y-4">
            <input 
              className="w-full rounded-lg border-0 py-3 px-4 text-white bg-white/10 ring-1 ring-inset ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400" 
              placeholder="Task Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <textarea 
              className="w-full rounded-lg border-0 py-3 px-4 text-white bg-white/10 ring-1 ring-inset ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 resize-none" 
              placeholder="Description (optional)"
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-200 text-sm">
                {success}
              </div>
            )}

            <button 
              type="submit" 
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-400 transition-all duration-200"
            >
              <Plus className="h-4 w-4" /> Add Task
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {user.role === 'admin' ? 'All Tasks (Admin View)' : 'Your Tasks'}
          </h2>
          {user.role === 'admin' && (
            <p className="text-sm text-indigo-300">As an admin, you can see tasks from all users.</p>
          )}
          
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
          
          {!loading && tasks.length === 0 && (
            <p className="text-gray-400 italic text-center py-8">No tasks found. Add one above!</p>
          )}
          
          {!loading && tasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-4 flex justify-between items-center border border-white/20 hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <button onClick={() => toggleTask(task)} className="mt-1 transition-transform hover:scale-110">
                  {task.is_completed ? 
                    <CheckCircle className="h-5 w-5 text-green-400" /> : 
                    <Circle className="h-5 w-5 text-gray-400 hover:text-indigo-400" />
                  }
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${task.is_completed ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</h3>
                    {task.owner && user.role === 'admin' && (
                      <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full">
                        by {task.owner.email}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{task.description}</p>
                </div>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
