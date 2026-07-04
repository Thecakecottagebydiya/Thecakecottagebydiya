import { useRef } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import About from "../components/About";
import OrderForm from "../components/OrderForm";
import Location from "../components/Location";
import Footer from "../components/Footer";

export default function HomePage() {
  const orderRef = useRef(null);

  const handleOrderFromCake = (cake) => {
    if (orderRef.current) orderRef.current.prefillWithCake(cake);
  };

  return (
    <div data-testid="home-page">
      <Header />
      <main>
        <Hero />
        <Gallery onOrder={handleOrderFromCake} />
        <About />
        <OrderForm ref={orderRef} />
        <Location />
      </main>
      <Footer />
    </div>
  );
}
