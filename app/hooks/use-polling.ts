import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function usePolling(ms: number) {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, ms);

    return () => clearInterval(intervalId);
  }, [ms, router]);
}
