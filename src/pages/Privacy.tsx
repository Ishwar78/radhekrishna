import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Vasstra - Premium Ethnic Fashion</title>
        <meta name="description" content="Vasstra Privacy Policy - Learn how we protect your personal information and data." />
      </Helmet>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2026
            </p>
          </div>

          <div className="prose prose-sm max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                Vasstra ("we", "our", or "us") operates the vasstra.com website and mobile app (collectively, the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
              <p className="text-muted-foreground">
                We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Definitions</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong>Personal Data:</strong> Personally identifiable information that can be used to identify an individual, such as a name, email address, postal address, phone number, or payment information.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information collected automatically, such as browser type, IP address, referring/exit pages, and pages visited.
                </li>
                <li>
                  <strong>Cookies:</strong> Small data files stored on your device to remember information about you.
                </li>
                <li>
                  <strong>Service:</strong> The Vasstra website, mobile app, and all related services.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Information Collection and Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">3.1 Personal Data</h3>
                  <p className="text-muted-foreground mb-3">
                    We collect the following types of personal data:
                  </p>
                  <ul className="space-y-2 text-muted-foreground ml-4">
                    <li>• Email address</li>
                    <li>• First name and last name</li>
                    <li>• Phone number</li>
                    <li>• Postal address</li>
                    <li>• Credit/Debit card information (processed securely via payment gateways)</li>
                    <li>• Order and purchase history</li>
                    <li>• Wishlist and saved items</li>
                    <li>• Account preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">3.2 Usage Data</h3>
                  <p className="text-muted-foreground">
                    We may collect information about how you access and use the Service, including:
                  </p>
                  <ul className="space-y-2 text-muted-foreground ml-4 mt-2">
                    <li>• Browser and device type</li>
                    <li>• IP address</li>
                    <li>• Pages visited and time spent on pages</li>
                    <li>• Referring and exit pages</li>
                    <li>• Search queries</li>
                    <li>• Clickstream data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">3.3 Use of Data</h3>
                  <p className="text-muted-foreground">
                    Vasstra uses the collected data for various purposes:
                  </p>
                  <ul className="space-y-2 text-muted-foreground ml-4 mt-2">
                    <li>• To provide and maintain the Service</li>
                    <li>• To notify you about changes to the Service</li>
                    <li>• To allow participation in interactive features</li>
                    <li>• To provide customer support</li>
                    <li>• To gather analysis or valuable information to improve the Service</li>
                    <li>• To monitor the usage of the Service</li>
                    <li>• To detect, prevent, and address fraud and security issues</li>
                    <li>• To send promotional emails (with your consent)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Cookies and Tracking</h2>
              <p className="text-muted-foreground mb-3">
                The Service uses cookies and similar tracking technologies to enhance your experience.
              </p>
              <p className="text-muted-foreground mb-3">
                Cookies are small data files that are placed on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of the Service.
              </p>
              <p className="text-muted-foreground">
                We use the following types of cookies:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4 mt-2">
                <li>• <strong>Essential Cookies:</strong> Required for the Service to function properly</li>
                <li>• <strong>Performance Cookies:</strong> Help us understand how users interact with the Service</li>
                <li>• <strong>Preference Cookies:</strong> Remember your choices and settings</li>
                <li>• <strong>Marketing Cookies:</strong> Used to track your activity for targeted advertising</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Security of Data</h2>
              <p className="text-muted-foreground">
                The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
              </p>
              <p className="text-muted-foreground mt-3">
                We implement various security measures including:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4 mt-2">
                <li>• SSL encryption for all sensitive data transmission</li>
                <li>• Secure payment gateway integration</li>
                <li>• Regular security audits and updates</li>
                <li>• Limited access to personal data</li>
                <li>• PCI DSS compliance for payment processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground">
                We will retain your personal data only for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. You can request deletion of your data at any time, subject to certain legal obligations.
              </p>
              <p className="text-muted-foreground mt-3">
                Order information will be retained for accounting and tax purposes as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Third-Party Services</h2>
              <p className="text-muted-foreground">
                The Service may contain links to third-party websites and services that are not operated by Vasstra. This Privacy Policy does not apply to third-party services, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services before providing your personal information.
              </p>
              <p className="text-muted-foreground mt-3">
                Third-party services we use include:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4 mt-2">
                <li>• Payment processors (credit card, UPI, net banking)</li>
                <li>• Shipping and logistics partners</li>
                <li>• Analytics services</li>
                <li>• Email service providers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4 mt-2">
                <li>• Access your personal data</li>
                <li>• Correct inaccurate data</li>
                <li>• Request deletion of your data</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Request a copy of your data in a portable format</li>
                <li>• Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                To exercise these rights, please contact us at privacy@vasstra.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground">
                The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-muted-foreground mt-3">
                Your continued use of the Service following the posting of revised Privacy Policy means that you accept and agree to the changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-card rounded-lg border border-border">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> privacy@vasstra.com
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Mailing Address:</strong><br />
                  Vasstra<br />
                  Customer Service Team<br />
                  India
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
