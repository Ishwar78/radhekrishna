import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ChatbotSettings {
  _id?: string;
  businessName: string;
  welcomeMessage: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  genericReply: string;
  storeHours: string;
  isActive: boolean;
}

export default function AdminChatbotManagement() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<ChatbotSettings>({
    businessName: 'Shree RadheKrishna Collection',
    welcomeMessage: '',
    supportEmail: '',
    supportPhone: '',
    whatsappNumber: '',
    genericReply: '',
    storeHours: '',
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Fetch current settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/chatbot-settings`);
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching chatbot settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch chatbot settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch(`${API_URL}/chatbot-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Chatbot settings updated successfully!',
        });
        setSettings(data.settings);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update settings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error saving chatbot settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save chatbot settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chatbot Settings</CardTitle>
          <CardDescription>
            Customize your chatbot's appearance and messages. These settings will be displayed to users when they interact with your chatbot.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={settings.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              placeholder="Your business name"
            />
            <p className="text-xs text-muted-foreground">
              This name will appear in the chatbot header. Change "Shree Balaji Vastralaya" to "shreeradhekrishnacollection" or your desired name.
            </p>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              value={settings.welcomeMessage}
              onChange={(e) => handleChange('welcomeMessage', e.target.value)}
              placeholder="Welcome message for users"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This message appears when the chatbot first opens.
            </p>
          </div>

          {/* Support Email */}
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
              placeholder="support@example.com"
            />
          </div>

          {/* Support Phone */}
          <div className="space-y-2">
            <Label htmlFor="supportPhone">Support Phone</Label>
            <Input
              id="supportPhone"
              value={settings.supportPhone}
              onChange={(e) => handleChange('supportPhone', e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              value={settings.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="919876543210"
            />
            <p className="text-xs text-muted-foreground">
              Enter without spaces or special characters (e.g., 919876543210)
            </p>
          </div>

          {/* Generic Reply */}
          <div className="space-y-2">
            <Label htmlFor="genericReply">Generic Reply Message</Label>
            <Textarea
              id="genericReply"
              value={settings.genericReply}
              onChange={(e) => handleChange('genericReply', e.target.value)}
              placeholder="Default message when user sends a message"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Use {'{email}'} and {'{whatsapp}'} as placeholders which will be replaced with the actual values.
            </p>
          </div>

          {/* Store Hours */}
          <div className="space-y-2">
            <Label htmlFor="storeHours">Store Hours</Label>
            <Textarea
              id="storeHours"
              value={settings.storeHours}
              onChange={(e) => handleChange('storeHours', e.target.value)}
              placeholder="Monday - Saturday: 10:00 AM - 7:00 PM\nSunday: Closed"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Display your store operating hours (use line breaks for multiple lines)
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Enable Chatbot</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Enable or disable the chatbot for all users.
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Chatbot Preview</CardTitle>
          <CardDescription>
            How your chatbot will appear to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden border">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4">
              <h3 className="font-semibold text-lg">{settings.businessName}</h3>
              <p className="text-xs text-emerald-100">Usually replies instantly</p>
            </div>

            {/* Chat Area */}
            <div className="p-4 bg-gray-50 space-y-4 min-h-64">
              {/* Bot Welcome Message */}
              <div className="flex justify-start">
                <div className="max-w-xs px-4 py-2 rounded-lg rounded-bl-none bg-white text-gray-800 border border-gray-200 text-sm">
                  <p className="break-words">{settings.welcomeMessage || 'Namaste! Welcome to our store.'}</p>
                </div>
              </div>

              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-xs px-4 py-2 rounded-lg rounded-br-none bg-blue-600 text-white text-sm">
                  <p>Tell me about bulk orders</p>
                </div>
              </div>

              {/* Bot Reply */}
              <div className="flex justify-start">
                <div className="max-w-xs px-4 py-2 rounded-lg rounded-bl-none bg-white text-gray-800 border border-gray-200 text-sm">
                  <p className="break-words">
                    {settings.genericReply
                      .replace('{email}', settings.supportEmail)
                      .replace('{whatsapp}', `WhatsApp ${settings.supportPhone}`)
                      || 'Thanks for your message!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-3 flex gap-2">
              <input
                type="text"
                disabled
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm"
              />
              <button disabled className="bg-gray-300 text-white rounded-full p-2">
                ✓
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
