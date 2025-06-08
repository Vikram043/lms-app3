import { readDB, writeDB } from "../models/db.js";

function validateCourseInput(data, forUpdate = false) {
  const errors = [];

  if (!forUpdate || ("title" in data)) {
    if (!data.title || data.title.trim() === "") errors.push("Title is required");
  }

  if (!forUpdate || ("description" in data)) {
    if (!data.description || data.description.trim() === "") errors.push("Description is required");
  }

  return errors;
}

export async function getCourses(req, res) {
  try {
    const db = await readDB();
    res.json(db.courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function addCourse(req, res) {
  try {
    const errors = validateCourseInput(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const db = await readDB();
    const newCourse = {
      id: Date.now().toString(),
      title: req.body.title.trim(),
      description: req.body.description.trim(),
    };
    db.courses.push(newCourse);
    await writeDB(db);

    res.status(201).json({ message: "Course added", course: newCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateCourse(req, res) {
  try {
    const courseId = req.params.id;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No data provided for update" });
    }

    const errors = validateCourseInput(updateData, true);
    if (errors.length > 0) return res.status(400).json({ errors });

    const db = await readDB();
    const courseIndex = db.courses.findIndex((c) => c.id === courseId);
    if (courseIndex === -1) return res.status(404).json({ error: "Course not found" });

    // Update fields
    if ("title" in updateData) db.courses[courseIndex].title = updateData.title.trim();
    if ("description" in updateData) db.courses[courseIndex].description = updateData.description.trim();

    await writeDB(db);
    res.json({ message: "Course updated", course: db.courses[courseIndex] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCourse(req, res) {
  try {
    const courseId = req.params.id;
    const db = await readDB();
    const index = db.courses.findIndex((c) => c.id === courseId);
    if (index === -1) return res.status(404).json({ error: "Course not found" });

    db.courses.splice(index, 1);
    await writeDB(db);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function searchCourses(req, res) {
  try {
    const query = req.query.q;
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }
    const db = await readDB();
    const lowerQuery = query.toLowerCase();

    const results = db.courses.filter((c) =>
      c.title.toLowerCase().includes(lowerQuery)
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
