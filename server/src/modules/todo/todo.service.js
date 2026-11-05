import mongoose from "mongoose";

import Todo from "./todo.model.js";
import ApiError from "../../common/utils/api-error.js";

const assertValidTodoId = (todoId) => {
  if (!mongoose.isValidObjectId(todoId)) {
    //isValidaObjectId(id): It validates ObjectId format/type
    throw ApiError.badRequest("Invalid todo ID");
  }
};

/**
 * Retrieve all Todo documents belonging to the currently authenticated user.
 */
const getTodos = async (userId) => {
  // Receive the authenticated user's ID as an argument
  // Use the Todo model to query to query the MongoDB database
  // Find all documetns where the user field matches the provided user ID
  // Sort the retrieved documents by createdAt in ascending order
  // Return the matching Todo documents
  // If the DB operation fails, allow the error to propogate to the calling controller
  const todos = await Todo.find({
    user: userId,
  }).sort({
    createdAt: 1,
  });

  return todos;
};

/**
 * Create a new Todo document in MongoDB and associate it with the currently authenticated user.
 */
const createTodo = async (userId, todoData) => {
  // Recieve the authenticated user's ID & validated Todo data
  // Extract the todo information required to create new document
  // Associate/Assign todo with the authenticated user's ID
  // Set the initial complition status to false
  // Create a new document in MongoDB
  // Return the newly created document to the controller

  const todo = await Todo.create({
    ...todoData,
    user: userId,
    completed: false,
  });

  return todo;
};
/**
 * Update an existing Todo document belonging to the authenticated user.
 */
const updateTodo = async (userId, todoId, updatedData) => {
  // Receive the authenticated user's ID, todo ID, updated data
  // Validate whether the provided Todo ID is a valid mongoDB ObjectId
  // Identify which Todo fields are allowed to be updated
  // Reject the request if no valid update fields are provided
  // Find the Todo document using both it's ID and the authenticated user's ID
  // Update the only permitted fields using MongoDB's $set operator
  // Enable mongoose schema validators during the update
  // Return the updated document

  // Step 1: Validate Todo ID
  assertValidTodoId(todoId);

  // Step 2: Allow only permitted fields
  const allowUpdates = {};
  if (updatedData.todo !== undefined) {
    allowUpdates.todo = updatedData.todo;
  }
  if (updatedData.dateTime !== undefined) {
    allowUpdates.dateTime = updatedData.dateTime;
  }
  if (updatedData.completed !== undefined) {
    allowUpdates.completed = updatedData.completed;
  }

  // Step 3: Check whether valid fields exist
  if (Object.keys(allowUpdates).length === 0) {
    throw ApiError.badRequest("No valid todo fields are provided");
  }

  // Step 4: Find and update the user's Todo
  const todo = await Todo.findOneAndUpdate(
    {
      _id: todoId,
      user: userId,
    },
    {
      $set: allowUpdates,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  // Step 5: Handle document not found
  if (!todo) {
    throw ApiError.notFound("Todo not found");
  }

  // Step 6: Return updated document
  return todo;
};

/**
 * Delete an existing Todo document that belongs to the currently authenticated user.
 */
const deleteTodo = async (userId, todoId) => {
  // Receive the authenticated user's ID & Todo ID
  // Validate whether the provided Todo ID is a valid MongoDB ObjectID
  // Find the Todo document using both its ID and authenticated user's ID
  // Delete the matching document from MongoDB
  // Check whether a document actually deleted
  // If no matching document exists, throw a 404 Not found error
  // Return the deleted document to the controller

  assertValidTodoId(todoId);
  const todo = await Todo.findOneAndDelete({
    _id: todoId,
    user: userId,
  });

  if (!todo) {
    throw ApiError.notFound("Todo not found");
  }

  return todo;
};

const deleteSelectedTodos = async (userId, todoIds) => {
  // Receive the authenticated user's ID and array of selected todo IDS
  // Verify that array of todo IDS is not empty
  // Validate evry todo ID
  // Find all selected todos that belong to the authenticated user
  // Delete all matching documents from DB
  // Return the number of deleted documents

  // Step 1: Validate the selected Todo IDs
  if (!Array.isArray(todoIds) || todoIds.length === 0) {
    throw ApiError.badRequest("Please select at least one todo");
  }

  // Step 2: Validate every Todo ID
  todoIds.forEach(assertValidTodoId);

  // Step 3: Remove duplicate IDs
  const uniqueTodoIds = [...new Set(todoIds)];

  // Step 4: Delete selected Todos belonging to the authenticated user
  const result = await Todo.deleteMany({
    _id: {
      $in: uniqueTodoIds,
    },
    user: userId,
  });

  // Step 5: Return the deletion result
  return {
    deletedCount: result.deletedCount,
    // Mongoose provide deleteMany() result in deletedCount property
  };
};
export { getTodos, createTodo, updateTodo, deleteTodo, deleteSelectedTodos };
