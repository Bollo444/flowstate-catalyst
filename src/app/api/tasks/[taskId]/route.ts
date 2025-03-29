import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Placeholder data - replace with actual database logic
// NOTE: This is a simplified example. In a real app, you'd fetch/update data
// in a database, and the 'tasks' array would likely live in a shared service or module.
// For this example, we'll re-declare it, but be aware this won't share state
// with the '/api/tasks' route handler without proper state management/DB.
let tasks = [
  { id: "1", title: "Implement Task API", status: "in-progress" },
  { id: "2", title: "Design UI Mockups", status: "todo" },
];
// This nextId is also separate from the one in the other file in this example
// let nextId = 3; // Unused variable

interface RouteParams {
  params: { taskId: string };
}

/**
 * GET /api/tasks/{taskId}
 * Retrieves a specific task by its ID.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  // Prefixed unused request
  try {
    const { taskId } = params;
    console.log(`GET /api/tasks/${taskId} called`);

    // In a real app, fetch this from a database
    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      return NextResponse.json(
        { message: "Not Found: Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error(`Error fetching task ${params.taskId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tasks/{taskId}
 * Updates an existing task (replaces the entire task).
 * Consider using PATCH for partial updates.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { taskId } = params;
    const body = await request.json();
    console.log(`PUT /api/tasks/${taskId} called with body:`, body);

    // Basic validation (expand later)
    if (
      !body.title ||
      typeof body.title !== "string" ||
      !body.status ||
      typeof body.status !== "string"
    ) {
      return NextResponse.json(
        { message: "Bad Request: Title and status are required" },
        { status: 400 }
      );
    }

    // In a real app, update this in a database
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json(
        { message: "Not Found: Task not found" },
        { status: 404 }
      );
    }

    const updatedTask = {
      ...tasks[taskIndex], // Keep original ID
      title: body.title,
      status: body.status,
      // Update other fields as necessary
    };

    tasks[taskIndex] = updatedTask;
    console.log("Task updated:", updatedTask);

    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error(`Error updating task ${params.taskId}:`, error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Bad Request: Invalid JSON format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/{taskId}
 * Deletes a specific task by its ID.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  // Prefixed unused request
  try {
    const { taskId } = params;
    console.log(`DELETE /api/tasks/${taskId} called`);

    // In a real app, delete this from a database
    const initialLength = tasks.length;
    tasks = tasks.filter((t) => t.id !== taskId);

    if (tasks.length === initialLength) {
      return NextResponse.json(
        { message: "Not Found: Task not found" },
        { status: 404 }
      );
    }

    console.log(`Task ${taskId} deleted`);
    // Typically, a DELETE request returns 204 No Content on success
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting task ${params.taskId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Note: PATCH implementation would be similar to PUT but would only update fields present in the request body.
