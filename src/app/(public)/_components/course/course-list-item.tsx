import type { CourseForHome } from "~/types/course";

import { BookIcon, ClockIcon, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

import { Badge } from "~/components/ui/badge";
import { formatCourseLength } from "~/lib/utils";

const fullConfig = resolveConfig(tailwindConfig);

type CourseListItemProps = {
  course: CourseForHome;
};

export const CourseListItem: React.FC<CourseListItemProps> = ({ course }) => {
  const courseLink = `/course/${course.slug}`;
  const coursePlaceholderImageUrl =
    "https://fakeimg.pl/300x170?text=Thumbnail&font=bebas";

  const calculateDiscountedPrice = (): number | null => {
    const courseDiscount = course.discount?.percentage;

    if (course.price != null && courseDiscount != null) {
      return course.price - (course.price * courseDiscount) / 100;
    }

    return null;
  };

  const renderPrice = (): JSX.Element => {
    const discountedPrice = calculateDiscountedPrice();

    if (discountedPrice != null && course.price != null) {
      return (
        <>
          <span className="text-sm font-semibold sm:text-base">
            ${discountedPrice.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500 line-through dark:text-gray-400 sm:text-sm">
            ${course.price.toFixed(2)}
          </span>
        </>
      );
    }

    return (
      <>
        {course.price ? (
          <span className="text-base font-semibold">${course.price}</span>
        ) : (
          <Badge>Free</Badge>
        )}
      </>
    );
  };

  const smBreakpoint = fullConfig.theme.screens.sm;
  const mdBreakpoint = fullConfig.theme.screens.md;
  const imageSizeAttribute = `(max-width: ${smBreakpoint}) 80vw, (max-width: ${mdBreakpoint}) 50vw, 33vw`;

  return (
    <li className="border border-neutral-200 transition-colors hover:bg-neutral-50">
      <Link className="flex flex-col gap-4 p-4 xs:flex-row " href={courseLink}>
        <div className="relative aspect-video h-full w-full xs:w-1/2 md:max-h-[12.5em] md:w-[22.125em]">
          <Image
            className="select-none object-cover"
            draggable={false}
            fill
            src={course.imageUrl ?? coursePlaceholderImageUrl}
            placeholder={course.imageBlurDataUrl ? "blur" : "empty"}
            blurDataURL={
              course.imageBlurDataUrl ? course.imageBlurDataUrl : undefined
            }
            alt=""
            sizes={imageSizeAttribute}
          />
        </div>
        <div className="w-full xs:w-1/2 md:w-2/3">
          <h3 className="mb-0 line-clamp-2 text-base font-bold leading-snug xs:text-base xs:leading-snug sm:line-clamp-1 sm:text-xl sm:leading-normal">
            {course.title}
          </h3>
          <p className="mb-1 text-sm text-neutral-500 sm:mb-2">
            with {course.instructor.name}
          </p>
          <p className="sr-only mb-2 max-w-[60ch] text-sm leading-normal sm:not-sr-only sm:mb-2 sm:line-clamp-2 md:line-clamp-3">
            {course.description}
          </p>
          <div className="mb-1 flex items-baseline gap-1">{renderPrice()}</div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-yellow-500" />
                {formatCourseLength(course.lengthInSeconds)}
              </span>
              <span className="flex items-center gap-1.5">
                <BookIcon className="h-4 w-4 text-blue-500" />
                {course.numberOfLessons} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <UsersRound className="h-4 w-4 text-purple-700" />
                {course._count.courseEnrollments}{" "}
                {course._count.courseEnrollments !== 1 ? "students" : "student"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default CourseListItem;
