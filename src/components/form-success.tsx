import { CheckCircledIcon } from "@radix-ui/react-icons";

type FormSuccessProps = {
  message?: string;
};

export const FormSuccess = ({ message }: FormSuccessProps) => {
  return (
    message && (
      <div className="text-emeral-500 flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3">
        <CheckCircledIcon className="h-6 w-6 shrink-0" />
        <p className="text-sm">{message}</p>
      </div>
    )
  );
};
