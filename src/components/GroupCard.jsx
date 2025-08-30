import React from 'react';

const GroupCard = ({ group, onJoin, onLeave, isMember }) => {
  const handleJoin = async () => {
    try {
      onJoin && onJoin(group.id);
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Failed to join group');
    }
  };

  const handleLeave = async () => {
    try {
      onLeave && onLeave(group.id);
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave group');
    }
  };

  const getMemberCount = () => {
    return group.members ? group.members.length : 0;
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

  return (
    <div className="card group-card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{group.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className={`badge ${getSubjectColor(group.subject)} text-white`}>
              {group.subject}
            </span>
            <span className="text-sm text-gray-500">
              {getMemberCount()}/{group.maxMembers || '∞'} members
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            Created by {group.createdBy}
          </div>
          <div className="text-xs text-gray-400">
            {group.createdAt?.toLocaleDateString() || 'Recently'}
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {group.description || 'No description available'}
      </p>

      {group.schedule && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-1">Study Schedule</div>
          <div className="text-sm text-gray-600">
            {group.schedule}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {group.tags && group.tags.length > 0 && (
            <div className="flex gap-1">
              {group.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="badge badge-primary text-xs">
                  {tag}
                </span>
              ))}
              {group.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{group.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {isMember ? (
            <button 
              onClick={handleLeave}
              className="btn btn-danger btn-sm"
            >
              Leave
            </button>
          ) : (
            <button 
              onClick={handleJoin}
              className="btn btn-primary btn-sm"
              disabled={group.maxMembers && getMemberCount() >= group.maxMembers}
            >
              {group.maxMembers && getMemberCount() >= group.maxMembers ? 'Full' : 'Join'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
