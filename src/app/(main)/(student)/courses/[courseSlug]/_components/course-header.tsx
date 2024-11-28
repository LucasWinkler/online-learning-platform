import Image from "next/image";

import { PrimaryHeading } from "~/components/primary-heading";

type CourseHeaderProps = {
  image: string | null;
  title: string;
  description: string;
};

export const CourseHeader = ({
  image,
  title,
  description,
}: CourseHeaderProps) => (
  <div className="lg:col-span-2">
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
      <Image
        src={image ?? ""}
        alt={title}
        fill
        sizes="(min-width: 1024px) 683px, calc(100vw - 48px)"
        className="object-cover"
        priority
      />
    </div>
    <div className="mt-6 space-y-2">
      <PrimaryHeading>{title}</PrimaryHeading>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);
