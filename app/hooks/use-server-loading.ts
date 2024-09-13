import React from "react";

export function useServerLoading() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(false);
  }, []);

  return loading;
}
