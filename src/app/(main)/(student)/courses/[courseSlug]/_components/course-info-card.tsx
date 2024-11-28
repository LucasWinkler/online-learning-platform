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

import { CourseStats } from "./course-stats";

type CourseInfoCardProps = {
  price: number;
  chaptersCount: number;
  isEnrolled: boolean;
  isFree: boolean;
};

export const CourseInfoCard = ({
  price,
  chaptersCount,
  isEnrolled,
  isFree,
}: CourseInfoCardProps) => (
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
      <Button className="w-full" size="lg">
        {isEnrolled
          ? "Continue Learning"
          : isFree
            ? "Enroll for Free"
            : "Buy Course"}
      </Button>
    </CardFooter>
  </Card>
);
