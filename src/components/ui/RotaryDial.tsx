import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotaryDialProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    size?: number;
    disabled?: boolean;
    children?: React.ReactNode;
}

export const RotaryDial: React.FC<RotaryDialProps> = ({
    value,
    onChange,
    min = 1,
    max = 10,
    size = 320,
    disabled = false,
    children
}) => {
    const dialRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Cyber Arc Settings - Adjusted for perfect 1-10 balance
    const START_ANGLE = -135; // Degrees (approx 7:30 o'clock)
    const END_ANGLE = 135;   // Degrees (approx 4:30 o'clock)
    const RANGE = END_ANGLE - START_ANGLE;

    const handleValueChange = useCallback((nextVal: number) => {
        const capped = Math.min(max, Math.max(min, Math.round(nextVal)));
        if (capped !== value) {
            onChange(capped);
            if (window.navigator.vibrate) {
                window.navigator.vibrate(5);
            }
        }
    }, [max, min, value, onChange]);

    // Calculate value based on angular position (Rotary Interaction)
    const handleDrag = useCallback((clientX: number, clientY: number) => {
        if (!isDragging || disabled || !dialRef.current) return;

        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate angle from center to mouse
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        // atan2 returns angle in radians (0 is right, PI/2 is bottom)
        const rad = Math.atan2(deltaY, deltaX);
        let deg = rad * (180 / Math.PI);

        // Adjust so 0 is Top (12 o'clock), matching the visual rendering logic
        // Original: 0 is Right (3 o'clock)
        // We add 90 to make 0 Top
        deg += 90;

        // Normalize to [-180, 180]
        if (deg > 180) deg -= 360;

        // Clamp to valid range [-135, 135]
        // If user is in the "dead zone" (135 to 180 or -180 to -135), snap to nearest
        if (deg > END_ANGLE) deg = END_ANGLE;
        if (deg < START_ANGLE) deg = START_ANGLE;

        // Map degrees to value
        const progress = (deg - START_ANGLE) / (END_ANGLE - START_ANGLE);
        const nextVal = min + progress * (max - min);

        handleValueChange(nextVal);
    }, [isDragging, disabled, min, max, handleValueChange, END_ANGLE, START_ANGLE]);

    // Handle Wheel
    useEffect(() => {
        const el = dialRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            if (disabled) return;
            e.preventDefault();
            const direction = e.deltaY > 0 ? -1 : 1;
            handleValueChange(value + direction);
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [disabled, value, handleValueChange]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleDrag(e.clientX, e.clientY);
        const onTouchMove = (e: TouchEvent) => handleDrag(e.touches[0].clientX, e.touches[0].clientY);
        const onEnd = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('mouseup', onEnd);
            window.addEventListener('touchend', onEnd);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchend', onEnd);
        };
    }, [isDragging, handleDrag]);

    const getAngleForValue = (val: number) => {
        const progress = (val - min) / (max - min);
        return START_ANGLE + progress * RANGE;
    };

    const markers = Array.from({ length: max }, (_, i) => i + 1);

    // SVG Arc Path Calculation
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
        const start = polarToCartesian(x, y, radius, startAngle);
        const end = polarToCartesian(x, y, radius, endAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
        ].join(" ");
    };

    const getArcColor = (val: number) => {
        if (val <= 3) return '#00f2ff'; // Cyan
        if (val <= 6) return '#8b5cf6'; // Purple
        if (val <= 8) return '#f97316'; // Orange
        return '#ef4444'; // Red (Max)
    };

    const arcRadius = size / 2 - 45;
    const currentAngle = getAngleForValue(value);
    const activeColor = getArcColor(value);
    const fullArcPath = describeArc(size / 2, size / 2, arcRadius, START_ANGLE, END_ANGLE);

    return (
        <div
            ref={dialRef}
            style={{
                position: 'relative',
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                touchAction: 'none'
            }}
        >
            {/* Background Decorative Rings */}
            <div style={{
                position: 'absolute',
                inset: '10px',
                borderRadius: '50%',
                border: `1px solid ${value >= 7 ? activeColor : 'rgba(255, 255, 255, 0.03)'}`,
                opacity: value >= 7 ? 0.2 : 1,
                pointerEvents: 'none',
                transition: 'all 0.3s ease'
            }} />

            {/* SVG Arc Progress */}
            <svg
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    filter: `drop-shadow(0 0 ${value >= 7 ? '15px' : '5px'} ${activeColor}66)`
                }}
            >
                <defs>
                    <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00f2ff" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                {/* Background Arc Track */}
                <path
                    d={fullArcPath}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="4"
                    strokeLinecap="round"
                />

                {/* Progress Arc - Uses pathLength for smooth animation */}
                <motion.path
                    d={fullArcPath}
                    fill="none"
                    stroke="url(#arcGradient)"
                    strokeWidth={value === 10 ? 8 : 4}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{
                        pathLength: (value - min) / (max - min),
                        strokeWidth: value === 10 ? 8 : 4
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{
                        filter: `drop-shadow(0 0 ${value >= 7 ? '15px' : '8px'} ${activeColor})`,
                    }}
                />
            </svg>

            {/* Numeric Tick Marks & Markers */}
            {markers.map((num) => {
                const angle = getAngleForValue(num);
                const pos = polarToCartesian(size / 2, size / 2, size / 2 - 32, angle);
                const dotPos = polarToCartesian(size / 2, size / 2, arcRadius, angle);
                const isActive = num === value;

                return (
                    <React.Fragment key={num}>
                        {/* Static Tick Dot */}
                        <div
                            style={{
                                position: 'absolute',
                                left: dotPos.x,
                                top: dotPos.y,
                                width: '3px',
                                height: '3px',
                                background: isActive ? activeColor : 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'none',
                                zIndex: 5,
                                transition: 'background 0.3s'
                            }}
                        />

                        {/* Clickable Number Container */}
                        <motion.div
                            onClick={() => !disabled && onChange(num)}
                            initial={{ x: '-50%', y: '-50%', scale: 1 }}
                            animate={{
                                x: '-50%',
                                y: '-50%',
                                scale: isActive ? 1.4 : 1,
                                opacity: isActive ? 1 : 0.5,
                                color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                                backgroundColor: 'transparent',
                            }}
                            whileHover={{ opacity: 1, scale: 1.15 }}
                            style={{
                                position: 'absolute',
                                left: pos.x,
                                top: pos.y,
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                                zIndex: 100,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '12px',
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: '15px',
                                fontWeight: 900,
                                textShadow: isActive ? `0 0 15px ${activeColor}` : 'none',
                                transition: 'background 0.3s, color 0.3s'
                            }}
                        >
                            {num}
                        </motion.div>
                    </React.Fragment>
                );
            })}

            {/* Draggable Active Handle */}
            <motion.div
                onMouseDown={() => {
                    if (disabled) return;
                    setIsDragging(true);
                }}
                onTouchStart={() => {
                    if (disabled) return;
                    setIsDragging(true);
                }}
                animate={{
                    rotate: currentAngle,
                    scale: isDragging ? 1.1 : 1
                }}
                transition={isDragging ? { type: "tween", duration: 0 } : { type: 'spring', damping: 20, stiffness: 200 }}
                style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    pointerEvents: 'none',
                    zIndex: 150
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isDragging ? activeColor : 'rgba(0, 10, 20, 0.9)',
                    border: `2px solid ${activeColor}`,
                    boxShadow: `0 0 ${isDragging ? '20px' : '10px'} ${activeColor}`,
                    cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: isDragging ? '#000' : '#fff'
                    }} />
                </div>
            </motion.div>

            {/* Static Content (Tap Button) */}
            <div
                style={{
                    width: size - 160,
                    height: size - 160,
                    borderRadius: '50%',
                    position: 'relative',
                    zIndex: 70,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
            >
                {children}
            </div>

            {/* MAX Effect Underlay */}
            <AnimatePresence>
                {value === 10 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.1, 1],
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            width: size,
                            height: size,
                            background: `radial-gradient(circle, ${activeColor}33 0%, transparent 70%)`,
                            pointerEvents: 'none',
                            zIndex: -1
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
