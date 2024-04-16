import type { CoursesPagePayload } from "~/types/course";

import { BookIcon, ClockIcon, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";

type CourseListItemProps = {
  course: CoursesPagePayload;
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
          <span className="sm:text-base text-sm font-semibold">
            ${discountedPrice.toFixed(2)}
          </span>
          <span className="text-gray-500 line-through dark:text-gray-400 sm:text-sm text-xs">
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

  const formatLength = (lengthInSeconds: number): string => {
    const lengthInHours = lengthInSeconds / 3600;
    const hours = Math.floor(lengthInHours);
    const minutes = Math.floor((lengthInHours - hours) * 60);

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <li className="border border-neutral-200 hover:bg-neutral-50 transition-colors ">
      <Link className="flex flex-col gap-4 p-4 xs:flex-row" href={courseLink}>
        <div className="relative aspect-video w-full h-full xs:w-1/2 md:w-1/2">
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
          />
        </div>
        <div className="w-full xs:w-1/2 md:w-2/3">
          <h3 className="line-clamp-2 sm:line-clamp-1 mb-0 text-base xs:leading-snug xs:text-base font-bold sm:text-xl leading-snug sm:leading-normal">
            {course.title}
          </h3>
          <p className="mb-1 sm:mb-2 text-sm text-neutral-500">
            with {course.instructor.name}
          </p>
          <p className="sm:line-clamp-2 md:line-clamp-3 mb-2 max-w-[60ch] text-sm leading-normal sr-only sm:not-sr-only sm:mb-2">
            {course.description}
          </p>
          <div className="mb-1 flex items-baseline gap-1">{renderPrice()}</div>
          <div className="mb-1 text-sm flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-yellow-500" />
                {formatLength(course.lengthInSeconds)}
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
