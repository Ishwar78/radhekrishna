import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import OfferSection from "@/components/OfferSection";
import ProductSectionDisplay from "@/components/ProductSectionDisplay";
import TrendingProducts from "@/components/TrendingProducts";
import CollectionShowcase from "@/components/CollectionShowcase";
import MediaShowcase from "@/components/MediaShowcase";
import CollectionsSection from "@/components/CollectionsSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import ReviewShowcase from "@/components/ReviewShowcase";
import TrustBadges from "@/components/TrustBadges";
import AvailableCoupons from "@/components/AvailableCoupons";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingSidebarVideo from "@/components/FloatingSidebarVideo";
const Index = () => {
  return (
    <>
      <Helmet>
        <title>ShreeradheKrishnacollection - Premium Ethnic Fashion | Suits, Lehengas & Sarees</title>
        <meta
          name="description"
          content="Shop the finest collection of ethnic wear at ShreeradheKrishnacollection. Discover handcrafted suits, lehengas, sarees & more. Free shipping on orders above ₹999. Shop now!"
        />
        <meta name="keywords" content="ethnic wear, indian fashion, suits, lehengas, sarees, anarkali, kurta sets, festive wear, wedding collection" />
        <link rel="canonical" href="https://shreeradhekrishnacollection.com" />

        {/* Open Graph */}
        <meta property="og:title" content="ShreeradheKrishnacollection - Premium Ethnic Fashion" />
        <meta property="og:description" content="Discover handcrafted ethnic wear for every occasion" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shreeradhekrishnacollection.com" />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ShreeradheKrishnacollection",
            "url": "https://shreeradhekrishnacollection.com",
            "logo": "https://shreeradhekrishnacollection.com/logo.png",
            "description": "Premium ethnic fashion store",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-98765-43210",
              "contactType": "customer service"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSlider />
          <OfferSection />
          <ProductSectionDisplay sectionName="diwali-sale" />
          <TrustBadges />
          <TrendingProducts />
          <ProductSectionDisplay sectionName="holi-sale" />
          <CollectionShowcase />
          <MediaShowcase />
          <AvailableCoupons />
          <CollectionsSection />
          <FeaturedProducts />
          <ReviewShowcase />
        </main>
        <Footer />
        <WhatsAppButton />
        <FloatingSidebarVideo />
      </div>
    </>
  );
};

export default Index;
