// Import necessary modules
import { MongoClient} from "mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET endpoint to fetch tasks
export async function GET() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("tasks");

    const result = await collection.find().toArray();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
}

// POST endpoint to add a new task
export async function POST(req, res) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("tasks");

    const payload = await req.json();

    const result = await collection.insertOne(payload);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
}

// DELETE endpoint to delete a task
export async function DELETE(request) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("tasks");

    // Get the task ID from the request query parameters
    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get('id');

    const result = await collection.deleteOne({ _id: new ObjectId(taskId) });
    if (result.deletedCount === 1) {
      return NextResponse.json({
        success: true,
        message: "Task deleted successfully",
      });
    } else {
      return NextResponse.json({ success: false, error: "Task not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
}

export async function PUT(request) {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("tasks");
  
      // Get the task ID from the request query parameters
      const searchParams = request.nextUrl.searchParams;
      const taskId = searchParams.get('id');
  
      // Extract the updated task details from the request body
      const { title, status, duedate, content } = await request.json();
  
      // Perform the update operation
      const result = await collection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { title, status, duedate, content } }
      );
  
      // Check if the update was successful
      if (result.modifiedCount === 1) {
        return NextResponse.json({
          success: true,
          message: "Task updated successfully",
        });
      } else {
        return NextResponse.json({ success: false, error: "Task not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({ success: false, error: error.message });
    } finally {
      await client.close();
    }
  }