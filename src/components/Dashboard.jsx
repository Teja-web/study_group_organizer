// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateGroup from "./CreateGroup";

const Dashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear localStorage and redirect to home
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleGroupCreated = (newGroup) => {
    setUserGroups(prev => [newGroup, ...prev]);
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-500',
      'Physics': 'bg-purple-500',
      'Chemistry': 'bg-green-500',
      'Biology': 'bg-red-500',
      'Computer Science': 'bg-indigo-500',
      'English': 'bg-yellow-500',
      'History': 'bg-orange-500',
      'Literature': 'bg-pink-500'
    };
    return colors[subject] || 'bg-gray-500';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">Study Group Organizer</h1>
              <span className="text-sm text-gray-500">Welcome back, {user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Browse Groups</h3>
            <p className="text-gray-600 mb-4">Find and join study groups that match your interests</p>
            <Link to="/groups" className="btn btn-primary w-full">
              Explore Groups
            </Link>
          </div>

          <div className="card text-center p-6">
            <div className="text-4xl mb-4">➕</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Create Group</h3>
            <p className="text-gray-600 mb-4">Start your own study group and invite others to join</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary w-full"
            >
              Create Group
            </button>
          </div>

          <div className="card text-center p-6">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">My Groups</h3>
            <p className="text-gray-600 mb-4">Access your joined groups and manage your studies</p>
            <Link to="/groups" className="btn btn-secondary w-full">
              View All Groups
            </Link>
          </div>
        </div>

        {/* Recent Groups */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">My Study Groups</h2>
            <Link to="/groups" className="btn btn-primary btn-sm">
              View All Groups
            </Link>
          </div>

          {userGroups.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No groups yet
              </h3>
              <p className="text-gray-600 mb-6">
                Join or create your first study group to get started!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                >
                  Create Group
                </button>
                <Link to="/groups" className="btn btn-secondary">
                  Browse Groups
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userGroups.slice(0, 6).map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{group.name}</h3>
                      <span className={`badge ${getSubjectColor(group.subject)} text-white text-xs`}>
                        {group.subject}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {group.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {group.members?.length || 0} members
                    </span>
                    <Link
                      to={`/group/${group.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Open Group
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="card text-center p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {userGroups.length}
            </div>
            <div className="text-sm text-gray-600">Groups Joined</div>
          </div>
          
          <div className="card text-center p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {userGroups.filter(g => g.createdByUid === user.uid).length}
            </div>
            <div className="text-sm text-gray-600">Groups Created</div>
          </div>
          
          <div className="card text-center p-4">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {userGroups.reduce((total, group) => total + (group.members?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          
          <div className="card text-center p-4">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {new Set(userGroups.map(g => g.subject)).size}
            </div>
            <div className="text-sm text-gray-600">Subjects</div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      <CreateGroup
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  );
};

export default Dashboard;
