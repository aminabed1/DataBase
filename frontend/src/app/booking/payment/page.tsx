// frontend/src/app/booking/payment/page.tsx
import PaymentView from "@/features/booking/components/PaymentView";
import { Suspense } from "react";

export const metadata = {
    title: "Checkout & Payment | PitchSide",
    description: "Secure ticket payment and live seat reservation confirmation",
};

export default function PaymentPage() {
    return (
        <main className="w-full h-screen overflow-hidden">
            <Suspense fallback={<div className="flex h-full items-center justify-center font-bold text-gray-500">Loading payment...</div>}>
                <PaymentView />
            </Suspense>
        </main>
    );
}