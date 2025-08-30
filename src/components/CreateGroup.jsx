// src/components/CreateGroup.jsx
import { useState } from "react";

const CreateGroup = ({ isOpen, onClose, onGroupCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    maxMembers: "",
    schedule: "",
    tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subjects = [
    "Mathematics",
    "Physics", 
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "History",
    "Literature"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Group name is required");
      return;
    }

    if (!formData.subject) {
      setError("Please select a subject");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const groupData = {
        id: Date.now().toString(), // Simple ID generation
        name: formData.name.trim(),
        subject: formData.subject,
        description: formData.description.trim(),
        maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : null,
        schedule: formData.schedule.trim(),
        tags: tagsArray,
        createdBy: "user@example.com",
        createdByUid: "user",
        createdAt: new Date(),
        members: ["user"]
      };

      // Simulate API call
      setTimeout(() => {
        onGroupCreated && onGroupCreated(groupData);
        
        // Reset form
        setFormData({
          name: "",
          subject: "",
          description: "",
          maxMembers: "",
          schedule: "",
          tags: ""
        });

        onClose();
      }, 1000);
      
    } catch (err) {
      setError("Failed to create group: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Study Group</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter group name..."
              className="input"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="select"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what this study group is about..."
              className="textarea"
              rows="3"
            />
          </div>

          {/* Max Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Members (Optional)
            </label>
            <input
              type="number"
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleInputChange}
              placeholder="Leave empty for unlimited"
              className="input"
              min="2"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to allow unlimited members
            </p>
          </div>

          {/* Study Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Study Schedule Preferences
            </label>
            <textarea
              name="schedule"
              value={formData.schedule}
              onChange={handleInputChange}
              placeholder="e.g., Every Monday and Wednesday at 6 PM, or Flexible schedule..."
              className="textarea"
              rows="2"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by commas (e.g., beginner, advanced, exam-prep)"
              className="input"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
