"use client";

import { useEffect } from "react";
import { useMenuStore } from "@/lib/store";

// 저장된 취향·기록을 마운트 후 불러온다. localStorage가 막힌 브라우저(사생활 보호 모드 등)에서는
// persist가 붙지 않으므로 ?.로 건너뛰고 기본값으로 동작한다.
export default function StoreHydrator() {
  useEffect(() => {
    Promise.resolve(useMenuStore.persist?.rehydrate()).finally(() =>
      useMenuStore.setState({ hydrated: true }),
    );
  }, []);
  return null;
}
