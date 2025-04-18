import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Helper for server-side auth
import { cookies } from 'next/headers'; // Needed for auth helpers
import { Task as DbTask } from "@/types/database"; // Import DB task type

/**
 * GET /api/tasks
 * Retrieves a list of tasks for the authenticated user.
 * Supports filtering by status and sorting.
 */
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies }); // Create server client
  const { searchParams } = new URL(request.url); // Get query params

  try {
    // 1. Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("GET /api/tasks: Auth Error", authError);
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log(`GET /api/tasks called for user: ${user.id}`);

    // 2. Build Supabase query
    let query = supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id); // Filter by authenticated user

    // 3. Apply filters from query parameters (optional)
    const status = searchParams.get("status");
    if (status) {
      // Validate status? Or assume it matches DbTaskStatus enum
      query = query.eq("status", status);
    } else {
       // Default filter: Exclude archived tasks unless specifically requested
       query = query.neq("status", "archived");
    }

     const projectId = searchParams.get("projectId");
     if (projectId) {
         query = query.eq("project_id", projectId);
     }

     const teamId = searchParams.get("teamId");
      if (teamId) {
         query = query.eq("team_id", teamId);
      }


    // 4. Apply sorting (optional)
    const sortBy = searchParams.get("sortBy") || "created_at"; // Default sort
    const orderAsc = searchParams.get("order") === "asc"; // Default is descending
    // Validate sortBy against allowed columns?
    query = query.order(sortBy, { ascending: orderAsc });

    // 5. Execute query
    const { data: tasks, error: dbError } = await query;

    if (dbError) {
      console.error("GET /api/tasks: DB Error", dbError);
      return NextResponse.json(
        { message: "Database Error", error: dbError.message },
        { status: 500 }
      );
    }

    // 6. Return tasks (as DbTask[])
    return NextResponse.json(tasks || []); // Return empty array if null

  } catch (error) {
    console.error("GET /api/tasks: General Error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Creates a new task for the authenticated user.
 */
export async function POST(request: NextRequest) {
   const supabase = createRouteHandlerClient({ cookies });

   try {
     // 1. Get authenticated user
     const {
       data: { user },
       error: authError,
     } = await supabase.auth.getUser();

     if (authError || !user) {
       console.error("POST /api/tasks: Auth Error", authError);
       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }
     console.log(`POST /api/tasks called by user: ${user.id}`);

     // 2. Parse request body
     const body = await request.json();
     console.log("POST /api/tasks: Request body:", body);

     // 3. Basic validation (improve as needed)
     if (!body.title || typeof body.title !== "string") {
       return NextResponse.json({ message: "Title is required" }, { status: 400 });
     }
      if (typeof body.estimated_duration !== 'number') {
        return NextResponse.json({ message: "Estimated duration (number) is required" }, { status: 400 });
     }

     // 4. Prepare data for insertion (maps input to DB schema)
     const newTaskData: Partial<DbTask> = {
       user_id: user.id, // Assign to logged-in user
       title: body.title,
       description: body.description ?? null,
       priority: body.priority ?? 50,
       status: body.status || 'active',
       estimated_duration: body.estimated_duration,
       team_id: body.team_id ?? null,
       project_id: body.project_id ?? null,
       due_date: body.due_date ?? null,
       flow_optimal: body.flow_optimal ?? false,
       context_cost: body.context_cost ?? 0,
       completion_metrics: body.completion_metrics ?? { progress: 0 },
       completed: body.completed ?? false,
       // created_at and updated_at will be handled by the database
     };

     // 5. Insert into database
     const { data: createdTask, error: dbError } = await supabase
       .from("tasks")
       .insert(newTaskData)
       .select() // Return the created record
       .single(); // Expecting a single row back

     if (dbError) {
       console.error("POST /api/tasks: DB Insert Error", dbError);
       return NextResponse.json(
         { message: "Database Error", error: dbError.message },
         { status: 500 }
       );
     }

     if (!createdTask) {
         console.error("POST /api/tasks: Task creation returned no data.");
         throw new Error("Task creation failed silently."); // Should not happen if DB error is null
     }


     // 6. Return the newly created task
     console.log("POST /api/tasks: Task created:", createdTask);
     return NextResponse.json(createdTask, { status: 201 }); // 201 Created

   } catch (error: any) {
     console.error("POST /api/tasks: General Error", error);
     if (error instanceof SyntaxError) {
       return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
     }
     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
   }
}
