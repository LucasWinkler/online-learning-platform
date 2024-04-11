export type CreateCourseInput = {
  title: string;
  description: string;
  price: number;
  slug: string;
  thumbnail: string;
  instructorId: number;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
