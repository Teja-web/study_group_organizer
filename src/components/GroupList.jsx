import React, { useState, useEffect } from "react";
import GroupCard from "./GroupCard";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const subjects = [
    "All Subjects",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "History",
    "Literature"
  ];

  // Mock data for testing
  useEffect(() => {
    const mockGroups = [
      {
        id: "1",
        name: "Advanced Calculus Study Group",
        subject: "Mathematics",
        description: "A group for students studying advanced calculus concepts and problem-solving techniques.",
        maxMembers: 15,
        schedule: "Every Tuesday and Thursday at 4 PM",
        tags: ["calculus", "advanced", "problem-solving"],
        createdBy: "professor@university.edu",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        members: ["user1", "user2", "user3"]
      },
      {
        id: "2",
        name: "Physics Lab Partners",
        subject: "Physics",
        description: "Collaborative group for physics lab experiments and theoretical discussions.",
        maxMembers: 8,
        schedule: "Flexible schedule based on lab availability",
        tags: ["lab", "experiments", "theory"],
        createdBy: "student@university.edu",
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        members: ["user1", "user4", "user5"]
      },
      {
        id: "3",
        name: "Computer Science Coding Club",
        subject: "Computer Science",
        description: "Weekly coding sessions and algorithm practice for CS students.",
        maxMembers: 20,
        schedule: "Every Saturday at 10 AM",
        tags: ["coding", "algorithms", "practice"],
        createdBy: "cs_student@university.edu",
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        members: ["user1", "user6", "user7", "user8"]
      }
    ];

    setTimeout(() => {
      setGroups(mockGroups);
      setFilteredGroups(mockGroups);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort groups
  useEffect(() => {
    let filtered = [...groups];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by subject
    if (selectedSubject && selectedSubject !== "All Subjects") {
      filtered = filtered.filter(group => group.subject === selectedSubject);
    }

    // Sort groups
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "members":
          return (b.members?.length || 0) - (a.members?.length || 0);
        case "createdAt":
        default:
          return b.createdAt - a.createdAt;
      }
    });

    setFilteredGroups(filtered);
  }, [groups, searchTerm, selectedSubject, sortBy]);

  const handleJoin = (groupId) => {
    if (!user) {
      alert('Please login to join groups');
      return;
    }

    // Update local state to reflect the join
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              members: [...(group.members || []), user.uid]
            }
          : group
      )
    );
  };

  const handleLeave = (groupId) => {
    if (!user) return;

    // Update local state to reflect leaving
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              members: group.members?.filter(id => id !== user.uid) || []
            }
          : group
      )
    );
  };

  const isMember = (group) => {
    return user && group.members?.includes(user.uid) || false;
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loading"></div>
          <span className="ml-2 text-gray-600">Loading groups...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Study Groups</h1>
        <p className="text-white/80">Find and join study groups that match your interests</p>
      </div>

      {/* Search and Filter Section */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Groups
            </label>
            <input
              type="text"
              placeholder="Search by name, description, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="select"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select"
            >
              <option value="createdAt">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="members">Most Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-white">
          Showing {filteredGroups.length} of {groups.length} groups
        </p>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No groups found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedSubject !== "All Subjects" 
              ? "Try adjusting your search or filters"
              : "Be the first to create a study group!"
            }
          </p>
          {!searchTerm && selectedSubject === "All Subjects" && (
            <button className="btn btn-primary">
              Create First Group
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onJoin={handleJoin}
              onLeave={handleLeave}
              isMember={isMember(group)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;
