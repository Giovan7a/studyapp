import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar,
  Search,
  MoreVertical,
  ChevronDown,
  ArrowLeft,
  ArrowUpDown,
  Paperclip,
  CheckSquare,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  status: 'active' | 'in_progress' | 'done';
  priority: 'High' | 'Mid' | 'Low';
  subtasks: number;
  completedSubtasks: number;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
  const navigate = useNavigate();

  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('active');

  // Load from localStorage and migrate old tasks
  useEffect(() => {
    const savedTasks = localStorage.getItem('studyapp_tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        const migrated: Task[] = parsed.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || 'Far far away, behind the word...',
          date: t.date || new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
          tags: t.tags || ['Work'],
          status: t.status ? t.status : (t.completed ? 'done' : 'active'),
          priority: t.priority || 'Mid',
          subtasks: t.subtasks || 4,
          completedSubtasks: t.completedSubtasks || 0
        }));
        setTasks(migrated);
      } catch (err) {
        console.error("Failed to parse tasks");
      }
    } else {
      setTasks([
        { id: '1', title: 'Website Development', description: 'Make some ideation.', date: 'Nov 17', tags: ['Work'], status: 'active', priority: 'High', subtasks: 4, completedSubtasks: 0 },
        { id: '2', title: 'Update Contact Form', description: 'Visual design.', date: 'Nov 18', tags: ['Work'], status: 'active', priority: 'Mid', subtasks: 4, completedSubtasks: 0 },
        { id: '3', title: 'Integrate Payment Gateway', description: 'Prototyping.', date: 'Nov 17', tags: ['Work'], status: 'in_progress', priority: 'Low', subtasks: 10, completedSubtasks: 9 },
        { id: '4', title: 'Do back exercises', description: 'User testing.', date: 'Nov 17', tags: ['Health'], status: 'in_progress', priority: 'Mid', subtasks: 6, completedSubtasks: 4 },
        { id: '5', title: 'Visit a dermatologist', description: 'Meeting.', date: 'Nov 17', tags: ['Health'], status: 'done', priority: 'High', subtasks: 1, completedSubtasks: 1 }
      ]);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('studyapp_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const changeTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const getPriorityStyle = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-500 border-red-100';
      case 'Mid': return 'bg-orange-50 text-orange-500 border-orange-100';
      case 'Low': return 'bg-green-50 text-green-500 border-green-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getTagStyle = (tag: string) => {
    if (tag.toLowerCase().includes('health')) return 'bg-[#f2eff8] text-[#967cd2]'; 
    if (tag.toLowerCase().includes('work')) return 'bg-[#eff3ff] text-[#5d6bf8]'; 
    return 'bg-slate-50 text-slate-500';
  };

  const openModal = (status: Task['status'] = 'active') => {
    setNewTaskStatus(status);
    setIsModalOpen(true);
  };

  // --- RENDERING BOARD COLUMN ---
  const renderBoardColumn = (title: string, status: Task['status']) => {
    const columnTasks = tasks.filter(t => t.status === status);
    return (
      <div className="flex-1 flex flex-col min-w-[300px] w-full md:max-w-md rounded-[1rem]">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          <span className="text-slate-400 font-bold">({columnTasks.length})</span>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {columnTasks.map(task => {
            const progressPercent = task.subtasks > 0 ? (task.completedSubtasks / task.subtasks) * 100 : 0;
            return (
              <div
                key={task.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all group flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-bold text-slate-800 leading-snug">{task.title}</h4>
                  
                  {/* Status Dropdown to replace Drag & Drop */}
                  <div className="relative shrink-0">
                    <select 
                      value={task.status}
                      onChange={(e) => changeTaskStatus(task.id, e.target.value as Task['status'])}
                      className="appearance-none bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold py-1 px-2 pr-6 rounded-lg outline-none focus:border-[#5d6bf8] cursor-pointer"
                    >
                      <option value="active">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Progress */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><CheckSquare size={12}/> Progress</span>
                    <span className="text-slate-500">{task.completedSubtasks}/{task.subtasks} subtasks</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-[6px]">
                    <div className="bg-[#5d6bf8] h-[6px] rounded-full" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>
                
                {/* Tags & Priority */}
                <div className="flex items-center flex-wrap gap-2 mt-2">
                  {task.tags.map((tag, idx) => (
                    <span key={idx} className={`text-xs font-bold px-3 py-1.5 rounded-lg ${getTagStyle(tag)}`}>{tag}</span>
                  ))}
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${getPriorityStyle(task.priority)} flex items-center gap-1`}>
                    <span className="text-[10px]">⚑</span> {task.priority}
                  </span>
                </div>

                {/* Footer: Date & Attachments */}
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Calendar size={14} className="text-slate-300" />
                    {task.date}
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <Paperclip size={14} className="text-slate-300" />
                      {task.completedSubtasks}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- RENDERING LIST SECTION ---
  const renderListSection = (title: string, status: Task['status']) => {
    const sectionTasks = tasks.filter(t => t.status === status);
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ChevronDown size={18} className="text-slate-400" />
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          </div>
          <span className="text-slate-400 font-bold">({sectionTasks.length})</span>
        </div>

        {/* List Header (Desktop Only) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-400 mb-2">
          <div className="col-span-5">Task</div>
          <div className="col-span-3">Due Date</div>
          <div className="col-span-2">Task Tags</div>
          <div className="col-span-2">Priority</div>
        </div>

        {/* List Rows */}
        <div className="flex flex-col gap-2">
          {sectionTasks.map(task => (
            <div key={task.id} className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 md:items-center transition-all">
              
              {/* Task Title & Status Toggle */}
              <div className="col-span-5 flex items-start md:items-center gap-3 w-full">
                {/* Visual Checkbox to change status to done or active */}
                <input 
                  type="checkbox" 
                  className="w-4 h-4 mt-0.5 md:mt-0 rounded border-slate-300 text-[#5d6bf8] focus:ring-[#5d6bf8] cursor-pointer" 
                  checked={task.status === 'done'}
                  onChange={() => changeTaskStatus(task.id, task.status === 'done' ? 'active' : 'done')}
                />
                <span className={`font-bold text-sm flex-1 ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</span>
                
                {/* Mobile-only status dropdown to move between lists easily */}
                <div className="md:hidden relative shrink-0">
                  <select 
                    value={task.status}
                    onChange={(e) => changeTaskStatus(task.id, e.target.value as Task['status'])}
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold py-1 px-2 pr-6 rounded-lg outline-none focus:border-[#5d6bf8]"
                  >
                    <option value="active">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Due Date */}
              <div className="col-span-3 flex items-center gap-1.5 text-xs font-bold text-slate-500 ml-7 md:ml-0">
                <Calendar size={14} className="text-slate-300" />
                {task.date}
              </div>

              {/* Tags & Priority wrapper for Mobile */}
              <div className="col-span-4 flex items-center flex-wrap md:grid md:grid-cols-2 gap-2 md:gap-4 ml-7 md:ml-0 mt-1 md:mt-0">
                <div className="flex items-center flex-wrap gap-2">
                  {task.tags.map((tag, idx) => (
                    <span key={idx} className={`text-xs font-bold px-3 py-1.5 rounded-lg ${getTagStyle(tag)}`}>{tag}</span>
                  ))}
                </div>
                <div className="flex items-center">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${getPriorityStyle(task.priority)} flex items-center gap-1`}>
                    <span className="text-[10px]">⚑</span> {task.priority}
                  </span>
                </div>
              </div>

            </div>
          ))}
          {sectionTasks.length === 0 && <div className="text-sm font-bold text-slate-400 px-4">No tasks in this section.</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#fbfbfe] rounded-none md:rounded-[2.5rem] overflow-hidden relative">
      
      {/* ========================================================
          UNIVERSAL VIEW: TASKS BOARD/LIST (Fully Responsive)
      ======================================================== */}
      <div className="flex flex-col h-full w-full">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 md:px-8 border-b border-slate-100 gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
            {/* View Toggle */}
            <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-4 sm:px-5 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-[#5d6bf8] text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                List
              </button>
              <button 
                onClick={() => setViewMode('board')}
                className={`px-4 sm:px-5 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'board' ? 'bg-[#5d6bf8] text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Board
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Button */}
              <button className="flex items-center justify-center w-11 h-11 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <ArrowUpDown size={18} />
              </button>

              {/* Add Button */}
              <button 
                onClick={() => openModal('active')}
                className="flex items-center justify-center w-11 h-11 bg-[#5d6bf8] text-white rounded-2xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 shrink-0"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-5 md:p-8">
          {viewMode === 'list' ? (
            <div className="max-w-5xl mx-auto w-full">
              {renderListSection('To Do', 'active')}
              {renderListSection('In Progress', 'in_progress')}
              {renderListSection('Done', 'done')}
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 h-full md:min-h-[500px]">
              {renderBoardColumn('To Do', 'active')}
              {renderBoardColumn('In Progress', 'in_progress')}
              {renderBoardColumn('Done', 'done')}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          NEW TASK MODAL
      ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTaskTitle.trim()) return;
              const newTask: Task = {
                id: Date.now().toString(),
                title: newTaskTitle.trim(),
                description: newTaskDesc.trim() || 'Far far away, behind the word...',
                date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
                tags: ['Work'],
                status: newTaskStatus,
                priority: 'Mid',
                subtasks: 4,
                completedSubtasks: 0
              };
              setTasks([...tasks, newTask]);
              setIsModalOpen(false);
              setNewTaskTitle('');
              setNewTaskDesc('');
            }}
            className="bg-white rounded-[2rem] p-6 md:p-8 w-full max-w-md shadow-2xl relative"
          >
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 p-2 rounded-full"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Task</h2>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Task Name</label>
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-[#4c3575]"
                  placeholder="E.g., Review Math Notes"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Initial Status</label>
                <select 
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value as Task['status'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#4c3575] appearance-none"
                >
                  <option value="active">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <button 
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="w-full bg-[#5d6bf8] text-white rounded-xl py-4 font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              Add Task
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
