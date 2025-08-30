import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';

const MemberList = ({ groupId }) => {
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchGroupAndMembers = async () => {
      try {
        setLoading(true);
        
        // Fetch group details
        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        if (groupDoc.exists()) {
          const groupData = { id: groupDoc.id, ...groupDoc.data() };
          setGroup(groupData);
          
          // For now, we'll use member UIDs as display names
          // In a real app, you'd fetch user profiles from a users collection
          const memberList = (groupData.members || []).map(uid => ({
            uid,
            displayName: uid === auth.currentUser?.uid ? 'You' : `User ${uid.slice(0, 8)}`,
            email: uid === auth.currentUser?.uid ? auth.currentUser?.email : 'user@example.com',
            isCreator: uid === groupData.createdByUid
          }));
          
          setMembers(memberList);
        }
      } catch (error) {
        console.error('Error fetching group members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndMembers();
  }, [groupId]);

  const handleLeaveGroup = async () => {
    if (!auth.currentUser) return;

    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(auth.currentUser.uid)
      });
      
      // Update local state
      setMembers(prev => prev.filter(member => member.uid !== auth.currentUser.uid));
      
      alert('You have left the group');
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave group');
    }
  };

  const isCreator = (memberUid) => {
    return memberUid === group?.createdByUid;
  };

  const isCurrentUser = (memberUid) => {
    return memberUid === auth.currentUser?.uid;
  };

  const canLeave = () => {
    return auth.currentUser && members.some(m => m.uid === auth.currentUser.uid);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loading"></div>
        <span className="ml-2 text-gray-600">Loading members...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Group Members</h3>
        <div className="text-sm text-gray-500">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </div>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👥</div>
          <p className="text-gray-500">No members in this group yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.uid}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
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
                </div>
              </div>
              
              {isCurrentUser(member.uid) && !isCreator(member.uid) && (
                <button
                  onClick={handleLeaveGroup}
                  className="btn btn-danger btn-sm"
                >
                  Leave Group
                </button>
              )}
              
              {isCreator(member.uid) && (
                <span className="text-sm text-gray-400">
                  Group Creator
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Leave Group Section */}
      {canLeave() && !isCreator(auth.currentUser?.uid) && (
        <div className="mt-8 p-4 border border-red-200 bg-red-50 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Leave Group</h4>
          <p className="text-sm text-red-600 mb-3">
            You can leave this group at any time. You'll lose access to all group content.
          </p>
          <button
            onClick={handleLeaveGroup}
            className="btn btn-danger"
          >
            Leave Group
          </button>
        </div>
      )}

      {/* Group Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Group Information</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Created by: {group?.createdBy}</p>
          <p>• Created on: {group?.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</p>
          <p>• Member limit: {group?.maxMembers || 'Unlimited'}</p>
          {group?.subject && <p>• Subject: {group.subject}</p>}
        </div>
      </div>
    </div>
  );
};

export default MemberList;
