import mongoose from "mongoose";

import Todo from "./todo.model.js";
import ApiError from "../../common/utils/api-error.js";

const assertValidTodoId = (todoId) => {
  if (!mongoose.isValidObjectId(todoId)) {
    //isValidaObjectId(id): It validates ObjectId format/type
    throw ApiError.badRequest("Invalid memo ID");
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
assertValidTodoId;
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
  if (updatedData.memo !== "undefined") {
    allowUpdates.memo = updatedData.memo;
  }
  if (updatedData.dataTime !== "undefined") {
    allowUpdates.dataTime = updatedData.dataTime;
  }
  if (updatedData.completed !== "undefined") {
    allowUpdates.completed = updatedData.completed;
  }

  // Step 3: Check whether valid fields exist
  if (Object.keys(allowUpdates).length === 0) {
    throw ApiError("No valid memo fields are provided");
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
    ApiError.notFound("Memo not found");
  }

  // Step 6: Return updated document
  return todo;
};

export { getTodos, createTodo, updateTodo };
