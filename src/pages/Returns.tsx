import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CheckCircle, Clock, AlertCircle, Mail } from "lucide-react";

export default function Returns() {
  return (
    <>
      <Helmet>
        <title>Returns & Exchange | Vasstra - Premium Ethnic Fashion</title>
        <meta name="description" content="Learn about Vasstra's hassle-free returns and exchange policy. 14-day returns, free return shipping, and easy exchanges." />
      </Helmet>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Returns & Exchange
            </h1>
            <p className="text-lg text-muted-foreground">
              We want you to be completely satisfied with your purchase. Shop with confidence knowing returns and exchanges are easy.
            </p>
          </div>

          {/* Return Policy Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="p-6 bg-card rounded-lg border border-border">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">14-Day Returns</h3>
              <p className="text-sm text-muted-foreground">
                Return items within 14 days of delivery for a full refund
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <AlertCircle className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Condition Required</h3>
              <p className="text-sm text-muted-foreground">
                Items must be unused, unwashed, and in original condition
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <CheckCircle className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Free Return Shipping</h3>
              <p className="text-sm text-muted-foreground">
                We provide prepaid return labels for all returns
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <Mail className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Easy Process</h3>
              <p className="text-sm text-muted-foreground">
                Request a return online, pack, and ship - simple as that
              </p>
            </div>
          </div>

          {/* Detailed Policy */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Return Policy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Eligibility</h3>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li>✓ Items must be returned within 14 days of delivery</li>
                    <li>✓ Items must be unused and in original condition</li>
                    <li>✓ Tags must be intact and attached</li>
                    <li>✓ Original packaging and invoice must be included</li>
                    <li>✓ No signs of wear, washing, or alteration</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Non-Returnable Items</h3>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li>✗ Clearance or final sale items</li>
                    <li>✗ Items worn or washed</li>
                    <li>✗ Items without original tags</li>
                    <li>✗ Customized or personalized items</li>
                    <li>✗ Underwear and intimate wear</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Exchange Policy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How to Exchange</h3>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li>• Log in to your Vasstra account</li>
                    <li>• Go to your order history</li>
                    <li>• Select the item you wish to exchange</li>
                    <li>• Choose the new size or color</li>
                    <li>• Print the return label we provide</li>
                    <li>• Ship the original item back to us</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Exchange Timeline</h3>
                  <ul className="text-muted-foreground space-y-2 text-sm">
                    <li>• Request exchanges within 14 days of delivery</li>
                    <li>• Send back original item within 7 days</li>
                    <li>• Replacement ships within 2-3 business days</li>
                    <li>• Delivery within 4-6 business days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-gradient-to-br from-gold/10 via-accent/5 to-background p-8 rounded-lg border border-border mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">How to Return an Item</h2>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-3">
                  1
                </div>
                <h3 className="font-semibold text-foreground mb-2">Request Return</h3>
                <p className="text-sm text-muted-foreground">Visit your account and initiate a return request</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-3">
                  2
                </div>
                <h3 className="font-semibold text-foreground mb-2">Get Label</h3>
                <p className="text-sm text-muted-foreground">Receive a free return shipping label via email</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-3">
                  3
                </div>
                <h3 className="font-semibold text-foreground mb-2">Pack Item</h3>
                <p className="text-sm text-muted-foreground">Pack your item securely with original packaging</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-3">
                  4
                </div>
                <h3 className="font-semibold text-foreground mb-2">Ship Back</h3>
                <p className="text-sm text-muted-foreground">Drop off at any courier pickup point</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-3">
                  5
                </div>
                <h3 className="font-semibold text-foreground mb-2">Get Refund</h3>
                <p className="text-sm text-muted-foreground">Refund processed within 5-7 business days</p>
              </div>
            </div>
          </div>

          {/* Refund Timeline */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-card rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Processing
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>5-7 business days</strong> after we receive your return
              </p>
              <p className="text-xs text-muted-foreground">Once your return is received and inspected</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Approval
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Instant approval</strong> if conditions are met
              </p>
              <p className="text-xs text-muted-foreground">Standard refunds don't require approval</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Refund Method
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Original payment method</strong>
              </p>
              <p className="text-xs text-muted-foreground">Credit/debit card or UPI used for purchase</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Common Questions</h2>
            <div className="space-y-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">Can I return items without original packaging?</h3>
                <p className="text-muted-foreground text-sm">
                  We recommend returning items in original packaging for better protection during shipping, but we can accept returns without packaging if the item condition is good.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">What if the size doesn't fit?</h3>
                <p className="text-muted-foreground text-sm">
                  If the size doesn't fit, we offer free exchanges. Simply request an exchange for a different size and we'll send you the correct size at no extra cost.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">How do I track my return?</h3>
                <p className="text-muted-foreground text-sm">
                  You can track your return using the tracking number provided on your return label. Login to your account to see the status of your return request.
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">What if I received a damaged item?</h3>
                <p className="text-muted-foreground text-sm">
                  Contact our support team immediately with photos of the damage. We'll arrange a replacement or refund right away at no cost to you.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-burgundy/10 to-accent/5 p-8 rounded-lg border border-border text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Our customer support team is here to help with any questions about returns, exchanges, or refunds.
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
                Contact Form
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
