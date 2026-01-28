import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ZoomIn } from "lucide-react";

interface Measurement {
  name: string;
  value: string;
}

interface Size {
  label: string;
  measurements: Measurement[];
}

interface SizeChart {
  _id?: string;
  sizes: Size[];
  unit: 'cm' | 'inches';
  chartImage?: string | null;
}

interface SizeChartDisplayProps {
  productId: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function SizeChartDisplay({ productId }: SizeChartDisplayProps) {
  const [sizeChart, setSizeChart] = useState<SizeChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchSizeChart();
  }, [productId]);

  const fetchSizeChart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/size-charts/product/${productId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch size chart');
      }

      const data = await response.json();
      if (data.sizeChart) {
        setSizeChart(data.sizeChart);
      }
    } catch (error) {
      console.error('Error fetching size chart:', error);
      setSizeChart(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!sizeChart || (sizeChart.sizes.length === 0 && !sizeChart.chartImage)) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <ZoomIn className="h-4 w-4" />
          View Size Chart
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Size Chart</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Chart Image */}
          {sizeChart.chartImage && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Size Chart Image</h3>
              <div className="w-full rounded-lg border border-border overflow-hidden bg-muted/50">
                <img
                  src={sizeChart.chartImage}
                  alt="Size Chart"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    console.error('Error loading size chart image');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Size chart image loaded successfully');
                  }}
                />
              </div>
            </div>
          )}

          {/* Measurements Table */}
          {sizeChart.sizes && sizeChart.sizes.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Measurements ({sizeChart.unit})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-4 py-2 text-left font-semibold">
                        Size
                      </th>
                      {sizeChart.sizes[0]?.measurements && 
                        sizeChart.sizes[0].measurements.map((_, mIndex) => (
                          <th
                            key={mIndex}
                            className="border border-border px-4 py-2 text-left font-semibold"
                          >
                            {sizeChart.sizes[0].measurements[mIndex].name}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.sizes.map((size, index) => (
                      <tr key={index} className="hover:bg-muted/50 transition-colors">
                        <td className="border border-border px-4 py-2 font-medium">
                          {size.label}
                        </td>
                        {size.measurements.map((measurement, mIndex) => (
                          <td key={mIndex} className="border border-border px-4 py-2">
                            {measurement.value} {sizeChart.unit}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> Please refer to this size chart to ensure a perfect fit. 
              If you're between sizes, we recommend choosing the larger size.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
