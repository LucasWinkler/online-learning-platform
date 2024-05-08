import { Card, CardHeader, CardTitle } from "~/components/ui/card";

import { ChangeNameForm } from "./change-name-form";

export const ChangeNameCard = () => {
  return (
    <Card className="border-0 bg-gray-50">
      <CardHeader>
        <CardTitle>Full Name</CardTitle>
      </CardHeader>
      <ChangeNameForm />
    </Card>
  );
};
