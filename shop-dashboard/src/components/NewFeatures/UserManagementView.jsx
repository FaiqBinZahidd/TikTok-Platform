import React, { useState, useMemo } from 'react';
import { Users, Plus, Trash2, Edit2, Shield, Mail, User as UserIcon, Key, Search } from 'lucide-react';
import * as userManagement from '../../utils/userManagement';

export default function UserManagementView({ allUsers = [], setAllUsers, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', role: 'viewer', department: 'General' });

  // Filtered users
  const filteredUsers = useMemo(() => {
    return (allUsers || []).filter(user => {
      const matchSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'all' || user.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [allUsers, searchTerm, roleFilter]);

  const handleAddUser = () => {
    if (!formData.username || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    const newUser = userManagement.createUser({
      username: formData.username,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: 'active'
    });

    setAllUsers([...(allUsers || []), newUser]);
    setFormData({ username: '', email: '', role: 'viewer', department: 'General' });
    setShowAddUser(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      userManagement.deleteUser(userId);
      setAllUsers((allUsers || []).filter(u => u.id !== userId));
    }
  };

  const handleChangeRole = (userId, newRole) => {
    const user = (allUsers || []).find(u => u.id === userId);
    if (user) {
      userManagement.updateUser(userId, { ...user, role: newRole });
      setAllUsers((allUsers || []).map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-700 border-red-200',
      manager: 'bg-blue-100 text-blue-700 border-blue-200',
      analyst: 'bg-purple-100 text-purple-700 border-purple-200',
      viewer: 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return colors[role] || colors.viewer;
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' 
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="analyst">Analyst</option>
                <option value="viewer">Viewer</option>
              </select>
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddUser}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-all"
              >
                Create User
              </button>
              <button
                onClick={() => setShowAddUser(false)}
                className="bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="analyst">Analyst</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-lg border border-violet-200">
            <p className="text-slate-600 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-violet-700">{(allUsers || []).length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-slate-600 text-sm">Admins</p>
            <p className="text-2xl font-bold text-blue-700">{(allUsers || []).filter(u => u.role === 'admin').length}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
            <p className="text-slate-600 text-sm">Managers</p>
            <p className="text-2xl font-bold text-emerald-700">{(allUsers || []).filter(u => u.role === 'manager').length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <p className="text-slate-600 text-sm">Active</p>
            <p className="text-2xl font-bold text-orange-700">{(allUsers || []).filter(u => u.status === 'active').length}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-slate-600 font-semibold">User</th>
                <th className="px-6 py-3 text-left text-slate-600 font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-slate-600 font-semibold">Department</th>
                <th className="px-6 py-3 text-left text-slate-600 font-semibold">Role</th>
                <th className="px-6 py-3 text-left text-slate-600 font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-slate-600 font-semibold">Last Login</th>
                <th className="px-6 py-3 text-center text-slate-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900">{user.username}</td>
                    <td className="px-6 py-3 text-slate-700">{user.email}</td>
                    <td className="px-6 py-3 text-slate-600">{user.department || 'N/A'}</td>
                    <td className="px-6 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg border font-semibold text-xs ${getRoleBadgeColor(user.role)} cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500`}
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="analyst">Analyst</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-lg border font-semibold text-xs ${getStatusBadgeColor(user.status || 'active')}`}>
                        {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-xs">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-rose-600 hover:text-rose-700 font-medium transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
