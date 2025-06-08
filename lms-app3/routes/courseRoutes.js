import express from "express";
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  searchCourses,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getCourses);
router.post("/", addCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.get("/search", searchCourses);

export default router;
