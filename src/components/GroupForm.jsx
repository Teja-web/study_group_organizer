import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function GroupForm() {
  const [groupName, setGroupName] = useState("");

  const createGroup = async () => {
    if (!groupName) return alert("Enter a group name");

    try {
      await addDoc(collection(db, "groups"), {
        name: groupName,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        members: [auth.currentUser.uid],
      });
      alert("Group created!");
      setGroupName("");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={createGroup}>Create Group</button>
    </div>
  );
}
