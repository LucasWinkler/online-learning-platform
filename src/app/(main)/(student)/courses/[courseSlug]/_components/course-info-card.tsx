"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCurrency } from "~/lib/utils";
import { enrollInCourse } from "~/server/actions/enrollment";

import { CourseStats } from "./course-stats";

type CourseInfoCardProps = {
  courseId: string;
  price: number;
  chaptersCount: number;
  isEnrolled: boolean;
  isFree: boolean;
  courseSlug: string;
};

export const CourseInfoCard = ({
  courseId,
  price,
  chaptersCount,
  isEnrolled,
  isFree,
  courseSlug,
}: CourseInfoCardProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleEnrollment = async () => {
    setIsPending(true);

    if (isEnrolled) {
      router.push(`/course/${courseSlug}`);
      return;
    }

    try {
      const result = await enrollInCourse(courseId);

      if (result.error) {
        toast.error("Enrollment Failed", {
          description: result.error,
        });
        return;
      }

      if (result.success) {
        toast.success("Successfully Enrolled", {
          description: "You now have access to all course content",
        });
        router.push(`/course/${courseSlug}`);
      }
    } catch (error) {
      toast.error("Enrollment Failed", {
        description: "Something went wrong while enrolling in the course",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-2xl">{formatCurrency(price)}</CardTitle>
        <CardDescription>
          {isFree ? "Free Course" : "One-time payment"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <CourseStats chaptersCount={chaptersCount} />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleEnrollment}
          disabled={isPending}
        >
          {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          {isEnrolled
            ? "Continue Learning"
            : isFree
              ? "Enroll for Free"
              : "Buy Course"}
        </Button>
      </CardFooter>
    </Card>
  );
};
