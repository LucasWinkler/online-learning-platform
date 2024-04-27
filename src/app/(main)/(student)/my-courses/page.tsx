import { Button } from "~/components/ui/button";
import { auth, signOut } from "~/server/auth";

const MyCoursesPage = async () => {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  );
};

export default MyCoursesPage;
