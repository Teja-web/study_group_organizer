// src/components/CreateGroup.jsx
import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createGroup = async () => {
    if (!name) return alert("Enter a group name");

    try {
      await addDoc(collection(db, "groups"), {
        name,
        description,
        createdBy: auth.currentUser ? auth.currentUser.email : "guest",
        createdAt: serverTimestamp(),
      });
      setName("");
      setDescription("");
      alert("✅ Group created!");
    } catch (err) {
      alert("❌ Failed: " + err.message);
    }
  };

  return (
    <div>
      <h3>Create a Study Group</h3>
      <input
        type="text"
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={createGroup}>Create Group</button>
    </div>
  );
}
