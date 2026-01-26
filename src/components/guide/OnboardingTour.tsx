import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Scan, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';

interface Step {
    targetId: string;
    titleKey: string;
    descKey: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const ONBOARDING_STEPS: Step[] = [
    { targetId: 'none', titleKey: 'results.tour.welcome_title', descKey: 'results.tour.welcome_desc', position: 'center' },
    { targetId: 'tour-settings-btn', titleKey: 'results.tour.step1_title', descKey: 'results.tour.step1_desc', position: 'bottom' },
    { targetId: 'tour-main-input', titleKey: 'results.tour.step2_title', descKey: 'results.tour.step2_desc', position: 'bottom' },
    { targetId: 'tour-sliders', titleKey: 'results.tour.step3_title', descKey: 'results.tour.step3_desc', position: 'bottom' },
    { targetId: 'tour-sample-visuals-btn', titleKey: 'results.tour.step_sample_title', descKey: 'results.tour.step_sample_desc', position: 'bottom' },
    { targetId: 'tour-overdrive-btn', titleKey: 'results.tour.step4_title', descKey: 'results.tour.step4_desc', position: 'bottom' },
    { targetId: 'tour-generate-btn', titleKey: 'results.tour.step5_title', descKey: 'results.tour.step5_desc', position: 'bottom' },
    { targetId: 'tour-history-btn', titleKey: 'results.tour.step6_title', descKey: 'results.tour.step6_desc', position: 'bottom' },
];

const REMIX_STEPS: Step[] = [
    { targetId: 'none', titleKey: 'results.tour.first_gen_title', descKey: 'results.tour.first_gen_desc', position: 'center' },
    { targetId: 'tour-remix-btn', titleKey: 'results.tour.remix_title', descKey: 'results.tour.remix_desc', position: 'bottom' },
];

interface OnboardingTourProps {
    onFinish?: () => void;
    tourType?: 'onboarding' | 'remix';
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onFinish }) => {
    const { t } = useLanguage();
    const { isTourOpen, setIsTourOpen, setHasSeenOnboarding, tourType } = useSettings();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const steps = tourType === 'remix' ? REMIX_STEPS : ONBOARDING_STEPS;

    // Reset when tour opens
    useEffect(() => {
        if (isTourOpen) {
            setCurrentStepIndex(0);
        }
    }, [isTourOpen]);

    // Track target position with requestAnimationFrame for smooth tracking during animations
    useEffect(() => {
        if (!isTourOpen) return;

        let animationFrameId: number;

        const updateRect = () => {
            const step = steps[currentStepIndex];
            if (step.targetId === 'none') {
                setTargetRect(null);
            } else {
                const element = document.getElementById(step.targetId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Only update needs update to prevent excessive renders if values haven't changed
                    setTargetRect(prev => {
                        if (!prev) return rect;
                        if (prev.top !== rect.top || prev.left !== rect.left || prev.width !== rect.width || prev.height !== rect.height) {
                            return rect;
                        }
                        return prev;
                    });
                } else {
                    // If target not found yet (e.g. modal opening), keep searching but don't clear unless intentional
                    // setTargetRect(null); 
                }
            }
            animationFrameId = requestAnimationFrame(updateRect);
        };

        // Start tracking
        updateRect();

        // Scroll into view when step changes
        const step = steps[currentStepIndex];
        if (step.targetId !== 'none') {
            const element = document.getElementById(step.targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isTourOpen, currentStepIndex]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsTourOpen(false);
        setHasSeenOnboarding(true);
        if (onFinish) onFinish();
    };

    if (!isTourOpen) return null;

    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;

    // tooltip position logic
    const getTooltipStyle = () => {
        const viewportWidth = window.innerWidth;
        const defaultWidth = Math.min(viewportWidth - 40, 320);

        if (!targetRect) {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '90vw',
                width: `${defaultWidth}px` // Use px to match other states for smoother transition
            };
        }

        const gap = 20;
        let top = 0;
        let left = 0;

        // Use the same width logic for consistency
        const width = defaultWidth;

        // Basic positioning
        if (currentStep.position === 'bottom') {
            top = targetRect.bottom + gap;
            left = targetRect.left + (targetRect.width / 2) - (width / 2);
        } else if (currentStep.position === 'top') {
            top = targetRect.top - gap - 200; // estimated height
            left = targetRect.left + (targetRect.width / 2) - (width / 2);
        }

        // Screen edge constraints
        if (left < 20) left = 20;
        if (left + width > viewportWidth - 20) left = viewportWidth - width - 20;

        // Vertical fallback
        if (top < 80) top = targetRect.bottom + gap; // if top flows offscreen, flip to bottom
        if (top > window.innerHeight - 200) top = targetRect.top - gap - 200; // if bottom flows offscreen

        // Ensure within horizontal bounds with padding
        if (left < 10) left = 10;
        if (left + width > viewportWidth - 10) left = viewportWidth - width - 10;

        return {
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            maxWidth: '90vw',
            transform: 'none' // Reset transform explicitly when not centered
        };
    };

    const tooltipStyle = getTooltipStyle();

    return (
        <AnimatePresence>
            {isTourOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        overflow: 'hidden'
                    }}
                >
                    {/* Backdrop with SVG mask/clipPath for spotlight effect */}
                    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                        <defs>
                            <mask id="tour-mask">
                                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                {targetRect && (
                                    <rect
                                        x={targetRect.left - 10}
                                        y={targetRect.top - 10}
                                        width={targetRect.width + 20}
                                        height={targetRect.height + 20}
                                        rx="12"
                                        fill="black"
                                    />
                                )}
                            </mask>
                        </defs>
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            fill="rgba(0,0,0,0.85)"
                            mask="url(#tour-mask)"
                        />
                    </svg>

                    {/* Cyber Frame around target */}
                    <AnimatePresence>
                        {targetRect && (
                            <motion.div
                                layoutId="tour-focus-frame"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    top: targetRect.top - 15,
                                    left: targetRect.left - 15,
                                    width: targetRect.width + 30,
                                    height: targetRect.height + 30
                                }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                style={{
                                    position: 'absolute',
                                    border: '2px solid var(--cyan)',
                                    borderRadius: '16px',
                                    boxShadow: '0 0 30px var(--cyan)',
                                    pointerEvents: 'none',
                                    zIndex: 10
                                }}
                            >
                                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white -translate-x-1 -translate-y-1" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white translate-x-1 -translate-y-1" />
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white -translate-x-1 translate-y-1" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white translate-x-1 translate-y-1" />
                                {/* Scanning effect */}
                                <motion.div
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        background: 'var(--cyan)',
                                        opacity: 0.5,
                                        boxShadow: '0 0 10px var(--cyan)'
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>


                    {/* Tooltip Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, ...tooltipStyle }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'absolute',
                            backgroundColor: 'rgba(13, 13, 18, 0.95)',
                            border: '1px solid var(--cyan)',
                            borderRadius: '16px',
                            padding: '24px',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            pointerEvents: 'auto',
                            ...tooltipStyle // Apply style initially directly to prevent layout thrashing
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Scan size={16} color="var(--cyan)" />
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    color: 'var(--cyan)',
                                    letterSpacing: '0.1em'
                                }}>
                                    SYSTEM_GUIDE // STEP {currentStepIndex + 1}/{steps.length}
                                </span>
                            </div>
                            <button
                                onClick={handleClose}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.3)',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: 900,
                                color: '#fff',
                                marginBottom: '8px',
                                letterSpacing: '0.05em'
                            }}>
                                {(t(currentStep.titleKey as any) as string) || currentStep.titleKey}
                            </h3>
                            <p style={{
                                fontSize: '13px',
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: '1.6'
                            }}>
                                {(t(currentStep.descKey as any) as string) || currentStep.descKey}
                            </p>
                        </div>

                        {/* Progress Dots moved to below text for better spacing */}
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                            {steps.map((_: any, idx: number) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: idx === currentStepIndex ? '20px' : '6px',
                                        height: '3px',
                                        backgroundColor: idx === currentStepIndex ? 'var(--cyan)' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '2px',
                                        transition: 'all 0.3s'
                                    }}
                                />
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '4px', gap: '16px' }}>
                            <button
                                onClick={handleClose}
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: 'rgba(255,255,255,0.4)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {t('results.tour.skip')}
                            </button>
                            <button
                                onClick={handleNext}
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 900,
                                    color: '#000',
                                    background: 'var(--cyan)',
                                    border: 'none',
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 0 15px rgba(0, 242, 255, 0.4)',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {isLastStep ? t('results.tour.finish') : t('results.tour.next')}
                                {!isLastStep && <ChevronRight size={14} />}
                                {isLastStep && <Zap size={14} fill="black" />}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence >
    );
};
