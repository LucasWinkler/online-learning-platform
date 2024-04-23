"use client";

import { toast } from "sonner";

import { Button } from "~/components/ui/button";

const App = () => {
  const promise = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ name: "Sonner" }), 2000),
    );

  const sendData = () => {
    toast.success("Success", {
      position: "top-center",
      dismissible: true,
      description: "Course updated successfully",
    });
  };

  return (
    <>
      <h1>App</h1>
      <Button onClick={sendData}>Toast</Button>
      <Button
        onClick={() =>
          toast.promise(promise, {
            loading: "Loading...",
            error: "Error",
            success: () => {
              return "Success!";
            },
          })
        }
      >
        Toast Promise
      </Button>
    </>
  );
};

export default App;
