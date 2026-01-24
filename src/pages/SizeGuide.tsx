import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

export default function SizeGuide() {
  return (
    <>
      <Helmet>
        <title>Size Guide | Vasstra - Premium Ethnic Fashion</title>
        <meta name="description" content="Vasstra Size Guide - Find your perfect fit with our detailed measurements for ethnic wear, western wear, and more." />
      </Helmet>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Size Guide
            </h1>
            <p className="text-lg text-muted-foreground">
              Find your perfect fit with our detailed size measurements. All measurements are in centimeters.
            </p>
          </div>

          {/* Size Measurement Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6 mb-16">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Measuring Tips</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Wear fitted clothes while measuring</li>
                  <li>• Measure on your body, not on the clothes</li>
                  <li>• Keep the measuring tape relaxed, not tight</li>
                  <li>• Take measurements while standing</li>
                  <li>• Have someone help you measure for accuracy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Size Tables */}
          <Tabs defaultValue="ethnic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="ethnic">Ethnic Wear</TabsTrigger>
              <TabsTrigger value="western">Western Wear</TabsTrigger>
              <TabsTrigger value="universal">Universal</TabsTrigger>
            </TabsList>

            {/* Ethnic Wear */}
            <TabsContent value="ethnic" className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Kurtas & Tunics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted">
                      <tr>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Size</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Chest (cm)</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Length (cm)</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Shoulders (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XS</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">76-81</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">98</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">35</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">S</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">81-86</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">102</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">37</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">M</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">86-91</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">106</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">39</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">L</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">91-97</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">110</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">41</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XL</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">97-102</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">114</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">43</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XXL</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">102-107</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">118</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">45</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Sarees & Lehengas</h3>
                <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Sarees</h4>
                    <p className="text-sm text-muted-foreground">
                      Standard saree length: 6 meters. Blouse pieces are customized based on your bust measurement. Please refer to individual product descriptions for specific measurements.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Lehengas</h4>
                    <p className="text-sm text-muted-foreground">
                      Lehengas are customized pieces. Please check product descriptions for waist, hip, and length measurements. Most lehengas come with stitching adjustments available.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Western Wear */}
            <TabsContent value="western" className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Tops & Dresses</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted">
                      <tr>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Size</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Bust (cm)</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Waist (cm)</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Length (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XS</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">76-81</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">58-63</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">58-62</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">S</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">81-86</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">63-68</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">62-66</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">M</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">86-91</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">68-73</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">66-70</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">L</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">91-97</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">73-78</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">70-74</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XL</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">97-102</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">78-83</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">74-78</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XXL</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">102-107</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">83-88</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">78-82</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Bottoms (Pants, Trousers)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted">
                      <tr>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Size</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Waist (cm)</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Inseam (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XS</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">58-63</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">76-79</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">S</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">63-68</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">79-81</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">M</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">68-73</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">81-84</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">L</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">73-78</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">84-86</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XL</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">78-83</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">86-89</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XXL</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">83-88</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">89-91</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Universal */}
            <TabsContent value="universal" className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Size Conversion Chart</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted">
                      <tr>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">Vasstra</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">UK</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">US</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">EU</th>
                        <th className="border border-border px-4 py-3 text-left text-sm font-semibold text-foreground">India</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XS</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">6</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">2</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">34</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">28</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">S</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">8</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">4</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">36</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">30</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">M</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">10</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">6</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">38</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">32</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">L</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">12</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">8</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">40</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">34</td>
                      </tr>
                      <tr>
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XL</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">14</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">10</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">42</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">36</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border px-4 py-3 text-sm font-medium text-foreground">XXL</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">16</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">12</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">44</td>
                        <td className="border border-border px-4 py-3 text-sm text-muted-foreground">38</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gold/10 via-accent/5 to-background p-6 rounded-lg border border-border">
                <h3 className="text-lg font-bold text-foreground mb-3">Still Unsure About Your Size?</h3>
                <p className="text-muted-foreground mb-4">
                  Don't worry! We offer free size exchanges. If your item doesn't fit perfectly, simply request an exchange for a different size and we'll send you the correct size at no extra cost.
                </p>
                <a
                  href="/returns"
                  className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Learn About Exchanges
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
