import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage",
  description: "Course management pages for admin",
};

const Admin = async () => {
  return (
    <section>
      <h1>Admin</h1>
    </section>
  );
};

export default Admin;
