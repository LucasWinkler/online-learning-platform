// import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
// import { useRouter } from 'next/router';

export function Course() {
  return <div>Course page not yet implemented</div>;
}

// type CourseProps {
//   response: Result<>
// }

// export const Course: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({response}) => {
//   const router = useRouter();
//   return (
// <>
// <h2>Course: </h2>
// </>
//   );
// }

// export const getServerSideProps: GetServerSideProps<Course> = async (context) => {
//   const slug = context.params?.slug

//   return {
//     props: {
//       something: true
//     }
//   }
// }

export default Course;
