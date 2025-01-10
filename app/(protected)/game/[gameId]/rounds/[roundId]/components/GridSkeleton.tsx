export default function GridSkeleton({ children }: { children: JSX.Element }) {
  return (
    <>
      <div></div>
      <div></div>
      {children}
    </>
  );
}
