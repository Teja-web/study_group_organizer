import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import { useParams } from "react-router-dom";
import UploadFile from "./UploadFile";
import { ref, deleteObject } from "firebase/storage";

export default function GroupResources() {
  const { groupId } = useParams();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "groups", groupId, "resources"),
      orderBy("uploadedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFiles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [groupId]);

  // delete file function
  const handleDelete = async (file) => {
    try {
      // 1. Delete from Storage
      const fileRef = ref(storage, `groups/${groupId}/resources/${file.name}`);
      await deleteObject(fileRef);

      // 2. Delete from Firestore
      await deleteDoc(doc(db, "groups", groupId, "resources", file.id));

      alert("File deleted successfully!");
    } catch (err) {
      alert("Error deleting file: " + err.message);
    }
  };

  return (
    <div>
      <h2>📂 Group Resources</h2>
      <UploadFile groupId={groupId} />

      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <a href={file.url} target="_blank" rel="noreferrer">
              {file.name}
            </a>{" "}
            (uploaded by {file.uploadedBy})
            {auth.currentUser?.uid === file.uploadedBy && (
              <button
                onClick={() => handleDelete(file)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                ❌ Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
