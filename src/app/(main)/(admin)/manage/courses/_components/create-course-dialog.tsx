"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const CreateCourseDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Course</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new course.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Course Title</Label>
            <Input placeholder="My Course" id="title" className="" />
            <p className="text-sm">The name of your course</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Course Slug</Label>
            <Input placeholder="my-course-slug" id="slug" className="" />
            <p className="text-sm">
              The slug is the URL-friendly version of the course title.
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Create Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
