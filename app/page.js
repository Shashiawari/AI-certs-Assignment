"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Note from "./components/Note";
import { useState, useEffect } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Pending");
  const [duedate, setDate] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setNotes(data.result); // Assuming the API response has a 'result' field containing the notes
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);
  console.log(notes);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, status, duedate, content }),
    });
    if (res.ok) {
      // If the request was successful, fetch the updated list of notes
      const updatedRes = await fetch("api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setNotes(updatedData.result);
      }
    }
  };

  const handleDelete = async (noteId) => {
    
    try {
      const res = await fetch(`api/tasks?id=${noteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotes(notes.filter((note) => note._id !== noteId));
      } else {
        console.error(`Failed to delete note with ID ${noteId}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className={styles.main}>
      <nav>TODOLIST</nav>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="status">Select status</label>
        <select
          id="status"
          name="status"
          onChange={(e) => setStatus(e.target.value)}
          value={status}
        >
          <option value="Pending">Pending</option>
          <option value="In progress">In progress</option>
          <option value="Completed">Completed</option>
        </select>
        <label htmlFor="start">Due date:</label>
        <input
          type="date"
          id="start"
          name="trip-start"
          value={duedate}
          min="2024-01-01"
          max="2025-12-31"
          onChange={(e) => setDate(e.target.value)}
        />
        <textarea
          onChange={(e) => setContent(e.target.value)}
          name="content"
          placeholder="Take a note..."
          rows="3"
          value={content}
        />
        <button type="submit">Add</button>
      </form>
      {notes.map((note) => (
        <div className="note">
          <h1>{note.title}</h1>
          <h2>{note.status}</h2>
          <h3>{note.duedate}</h3>
          <p>{note.content}</p>
          <button
            onClick={() => {
              handleDelete(note._id);
              console.log(note._id);
            }}
          >
            delete
          </button>
        </div>
      ))}
    </main>
  );
}
