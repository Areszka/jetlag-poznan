export default function Layout({ children }: { children: React.ReactNode }) {
  return <div style={{ maxWidth: "500px", margin: "32px auto" }}>{children}</div>;
}
