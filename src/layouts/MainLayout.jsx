import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;