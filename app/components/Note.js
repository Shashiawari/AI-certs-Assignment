import React from "react";

function Note({ _id, title, status, duedate, content, onDelete }) {
  const handleDelete = () => {
    onDelete(_id);
  };

  return (
    <div className="note">
      <h1>{title}</h1>
      <h2>{status}</h2>
      <h3>{duedate}</h3>
      <p>{content}</p>
      <button onClick={handleDelete}>DELETE</button>
    </div>
  );
}

export default Note;
