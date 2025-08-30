import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "../firebase";

export default function UploadFile({ groupId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first");

    try {
      setLoading(true);

      // 1. Create a reference in Firebase Storage
      const fileRef = ref(storage, `groups/${groupId}/resources/${file.name}`);

      // 2. Upload file
      await uploadBytes(fileRef, file);

      // 3. Get download URL
      const url = await getDownloadURL(fileRef);

      // 4. Save file details in Firestore
      await addDoc(collection(db, "groups", groupId, "resources"), {
        name: file.name,
        url: url,
        uploadedAt: serverTimestamp(),
        uploadedBy: auth.currentUser.uid,
      });

      alert("File uploaded successfully!");
      setFile(null);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
