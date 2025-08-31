import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Chat from './Chat';
import UploadFile from './UploadFile';
import MemberList from './MemberList';

const GroupDashboard = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Mock data for testing
  useEffect(() => {
    const mockGroup = {
      id: groupId,
      name: "Advanced Calculus Study Group",
      subject: "Mathematics",
      description: "A comprehensive study group for advanced calculus concepts, problem-solving techniques, and exam preparation.",
      maxMembers: 15,
      schedule: "Every Tuesday and Thursday at 4 PM, with additional weekend sessions for exam prep",
      tags: ["calculus", "advanced", "problem-solving", "exam-prep"],
      createdBy: "professor@university.edu",
      createdAt: new Date(Date.now() - 86400000),
      members: ["user1", "user2", "user3", "mock-user-id"] // Include the mock user ID
    };

    setTimeout(() => {
      setGroup(mockGroup);
      setLoading(false);
    }, 1000);
  }, [groupId]);

  const isMember = () => {
    return user && group?.members?.includes(user.uid) || false;
  };

  const getMemberCount = () => {
    return group?.members?.length || 0;
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

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loading"></div>
          <span className="ml-2 text-gray-600">Loading group...</span>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container py-8">
        <div className="card text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Not Found</h2>
          <p className="text-gray-600 mb-6">The group you're looking for doesn't exist.</p>
          <Link to="/groups" className="btn btn-primary">
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Group Header */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
              <span className={`badge ${getSubjectColor(group.subject)} text-white`}>
                {group.subject}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{group.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👥 {getMemberCount()}/{group.maxMembers || '∞'} members</span>
              <span>📅 Created {group.createdAt?.toLocaleDateString() || 'Recently'}</span>
              <span>👤 by {group.createdBy}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/groups" className="btn btn-secondary">
              Back to Groups
            </Link>
            {!isMember() && (
              <button className="btn btn-primary">
                Join Group
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'chat', label: 'Chat', icon: '💬' },
          { id: 'resources', label: 'Resources', icon: '📁' },
          { id: 'members', label: 'Members', icon: '👥' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Group Info */}
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Group Information</h3>
                
                {group.schedule && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">📅 Study Schedule</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {group.schedule}
                    </p>
                  </div>
                )}

                {group.tags && group.tags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-2">🏷️ Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag, index) => (
                        <span key={index} className="badge badge-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">📝 Description</h4>
                  <p className="text-gray-600">
                    {group.description || 'No description available.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              {/* Recent Messages */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">💬 Recent Messages</h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-blue-500 pl-3">
                    <div className="text-sm font-medium text-gray-700">John Doe</div>
                    <div className="text-sm text-gray-600 truncate">Anyone up for a study session tomorrow?</div>
                    <div className="text-xs text-gray-400">2 hours ago</div>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-3">
                    <div className="text-sm font-medium text-gray-700">Jane Smith</div>
                    <div className="text-sm text-gray-600 truncate">I found some great practice problems!</div>
                    <div className="text-xs text-gray-400">4 hours ago</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="btn btn-primary btn-sm w-full mt-4"
                >
                  View All Messages
                </button>
              </div>

              {/* Shared Resources */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📁 Shared Resources</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  5
                </div>
                <p className="text-sm text-gray-600 mb-4">files shared</p>
                <button
                  onClick={() => setActiveTab('resources')}
                  className="btn btn-secondary btn-sm w-full"
                >
                  View All Resources
                </button>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="btn btn-primary btn-sm w-full"
                  >
                    💬 Start Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className="btn btn-secondary btn-sm w-full"
                  >
                    📤 Upload File
                  </button>
                  <button
                    onClick={() => setActiveTab('members')}
                    className="btn btn-secondary btn-sm w-full"
                  >
                    👥 View Members
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="card">
            <Chat groupId={groupId} />
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📁 Shared Resources</h3>
            <UploadFile groupId={groupId} />
          </div>
        )}

        {activeTab === 'members' && (
          <div className="card">
            <MemberList groupId={groupId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDashboard;
