import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "1",
    category: "General",
    question: "What is Vasstra?",
    answer: "Vasstra is a premium ethnic fashion brand offering handpicked collections of ethnic wear, western wear, and seasonal collections. We pride ourselves on quality fabrics, traditional designs, and excellent customer service."
  },
  {
    id: "2",
    category: "General",
    question: "Is Vasstra available as a mobile app?",
    answer: "Yes! You can install Vasstra as a Progressive Web App (PWA) on your mobile device. Just visit our website and select 'Install App' from your browser menu. You'll get app-like experience with offline browsing capabilities."
  },
  {
    id: "3",
    category: "Orders",
    question: "How do I place an order?",
    answer: "Browse our collections, select your preferred items, choose size and color, add to cart, and proceed to checkout. You can pay using credit/debit cards, UPI, or other payment methods."
  },
  {
    id: "4",
    category: "Orders",
    question: "Can I modify my order after placing it?",
    answer: "If your order hasn't been dispatched yet, you can cancel it and place a new one. Once dispatched, modifications aren't possible. Contact our support team immediately for assistance."
  },
  {
    id: "5",
    category: "Shipping",
    question: "What are the shipping charges?",
    answer: "Free shipping on orders above ₹499. Orders below ₹499 have a flat shipping charge of ₹50. Delivery is within 4-6 business days across India."
  },
  {
    id: "6",
    category: "Shipping",
    question: "How can I track my order?",
    answer: "Once your order is dispatched, you'll receive a tracking ID via email. Use it on our 'Track Order' page or on the courier's website to track your package in real-time."
  },
  {
    id: "7",
    category: "Returns",
    question: "What is your return policy?",
    answer: "You can return items within 14 days of delivery if they're unused, unwashed, and in original condition with tags intact. Return shipping is free. Refunds are processed within 5-7 business days."
  },
  {
    id: "8",
    category: "Returns",
    question: "How do I initiate a return?",
    answer: "Log into your account, go to your order history, select the item to return, and click 'Return/Exchange'. You'll receive a free return label via email. Pack the item and drop it at any courier pickup point."
  },
  {
    id: "9",
    category: "Payments",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express), UPI, net banking, and digital wallets. All payments are secure and encrypted."
  },
  {
    id: "10",
    category: "Payments",
    question: "Is my payment information secure?",
    answer: "Yes, absolutely. We use SSL encryption and PCI DSS compliance to protect your payment information. We never store your full card details on our servers."
  },
  {
    id: "11",
    category: "Size & Fit",
    question: "How do I know my size?",
    answer: "Check our detailed size guide available on product pages. We provide measurements in centimeters for accurate sizing. If unsure, consider exchanging for a different size - it's free!"
  },
  {
    id: "12",
    category: "Size & Fit",
    question: "Do you offer size exchanges?",
    answer: "Yes! If the size doesn't fit, you can exchange it for a different size free of charge. The new item will be dispatched within 2-3 business days of receiving your return."
  },
  {
    id: "13",
    category: "Products",
    question: "Are the products genuine and high quality?",
    answer: "Yes, all our products are 100% genuine. We source premium fabrics and work with skilled artisans to ensure the highest quality. Each item is quality-checked before shipping."
  },
  {
    id: "14",
    category: "Products",
    question: "Do you provide care instructions?",
    answer: "Yes, each product comes with detailed care instructions. We recommend hand washing in cold water for most ethnic wear. Dry cleaning is available for delicate fabrics."
  },
  {
    id: "15",
    category: "Account",
    question: "How do I create an account?",
    answer: "Click 'Sign Up' on our website or app, enter your email/phone number and password, and verify your account. You can also sign up using your Google or social media accounts."
  },
  {
    id: "16",
    category: "Account",
    question: "What are the benefits of having an account?",
    answer: "With an account, you can track orders, save addresses, manage returns, view order history, save items to wishlist, and receive exclusive offers and updates."
  },
  {
    id: "17",
    category: "Discounts",
    question: "How do I get discount codes?",
    answer: "Subscribe to our newsletter to receive exclusive discount codes. We also offer seasonal sales, special promotions, and loyalty discounts for regular customers."
  },
  {
    id: "18",
    category: "Discounts",
    question: "Can I use multiple coupon codes?",
    answer: "Typically, only one coupon code can be applied per order. However, during special promotions, additional discounts might be available. Check the Terms & Conditions."
  }
];

const categories = ["All", "General", "Orders", "Shipping", "Returns", "Payments", "Size & Fit", "Products", "Account", "Discounts"];

export default function FAQ() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFaqs = selectedCategory === "All"
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>FAQs | Vasstra - Premium Ethnic Fashion</title>
        <meta name="description" content="Frequently Asked Questions about Vasstra. Find answers to common questions about orders, shipping, returns, payments, and more." />
      </Helmet>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions. Can't find what you're looking for? Contact our support team.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full font-medium transition-colors",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQs List */}
          <div className="space-y-4 mb-16">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{faq.question}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{faq.category}</p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground flex-shrink-0 ml-4 transition-transform",
                      activeId === faq.id && "rotate-180"
                    )}
                  />
                </button>
                {activeId === faq.id && (
                  <div className="px-6 py-4 border-t border-border bg-muted/30">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-gold/10 via-accent/5 to-background p-8 rounded-lg border border-border text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Didn't Find Your Answer?</h2>
            <p className="text-muted-foreground mb-6">
              Our customer support team is ready to help with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@vasstra.com"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Email Support
              </a>
              <a
                href="/contact"
                className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Contact Us
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
