import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Placeholder data - replace with actual database logic
const tasks = [
  { id: "1", title: "Implement Task API", status: "in-progress" },
  { id: "2", title: "Design UI Mockups", status: "todo" },
];
let nextId = 3;

/**
 * GET /api/tasks
 * Retrieves a list of tasks.
 * Add query parameters for filtering, sorting, pagination later.
 */
export async function GET(_request: NextRequest) {
  // Prefixed unused request
  try {
    // In a real app, fetch this from a database
    console.log("GET /api/tasks called");
    // TODO: Add filtering, sorting, pagination logic based on request.url.searchParams
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Creates a new task.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("POST /api/tasks called with body:", body);

    // Basic validation (expand later)
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { message: "Bad Request: Title is required and must be a string" },
        { status: 400 }
      );
    }

    const newTask = {
      id: String(nextId++),
      title: body.title,
      status: body.status || "todo", // Default status
      // Add other fields as necessary (description, assignee, dueDate, etc.)
    };

    // In a real app, save this to a database
    tasks.push(newTask);
    console.log("New task created:", newTask);

    return NextResponse.json(newTask, { status: 201 }); // 201 Created
  } catch (error: any) {
    console.error("Error creating task:", error);
    // Handle JSON parsing errors specifically
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
