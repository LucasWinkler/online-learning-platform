import { SquarePenIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCurrency } from "~/lib/utils";

type CoursePriceCardProps = {
  price: number | null;
};

export const CoursePriceCard = ({ price }: CoursePriceCardProps) => {
  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Course Price</CardTitle>
        <Button variant="outline" size="icon">
          <span className="sr-only">Edit Price</span>
          <SquarePenIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          {price ? formatCurrency(price) : "Free"}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-center border-t px-6 py-3 text-sm font-light text-gray-600 md:justify-start">
        To make the course free, leave this empty.
      </CardFooter>
    </Card>
  );
};
