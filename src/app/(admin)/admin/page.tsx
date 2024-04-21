import checkAuth from "~/lib/checkAuth";

const Admin = async () => {
  await checkAuth();

  return (
    <section>
      <h1>Admin</h1>
    </section>
  );
};

export default Admin;
