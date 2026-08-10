"use client";

import { useState } from "react";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import ProfileTab from "@/features/dashboard/components/ProfileTab";
import { DashboardTab } from "@/features/dashboard/types";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');

  // کامپوننت‌های موقت برای تست ساختار تب‌ها (ارتفاع زیاد دادیم تا اسکرول تست بشه)
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'wallet':
        return <div className="h-[1200px] rounded-3xl bg-white p-8 shadow-sm border border-gray-100">Wallet Details Goes Here</div>;
      case 'tickets':
        return <div className="h-[1200px] rounded-3xl bg-white p-8 shadow-sm border border-gray-100">Tickets List Goes Here</div>;
      case 'transactions':
        return <div className="h-[1200px] rounded-3xl bg-white p-8 shadow-sm border border-gray-100">Transactions Table Goes Here</div>;
      case 'support':
        return <div className="h-[1200px] rounded-3xl bg-white p-8 shadow-sm border border-gray-100">Support Tickets Goes Here</div>;
      default:
        return null;
    }
  };

  return (
      // کل صفحه قفل شد (h-screen overflow-hidden)
      // پدینگ بالا رو کم کردیم چون دیگه نوبار اینجا نداریم (pt-8)
      <main className="h-screen w-full bg-[#f7f7f7] pt-8 pb-8 text-gray-900 overflow-hidden">
        {/* عرض رو کردیم max-w-[90rem] تا سایدبار بره سمت چپ‌تر */}
        <div className="mx-auto flex h-full max-w-[90rem] flex-col gap-8 px-4 md:flex-row md:px-8">

          {/* Sidebar */}
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <section className="flex flex-1 flex-col h-full overflow-hidden">

            {/* Header بخش کانتنت (ثابت) */}
            <div className="mb-6 shrink-0 pl-2">
              <h1 className="text-3xl font-black tracking-tight text-black capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
              <p className="mt-2 text-gray-500">
                Manage your account details and preferences.
              </p>
            </div>

            <div
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