export interface CourseChapter {
  id: string;
  title: string;
  publishedAt: Date | null;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  description: string | null;
  publishedAt: Date | null;
}

export interface CourseInstructor {
  name: string | null;
  image: string | null;
}

export interface Course {
  title: string;
  description: string;
  image: string | null;
  price: number;
  chapters: CourseChapter[];
  instructor: CourseInstructor;
}
