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
    max = 20,
    size = 280,
    disabled = false,
    children
}) => {
    const dialRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Calculate angle based on mouse/touch position relative to center
    const calculateAngle = useCallback((clientX: number, clientY: number) => {
        if (!dialRef.current) return 0;
        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Atan2 returns radians from -PI to PI
        const rad = Math.atan2(clientY - centerY, clientX - centerX);
        // Convert to degrees (0 to 360, starting from top)
        let deg = (rad * 180) / Math.PI + 90;
        if (deg < 0) deg += 360;
        return deg;
    }, []);

    const handleMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging || disabled) return;

        const angle = calculateAngle(clientX, clientY);

        // Map 0-360 degrees to 1-20 value
        // We can make it snap or continuous. Let's do snapping.
        // For 20 values, each slot is 360/20 = 18 degrees.
        const stepDegrees = 360 / max;
        const newValue = Math.round(angle / stepDegrees);

        // Value 0 is same as max (360 degrees)
        const finalValue = newValue === 0 ? max : Math.min(max, Math.max(min, newValue));

        if (finalValue !== value) {
            onChange(finalValue);
            // Optional: trigger haptic feedback if available
            if (window.navigator.vibrate) {
                window.navigator.vibrate(5);
            }
        }
    }, [isDragging, disabled, calculateAngle, max, min, value, onChange]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
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
    }, [isDragging, handleMove]);

    // Positions for valid numbers
    const markers = Array.from({ length: max }, (_, i) => i + 1);

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
            {/* Background Ring */}
            <div style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                border: '1px solid rgba(0, 242, 255, 0.1)',
                background: 'radial-gradient(circle, rgba(0, 242, 255, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            {/* Glowing Track */}
            <svg
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    transform: 'rotate(-90deg)',
                    pointerEvents: 'none'
                }}
            >
                <circle
                    cx="50%"
                    cy="50%"
                    r={size / 2 - 40}
                    fill="none"
                    stroke="rgba(0, 242, 255, 0.05)"
                    strokeWidth="2"
                />
                <motion.circle
                    cx="50%"
                    cy="50%"
                    r={size / 2 - 40}
                    fill="none"
                    stroke="#00f2ff"
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * (size / 2 - 40)}`}
                    animate={{
                        strokeDashoffset: (2 * Math.PI * (size / 2 - 40)) * (1 - value / max)
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 5px #00f2ff)' }}
                />
            </svg>

            {/* Numbers around the dial */}
            {markers.map((num) => {
                const angle = (num * (360 / max)) - 90;
                const rad = (angle * Math.PI) / 180;
                const radius = size / 2 - 20;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                const isActive = num === value;
                const isNear = Math.abs(num - value) <= 1 || (value === 1 && num === max) || (value === max && num === 1);

                return (
                    <motion.div
                        key={num}
                        animate={{
                            scale: isActive ? 1.4 : isNear ? 1.1 : 0.8,
                            opacity: isActive ? 1 : isNear ? 0.6 : 0.2,
                            color: isActive ? '#00f2ff' : '#fff'
                        }}
                        style={{
                            position: 'absolute',
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: 'translate(-50%, -50%)',
                            fontSize: '10px',
                            fontWeight: 900,
                            fontFamily: "'Space Grotesk', sans-serif",
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                            zIndex: 20
                        }}
                        onClick={() => !disabled && onChange(num)}
                    >
                        {num}
                    </motion.div>
                );
            })}

            {/* Central Dial Disc (Draggable or Container for Children) */}
            <motion.div
                onMouseDown={() => !disabled && setIsDragging(true)}
                onTouchStart={() => !disabled && setIsDragging(true)}
                animate={{ rotate: (value * (360 / max)) }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                    width: size - 140,
                    height: size - 140,
                    borderRadius: '50%',
                    background: children ? 'transparent' : 'rgba(0, 10, 20, 0.8)',
                    border: children ? 'none' : '2px solid rgba(0, 242, 255, 0.2)',
                    boxShadow: !children && isDragging ? '0 0 40px rgba(0, 242, 255, 0.2), inset 0 0 20px rgba(0, 242, 255, 0.1)' : 'none',
                    cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 30,
                    backdropFilter: !children ? 'blur(10px)' : 'none'
                }}
            >
                {/* Finger Hole (Cyber Style) */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isDragging ? 'rgba(0, 242, 255, 0.4)' : 'rgba(0, 242, 255, 0.1)',
                    boxShadow: '0 0 15px rgba(0, 242, 255, 0.4)',
                    border: '2px solid rgba(0, 242, 255, 0.6)',
                    zIndex: 40
                }} />

                {/* Display Current Value in center if no children */}
                {!children && (
                    <motion.div
                        animate={{ rotate: -(value * (360 / max)) }} // Counter-rotate text to keep it upright
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <span style={{
                            fontSize: '32px',
                            fontWeight: 900,
                            color: '#fff',
                            textShadow: '0 0 10px rgba(0, 242, 255, 0.5)'
                        }}>
                            {value}
                        </span>
                        <span style={{
                            fontSize: '8px',
                            fontWeight: 900,
                            color: 'rgba(0, 242, 255, 0.6)',
                            letterSpacing: '0.1em'
                        }}>
                            COUNT
                        </span>
                    </motion.div>
                )}

                {/* If children exist (like Generate button), wrap and counter-rotate */}
                {children && (
                    <motion.div
                        animate={{ rotate: -(value * (360 / max)) }}
                        style={{ pointerEvents: 'auto' }}
                    >
                        {children}
                    </motion.div>
                )}
            </motion.div>

            {/* Outer Decorative Ring */}
            <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '1px dashed rgba(255, 255, 255, 0.05)',
                pointerEvents: 'none',
                animation: 'spin 60s linear infinite'
            }} />
        </div>
    );
};
