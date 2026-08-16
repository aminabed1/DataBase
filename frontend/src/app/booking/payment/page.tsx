import PaymentView from "@/features/booking/components/PaymentView";

export const metadata = {
    title: "Checkout & Payment | PitchSide",
    description: "Secure ticket payment and live seat reservation confirmation",
};

export default function PaymentPage() {
    return (
        <main className="w-full h-screen overflow-hidden">
            <PaymentView />
        </main>
    );
}