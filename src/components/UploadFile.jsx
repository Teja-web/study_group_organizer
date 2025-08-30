import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, serverTimestamp, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { storage, db, auth } from "../firebase";

export default function UploadFile({ groupId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!groupId) return;

    // Listen to resources in real-time
    const resourcesQuery = collection(db, "groups", groupId, "resources");
    const unsubscribe = onSnapshot(resourcesQuery, (snapshot) => {
      const resourcesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResources(resourcesData);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;

    try {
      setLoading(true);
      setUploadProgress(0);

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const fileRef = ref(storage, `groups/${groupId}/resources/${fileName}`);

      // Upload file
      await uploadBytes(fileRef, file);
      setUploadProgress(50);

      // Get download URL
      const url = await getDownloadURL(fileRef);
      setUploadProgress(75);

      // Save file details in Firestore
      await addDoc(collection(db, "groups", groupId, "resources"), {
        name: file.name,
        originalName: file.name,
        url: url,
        size: file.size,
        type: file.type,
        uploadedAt: serverTimestamp(),
        uploadedBy: auth.currentUser.uid,
        uploadedByName: auth.currentUser.displayName || auth.currentUser.email,
      });

      setUploadProgress(100);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (resource) => {
    if (!auth.currentUser || resource.uploadedBy !== auth.currentUser.uid) {
      alert("You can only delete your own files");
      return;
    }

    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      // Delete from Storage
      const fileRef = ref(storage, resource.url);
      await deleteObject(fileRef);

      // Delete from Firestore
      await deleteDoc(doc(db, "groups", groupId, "resources", resource.id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete file: " + err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📈';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    return '📁';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📤 Upload File</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileSelect}
              className="input"
              accept="*/*"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum file size: 10MB
            </p>
          </div>

          {file && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileIcon(file.type)}</span>
                <div className="flex-1">
                  <div className="font-medium text-blue-800">{file.name}</div>
                  <div className="text-sm text-blue-600">{formatFileSize(file.size)}</div>
                </div>
              </div>
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📁 Shared Files ({resources.length})
        </h3>
        
        {resources.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-gray-500">No files shared yet</p>
            <p className="text-sm text-gray-400">Upload the first file to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getFileIcon(resource.type)}</span>
                  <div>
                    <div className="font-medium text-gray-800">{resource.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatFileSize(resource.size)} • Uploaded by {resource.uploadedByName} • {resource.uploadedAt?.toDate?.()?.toLocaleDateString()}
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
                  {auth.currentUser && resource.uploadedBy === auth.currentUser.uid && (
                    <button
                      onClick={() => handleDelete(resource)}
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
}
