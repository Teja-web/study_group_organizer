import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";

const GroupList = () => {
  const [groups, setGroups] = useState([]);

  // Fetch all groups from Firestore
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "groups"));
        const groupsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroups(groupsData);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  // Handle join group
  const handleJoin = async (groupId) => {
    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(auth.currentUser.uid),
      });
      alert("You joined the group!");
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Study Groups</h2>
      {groups.length === 0 ? (
        <p>No groups available. Create one!</p>
      ) : (
        <ul className="space-y-4">
          {groups.map((group) => (
            <li
              key={group.id}
              className="border p-4 rounded shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.description}</p>
                <p className="text-xs text-gray-400">ID: {group.id}</p>
              </div>
              <button
                onClick={() => handleJoin(group.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupList;
