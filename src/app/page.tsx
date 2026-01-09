import Navbar from './Components/Navbar';
import Banner from './Components/Banner';
import CustomersSection from './Components/Customers';
import Imagesection from './Components/Image';
import Faq from './Components/Faq';
import Footer from './Components/Footer';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Banner />
      <CustomersSection />
      <Imagesection />
      <Faq />
      <Footer />
    </div>
  );
}