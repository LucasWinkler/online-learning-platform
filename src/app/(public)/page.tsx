import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

const Home = () => {
  return (
    <section className="mx-auto mb-12 max-w-7xl px-3 sm:px-4 md:px-5 lg:px-6">
      <h1 className="my-6 text-base font-bold xs:text-lg md:text-2xl">
        Work in progress
      </h1>
    </section>
  );
};

export default Home;
