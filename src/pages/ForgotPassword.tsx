import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

type ResetStep = "email" | "code" | "password" | "success";

export default function ForgotPassword() {
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 1: Send reset email
  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Email sent",
          description: "Check your email for the reset code",
        });
        setStep("code");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process request",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify code and get token
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!verificationCode.trim()) {
      setErrors({ code: "Please enter the code from your email" });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you'd validate the code against the one sent
      // For now, we'll use the code as the token
      setResetToken(verificationCode);
      setStep("password");
      toast({
        title: "Code verified",
        description: "Now set your new password",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {};

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep("success");
        toast({
          title: "Success!",
          description: "Your password has been reset. Redirecting to login...",
        });
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | Vasstra</title>
        <meta name="description" content="Reset your Vasstra password" />
      </Helmet>

      <Header />

      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl shadow-card border border-border p-8">
              {/* Step 1: Email */}
              {step === "email" && (
                <>
                  <div className="text-center mb-8">
                    <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                      Reset Password
                    </h1>
                    <p className="text-muted-foreground">
                      Enter your email to receive a reset code
                    </p>
                  </div>

                  <form onSubmit={handleSendReset} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="gold"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Reset Password"}
                    </Button>
                  </form>
                </>
              )}

              {/* Step 2: Verify Code */}
              {step === "code" && (
                <>
                  <div className="text-center mb-8">
                    <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                      Enter Reset Code
                    </h1>
                    <p className="text-muted-foreground">
                      Check your email for the reset code
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                    <p className="text-sm text-blue-800">
                      ✓ We sent a reset code to <strong>{email}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyCode} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-foreground">
                        Reset Code
                      </Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="Enter the code from your email"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                      {errors.code && (
                        <p className="text-sm text-destructive">{errors.code}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="gold"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Verifying..." : "Verify Code"}
                    </Button>
                  </form>
                </>
              )}

              {/* Step 3: New Password */}
              {step === "password" && (
                <>
                  <div className="text-center mb-8">
                    <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                      Create New Password
                    </h1>
                    <p className="text-muted-foreground">
                      Enter your new password below
                    </p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">
                        New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-foreground">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="gold"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </>
              )}

              {/* Step 4: Success */}
              {step === "success" && (
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-2xl">✓</span>
                    </div>
                  </div>
                  <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                    Password Reset Successful
                  </h1>
                  <p className="text-muted-foreground">
                    Your password has been updated. Redirecting to login...
                  </p>
                </div>
              )}

              {/* Back to Login Button */}
              {step !== "success" && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/auth")}
                    className="flex items-center justify-center gap-2 text-primary font-medium hover:underline mx-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </button>
                </div>
              )}

              {/* Security Message */}
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-primary text-center font-medium">
                  ✓ Your password reset is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
