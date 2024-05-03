import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type FormWarningProps = {
  message?: string;
};

export const FormWarning = ({ message }: FormWarningProps) => {
  return (
    message && (
      <div className="flex items-center gap-x-2 rounded-md bg-amber-500 p-3 text-primary-foreground">
        <ExclamationTriangleIcon className="h-6 w-6 shrink-0" />
        <p className="text-sm">{message}</p>
      </div>
    )
  );
};
