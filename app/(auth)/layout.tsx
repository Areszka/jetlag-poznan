import Footer from "../ui/components/Footer/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        maxWidth: "500px",
        margin: "auto",
        justifyContent: "space-around",
        paddingInline: "16px",
      }}
    >
      {children}
      <Footer />
    </div>
  );
}
