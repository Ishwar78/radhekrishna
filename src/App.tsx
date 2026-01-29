import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrderProvider } from "@/contexts/OrderContext";
import CartDrawer from "@/components/CartDrawer";
import ChatBot from "@/components/ChatBot";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Install from "./pages/Install";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import Bestsellers from "./pages/Bestsellers";
import NewArrivals from "./pages/NewArrivals";
import EthnicWear from "./pages/EthnicWear";
import WesternWear from "./pages/WesternWear";
import SummerCollection from "./pages/SummerCollection";
import WinterWear from "./pages/WinterWear";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OrderHistory from "./pages/OrderHistory";
import UserDashboard from "./pages/UserDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import FAQ from "./pages/FAQ";
import SizeGuide from "./pages/SizeGuide";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Careers from "./pages/Careers";
import NotFound from "./pages/NotFound";
import InstallPWA from "./components/InstallPWA";

// Ethnic Wear Subcategories
import KurtaSets from "./pages/ethnic/KurtaSets";
import AnarkaliSuits from "./pages/ethnic/AnarkaliSuits";
import Lehengas from "./pages/ethnic/Lehengas";
import PartyWear from "./pages/ethnic/PartyWear";
import FestiveCollection from "./pages/ethnic/FestiveCollection";

// Western Wear Subcategories
import TopsTees from "./pages/western/TopsTees";
import Dresses from "./pages/western/Dresses";
import CoordSets from "./pages/western/CoordSets";
import CasualWear from "./pages/western/CasualWear";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <WishlistProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/install" element={<Install />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/bestsellers" element={<Bestsellers />} />
                    <Route path="/new-arrivals" element={<NewArrivals />} />
                    <Route path="/ethnic-wear" element={<EthnicWear />} />
                    <Route path="/ethnic-wear/kurta-sets" element={<KurtaSets />} />
                    <Route path="/ethnic-wear/anarkali-suits" element={<AnarkaliSuits />} />
                    <Route path="/ethnic-wear/lehengas" element={<Lehengas />} />
                    <Route path="/ethnic-wear/party-wear" element={<PartyWear />} />
                    <Route path="/ethnic-wear/festive-collection" element={<FestiveCollection />} />
                    <Route path="/western-wear" element={<WesternWear />} />
                    <Route path="/western-wear/tops-tees" element={<TopsTees />} />
                    <Route path="/western-wear/dresses" element={<Dresses />} />
                    <Route path="/western-wear/coord-sets" element={<CoordSets />} />
                    <Route path="/western-wear/casual-wear" element={<CasualWear />} />
                    <Route path="/summer-collection" element={<SummerCollection />} />
                    <Route path="/winter-wear" element={<WinterWear />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/vastra/admin" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/size-guide" element={<SizeGuide />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <CartDrawer />
                  <InstallPWA />
                  <ChatBot />
                </BrowserRouter>
              </TooltipProvider>
            </WishlistProvider>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
