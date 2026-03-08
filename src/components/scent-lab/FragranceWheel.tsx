import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scentFamilies, SEGMENT_COUNT, SEGMENT_ANGLE } from "@/data/fragranceData";

interface FragranceWheelProps {
  selectedIndex: number | null;
  highlightedIndices: number[];
  confirmedIndices: number[];
  triangleIndices: number[];
  onRotate: (index: number) => void;
  onConfirm: () => void;
  disabled?: boolean;
  showConfirmButton?: boolean;
  autoConfirmOnClick?: boolean;
  dimKnob?: boolean;
}

// Responsive sizing based on viewport width
const getResponsiveSize = () => {
  if (typeof window !== 'undefined') {
    const containerSize = Math.min(window.innerWidth * 0.9, 500);
    
    // Calculate sizes relative to container
    const scale = containerSize / 500;
    
    return {
      SIZE: containerSize,
      CENTER: containerSize / 2,
      OUTER_R: containerSize / 2,
      INNER_R: (containerSize / 2) * 0.56,
      KNOB_R: (containerSize / 2) * 0.54,
      LABEL_R: ((containerSize / 2) + ((containerSize / 2) * 0.56)) / 2,
      scale: scale
    };
  }
  // Desktop fallback
  return {
    SIZE: 500,
    CENTER: 250,
    OUTER_R: 250,
    INNER_R: 140,
    KNOB_R: 135,
    LABEL_R: (250 + 140) / 2,
    scale: 1
  };
};

// Responsive font sizes using clamp()
const getResponsiveFonts = (scale: number) => {
  return {
    labelSize: `clamp(${10 * scale}px, ${1.5 * scale}vw, ${16 * scale}px)`,
    labelSizeSmall: `clamp(${8 * scale}px, ${1.2 * scale}vw, ${12 * scale}px)`,
    centerTextSize: `clamp(${12 * scale}px, ${2 * scale}vw, ${24 * scale}px)`,
    notchWidth: `${10 * scale}px`,
    notchHeight: `${30 * scale}px`,
    notchRadius: `${3 * scale}px`
  };
};

const responsive = getResponsiveSize();
const { SIZE, CENTER, OUTER_R, INNER_R, KNOB_R, LABEL_R, scale } = responsive;
const { labelSize, labelSizeSmall, centerTextSize } = getResponsiveFonts(scale);

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segmentPath(idx: number): string {
  const startAngle = idx * SEGMENT_ANGLE;
  const endAngle = startAngle + SEGMENT_ANGLE;
  const s1 = polarToXY(CENTER, CENTER, OUTER_R, startAngle);
  const e1 = polarToXY(CENTER, CENTER, OUTER_R, endAngle);
  const s2 = polarToXY(CENTER, CENTER, INNER_R, endAngle);
  const e2 = polarToXY(CENTER, CENTER, INNER_R, startAngle);
  return `M${s1.x},${s1.y} A${OUTER_R},${OUTER_R} 0 0,1 ${e1.x},${e1.y} L${s2.x},${s2.y} A${INNER_R},${INNER_R} 0 0,0 ${e2.x},${e2.y} Z`;
}

// Helper to detect if device is likely mobile/touch
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};

const FragranceWheel = ({
  selectedIndex,
  highlightedIndices,
  confirmedIndices,
  triangleIndices,
  onRotate,
  onConfirm,
  disabled = false,
  showConfirmButton = false,
  autoConfirmOnClick = false,
  dimKnob = false,
}: FragranceWheelProps) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const knobRef = useRef<SVGGElement>(null);
  const [knobRotation, setKnobRotation] = useState(0);
  const [activeSegment, setActiveSegment] = useState<number | null>(selectedIndex);
  const dragging = useRef(false);
  const startAngle = useRef(0);
  const startRot = useRef(0);
  const rafId = useRef<number>();
  const [isTouch, setIsTouch] = useState(false);
  
  // For smoother animation on mobile
  const [displayRotation, setDisplayRotation] = useState(0);
  const animationFrameId = useRef<number>();

  // Detect touch device on mount
  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  // Smooth rotation update using requestAnimationFrame
  useEffect(() => {
    let lastTime = 0;
    const updateRotation = (currentTime: number) => {
      if (currentTime - lastTime >= 16) {
        setDisplayRotation(knobRotation);
        lastTime = currentTime;
      }
      animationFrameId.current = requestAnimationFrame(updateRotation);
    };
    
    animationFrameId.current = requestAnimationFrame(updateRotation);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [knobRotation]);

  // Keep internal active segment in sync with external selectedIndex prop
  useEffect(() => {
    if (selectedIndex !== null && !dragging.current) {
      setActiveSegment(selectedIndex);
      const segmentAngle = 360 / SEGMENT_COUNT;
      const snapAngle = selectedIndex * segmentAngle + segmentAngle / 2;
      setKnobRotation(snapAngle);
    }
  }, [selectedIndex]);

  // FIXED: Simple angle calculation with proper orientation
  const getAngle = (clientX: number, clientY: number) => {
    const ref = wheelRef.current ?? svgRef.current;
    if (!ref) return 0;

    const rect = ref.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    // Calculate angle where 0° is at top (north) and increases clockwise
    const dx = clientX - cx;
    const dy = clientY - cy;
    
    // atan2 gives angle from positive x-axis, counter-clockwise
    // We want from positive y-axis, clockwise
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    
    // Normalize to 0-360
    angle = (angle + 360) % 360;
    
    return angle;
  };

  const getSegmentIndexFromPointer = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    angle = (angle + 360) % 360;

    const segmentAngle = 360 / SEGMENT_COUNT;
    const rawIndex = Math.floor((angle + segmentAngle / 2) / segmentAngle);
    return ((rawIndex % SEGMENT_COUNT) + SEGMENT_COUNT) % SEGMENT_COUNT;
  };

  const snap = useCallback(
    (rot: number) => {
      if (disabled) return;

      const segmentAngle = 360 / SEGMENT_COUNT;
      const rawIndex = Math.round(rot / segmentAngle);
      const snappedIndex = ((rawIndex % SEGMENT_COUNT) + SEGMENT_COUNT) % SEGMENT_COUNT;
      const snapAngle = snappedIndex * segmentAngle + segmentAngle / 2;

      setKnobRotation(snapAngle);
      setActiveSegment(snappedIndex);
      onRotate(snappedIndex);
    },
    [onRotate, disabled]
  );

  const handleSegmentClick = (clientX: number, clientY: number) => {
    if (disabled || dragging.current) return;

    const index = getSegmentIndexFromPointer(clientX, clientY);
    const segmentAngle = 360 / SEGMENT_COUNT;
    const snapAngle = index * segmentAngle + segmentAngle / 2;

    setKnobRotation(snapAngle);
    setActiveSegment(index);
    onRotate(index);

    if (autoConfirmOnClick) {
      onConfirm();
    }
  };

  // Create a larger invisible hit area for each segment
  const createHitAreaPath = (idx: number): string => {
    const startAngle = idx * SEGMENT_ANGLE;
    const endAngle = startAngle + SEGMENT_ANGLE;
    
    const hitOuterR = OUTER_R + (isTouch ? 20 : 10);
    const hitInnerR = Math.max(INNER_R - (isTouch ? 20 : 10), 0);
    
    const s1 = polarToXY(CENTER, CENTER, hitOuterR, startAngle);
    const e1 = polarToXY(CENTER, CENTER, hitOuterR, endAngle);
    const s2 = polarToXY(CENTER, CENTER, hitInnerR, endAngle);
    const e2 = polarToXY(CENTER, CENTER, hitInnerR, startAngle);
    
    return `M${s1.x},${s1.y} A${hitOuterR},${hitOuterR} 0 0,1 ${e1.x},${e1.y} L${s2.x},${s2.y} A${hitInnerR},${hitInnerR} 0 0,0 ${e2.x},${e2.y} Z`;
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    if (disabled) return;
    
    dragging.current = true;
    startAngle.current = getAngle(clientX, clientY);
    startRot.current = knobRotation;
  };

  // FIXED: Simple and reliable drag move
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragging.current || disabled) return;
    
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const currentAngle = getAngle(clientX, clientY);
      
      // Calculate the difference from start angle
      let delta = currentAngle - startAngle.current;
      
      // Handle the shortest path around the circle
      if (delta > 180) {
        delta = delta - 360;
      } else if (delta < -180) {
        delta = delta + 360;
      }
      
      // Apply the delta to the starting rotation
      const newRotation = (startRot.current + delta + 360) % 360;
      
      setKnobRotation(newRotation);
    });
  };

  const handleDragEnd = () => {
    if (dragging.current) {
      dragging.current = false;
      snap(knobRotation);
    }
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
  };

  // Triangle lines
  const trianglePoints = triangleIndices.map((idx) => {
    const angle = idx * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    return polarToXY(CENTER, CENTER, LABEL_R, angle);
  });

  const hasConfirmed = confirmedIndices.length > 0;

  return (
    <AnimatePresence>
      <div 
        ref={wheelRef}
        className="relative w-full mx-auto h-full min-h-[200px] aspect-square"
        style={{ 
          width: 'min(90vw, 500px)',
          maxWidth: '500px',
          margin: '0 auto',
          touchAction: 'none',
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full h-full"
          style={{ 
            touchAction: 'none',
            display: 'block',
            WebkitTransform: 'translate3d(0,0,0)',
            transform: 'translate3d(0,0,0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <defs>
            <filter id="segmentGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="knobShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Segments - visible paths */}
          {scentFamilies.map((fam, i) => {
            const isSelected = activeSegment === i;
            const isHighlighted = highlightedIndices.includes(i);
            const isConfirmed = confirmedIndices.includes(i);
            const isDimmed = hasConfirmed && !isSelected && !isHighlighted && !isConfirmed;

            const fillColor = fam.colorHex;
            const opacity = isDimmed ? 0.2 : 1;
            let strokeColor = "rgba(255,255,255,0.15)";
            let strokeWidth = 0.5;

            if (isConfirmed || isSelected) {
              strokeColor = fam.colorHex;
              strokeWidth = 2;
            }
            if (isHighlighted && !isConfirmed) {
              strokeColor = fam.colorHex;
              strokeWidth = 2.5;
            }

            const segmentCenterAngle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
            const segmentCenter = polarToXY(CENTER, CENTER, (OUTER_R + INNER_R) / 2, segmentCenterAngle);

            return (
              <g
                key={fam.name}
                className={`transition-transform duration-200 ${isSelected ? "scale-110" : "scale-100"}`}
                style={{ transformOrigin: `${segmentCenter.x}px ${segmentCenter.y}px` }}
              >
                <path
                  d={segmentPath(i)}
                  fill={fillColor}
                  opacity={opacity}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  pointerEvents="none"
                  filter={isConfirmed || isSelected || isHighlighted ? "url(#segmentGlow)" : undefined}
                />
                
                <path
                  d={createHitAreaPath(i)}
                  fill="transparent"
                  stroke="transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSegmentClick(e.clientX, e.clientY);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const touch = e.changedTouches[0];
                    handleSegmentClick(touch.clientX, touch.clientY);
                  }}
                  style={{ 
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                  className="segment-hit-area"
                />
              </g>
            );
          })}

          {/* Triangle connecting lines */}
          {trianglePoints.length >= 2 && (
            <g pointerEvents="none">
              {trianglePoints.length === 3 && (
                <polygon
                  points={trianglePoints.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="hsl(48, 100%, 70%)"
                  strokeWidth="3"
                />
              )}
              {trianglePoints.length === 2 && (
                <line
                  x1={trianglePoints[0].x} y1={trianglePoints[0].y}
                  x2={trianglePoints[1].x} y2={trianglePoints[1].y}
                  stroke="hsl(48, 100%, 70%)"
                  strokeWidth="3"
                />
              )}
              {trianglePoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" opacity="0.7" />
              ))}
            </g>
          )}

          {/* Segment labels */}
          {scentFamilies.map((fam, i) => {
            const angle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
            const pos = polarToXY(CENTER, CENTER, LABEL_R, angle);
            const isSelected = selectedIndex === i;
            const isHighlighted = highlightedIndices.includes(i);
            const isConfirmed = confirmedIndices.includes(i);
            const isDimmed = hasConfirmed && !isSelected && !isHighlighted && !isConfirmed;

            const nameParts = fam.name.split(" ");

            return (
              <g key={fam.name} pointerEvents="none">
                {nameParts.length === 2 ? (
                  <g>
                    <text
                      x={pos.x}
                      y={pos.y - 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-sans-refined select-none"
                      style={{
                        fontSize: isSelected || isConfirmed ? labelSize : labelSizeSmall,
                        fontWeight: isSelected || isConfirmed ? 700 : 500,
                        fill: isDimmed
                          ? "rgba(255,255,255,0.3)"
                          : isHighlighted
                          ? "#ffffff"
                          : "rgba(255,255,255,0.95)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {nameParts[0]}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-sans-refined select-none"
                      style={{
                        fontSize: isSelected || isConfirmed ? labelSize : labelSizeSmall,
                        fontWeight: isSelected || isConfirmed ? 700 : 500,
                        fill: isDimmed
                          ? "rgba(255,255,255,0.3)"
                          : isHighlighted
                          ? "#ffffff"
                          : "rgba(255,255,255,0.95)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {nameParts[1]}
                    </text>
                  </g>
                ) : (
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-sans-refined select-none"
                    style={{
                      fontSize: isSelected || isConfirmed ? labelSize : labelSizeSmall,
                      fontWeight: isSelected || isConfirmed ? 700 : 500,
                      fill: isDimmed
                        ? "rgba(255,255,255,0.3)"
                        : isHighlighted
                        ? "#ffffff"
                        : "rgba(255,255,255,0.95)",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {fam.name}
                  </text>
                )}
              </g>
            );
          })}

          <motion.g
            filter="url(#knobShadow)"
            animate={{ rotate: displayRotation, opacity: dimKnob ? 0.45 : 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 20,
              mass: isTouch ? 0.8 : 1
            }}
            style={{ 
              transformOrigin: `${CENTER}px ${CENTER}px`,
              willChange: 'transform',
              transform: 'translate3d(0,0,0)',
              WebkitTransform: 'translate3d(0,0,0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <circle cx={CENTER} cy={CENTER} r={KNOB_R} fill="url(#knobOuter)" />
            <defs>
              <radialGradient id="knobOuter" cx="40%" cy="35%">
                <stop offset="0%" stopColor="hsl(0, 0%, 85%)" />
                <stop offset="60%" stopColor="hsl(0, 0%, 72%)" />
                <stop offset="100%" stopColor="hsl(0, 0%, 60%)" />
              </radialGradient>
              <radialGradient id="knobInner" cx="45%" cy="40%">
                <stop offset="0%" stopColor="hsl(0, 0%, 92%)" />
                <stop offset="50%" stopColor="hsl(0, 0%, 82%)" />
                <stop offset="100%" stopColor="hsl(0, 0%, 70%)" />
              </radialGradient>
              <radialGradient id="knobDish" cx="50%" cy="45%">
                <stop offset="0%" stopColor="hsl(0, 0%, 78%)" />
                <stop offset="100%" stopColor="hsl(0, 0%, 65%)" />
              </radialGradient>
            </defs>

            <circle cx={CENTER} cy={CENTER} r={KNOB_R} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <circle cx={CENTER} cy={CENTER} r={KNOB_R - 8} fill="url(#knobInner)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <circle cx={CENTER} cy={CENTER} r={KNOB_R - 22} fill="url(#knobDish)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />

            {Array.from({ length: 36 }).map((_, i) => {
              const a = (i * 10 - 90) * (Math.PI / 180);
              const r1 = KNOB_R - 3;
              const r2 = KNOB_R - 8;
              return (
                <line
                  key={i}
                  x1={CENTER + r1 * Math.cos(a)}
                  y1={CENTER + r1 * Math.sin(a)}
                  x2={CENTER + r2 * Math.cos(a)}
                  y2={CENTER + r2 * Math.sin(a)}
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="0.5"
                  pointerEvents="none"
                />
              );
            })}

            <circle
              cx={CENTER}
              cy={CENTER}
              r={Math.max(KNOB_R - 20, 22)}
              fill="transparent"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled && activeSegment !== null) {
                  onConfirm();
                }
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!disabled && activeSegment !== null) {
                  onConfirm();
                }
              }}
              className={disabled ? "cursor-default" : "cursor-pointer"}
              style={{ 
                WebkitTapHighlightColor: 'transparent'
              }}
            />

            {/* Rotating ring - drag/rotation zone */}
            <g
              ref={knobRef}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragStart(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragMove(e.clientX, e.clientY);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragEnd();
              }}
              onPointerCancel={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragEnd();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const touch = e.touches[0];
                handleDragStart(touch.clientX, touch.clientY);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const touch = e.touches[0];
                handleDragMove(touch.clientX, touch.clientY);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragEnd();
              }}
              onTouchCancel={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragEnd();
              }}
              className={disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
              style={{ 
                touchAction: 'none',
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform',
                transform: 'translate3d(0,0,0)',
                WebkitTransform: 'translate3d(0,0,0)'
              }}
            >
              <circle 
                cx={CENTER} 
                cy={CENTER} 
                r={KNOB_R + (isTouch ? 15 : 5)}
                fill="transparent" 
              />

              <text
                x={CENTER}
                y={CENTER + 15}
                textAnchor="middle"
                style={{
                  fontSize: centerTextSize,
                  fill: "rgba(0,0,0,0.25)",
                  letterSpacing: "0.2em",
                  fontFamily: "'Raleway', sans-serif",
                  textTransform: "uppercase",
                  userSelect: "none",
                  pointerEvents: 'none'
                }}
              >
                {disabled ? "Selected" : "Rotate"}
              </text>

              <g pointerEvents="none">
                <rect
                  x={CENTER - (5 * scale)}
                  y={CENTER - KNOB_R + (15 * scale)}
                  width={10 * scale}
                  height={30 * scale}
                  rx={3 * scale}
                  fill="hsl(48, 90%, 60%)"
                  stroke="hsl(38, 80%, 50%)"
                  strokeWidth={1 * scale}
                />
                <rect
                  x={CENTER - (5 * scale)}
                  y={CENTER - KNOB_R + (15 * scale)}
                  width={10 * scale}
                  height={30 * scale}
                  rx={3 * scale}
                  fill="hsl(48, 90%, 60%)"
                  opacity="0.7"
                  filter="url(#segmentGlow)"
                />
              </g>
            </g>
          </motion.g>
        </svg>

        {showConfirmButton && selectedIndex !== null && !disabled && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onConfirm}
            onTouchEnd={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="relative mx-auto block mt-2 md:mt-3 px-6 py-2.5 bg-accent text-cream font-sans-refined text-xs tracking-[0.15em] uppercase hover:bg-accent/90 transition-all rounded-sm shadow-lg"
            style={{
              minHeight: '44px',
              minWidth: '44px',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            Select Scent
          </motion.button>
        )}
      </div>
    </AnimatePresence>
  );
};

export default FragranceWheel;