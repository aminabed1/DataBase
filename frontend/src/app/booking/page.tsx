import StadiumView from "@/features/booking/components/StadiumView";
import { Suspense } from "react";

export const metadata = {
    title: "Select Section | PitchSide",
    description: "Stadium map and section selection for ticket booking",
};

export default function BookingPage() {
    return (
        <main className="w-full bg-gray-50/50">
            <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold text-gray-500">Loading stadium...</div>}>
                <StadiumView />
            </Suspense>
        </main>
    );
}