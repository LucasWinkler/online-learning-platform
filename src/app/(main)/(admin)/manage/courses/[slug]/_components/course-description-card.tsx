import { SquarePenIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type CourseDescriptionCardProps = {
  description: string | null;
};

export const CourseDescriptionCard = ({
  description,
}: CourseDescriptionCardProps) => {
  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Course Description</CardTitle>
        <Button variant="outline" size="icon">
          <span className="sr-only">Edit Description</span>
          <SquarePenIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          {description ?? "No description."}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 md:justify-start">
        The maximum length of your description is 250 characters.
      </CardFooter>
    </Card>
  );
};
