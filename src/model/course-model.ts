export type CourseType = {
  id?: number;
  image?: string;
  category?: string;
  title?: string;
  subtitle?: string;
  rating?: string;
  description?: string;
  price?: string;
  discount?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type CourseFilterType = {};

export type CourseRequest = {
  image?: "image";
  title?: "title";
  category?: "category";
  subtitle?: "subtitle";
  rating?: "rating";
  description?: "description";
  price?: "price";
  discount?: "discount";
};

export type CourseResponse = {
  code: number;
  status: string;
  message: string;
  data?: CourseType | CourseType[];
};

export const allowableColumns = [
  "id",
  "image",
  "category",
  "title",
  "subtitle",
  "rating",
  "description",
  "price",
  "discount",
  "created_at",
  "updated_at",
  "deleted_at",
];
