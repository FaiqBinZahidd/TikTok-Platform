import React, { useState, useMemo } from 'react';
import { MessageSquare, CheckSquare2, Share2, Bell, Plus, Trash2, User, Clock, Heart, Reply } from 'lucide-react';
import * as collaborationUtils from '../../utils/collaborationUtils';

export default function CollaborationView({ 
  collaborativeComments = [], 
  setCollaborativeComments,
  tasks = [],
  setTasks,
  currentUser 
}) {
  const [activeTab, setActiveTab] = useState('comments');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    assignee: currentUser || 'Unassigned',
    priority: 'medium',
    dueDate: ''
  });
  const [commentFormData, setCommentFormData] = useState({
    text: '',
    targetType: 'product',
    targetId: '1'
  });

  // Filter comments
  const filteredComments = useMemo(() => {
    return (collaborativeComments || []).filter(comment => 
      comment.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collaborativeComments, searchTerm]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return (tasks || []).filter(task => 
      task.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const taskStats = useMemo(() => {
    const total = (tasks || []).length;
    const completed = (tasks || []).filter(t => t.status === 'completed').length;
    const pending = (tasks || []).filter(t => t.status === 'pending').length;
    return { total, completed, pending };
  }, [tasks]);

  const handleAddComment = () => {
    if (!commentFormData.text.trim()) {
      alert('Please enter a comment');
      return;
    }

    const newComment = collaborationUtils.createComment({
      text: commentFormData.text,
      author: currentUser || 'Anonymous',
      targetType: commentFormData.targetType,
      targetId: commentFormData.targetId
    });

    setCollaborativeComments([...(collaborativeComments || []), newComment]);
    setCommentFormData({ text: '', targetType: 'product', targetId: '1' });
  };

  const handleDeleteComment = (commentId) => {
    collaborationUtils.deleteComment(commentId);
    setCollaborativeComments((collaborativeComments || []).filter(c => c.id !== commentId));
  };

  const handleLikeComment = (commentId) => {
    collaborationUtils.likeComment(commentId);
    setCollaborativeComments((collaborativeComments || []).map(c =>
      c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
    ));
  };

  const handleAddTask = () => {
    if (!taskFormData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const newTask = collaborationUtils.createTask({
      title: taskFormData.title,
      description: taskFormData.description,
      assignee: taskFormData.assignee,
      priority: taskFormData.priority,
      dueDate: taskFormData.dueDate,
      status: 'pending'
    });

    setTasks([...(tasks || []), newTask]);
    setTaskFormData({
      title: '',
      description: '',
      assignee: currentUser || 'Unassigned',
      priority: 'medium',
      dueDate: ''
    });
    setShowAddTask(false);
  };

  const handleCompleteTask = (taskId) => {
    collaborationUtils.updateTaskStatus(taskId, 'completed');
    setTasks((tasks || []).map(t =>
      t.id === taskId ? { ...t, status: 'completed' } : t
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks((tasks || []).filter(t => t.id !== taskId));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-rose-100 text-rose-700 border-rose-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Team Collaboration</h2>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-3 font-medium transition-all border-b-2 ${
              activeTab === 'comments'
                ? 'text-violet-600 border-violet-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Comments {(collaborativeComments || []).length}
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-3 font-medium transition-all border-b-2 ${
              activeTab === 'tasks'
                ? 'text-violet-600 border-violet-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <CheckSquare2 className="w-4 h-4 inline mr-2" />
            Tasks {(tasks || []).length}
          </button>
        </div>
      </div>

      {/* Comments Tab */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          {/* Add Comment Form */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Comment</h3>
            <div className="space-y-4">
              <textarea
                value={commentFormData.text}
                onChange={(e) => setCommentFormData({ ...commentFormData, text: e.target.value })}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={commentFormData.targetType}
                  onChange={(e) => setCommentFormData({ ...commentFormData, targetType: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="product">Product</option>
                  <option value="campaign">Campaign</option>
                  <option value="dashboard">Dashboard</option>
                  <option value="general">General</option>
                </select>
                <input
                  type="text"
                  placeholder="Target ID (optional)"
                  value={commentFormData.targetId}
                  onChange={(e) => setCommentFormData({ ...commentFormData, targetId: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <button
                onClick={handleAddComment}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition-all"
              >
                Post Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {filteredComments.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>No comments yet. Start the conversation!</p>
              </div>
            ) : (
              filteredComments.map(comment => (
                <div key={comment.id} className="bg-white rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
                        {(comment.author || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{comment.author || 'Anonymous'}</p>
                        <p className="text-xs text-slate-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-700 mb-3">{comment.text}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1"
                    >
                      <Heart className="w-4 h-4" />
                      {comment.likes || 0}
                    </button>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {comment.targetType}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-lg border border-violet-200">
              <p className="text-slate-600 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-violet-700">{taskStats.total}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
              <p className="text-slate-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-emerald-700">{taskStats.completed}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <p className="text-slate-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-orange-700">{taskStats.pending}</p>
            </div>
          </div>

          {/* Add Task Form */}
          {showAddTask && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Task</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <input
                  type="text"
                  placeholder="Assign To"
                  value={taskFormData.assignee}
                  onChange={(e) => setTaskFormData({ ...taskFormData, assignee: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <select
                  value={taskFormData.priority}
                  onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input
                  type="date"
                  value={taskFormData.dueDate}
                  onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <textarea
                placeholder="Description (optional)"
                value={taskFormData.description}
                onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none mb-4"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddTask}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-all"
                >
                  Create Task
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!showAddTask && (
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          )}

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
                <CheckSquare2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>No tasks yet. Create one to organize team work!</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`bg-white rounded-lg border border-slate-200 p-4 transition-all ${
                    task.status === 'completed' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          task.status === 'completed'
                            ? 'bg-emerald-600 border-emerald-600'
                            : 'border-slate-300 hover:border-emerald-600'
                        }`}
                      >
                        {task.status === 'completed' && <span className="text-white text-xs">✓</span>}
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-semibold transition-all ${
                          task.status === 'completed' 
                            ? 'line-through text-slate-400' 
                            : 'text-slate-900'
                        }`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className={`px-2 py-1 rounded border ${getPriorityColor(task.priority || 'medium')}`}>
                            {(task.priority || 'medium').charAt(0).toUpperCase() + (task.priority || 'medium').slice(1)}
                          </span>
                          <span className="text-slate-600 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {task.assignee || 'Unassigned'}
                          </span>
                          {task.dueDate && (
                            <span className="text-slate-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
