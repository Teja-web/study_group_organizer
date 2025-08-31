import React, { useState, useEffect } from "react";

const UploadFile = ({ groupId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Mock resources data
  useEffect(() => {
    const mockResources = [
      {
        id: "1",
        name: "Calculus_Chapter_1_Notes.pdf",
        originalName: "Calculus_Chapter_1_Notes.pdf",
        url: "#",
        size: 2048576, // 2MB
        type: "application/pdf",
        uploadedAt: new Date(Date.now() - 86400000), // 1 day ago
        uploadedBy: "professor",
        uploadedByName: "Professor Smith"
      },
      {
        id: "2",
        name: "Integration_Practice_Problems.docx",
        originalName: "Integration_Practice_Problems.docx",
        url: "#",
        size: 1048576, // 1MB
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploadedAt: new Date(Date.now() - 43200000), // 12 hours ago
        uploadedBy: "john",
        uploadedByName: "John Doe"
      },
      {
        id: "3",
        name: "Study_Schedule_2024.xlsx",
        originalName: "Study_Schedule_2024.xlsx",
        url: "#",
        size: 512000, // 512KB
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: new Date(Date.now() - 21600000), // 6 hours ago
        uploadedBy: "jane",
        uploadedByName: "Jane Smith"
      }
    ];

    setTimeout(() => {
      setResources(mockResources);
    }, 1000);
  }, [groupId]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create mock resource data
      const resourceData = {
        id: Date.now().toString(),
        name: file.name,
        originalName: file.name,
        url: URL.createObjectURL(file), // Create a blob URL for preview
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        uploadedBy: user.uid,
        uploadedByName: user.displayName || user.email
      };

      // Add to resources list
      setResources(prev => [resourceData, ...prev]);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (!user) return;

    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        // Remove from local state
        setResources(prev => prev.filter(resource => resource.id !== resourceId));
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete file");
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    return '📁';
  };

  const canDelete = (resource) => {
    return resource.uploadedBy === user?.uid;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="card">
        <h4 className="font-medium text-gray-700 mb-4">📤 Upload New File</h4>
        
        <div className="space-y-4">
          {/* File Input */}
          <div>
            <input
              type="file"
              id="file-input"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum file size: 10MB. Supported formats: PDF, DOC, XLS, PPT, TXT, Images
            </p>
          </div>

          {/* Selected File Preview */}
          {file && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileIcon(file.type)}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{file.name}</div>
                  <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <div className="loading mr-2"></div>
                Uploading...
              </>
            ) : (
              'Upload File'
            )}
          </button>
        </div>
      </div>

      {/* Files List */}
      <div className="card">
        <h4 className="font-medium text-gray-700 mb-4">📁 Shared Files ({resources.length})</h4>
        
        {resources.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-gray-500">No files shared yet</p>
            <p className="text-sm text-gray-400">Be the first to share a resource!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(resource.type)}</span>
                  <div>
                    <div className="font-medium text-gray-800">{resource.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatFileSize(resource.size)} • Uploaded by {resource.uploadedByName} • {resource.uploadedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Download
                  </a>
                  {canDelete(resource) && (
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
