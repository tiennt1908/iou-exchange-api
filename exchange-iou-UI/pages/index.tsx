import { useRouter } from "next/router";
import React, { useEffect } from "react";

type Props = {};

export default function HomePage({}: Props) {
  const router = useRouter();
  useEffect(() => {
    router.push("/tokens");
  }, []);
  return <></>;
}
