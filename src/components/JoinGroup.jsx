import React, { useState } from "react";
import { db, auth } from "../firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

const JoinGroup = () => {
  const [groupId, setGroupId] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!groupId.trim()) {
      alert("Please enter a group ID!");
      return;
    }

    try {
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
        await updateDoc(groupRef, {
          members: arrayUnion(auth.currentUser.uid),
        });
        alert("You have joined the group!");
        setGroupId("");
      } else {
        alert("Group not found!");
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-96 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Join a Study Group</h2>
      <form onSubmit={handleJoin} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter Group ID"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Join Group
        </button>
      </form>
    </div>
  );
};

export default JoinGroup;
