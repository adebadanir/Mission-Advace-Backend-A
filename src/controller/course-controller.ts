import { Request, Response, NextFunction } from "express";
import { CourseService } from "../service/course-service";
import { AppError } from "../middleware/error-handler";

export class CourseController {
  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { image, category, title, subtitle, rating, description, price, discount } = req.body;
      if (!image || !category || !title || !subtitle || !rating || !description || !price || !discount) {
        throw new AppError({
          status: 400,
          success: "failed",
          message: "All fields are required",
        });
      }

      const exsistingCourse = await CourseService.findOneByColumn("title", title);

      if (exsistingCourse && exsistingCourse.title === title) {
        throw new AppError({
          status: 400,
          success: "failed",
          message: "Course already exists",
        });
      }

      const course = await CourseService.create({
        image,
        category,
        title,
        subtitle,
        rating,
        description,
        price,
        discount,
      });

      res.status(201).json({
        status: 201,
        success: "success",
        message: "Course successfully created",
        data: {
          image: image,
          category: category,
          title: title,
          subtitle: subtitle,
          rating: rating,
          description: description,
          price: price,
          discount: discount,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  static findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await CourseService.findAll();
      if (!courses || courses.length === 0) {
        throw new AppError({
          status: 404,
          success: "failed",
          message: "No courses found",
        });
      }
      res.status(200).json({
        status: 200,
        success: "success",
        message: "Courses successfully fetched",
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  };

  static findOne = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const course = await CourseService.findOneById(id);
      if (!course) {
        throw new AppError({
          status: 404,
          success: "failed",
          message: "Course not found",
        });
      }
      res.status(200).json({
        status: 200,
        success: "success",
        message: "Course successfully fetched",
        data: course,
      });
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { image, category, title, subtitle, rating, description, price, discount } = req.body;
    try {
      if (!image || !category || !title || !subtitle || !rating || !description || !price || !discount) {
        throw new AppError({
          status: 400,
          success: "failed",
          message: "All fields are required",
        });
      }
      const existingCourse = await CourseService.findOneById(id);
      if (!existingCourse) {
        throw new AppError({
          status: 404,
          success: "failed",
          message: "Course not found",
        });
      }
      await CourseService.update(id, {
        image,
        category,
        title,
        subtitle,
        rating,
        description,
        price,
        discount,
      });
      res.status(200).json({
        status: 200,
        success: "success",
        message: "Course successfully updated",
        data: {
          image: image,
          category: category,
          title: title,
          subtitle: subtitle,
          rating: rating,
          description: description,
          price: price,
          discount: discount,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const course = await CourseService.findOneById(id);
      if (!course) {
        throw new AppError({
          status: 404,
          success: "failed",
          message: "Course not found",
        });
      }
      await CourseService.delete(id);
      res.status(200).json({
        status: 200,
        success: "success",
        message: "Course successfully deleted",
      });
    } catch (error) {
      next(error);
    }
  };

  static filterByTopics = async (req: Request, res: Response, next: NextFunction) => {
    const { value } = req.query;
    try {
      const courses = await CourseService.filterBy(value as string);
      if (!courses || courses.length === 0) {
        throw new AppError({
          status: 404,
          success: "failed",
          message: "No courses found by filter",
        });
      }
      res.status(200).json({
        status: 200,
        success: "success",
        message: "Courses successfully fetched",
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  };

  static sortByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.query;
    try {
      const courses = await CourseService.sortBy(category as string);
      if (!courses || courses.length === 0) {
        throw new AppError({
          status: 404,
          success: "failed",
          message: "No courses found",
        });
      }
      res.status(200).json({
        status: 200,
        success: "success",
        message: "Courses successfully fetched",
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  };

  static searchByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { category, value } = req.query;
    if (!category || !value) {
      throw new AppError({
        status: 400,
        success: "failed",
        message: "Category and value are required",
      });
    }
    try {
      const courses = await CourseService.searchBy(category as string, value as string);
      if (!courses || courses.length === 0) {
        throw new AppError({
          status: 404,
          success: "failed",
          message: "No courses found",
        });
      }
      res.status(200).json({
        status: 200,
        success: "success",
        message: "Courses successfully fetched",
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  };
}
