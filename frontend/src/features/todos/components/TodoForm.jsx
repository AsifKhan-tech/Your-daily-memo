import { useState } from "react";

export default function TodoForm({ onAddTodo }) {
  const [memo, setMemo] = useState("");
  const [dateTime, setDateTime] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedMemo = memo.trim();

    if (!trimmedMemo || !dateTime) {
      return;
    }

    onAddTodo({
      memo: trimmedMemo,
      dateTime,
    });

    // Clear the form after adding the memo.
    setMemo("");
    setDateTime("");
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="todo">New memo</label>

        <input
          id="todo"
          className="todo"
          type="text"
          name="todo"
          placeholder="Today's task"
          autoComplete="off"
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          required
        />

        <label htmlFor="todo-date-time">Date and time</label>

        <input
          id="todo-date-time"
          className="todo todo-date-time"
          type="datetime-local"
          name="date-time"
          value={dateTime}
          onChange={(event) => setDateTime(event.target.value)}
          required
        />
      </div>

      <button className="add-todo" type="submit">
        Add memo
      </button>
    </form>
  );
}
