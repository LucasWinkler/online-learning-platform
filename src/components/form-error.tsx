import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type FormErrorProps = {
  message?: string;
};

export const FormError = ({ message }: FormErrorProps) => {
  return (
    message && (
      <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <p className="text-sm">{message}</p>
      </div>
    )
  );
};
