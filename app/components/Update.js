import React, { useState } from "react";
import styles from "./Note.module.css";
import { redirect } from "next/navigation";

function Note({ _id, title, status, duedate, content, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedStatus, setUpdatedStatus] = useState(status);
  const [updatedDuedate, setUpdatedDuedate] = useState(duedate);
  const [updatedContent, setUpdatedContent] = useState(content);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setUpdatedTitle(title);
    setUpdatedStatus(status);
    setUpdatedDuedate(duedate);
    setUpdatedContent(content);
    setEditing(false);
  };

  console.log(notes);
  const handleSubmit = async (e,noteid) => {
    e.preventDefault();
    const res = await fetch(`api/tasks?id=${noteid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, status, duedate, content }),
    });
    if (res.ok) {
      // If the request was successful, fetch the updated list of notes
      redirect("/")
    
    }
  };

  return (
    <div className={styles.note}>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <input
            type="text"
            value={updatedStatus}
            onChange={(e) => setUpdatedStatus(e.target.value)}
          />
          <input
            type="date"
            value={updatedDuedate}
            onChange={(e) => setUpdatedDuedate(e.target.value)}
          />
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
          <button type="submit">Update</button>
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h1>{title}</h1>
          <h2>{status}</h2>
          <h3>{duedate}</h3>
          <p>{content}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => onDelete(_id)}>Delete</button>
        </>
      )}
    </div>
  );
}

export default Note;
