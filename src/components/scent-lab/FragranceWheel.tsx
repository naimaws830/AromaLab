import { useState, useRef, useCallback } from "react";
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

// Responsive sizing based on device
const getResponsiveSize = () => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    if (width < 768) { // Mobile - ultra-tiny (eighth size)
      return {
        SIZE: 30,
        CENTER: 15,
        OUTER_R: 15,
        INNER_R: 8,
        KNOB_R: 8,
        LABEL_R: (15 + 8) / 2
      };
    } else if (width < 1024) { // Tablet
      return {
        SIZE: 420,
        CENTER: 210,
        OUTER_R: 210,
        INNER_R: 118,
        KNOB_R: 113,
        LABEL_R: (210 + 118) / 2
      };
    }
  }
  // Desktop (default)
  return {
    SIZE: 500,
    CENTER: 250,
    OUTER_R: 250,
    INNER_R: 140,
    KNOB_R: 135,
    LABEL_R: (250 + 140) / 2
  };
};

// Responsive font sizes
const getResponsiveFonts = () => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    if (width < 768) { // Mobile - microscopic fonts for ultra-tiny wheel
      return {
        labelSize: "3px",
        labelSizeSmall: "2px",
        centerTextSize: "4px"
      };
    } else if (width < 1024) { // Tablet
      return {
        labelSize: "14px",
        labelSizeSmall: "10px",
        centerTextSize: "20px"
      };
    }
  }
  // Desktop (default)
  return {
    labelSize: "16px",
    labelSizeSmall: "12px",
    centerTextSize: "24px"
  };
};

const responsive = getResponsiveSize();
const { SIZE, CENTER, OUTER_R, INNER_R, KNOB_R, LABEL_R } = responsive;
const { labelSize, labelSizeSmall, centerTextSize } = getResponsiveFonts();

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
  const svgRef = useRef<SVGSVGElement>(null);
  const knobRef = useRef<SVGGElement>(null);
  const [knobRotation, setKnobRotation] = useState(0);
  const dragging = useRef(false);
  const startAngle = useRef(0);
  const startRot = useRef(0);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const dragThreshold = 10;

  const getAngle = (clientX: number, clientY: number) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  };

  const snap = useCallback(
    (rot: number) => {
      if (disabled) return;
      
      // Snap to the midpoint of the nearest segment so the notch points at the center.
      const segmentAngle = 360 / SEGMENT_COUNT;
      const nearestIndex = Math.round(rot / segmentAngle);
      const snapAngle = nearestIndex * segmentAngle + segmentAngle / 2;
      
      setKnobRotation(snapAngle);
      onRotate(nearestIndex % SEGMENT_COUNT);
    },
    [onRotate, disabled]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    dragging.current = true;
    startAngle.current = getAngle(touch.clientX, touch.clientY);
    startRot.current = knobRotation;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    
    // Prevent default touch behavior
    if (e.pointerType === 'touch') {
      e.preventDefault();
      e.stopPropagation();
    }
    
    dragging.current = true;
    startAngle.current = getAngle(e.clientX, e.clientY);
    startRot.current = knobRotation;
    (e.target as SVGElement).setPointerCapture?.(e.pointerId);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging.current || disabled) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
    
    // Check if drag threshold is met
    if (deltaX < dragThreshold && deltaY < dragThreshold) {
      return;
    }
    
    const angle = getAngle(touch.clientX, touch.clientY);
    let delta = angle - startAngle.current;
    
    // Handle angle wrapping for smooth rotation
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    // Apply rotation relative to starting position
    const newRotation = startRot.current + delta;
    setKnobRotation(newRotation);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || disabled) return;
    
    // Prevent default touch behavior
    if (e.pointerType === 'touch') {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const currentAngle = getAngle(e.clientX, e.clientY);
    let delta = currentAngle - startAngle.current;
    
    // Handle angle wrapping for smooth rotation
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    // Apply rotation relative to starting position
    const newRotation = startRot.current + delta;
    setKnobRotation(newRotation);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging.current) return;
    dragging.current = false;
    snap(knobRotation);
  };

  const handlePointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    snap(knobRotation);
  };

  // Triangle lines
  const trianglePoints = triangleIndices.map((idx) => {
    const angle = idx * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    return polarToXY(CENTER, CENTER, LABEL_R, angle);
  });

  const hasConfirmed = confirmedIndices.length > 0;

  return (
    <AnimatePresence>
      <div className="relative w-full max-w-[500px] mx-auto h-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] aspect-square">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full h-full"
          style={{ touchAction: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
        <defs>
          {/* Glow filter */}
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

        {/* Segments */}
        {scentFamilies.map((fam, i) => {
          const isSelected = selectedIndex === i;
          const isHighlighted = highlightedIndices.includes(i);
          const isConfirmed = confirmedIndices.includes(i);
          const isDimmed = hasConfirmed && !isSelected && !isHighlighted && !isConfirmed;

          let fillColor = fam.colorHex;
          let opacity = isDimmed ? 0.2 : 1;
          let strokeColor = "rgba(255,255,255,0.15)";
          let strokeWidth = 0.5;

          if (isConfirmed || isSelected) {
            strokeColor = fam.colorHex;
            strokeWidth = 2;
          }
          if (isHighlighted && !isConfirmed) {
            // Use segment color like first selection, just brighter
            strokeColor = fam.colorHex;
            strokeWidth = 2.5;
          }

          // Calculate segment center for transform origin
          const segmentCenterAngle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
          const segmentCenter = polarToXY(CENTER, CENTER, (OUTER_R + INNER_R) / 2, segmentCenterAngle);

          return (
            <g
              key={fam.name}
              // Slightly enlarge the currently selected / confirmed segment from its center
              transform={
                isSelected || isConfirmed
                  ? `translate(${segmentCenter.x} ${segmentCenter.y}) scale(1.05) translate(${-segmentCenter.x} ${-segmentCenter.y})`
                  : undefined
              }
            >
              <path
                d={segmentPath(i)}
                fill={fillColor}
                opacity={opacity}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="cursor-pointer transition-opacity duration-300"
                onClick={() => {
                  if (!disabled) {
                    // Snap directly to the segment's midpoint so the pointer aligns to the center.
                    setKnobRotation(i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
                    onRotate(i);
                    if (autoConfirmOnClick) {
                      onConfirm();
                    }
                  }
                }}
                filter={isConfirmed || isSelected || isHighlighted ? "url(#segmentGlow)" : undefined}
              />
            </g>
          );
        })}

        {/* Triangle connecting lines */}
        {trianglePoints.length >= 2 && (
          <g>
            {trianglePoints.length === 3 && (
              <polygon
                points={trianglePoints.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                // Brighter yellow for better contrast
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

          // Rotate text to follow arc
          const textAngle = angle > 180 ? angle - 270 : angle - 90;
          
          // Split two-word names into two lines
          const nameParts = fam.name.split(" ");

          return (
            <g key={fam.name}>
              {nameParts.length === 2 ? (
                // Two words: one per line
                <g>
                  <text
                    x={pos.x}
                    y={pos.y - 12}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-sans-refined select-none pointer-events-none"
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
                    className="font-sans-refined select-none pointer-events-none"
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
                // Single word: normal display
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-sans-refined select-none pointer-events-none"
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
          animate={{ rotate: knobRotation, opacity: dimKnob ? 0.45 : 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px`, transition: "opacity 0.3s ease" }}
        >
          {/* Outer beveled ring */}
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

          {/* Outer ring highlight */}
          <circle cx={CENTER} cy={CENTER} r={KNOB_R} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

          {/* Inner raised ring */}
          <circle cx={CENTER} cy={CENTER} r={KNOB_R - 8} fill="url(#knobInner)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

          {/* Concave dish */}
          <circle cx={CENTER} cy={CENTER} r={KNOB_R - 22} fill="url(#knobDish)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />

          {/* Knurled edge marks */}
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
              />
            );
          })}

          {/* Center circle - tap/click zone */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={KNOB_R - 20}
              fill="transparent"
              onClick={() => {
                if (!disabled && selectedIndex !== null) {
                  onConfirm();
                }
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={disabled ? "cursor-default" : "cursor-pointer"}
              style={{ touchAction: "none" }}
            />

            {/* Rotating ring - drag/rotation zone */}
            <g
              ref={knobRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
              style={{ touchAction: "none" }}
            >
              {/* Invisible hit area for dragging */}
              <circle cx={CENTER} cy={CENTER} r={KNOB_R} fill="transparent" />

              {/* Center text */}
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
                }}
              >
                {disabled ? "Selected" : "Rotate"}
              </text>

              {/* Rotating indicator notch */}
              <g>
                <rect
                  x={CENTER - 2}
                  y={CENTER - KNOB_R + 15}
                  width={10}
                  height={30}
                  rx={3}
                  fill="hsl(48, 90%, 60%)"
                  stroke="hsl(38, 80%, 50%)"
                  strokeWidth="1"
                  // Keep the notch pointing at the currently selected segment (top center) by
                  // counter-rotating it relative to the knob's overall rotation.
                  transform={`rotate(${-knobRotation + 5}deg)`}
                />
                {/* Notch glow */}
                <rect
                  x={CENTER - 2}
                  y={CENTER - KNOB_R + 15}
                  width={10}
                  height={30}
                  rx={3}
                  fill="hsl(48, 90%, 60%)"
                  opacity="0.7"
                  filter="url(#segmentGlow)"
                />
              </g>
            </g>
          </motion.g>
        </svg>

        {/* Select Scent button - centered below wheel */}
        {showConfirmButton && selectedIndex !== null && !disabled && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onConfirm}
            className="relative mx-auto block mt-2 md:mt-3 px-6 py-2.5 bg-accent text-cream font-sans-refined text-xs tracking-[0.15em] uppercase hover:bg-accent/90 transition-all rounded-sm shadow-lg"
          >
            Select Scent
          </motion.button>
        )}
      </div>
    </AnimatePresence>
  );
};

export default FragranceWheel;
