import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target;
      let scrollTop = 0;

      if (target === document) {
        scrollTop = window.scrollY || document.documentElement.scrollTop;
      } else if (target instanceof HTMLElement) {
        // Only track scroll for large containers (likely the main page content)
        if (target.clientHeight >= window.innerHeight * 0.5) {
          scrollTop = target.scrollTop;
        } else {
          return; // Ignore small scrolling elements like sidebars or dropdowns
        }
      }

      if (scrollTop > 400) {
        setIsVisible(true);
      } else if (scrollTop < 100) {
        setIsVisible(false);
      }
    };

    // Use capture phase to catch scroll events from all elements
    window.addEventListener("scroll", handleScroll, true);
    
    // Safety check: hide button if the active container is scrolled to top (handles navigation)
    const interval = setInterval(() => {
        let activeScrollTop = 0;
        const scrollableContainers = document.querySelectorAll('.overflow-y-auto, .overflow-y-scroll, main div');
        for (let i = 0; i < scrollableContainers.length; i++) {
            const el = scrollableContainers[i] as HTMLElement;
            if (el.clientHeight >= window.innerHeight * 0.5 && el.scrollTop > 0) {
                activeScrollTop = Math.max(activeScrollTop, el.scrollTop);
            }
        }
        if (activeScrollTop < 100 && (window.scrollY || document.documentElement.scrollTop) < 100) {
            setIsVisible(false);
        }
    }, 1000);
    
    return () => {
        window.removeEventListener("scroll", handleScroll, true);
        clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    let activeContainer: HTMLElement | Window = window;
    let maxScroll = window.scrollY || document.documentElement.scrollTop;

    // Find the container that is currently scrolled
    const scrollableContainers = document.querySelectorAll('.overflow-y-auto, .overflow-y-scroll, main div');
    for (let i = 0; i < scrollableContainers.length; i++) {
        const el = scrollableContainers[i] as HTMLElement;
        if (el.clientHeight >= window.innerHeight * 0.5 && el.scrollTop > maxScroll) {
            maxScroll = el.scrollTop;
            activeContainer = el;
        }
    }

    const toolHeader = document.getElementById("tool-header-top");
    const dashboardHero = document.getElementById("dashboard-hero") || document.querySelector('.hero-section');
    
    if (activeContainer instanceof HTMLElement) {
      if (toolHeader && activeContainer.contains(toolHeader)) {
        const y = toolHeader.offsetTop - 80;
        activeContainer.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      } else if (dashboardHero && activeContainer.contains(dashboardHero)) {
        const y = (dashboardHero as HTMLElement).offsetTop - 80;
        activeContainer.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      } else {
        activeContainer.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (toolHeader) {
        const y = toolHeader.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      } else if (dashboardHero) {
        const y = dashboardHero.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 16 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/80 dark:bg-slate-100/80 text-white dark:text-slate-900 shadow-[0_8px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-2xl z-[90] transition-all duration-300 ease-out border border-white/20 dark:border-slate-900/10 hover:bg-slate-900 dark:hover:bg-slate-100 hover:scale-[1.05] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] active:scale-90 focus:outline-none"
        >
          <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
