import { useState } from "react";

import { validateCreateTodoDto } from "../dto/createTodo.dto.js";

export default function TodoForm({ onAddTodo }) {
  const [memo, setMemo] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();

    const validation = validateCreateTodoDto({
      todo: memo,
      dateTime,
    });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const createTodo = await onAddTodo({
      memo: validation.data.todo,
      dateTime,
    });

    // Clear the form after adding the memo.
    if (createTodo) {
      setMemo("");
      setDateTime("");
      setErrors({});
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <div className="input-group">
        <label htmlFor="todo">New memo</label>

        <input
          id="todo"
          className="todo"
          type="text"
          name="todo"
          placeholder="Today's task"
          autoComplete="off"
          maxLength={200}
          value={memo}
          onChange={(event) => {
            setMemo(event.target.value);
            setErrors((previous) => ({ ...previous, todo: "" }));
          }}
          aria-invalid={Boolean(errors.todo)}
          aria-describedby={errors.todo ? "todo-error" : undefined}
          required
        />

        {errors.todo && (
          <small className="field-error" id="todo-error">
            {errors.todo}
          </small>
        )}

        <label htmlFor="todo-date-time">Date and time</label>

        <input
          id="todo-date-time"
          className="todo todo-date-time"
          type="datetime-local"
          name="date-time"
          value={dateTime}
          onChange={(event) => {
            setDateTime(event.target.value);
            setErrors((previous) => ({ ...previous, dateTime: "" }));
          }}
          aria-invalid={Boolean(errors.dateTime)}
          aria-describedby={
            errors.dateTime ? "todo-date-time-error" : undefined
          }
          required
        />

        {errors.dateTime && (
          <small className="field-error" id="todo-date-time-error">
            {errors.dateTime}
          </small>
        )}
      </div>

      <button className="add-todo" type="submit">
        Add memo
      </button>
    </form>
  );
}
