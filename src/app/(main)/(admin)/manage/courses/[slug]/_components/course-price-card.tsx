"use client";

import { useRef, useState } from "react";
import { Loader2Icon, SquarePenIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCurrency } from "~/lib/utils";

import { CoursePriceForm } from "./course-price-form";
import { IncompleteFieldIndicator } from "./incomplete-field-indicator";

type CoursePriceCardProps = {
  id: string;
  price: number | null;
  completed: boolean;
};

export const CoursePriceCard = ({
  id,
  price,
  completed,
}: CoursePriceCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<{ submitForm: () => void }>(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  return (
    <Card className="relative border-0 bg-gray-50">
      <IncompleteFieldIndicator completed={completed} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Course Price</CardTitle>
        {isEditing ? (
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        ) : (
          <Button onClick={handleEdit} variant="outline" size="icon">
            <span className="sr-only">Edit Price</span>
            <SquarePenIcon className="size-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <CoursePriceForm
            ref={formRef}
            id={id}
            price={price}
            onCancel={handleCancel}
            onPendingStateChange={setIsPending}
          />
        ) : (
          <p className="text-sm text-gray-600">
            {price ? formatCurrency(price) : "Free"}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col flex-wrap items-center justify-center gap-2 border-t px-6 py-3 text-sm font-light text-gray-600 md:flex-row md:justify-between">
        To make the course free, leave this empty or 0.
        {isEditing && (
          <Button
            onClick={handleFormSubmit}
            size="sm"
            type="submit"
            disabled={isPending}
          >
            {isPending && (
              <>
                <span className="sr-only">Saving...</span>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              </>
            )}
            Save
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
