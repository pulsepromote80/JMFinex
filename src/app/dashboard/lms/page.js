"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StatsDashboard from "../../user/components/StatsDashboard";
import CourseCatalog from "../../user/components/CourseCatalog";
import ExtrasSection from "../../user/components/ExtrasSection";
import CoursePlayer from "../../user/components/CoursePlayer";
import { courses } from "../../user/components/lmsData";

export default function LMSPage() {
  const [activeCourse, setActiveCourse] = useState(null);

  return (
    <div className="min-h-screen w-full text-white bg-[#0A0F1F] font-['var(--font-body,ui-sans-serif)'] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full -left-32 -top-32 w-96 h-96 bg-blue-500/7 blur-[120px]" />
        <div className="absolute rounded-full -right-32 top-[30%] w-96 h-96 bg-amber-400/6 blur-[120px]" />
        <div className="absolute rounded-full left-[30%] bottom-0 w-96 h-96 bg-green-500/5 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeCourse ? (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CoursePlayer course={activeCourse} onBack={() => setActiveCourse(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10 max-w-[1380px]"
            >
              <StatsDashboard onContinueLearning={() => setActiveCourse(courses.find((c) => c.progress > 0) || courses[0])} />
              <CourseCatalog onOpenCourse={setActiveCourse} />
              <ExtrasSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}