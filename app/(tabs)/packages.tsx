import ComingSoon, { ComingSoonRef } from "@/components/ui/ComingSoon";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";

export default function Packages() {
  const ref = useRef<ComingSoonRef>(null);

  useFocusEffect(
    useCallback(() => {
      ref.current?.startAnimation();
    }, []),
  );

  return <ComingSoon ref={ref} />;
}
