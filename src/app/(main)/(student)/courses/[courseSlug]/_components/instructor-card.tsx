import type { CourseInstructor } from "./types";

import { UserRoundIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type InstructorCardProps = {
  instructor: CourseInstructor;
};

export const InstructorCard = ({ instructor }: InstructorCardProps) => (
  <Card className="h-fit">
    <CardHeader>
      <CardTitle>Instructor</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-3">
        <div className="relative size-12 overflow-hidden rounded-full">
          <Avatar className="size-full [&>*]:transition-all [&>*]:duration-300 [&>*]:ease-out [&>*]:group-hover:scale-[1.15]">
            <AvatarImage src={instructor.image ?? undefined} />
            <AvatarFallback className="bg-neutral-500 text-neutral-50">
              <UserRoundIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="font-medium">{instructor.name}</p>
          <p className="text-sm text-muted-foreground">Course Instructor</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
