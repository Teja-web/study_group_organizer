// src/components/FileList.jsx
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function FileList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Create a Firestore query
    const q = query(collection(db, "resources"), orderBy("uploadedAt", "desc"));

    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fileData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFiles(fileData);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  return (
    <div>
      <h3>📂 Uploaded Files</h3>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>{" "}
            — uploaded by {file.uploadedBy} at{" "}
            {file.uploadedAt?.toDate().toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
