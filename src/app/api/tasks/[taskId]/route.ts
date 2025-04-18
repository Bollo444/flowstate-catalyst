import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Task as DbTask } from "@/types/database"; // Import DB task type

interface RouteParams {
  params: { taskId: string };
}

/**
 * GET /api/tasks/{taskId}
 * Retrieves a specific task by its ID, ensuring the user owns it.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const supabase = createRouteHandlerClient({ cookies });
  const { taskId } = params;

  try {
    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log(`GET /api/tasks/${taskId} called by user: ${user.id}`);

    // 2. Fetch task from DB, ensuring user_id matches
    const { data: task, error: dbError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("user_id", user.id) // Ensure user owns the task
      .single(); // Expecting one or zero results

    if (dbError) {
      // 'PGRST116' is the code for 'No rows found' in PostgREST
      if (dbError.code === "PGRST116") {
        console.log(
          `GET /api/tasks/${taskId}: Task not found or not owned by user ${user.id}`
        );
        return NextResponse.json(
          { message: "Task not found" },
          { status: 404 }
        );
      }
      console.error(`GET /api/tasks/${taskId}: DB Error`, dbError);
      return NextResponse.json(
        { message: "Database Error", error: dbError.message },
        { status: 500 }
      );
    }

    if (!task) {
      // This case might be redundant due to .single() throwing error, but good practice
      console.log(
        `GET /api/tasks/${taskId}: Task not found (post-query) for user ${user.id}`
      );
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // 3. Return task
    return NextResponse.json(task);
  } catch (error) {
    console.error(`GET /api/tasks/${taskId}: General Error`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tasks/{taskId}
 * Updates an existing task (replaces specified fields). Use PATCH for partial updates.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const supabase = createRouteHandlerClient({ cookies });
  const { taskId } = params;

  try {
    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log(`PUT /api/tasks/${taskId} called by user: ${user.id}`);

    // 2. Parse request body
    const body = await request.json();
    console.log(`PUT /api/tasks/${taskId}: Request body:`, body);

    // 3. Basic validation
    // For PUT, arguably all non-meta fields should be provided for a full replace.
    // However, we'll implement it like PATCH for flexibility. Use PATCH method instead for standard partial updates.
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      return NextResponse.json(
        { message: "Bad Request: Missing update data" },
        { status: 400 }
      );
    }

    // 4. Prepare update data (only include fields present in the body)
    const updateData: Partial<DbTask> = {};
    // Map allowed fields from body to updateData
    const allowedFields: (keyof DbTask)[] = [
      "title",
      "description",
      "status",
      "priority",
      "flow_optimal",
      "context_cost",
      "estimated_duration",
      "completed",
      "team_id",
      "project_id",
      "due_date",
      "completion_metrics",
    ];

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        (updateData as any)[key] = body[key];
      }
    }
    updateData.updated_at = new Date().toISOString(); // Always update timestamp

    // 5. Update task in DB, ensuring user_id matches
    const { data: updatedTask, error: dbError } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", taskId)
      .eq("user_id", user.id) // Ensure user owns the task
      .select()
      .single();

    if (dbError) {
      // Check if the error is due to the task not being found (or not owned)
      if (dbError.code === "PGRST116" || dbError.details?.includes("0 rows")) {
        console.log(
          `PUT /api/tasks/${taskId}: Task not found or not owned by user ${user.id}`
        );
        return NextResponse.json(
          { message: "Task not found" },
          { status: 404 }
        );
      }
      console.error(`PUT /api/tasks/${taskId}: DB Error`, dbError);
      return NextResponse.json(
        { message: "Database Error", error: dbError.message },
        { status: 500 }
      );
    }

    if (!updatedTask) {
      console.error(
        `PUT /api/tasks/${taskId}: Update returned no data (unexpected).`
      );
      // This might indicate an issue if the update should have returned data
      return NextResponse.json(
        { message: "Update failed to return data" },
        { status: 500 }
      );
    }

    // 6. Return updated task
    console.log(`PUT /api/tasks/${taskId}: Task updated:`, updatedTask);
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error(`PUT /api/tasks/${taskId}: General Error`, error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON format" },
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
 * PATCH /api/tasks/{taskId}
 * Partially updates an existing task.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  // Implementation is identical to PUT in this case, as PUT was implemented partially.
  // In a strict REST sense, PUT should replace, PATCH should partially update.
  // Forwarding to PUT handler for this implementation.
  return PUT(request, { params });
}

/**
 * DELETE /api/tasks/{taskId}
 * Deletes a specific task by its ID, ensuring the user owns it.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const supabase = createRouteHandlerClient({ cookies });
  const { taskId } = params;

  try {
    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log(`DELETE /api/tasks/${taskId} called by user: ${user.id}`);

    // 2. Delete task from DB, ensuring user_id matches
    const { error: dbError, count } = await supabase
      .from("tasks")
      .delete({ count: "exact" }) // Request count of deleted rows
      .eq("id", taskId)
      .eq("user_id", user.id); // Ensure user owns the task

    if (dbError) {
      console.error(`DELETE /api/tasks/${taskId}: DB Error`, dbError);
      return NextResponse.json(
        { message: "Database Error", error: dbError.message },
        { status: 500 }
      );
    }

    // Check if any row was actually deleted
    if (count === 0) {
      console.log(
        `DELETE /api/tasks/${taskId}: Task not found or not owned by user ${user.id}`
      );
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // 3. Return success (No Content)
    console.log(`DELETE /api/tasks/${taskId}: Task deleted successfully`);
    return new NextResponse(null, { status: 204 }); // Standard success response for DELETE
  } catch (error) {
    console.error(`DELETE /api/tasks/${taskId}: General Error`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
