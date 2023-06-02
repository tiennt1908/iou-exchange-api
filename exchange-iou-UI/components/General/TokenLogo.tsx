import Image from "next/image";
import React from "react";

type Props = {
  alt: string;
  imgURL: string | null;
  width: number;
  height: number;
  [key: string]: any;
};

export default function TokenLogo({ imgURL, tokenName, width, height, alt, ...restProps }: Props) {
  return (
    <Image
      alt={alt}
      src={imgURL || "/img/token/empty-token.webp"}
      width={width}
      height={height}
      onError={({ target }: { target: any }) => {
        target.onerror = null; // prevents looping
        target.src = "img/token/empty-token.webp";
        target.srcset = "img/token/empty-token.webp";
      }}
      {...restProps}
    ></Image>
  );
}
