import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Truck, MapPin, Clock, DollarSign, Package } from "lucide-react";

export default function Shipping() {
  return (
    <>
      <Helmet>
        <title>Shipping Info | Vasstra - Premium Ethnic Fashion</title>
        <meta name="description" content="Learn about Vasstra's fast and reliable shipping options. Free shipping on orders above ₹499, delivery in 4-6 business days." />
      </Helmet>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Shipping Information
            </h1>
            <p className="text-lg text-muted-foreground">
              Fast, reliable delivery across India. Track your order every step of the way.
            </p>
          </div>

          {/* Shipping Benefits */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="p-6 bg-card rounded-lg border border-border">
              <Truck className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Delivery within 4-6 business days across India
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <DollarSign className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                On orders above ₹499. Flat ₹50 shipping below that.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <Package className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Secure Packaging</h3>
              <p className="text-sm text-muted-foreground">
                Your items are carefully packed to arrive safely
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Real-time Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track your package at every step of delivery
              </p>
            </div>
          </div>

          {/* Shipping Rates */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Shipping Rates</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shipping Cost</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Delivery Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-6 py-4 text-sm text-foreground">Below ₹499</td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">₹50</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">4-6 business days</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-foreground">₹499 - ₹999</td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium text-green-600">FREE</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">4-6 business days</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-foreground">₹1000 & Above</td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium text-green-600">FREE</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">4-6 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Coverage */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Coverage</h2>
              <div className="space-y-4">
                <div className="p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Nationwide Delivery
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We deliver to all cities and towns across India including metro areas and remote locations
                  </p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-2">Courier Partners</h3>
                  <p className="text-sm text-muted-foreground">
                    We work with trusted logistics partners including Delhivery, BlueDart, Ecom Express, and more for reliable delivery
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Shipping Process</h2>
              <div className="space-y-3">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Order Placed</h3>
                    <p className="text-sm text-muted-foreground">You complete your purchase</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Order Confirmation</h3>
                    <p className="text-sm text-muted-foreground">You receive order confirmation via email</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Processing</h3>
                    <p className="text-sm text-muted-foreground">Order is packed and prepared (1-2 days)</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Dispatch</h3>
                    <p className="text-sm text-muted-foreground">Item ships and tracking ID is provided</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">In Transit</h3>
                    <p className="text-sm text-muted-foreground">Track your package in real-time</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    6
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Delivered</h3>
                    <p className="text-sm text-muted-foreground">Your order arrives safely to your door</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Section */}
          <div className="bg-gradient-to-br from-gold/10 via-accent/5 to-background p-8 rounded-lg border border-border mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Track Your Order</h2>
            <p className="text-muted-foreground mb-6">
              Once your order ships, you'll receive a tracking ID via email. Use it to track your package in real-time:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>✓ Check order status in your account dashboard</li>
              <li>✓ Real-time location updates of your package</li>
              <li>✓ Estimated delivery date</li>
              <li>✓ Courier contact information</li>
              <li>✓ Email notifications at each stage</li>
            </ul>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Shipping FAQ</h2>
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">How long does delivery take?</h3>
                <p className="text-muted-foreground text-sm">
                  Standard delivery is 4-6 business days across India. Order processing takes 1-2 days, and courier delivery takes another 3-4 days depending on your location.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">Can I change the delivery address?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can change the delivery address within 2 hours of placing your order. Contact our support team immediately with the new address.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">What if my package is delayed?</h3>
                <p className="text-muted-foreground text-sm">
                  If your package is delayed beyond 7 days, contact our support team. We'll track the package with the courier and ensure it's delivered promptly.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">Do you ship internationally?</h3>
                <p className="text-muted-foreground text-sm">
                  Currently, we deliver only within India. We're working on international shipping options. Contact us for more details.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">What if my item arrives damaged?</h3>
                <p className="text-muted-foreground text-sm">
                  If your item arrives damaged, please contact us immediately with photos. We'll arrange a replacement or refund at no cost to you.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-burgundy/10 to-accent/5 p-8 rounded-lg border border-border text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Shipping Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help with any shipping inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@vasstra.com"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/track-order"
                className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Track Order
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
