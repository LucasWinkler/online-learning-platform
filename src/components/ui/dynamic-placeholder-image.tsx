import Image from "next/image";
import { type ImageProps } from "next/image";
import { type FC } from "react";

interface DynamicPlaceholderImageProps extends ImageProps {
  src: string;
}

export const DynamicPlaceholderImage: FC<DynamicPlaceholderImageProps> = ({
  src,
  alt,
  width,
  height,
  ...props
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      placeholder="blur"
      {...props}
    />
  );
};
