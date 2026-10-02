import * as React from "react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { List, X } from "@phosphor-icons/react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Awwwards Nav
 *
 * A segmented glassmorphic bottom navigation bar with individual pill buttons
 * and an expandable "More" panel matching the Codepolarity dark navy website color scheme.
 */

const DEFAULT_ITEMS = [
  { label: "Overview", href: "/" },
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "Online IDE", href: "/editor" },
  { label: "Typlab", href: "/typlab" },
];

const DEFAULT_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Overview", href: "/" },
      { label: "Assessment", href: "/assessment" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Roadmaps", href: "/roadmaps" },
      { label: "Online IDE", href: "/editor" },
      { label: "Typlab Speed", href: "/typlab" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/signin" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQs", href: "#faq-section" },
      { label: "Community", href: "https://github.com/Dhruv-cmd7/Codepolarity_v3", external: true },
    ],
  },
];

const COLLAPSED_HEIGHT = 56;
const EXPANDED_HEIGHT = 275;

export function AwwwardsNav({
  items = DEFAULT_ITEMS,
  columns = DEFAULT_COLUMNS,
  moreLabel = "More",
  theme = "dark",
  onToggleTheme,
  onOpenChange,
  className,
}) {
  const navRef = useRef(null);
  const navTopRef = useRef(null);
  const navItemsRef = useRef(null);
  const navHomeRef = useRef(null);

  const openRef = useRef(false);
  const animatingRef = useRef(false);
  const [showClose, setShowClose] = useState(false);

  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  // Establish the collapsed baseline imperatively.
  useEffect(() => {
    const nav = navRef.current;
    const navTop = navTopRef.current;
    const navItems = navItemsRef.current;
    const navHome = navHomeRef.current;
    if (!nav || !navTop || !navItems || !navHome) return;

    gsap.set(nav, { height: COLLAPSED_HEIGHT });
    gsap.set(navTop, { opacity: 0, scale: 0.96, display: "none" });
    gsap.set(navItems, { opacity: 1, display: "flex" });
    gsap.set(navHome, { flexGrow: 0 });

    return () => {
      gsap.killTweensOf([nav, navTop, navItems, navHome]);
    };
  }, []);

  const toggle = () => {
    const nav = navRef.current;
    const navTop = navTopRef.current;
    const navItems = navItemsRef.current;
    const navHome = navHomeRef.current;
    if (!nav || !navTop || !navItems || !navHome || animatingRef.current) return;

    animatingRef.current = true;
    const opening = !openRef.current;
    openRef.current = opening;
    onOpenChangeRef.current?.(opening);

    if (opening) {
      gsap.to(nav, { height: EXPANDED_HEIGHT, duration: 0.65, ease: "power4.inOut" });
      gsap.to(navItems, {
        opacity: 0,
        duration: 0.12,
        onComplete: () => gsap.set(navItems, { display: "none" }),
      });
      gsap.to(navHome, {
        flexGrow: 1,
        duration: 0.2,
        ease: "power4.inOut",
        onComplete: () => setShowClose(true),
      });
      gsap.to(navTop, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        delay: 0.35,
        onStart: () => gsap.set(navTop, { display: "block" }),
        onComplete: () => {
          animatingRef.current = false;
        },
      });
    } else {
      gsap.to(nav, { height: COLLAPSED_HEIGHT, duration: 0.65, ease: "power4.inOut", delay: 0.12 });
      gsap.to(navTop, {
        opacity: 0,
        scale: 0.96,
        duration: 0.18,
        onComplete: () => gsap.set(navTop, { display: "none" }),
      });
      gsap.to(navHome, {
        flexGrow: 0,
        duration: 0.2,
        ease: "power4.inOut",
        onComplete: () => setShowClose(false),
      });
      gsap.to(navItems, {
        opacity: 1,
        duration: 0.18,
        delay: 0.35,
        onStart: () => gsap.set(navItems, { display: "flex" }),
        onComplete: () => {
          animatingRef.current = false;
        },
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
        "w-[min(760px,94vw)] overflow-hidden rounded-2xl border backdrop-blur-2xl shadow-2xl p-1.5 transition-shadow",
        "border-black/10 bg-white/85 dark:border-white/15 dark:bg-[#0a0d14]/90",
        className,
      )}
      style={{ height: COLLAPSED_HEIGHT }}
    >
      {/* Expanded mega-menu panel */}
      <div
        ref={navTopRef}
        className="absolute inset-x-1.5 top-1.5 bottom-[54px] hidden overflow-hidden rounded-xl border border-black/[0.08] bg-black/[0.02] dark:border-white/[0.08] dark:bg-white/[0.03] p-6 sm:p-7 pt-7 sm:pt-8 backdrop-blur-xl"
      >
        <div className="flex h-full w-full justify-between items-stretch">
          {columns.map((col, ci) => (
            <div
              key={col.title}
              className={cn(
                "flex flex-1 flex-col justify-start items-center min-w-0 h-full px-2",
                ci > 0 && "border-l border-dashed border-black/15 dark:border-white/15",
              )}
            >
              {/* Horizontally centered text block with heading aligned on top */}
              <div className="flex flex-col justify-start items-start w-fit">
                {/* Title Header with Dot */}
                <div
                  className="mb-7 flex items-center gap-2.5 shrink-0 select-none"
                  style={{ marginBottom: "28px" }}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black/40 dark:bg-white/40" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/50 dark:text-white/50 whitespace-nowrap">
                    {col.title}
                  </p>
                </div>

                {/* Links List with hover animation */}
                <div className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href || "#"}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer noopener" : undefined}
                      onClick={(e) => {
                        if (link.onClick) {
                          e.preventDefault();
                          link.onClick(e);
                        }
                      }}
                      className="group flex items-center text-sm font-medium text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white transition-all duration-75 ease-out cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis py-0.5 hover:translate-x-1"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row: More / Close button + Inline nav pill items */}
      <div className="absolute inset-x-1.5 bottom-1.5 flex h-[44px] items-center gap-1.5">
        {/* More / Close Pill */}
        <div
          ref={navHomeRef}
          role="button"
          tabIndex={0}
          aria-expanded={showClose}
          aria-label={showClose ? "Close menu" : "Open menu"}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          className={cn(
            "flex h-full min-w-[100px] shrink-0 cursor-pointer select-none items-center justify-center gap-2 rounded-xl border px-3.5 text-xs sm:text-sm font-medium transition-all duration-100 ease-out overflow-hidden active:scale-[0.97]",
            "border-black/10 bg-black/[0.04] text-neutral-700 hover:bg-black hover:text-white hover:border-black",
            "dark:border-white/10 dark:bg-white/[0.05] dark:text-neutral-200 dark:hover:bg-white dark:hover:text-black dark:hover:border-white dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.15)]",
            showClose && "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white font-semibold",
          )}
        >
          {showClose ? (
            <X weight="bold" className="h-4 w-4 shrink-0" />
          ) : (
            <List weight="bold" className="h-4 w-4 shrink-0" />
          )}
          <span className="whitespace-nowrap">{showClose ? "Close" : moreLabel}</span>
        </div>

        {/* Inline Navigation Pills */}
        <div ref={navItemsRef} className="flex min-w-0 flex-1 h-full items-center gap-1.5">
          {items.map((item) => (
            <div
              key={item.label}
              className={cn(
                "group flex h-full flex-1 items-center justify-center rounded-xl border transition-all duration-100 ease-out overflow-hidden cursor-pointer active:scale-[0.97]",
                // Inactive pill: subtle website surface color & border
                "border-black/10 bg-black/[0.03] hover:bg-black hover:text-white hover:border-black",
                "dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white dark:hover:text-black dark:hover:border-white dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.15)]",
                // Active pill: distinctive highlighted surface matching website scheme
                item.active && "border-black/20 dark:border-white/20 bg-black/[0.08] dark:bg-white/[0.12] shadow-sm font-semibold"
              )}
            >
              <a
                href={item.href || "#"}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick(e);
                  }
                }}
                className={cn(
                  "w-full h-full flex items-center justify-center px-2 sm:px-3 text-center text-xs sm:text-sm font-medium transition-colors duration-75 ease-out cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis select-none",
                  item.active
                    ? "text-black dark:text-white group-hover:text-white dark:group-hover:text-black font-semibold"
                    : "text-neutral-700 dark:text-neutral-300 group-hover:text-white dark:group-hover:text-black"
                )}
              >
                <span className="flex items-center justify-center gap-1.5">
                  {item.active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 animate-pulse" />
                  )}
                  <span>{item.label}</span>
                </span>
              </a>
            </div>
          ))}

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className={cn(
                "group flex h-full w-[44px] shrink-0 items-center justify-center rounded-xl border transition-all duration-100 ease-out cursor-pointer active:scale-[0.97]",
                "border-black/10 bg-black/[0.03] text-neutral-700 hover:bg-black hover:text-white hover:border-black",
                "dark:border-white/10 dark:bg-white/[0.05] dark:text-neutral-300 dark:hover:bg-white dark:hover:text-black dark:hover:border-white dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
              )}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default AwwwardsNav;
