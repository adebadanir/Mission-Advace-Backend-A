import express from "express";
import { CourseController } from "../controller/course-controller";

const router = express.Router();

router.get("/", CourseController.findAll);
router.get("/:id", CourseController.findOne);
router.post("/", CourseController.create);
router.patch("/:id", CourseController.update);
router.delete("/:id", CourseController.delete);
router.post("/search", CourseController.searchByCategory);
router.post("/filter", CourseController.filterByTopics);
router.post("/sort", CourseController.sortByCategory);

export default router;
