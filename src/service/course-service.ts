import { RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { allowableColumns, CourseRequest, CourseType } from "../model/course-model";

export class CourseService {
  static findAll = async (): Promise<CourseType[]> => {
    const [result] = await db.query<RowDataPacket[]>("SELECT *  FROM courses WHERE deleted_at IS NULL");
    return result as CourseType[];
  };

  static findOneById = async (id: string): Promise<CourseType> => {
    const [result] = await db.query<RowDataPacket[]>(
      "SELECT id, image, category, title, subtitle, rating, description, price, discount FROM courses WHERE id = ? AND deleted_at IS NULL",
      [id]
    );

    return result[0] as CourseType;
  };

  static create = async (course: CourseRequest): Promise<CourseType> => {
    const [result] = await db.query<RowDataPacket[]>(
      "INSERT INTO courses (image, category, title, subtitle, rating, description, price, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [course.image, course.category, course.title, course.subtitle, course.rating, course.description, course.price, course.discount]
    );
    return result as CourseType;
  };

  static update = async (id: string, course: CourseRequest): Promise<CourseType> => {
    const result = await db.query<RowDataPacket[]>(
      "UPDATE courses SET image = ?, category = ?, title = ?, subtitle = ?, rating = ?, description = ?, price = ?, discount = ? WHERE id = ? AND deleted_at IS NULL",
      [course.image, course.category, course.title, course.subtitle, course.rating, course.description, course.price, course.discount, id]
    );
    return result as CourseType;
  };

  static delete = async (id: string): Promise<CourseType> => {
    const existingCourse = await this.findOneById(id);

    if (!existingCourse || Object.keys(existingCourse).length === 0) {
      throw new Error("Data not found");
    }

    const result = await db.query<RowDataPacket[]>("UPDATE courses SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL", [id]);
    return result as CourseType;
  };

  static restore = async (id: string): Promise<CourseType> => {
    const result = await db.query<RowDataPacket[]>("UPDATE courses SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL", [id]);
    return result as CourseType;
  };

  static hardDelete = async (id: string): Promise<CourseType> => {
    const result = await db.query<RowDataPacket[]>("DELETE FROM courses WHERE id = ?", [id]);
    return result as CourseType;
  };

  static findOneByColumn = async (column: string, value: string): Promise<CourseType> => {
    if (!allowableColumns.includes(column)) {
      throw new Error("Invalid column name");
    }

    const [result] = await db.query<RowDataPacket[]>(
      `SELECT id, image, category, title, subtitle, rating, description, price, discount FROM courses WHERE ${column} = ? AND deleted_at IS NULL LIMIT 1`,
      [value]
    );
    return result[0] as CourseType;
  };

  static findAllByColumn = async (column: string, value: string): Promise<CourseType[]> => {
    if (!allowableColumns.includes(column)) {
      throw new Error("Invalid column name");
    }
    const result = await db.query<RowDataPacket[]>(
      `SELECT id, image, category, title, subtitle, rating, description, price, discount FROM courses WHERE ${column} = ? AND deleted_at IS NULL`,
      [value]
    );
    return result as CourseType[];
  };

  static filterBy = async (value: string): Promise<CourseType[]> => {
    const [result] = await db.query<RowDataPacket[]>(
      `SELECT id, image, category, title, subtitle, rating, description, price, discount FROM courses WHERE title LIKE ? OR description LIKE ? AND deleted_at IS NULL`,
      [`%${value}%`, `%${value}%`]
    );
    return result as CourseType[];
  };

  static searchBy = async (column: string, value: string): Promise<CourseType[]> => {
    if (!allowableColumns.includes(column)) {
      throw new Error("Invalid column name");
    }
    const [result] = await db.query<RowDataPacket[]>(
      `SELECT id, image, category, title, subtitle, rating, description, price, discount FROM courses WHERE ${column} LIKE ? AND deleted_at IS NULL`,
      [`%${value}%`]
    );
    return result as CourseType[];
  };

  static sortBy = async (column: string): Promise<CourseType[]> => {
    if (!allowableColumns.includes(column)) {
      throw new Error("Invalid column name");
    }
    const [result] = await db.query<RowDataPacket[]>(
      `SELECT id, image, category, title, subtitle, rating, description, price, discount 
                 FROM courses 
                 WHERE deleted_at IS NULL 
                 ORDER BY ${column} DESC`
    );
    return result as CourseType[];
  };
}
