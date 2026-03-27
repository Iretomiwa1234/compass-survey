import React, { useEffect, useRef, useState } from "react";
import { LayoutGrid, Move, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// Pages where QuickActions should be hidden
const hiddenRoutes = ["/auth", "/login", "/register", "/verification"];

// SVG icon components
const EditIcon = () => (
  <img src="/assets/edit-05.svg" alt="Create Survey" className="h-5 w-5" />
);

const GlassesIcon = () => (
  <img src="/assets/glasses-01.svg" alt="Social Insights" className="h-5 w-5" />
);

const BarChartIcon = () => (
  <img
    src="/assets/bar-line-chart.svg"
    alt="Survey Analysis"
    className="h-5 w-5"
  />
);

const FileIcon = () => (
  <img src="/assets/file-07.svg" alt="Report" className="h-5 w-5" />
);

const StarIcon = () => (
  <img src="/assets/star-icon.svg" alt="Generate with AI" className="h-5 w-5" />
);

const quickActions = [
  {
    icon: EditIcon,
    label: "Create Survey",
    path: "/create-survey",
  },
  {
    icon: GlassesIcon,
    label: "Social Insights",
    path: "/social-insights",
    disabled: true,
  },
  {
    icon: BarChartIcon,
    label: "Survey Analysis",
    path: "/survey-analysis",
  },
  {
    icon: FileIcon,
    label: "Report",
    path: "/report",
    disabled: true,
  },
  {
    icon: StarIcon,
    label: "Generate Survey with AI",
    path: "/create-survey",
    disabled: true,
  },
  {
    icon: LayoutGrid,
    label: "Dashboard",
    path: "/",
  },
];

export function QuickActions() {
  const navigate = useNavigate();
  const location = useLocation();

  const search = new URLSearchParams(location.search);
  const hasPublicHashParam = Boolean(
    (search.get("") ?? "").trim() ||
      (search.get("hash") ?? "").trim() ||
      (search.get("h") ?? "").trim() ||
      (search.get("token") ?? "").trim() ||
      (search.get("respondent_hash") ?? "").trim(),
  );

  const isPublicResponseRoute =
    location.pathname === "/respond" ||
    location.pathname.startsWith("/respond/") ||
    (location.pathname === "/" && hasPublicHashParam);

  const shouldHide =
    hiddenRoutes.includes(location.pathname) ||
    location.pathname === "/survey-preview" ||
    isPublicResponseRoute;

  // offset state (in px)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // control visibility of the move handle; keep visible for 2s after mouse leaves
  const [showHandle, setShowHandle] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const hideHandleTimeoutRef = useRef<number | null>(null);

  // refs to track pointer dragging
  const startRef = useRef<{
    px: number;
    py: number;
    ox: number;
    oy: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // show handle on hover; keep visible for 2s after leave (unless dragging)
  const handleMouseEnter = () => {
    if (hideHandleTimeoutRef.current) {
      window.clearTimeout(hideHandleTimeoutRef.current);
      hideHandleTimeoutRef.current = null;
    }
    setIsExpanded(true);
    setShowHandle(true);
  };

  const handleMouseLeave = () => {
    if (isDragging) return;
    setIsExpanded(false);
    // hide after 2s
    hideHandleTimeoutRef.current = window.setTimeout(() => {
      setShowHandle(false);
      hideHandleTimeoutRef.current = null;
    }, 2000);
  };

  // pointer event handlers (works for mouse + touch)
  useEffect(() => {
    if (shouldHide) return;
    const onPointerMove = (ev: PointerEvent) => {
      if (!startRef.current) return;
      // calculate delta
      const dx = ev.clientX - startRef.current.px;
      const dy = ev.clientY - startRef.current.py;
      setOffset({
        x: startRef.current.ox + dx,
        y: startRef.current.oy + dy,
      });
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (!startRef.current) return;
      // end dragging
      setIsDragging(false);
      try {
        containerRef.current?.releasePointerCapture(ev.pointerId);
      } catch {
        // ignore if not captured
      }
      startRef.current = null;
      // hide handle after 2s if mouse not over
      if (!containerRef.current?.matches(":hover")) {
        if (hideHandleTimeoutRef.current)
          window.clearTimeout(hideHandleTimeoutRef.current);
        hideHandleTimeoutRef.current = window.setTimeout(() => {
          setIsExpanded(false);
          setShowHandle(false);
          hideHandleTimeoutRef.current = null;
        }, 2000);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [shouldHide]);

  const onPointerDownHandle = (e: React.PointerEvent) => {
    // only start drag using primary button
    if (
      e.pointerType === "mouse" &&
      (e as unknown as PointerEvent).button !== 0
    ) {
      return;
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    // clear any hide timeouts
    if (hideHandleTimeoutRef.current) {
      window.clearTimeout(hideHandleTimeoutRef.current);
      hideHandleTimeoutRef.current = null;
    }
    startRef.current = {
      px: e.clientX,
      py: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };

  // reset position
  const reset = () => {
    setOffset({ x: 0, y: 0 });
    setIsExpanded(false);
    setShowHandle(false);
  };

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (hideHandleTimeoutRef.current) {
        window.clearTimeout(hideHandleTimeoutRef.current);
        hideHandleTimeoutRef.current = null;
      }
      startRef.current = null;
    };
  }, []);

  // determine whether position changed from original
  const isMoved = offset.x !== 0 || offset.y !== 0;

  // Hide on auth-related pages
  if (shouldHide) {
    return null;
  }
  const handleCursor = isDragging
    ? "grabbing"
    : showHandle
      ? "grab"
      : "default";

  return (
    <TooltipProvider delayDuration={100}>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={() => {
          if (hideHandleTimeoutRef.current) {
            window.clearTimeout(hideHandleTimeoutRef.current);
            hideHandleTimeoutRef.current = null;
          }
          setIsExpanded(true);
          setShowHandle(true);
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsExpanded(false);
            if (!isDragging) {
              hideHandleTimeoutRef.current = window.setTimeout(() => {
                setShowHandle(false);
                hideHandleTimeoutRef.current = null;
              }, 2000);
            }
          }
        }}
        // position anchored bottom center
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "50%",
          transform: `translateX(-50%) translate(${offset.x}px, ${offset.y}px)`,
          zIndex: 50,
        }}
        // small accessibility label
        aria-label="Quick actions"
        className="hidden md:flex items-center gap-0"
      >
        {/* Control group (drag + reset) - side-by-side, slides up on hover */}
        <div
          aria-hidden={!showHandle && !isDragging && !isMoved}
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: showHandle || isDragging ? "0.5rem" : "-2.25rem",
            opacity: showHandle || isDragging || isMoved ? 1 : 0,
            pointerEvents:
              showHandle || isDragging || isMoved ? "auto" : "none",
            transition: "all 0.22s cubic-bezier(.2,.9,.2,1)",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            zIndex: "-4",
          }}
          className="rounded-full"
        >
          {/* Drag handle button */}
          <button
            onPointerDown={onPointerDownHandle}
            role="button"
            aria-label="Drag quick actions"
            style={{ cursor: handleCursor }}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
          >
            <Move className="h-4 w-4 text-gray-500" />
          </button>

          {/* Reset button - only shown when moved */}
          {isMoved && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={reset}
                  className="h-8 w-8 p-0 rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-[#206AB5] hover:bg-[#206AB5]/5"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-gray-900 text-white text-xs"
              >
                Reset position
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Main actions bar */}
        <div
          className="bg-white rounded-full shadow-lg border border-gray-200 transition-all duration-300 overflow-hidden"
          style={{ width: isExpanded ? 306 : 44 }}
        >
          <div className="relative h-[44px]">
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
              style={{
                opacity: isExpanded ? 0 : 1,
                pointerEvents: isExpanded ? "none" : "auto",
              }}
            >
              <LayoutGrid className="h-5 w-5 text-[#206AB5]" />
            </div>

            <div
              className="absolute inset-0 flex items-center gap-1 px-3 transition-opacity duration-200"
              style={{
                opacity: isExpanded ? 1 : 0,
                pointerEvents: isExpanded ? "auto" : "none",
              }}
            >
              {/* Action buttons */}
              {quickActions.map((action, index) => (
                <div key={action.label} className="flex items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={action.disabled}
                        className={`h-9 w-9 ${
                          action.disabled
                            ? "text-gray-300 opacity-50 cursor-not-allowed"
                            : "text-gray-500 hover:text-[#206AB5] hover:bg-[#206AB5]/5"
                        }`}
                        onClick={() => !action.disabled && navigate(action.path)}
                      >
                        <action.icon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-gray-900 text-white text-xs"
                    >
                      {action.label}
                      {action.disabled && " (Coming Soon)"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
