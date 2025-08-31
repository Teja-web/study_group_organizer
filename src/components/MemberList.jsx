import React, { useState, useEffect } from 'react';

const MemberList = ({ groupId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);

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
      maxMembers: 15,
      createdByUid: "professor"
    };

    const mockMembers = [
      {
        uid: "professor",
        email: "professor@university.edu",
        displayName: "Professor Smith",
        joinedAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        uid: "john",
        email: "john.doe@student.edu",
        displayName: "John Doe",
        joinedAt: new Date(Date.now() - 82800000) // 23 hours ago
      },
      {
        uid: "jane",
        email: "jane.smith@student.edu",
        displayName: "Jane Smith",
        joinedAt: new Date(Date.now() - 7200000) // 2 hours ago
      },
      {
        uid: "mike",
        email: "mike.johnson@student.edu",
        displayName: "Mike Johnson",
        joinedAt: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        uid: "mock-user-id",
        email: "test@example.com",
        displayName: "Test User",
        joinedAt: new Date(Date.now() - 1800000) // 30 minutes ago
      }
    ];

    setTimeout(() => {
      setGroup(mockGroup);
      setMembers(mockMembers);
      setLoading(false);
    }, 1000);
  }, [groupId]);

  const handleLeaveGroup = async () => {
    if (!user) return;

    if (window.confirm("Are you sure you want to leave this group?")) {
      try {
        // Remove user from members list
        setMembers(prev => prev.filter(member => member.uid !== user.uid));
        
        // Show success message
        alert("You have left the group successfully!");
        
        // Redirect to groups page after a short delay
        setTimeout(() => {
          window.location.href = '/groups';
        }, 1000);
      } catch (error) {
        console.error("Error leaving group:", error);
        alert("Failed to leave group");
      }
    }
  };

  const isCreator = (memberUid) => {
    return group?.createdByUid === memberUid;
  };

  const isCurrentUser = (memberUid) => {
    return user?.uid === memberUid;
  };

  const getMemberCount = () => {
    return members.length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading"></div>
        <span className="ml-2 text-gray-600">Loading members...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Group Info */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">👥 Group Members</h3>
          <div className="text-sm text-gray-500">
            {getMemberCount()}/{group?.maxMembers || '∞'} members
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Group:</span> {group?.name}
          </div>
          <div>
            <span className="font-medium">Subject:</span> {group?.subject}
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="card">
        <h4 className="font-medium text-gray-700 mb-4">Members ({members.length})</h4>
        
        {members.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-500">No members in this group yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.uid} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    {member.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {member.displayName}
                      </span>
                      {isCreator(member.uid) && (
                        <span className="badge badge-success">Creator</span>
                      )}
                      {isCurrentUser(member.uid) && (
                        <span className="badge badge-primary">You</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.email}
                    </div>
                    <div className="text-xs text-gray-400">
                      Joined {member.joinedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isCurrentUser(member.uid) && !isCreator(member.uid) && (
                    <button
                      onClick={handleLeaveGroup}
                      className="btn btn-danger btn-sm"
                    >
                      Leave Group
                    </button>
                  )}
                  {isCreator(member.uid) && (
                    <span className="text-sm text-gray-400">Group Creator</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center p-4">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {getMemberCount()}
          </div>
          <div className="text-sm text-gray-600">Total Members</div>
        </div>
        
        <div className="card text-center p-4">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {members.filter(m => !isCreator(m.uid)).length}
          </div>
          <div className="text-sm text-gray-600">Students</div>
        </div>
        
        <div className="card text-center p-4">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {group?.maxMembers ? group.maxMembers - getMemberCount() : '∞'}
          </div>
          <div className="text-sm text-gray-600">Available Spots</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h4 className="font-medium text-gray-700 mb-4">⚡ Quick Actions</h4>
        <div className="flex gap-2">
          <button className="btn btn-primary btn-sm">
            📧 Invite Members
          </button>
          <button className="btn btn-secondary btn-sm">
            📊 View Analytics
          </button>
          {isCreator(user?.uid) && (
            <button className="btn btn-secondary btn-sm">
              ⚙️ Group Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberList;
