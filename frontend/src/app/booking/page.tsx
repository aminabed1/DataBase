import StadiumView from "@/features/booking/components/StadiumView";

export const metadata = {
    title: "Select Section | PitchSide",
    description: "Stadium map and section selection for ticket booking",
};

export default function BookingPage() {
    return (
        <main className="w-full bg-gray-50/50">
            {/* The stadium component we built is rendered here */}
            <StadiumView />
        </main>
    );
}