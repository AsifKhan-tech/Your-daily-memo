// import { formatDateTime } from "../../../lib/utils.js";

// export default function TodoList({ todos }) {
//   return (
//     <section
//       className="todo-list-section"
//       id="todos"
//       aria-labelledby="list-title"
//     >
//       <div className="list-heading">
//         <h2 id="list-title">All tasks</h2>

//         <span className="todo-count">{todos.length}</span>
//       </div>

//       {todos.length === 0 ? (
//         <p className="empty-state">Your added tasks will appear here.</p>
//       ) : (
//         <ul className="todo-list" aria-live="polite">
//           {todos.map((todo) => (
//             <li className="todo-row" key={todo.id}>
//               <div
//                 className={`todo-item ${todo.completed ? "is-complete" : ""}`}
//               >
//                 <input
//                   className="todo-checkbox"
//                   type="checkbox"
//                   checked={todo.completed}
//                   disabled
//                   aria-label={`Task: ${todo.memo}`}
//                 />

//                 <div className="todo-item-content">
//                   <span className="todo-item-text">{todo.memo}</span>

//                   <span className="todo-item-details">
//                     {formatDateTime(todo.dateTime)}
//                   </span>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </section>
//   );
// }

import { formatDateTime } from "../../../lib/utils.js";

function TodoList({ todos, onToggleTodo, onDeleteTodo, onEditTodo }) {
  return (
    <section
      className="todo-list-section"
      id="todos"
      aria-labelledby="list-title"
    >
      <div className="list-heading">
        <h2 id="list-title">All tasks</h2>

        <span className="todo-count">{todos.length}</span>
      </div>

      {todos.length === 0 ? (
        <p className="empty-state">Your added tasks will appear here.</p>
      ) : (
        <ul className="todo-list" aria-live="polite">
          {todos.map((todo) => (
            <li className="todo-row" key={todo.id}>
              <div
                className={`todo-item ${todo.completed ? "is-complete" : ""}`}
              >
                <input
                  className="todo-checkbox"
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggleTodo(todo.id)}
                  aria-label={`Mark "${todo.memo}" as ${todo.completed ? "incomplete" : "complete"}`}
                />

                <div className="todo-item-content">
                  <span className="todo-item-text">{todo.memo}</span>
                  <span className="todo-item-details">
                    {formatDateTime(todo.dateTime)}
                  </span>
                </div>

                {/* Edit todo button  */}
                <button
                  className="edit-todo"
                  type="button"
                  onClick={() => onEditTodo(todo.id)}
                  aria-label={`Edit ${todo.memo}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
              </div>

              <button
                className="delete-todo"
                type="button"
                onClick={() => onDeleteTodo(todo.id)}
                aria-label={`Delete ${todo.memo}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TodoList;
