import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Download } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ open, onClose, onSuccess }: PaymentModalProps) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<"single" | "bundle">("single");

  const initiateMutation = useMutation({
    mutationFn: async (plan: "single" | "bundle") => {
      return await apiRequest("POST", "/api/payments/initiate", { plan });
    },
    onSuccess: (data: { orderId: string; amount: number; currency: string; keyId: string }) => {
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "ResumeAI",
        description: selectedPlan === "single" ? "Single Download" : "20 Downloads Bundle",
        handler: async (response: any) => {
          try {
            const result = await apiRequest("POST", "/api/payments/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            
            if (result.success) {
              await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
              toast({
                title: "Payment Successful!",
                description: result.message,
              });
              onSuccess();
              onClose();
            } else {
              toast({
                title: "Payment Verification Failed",
                description: result.message,
                variant: "destructive",
              });
            }
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to verify payment",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#4F94D4",
        },
        modal: {
          ondismiss: () => {
            toast({
              title: "Payment Cancelled",
              description: "You can retry anytime",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        variant: "destructive",
      });
    },
  });

  const handlePayment = () => {
    initiateMutation.mutate(selectedPlan);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-payment">
        <DialogHeader>
          <DialogTitle data-testid="text-payment-title">Purchase Download Credits</DialogTitle>
          <DialogDescription data-testid="text-payment-description">
            Choose a plan to download your resume as PDF
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card
            className={`p-4 cursor-pointer hover-elevate active-elevate-2 ${
              selectedPlan === "single" ? "border-primary" : ""
            }`}
            onClick={() => setSelectedPlan("single")}
            data-testid="card-plan-single"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold" data-testid="text-plan-single-name">Single Download</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Perfect for one-time use
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold" data-testid="text-plan-single-price">₹10</span>
                  <span className="text-sm text-muted-foreground">/ download</span>
                </div>
              </div>
              {selectedPlan === "single" && (
                <Badge variant="default" data-testid="badge-selected-single">
                  <Check className="h-3 w-3" />
                </Badge>
              )}
            </div>
          </Card>

          <Card
            className={`p-4 cursor-pointer hover-elevate active-elevate-2 ${
              selectedPlan === "bundle" ? "border-primary" : ""
            }`}
            onClick={() => setSelectedPlan("bundle")}
            data-testid="card-plan-bundle"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold" data-testid="text-plan-bundle-name">20 Downloads Bundle</h3>
                  <Badge variant="secondary" className="text-xs">Best Value</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Save 50% with bulk purchase
                </p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold" data-testid="text-plan-bundle-price">₹100</span>
                  <span className="text-sm text-muted-foreground line-through">₹200</span>
                </div>
              </div>
              {selectedPlan === "bundle" && (
                <Badge variant="default" data-testid="badge-selected-bundle">
                  <Check className="h-3 w-3" />
                </Badge>
              )}
            </div>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-cancel-payment"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={initiateMutation.isPending}
            className="flex-1"
            data-testid="button-proceed-payment"
          >
            {initiateMutation.isPending ? "Processing..." : "Proceed to Pay"}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Secure payment via Razorpay • UPI, Cards, Wallets accepted
        </p>
      </DialogContent>
    </Dialog>
  );
}
