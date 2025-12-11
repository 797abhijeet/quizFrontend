import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import "./HomeNew.css";
function HomeNew() {
  return (
    <div className="HomeNew">
      <Home />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

export default HomeNew;
