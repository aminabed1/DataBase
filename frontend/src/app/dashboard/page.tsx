"use client";

import { useState, useRef, useEffect } from "react";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import ProfileTab from "@/features/dashboard/components/ProfileTab";
import WalletTab from "@/features/dashboard/components/WalletTab";
import SupportTab from "@/features/dashboard/components/SupportTab";
import { DashboardTab } from "@/features/dashboard/types";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'wallet':
        return <WalletTab />;
      case 'tickets':
        return <div className="h-[1200px] rounded-3xl bg-white p-8 shadow-sm border border-gray-100">Tickets List Goes Here</div>;
      case 'support':
        return <SupportTab />;
      default:
        return null;
    }
  };

  return (
      <main className="h-screen w-full bg-[#f7f7f7] pt-8 pb-8 text-gray-900 overflow-hidden">
        <div className="mx-auto flex h-full max-w-[90rem] flex-col gap-8 px-4 md:flex-row md:px-8">

          {/* Sidebar */}
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <section className="flex flex-1 flex-col h-full overflow-hidden">

            {/* Header */}
            <div className="mb-6 shrink-0 pl-2">
              <h1 className="text-3xl font-black tracking-tight text-black capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
              <p className="mt-2 text-gray-500">
                Manage your account details and preferences.
              </p>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto pr-4 pb-12 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors"
                data-lenis-prevent="true"
            >
              <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

        </div>
      </main>
  );
}