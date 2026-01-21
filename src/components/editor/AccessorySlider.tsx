import React from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

interface AccessorySliderProps {
    value: number;
    onChange: (value: number) => void;
}

export const AccessorySlider: React.FC<AccessorySliderProps> = ({ value, onChange }) => {
    return (
        <div className="sexy-slider-container">
            <div className="sexy-slider-header">
                <label className="sexy-slider-label" style={{ color: '#f59e0b' }}>
                    <Gem size={14} className="icon-orange" style={{ color: '#f59e0b' }} />
                    Decorative Level / 装飾度
                </label>
                <div className="sexy-slider-value-group">
                    <span className="sexy-slider-number">
                        {value === 10 ? 'MAX' : value}
                    </span>
                    <span className="sexy-slider-intensity">Intensity {value * 10}%</span>
                </div>
            </div>

            <div className="sexy-slider-track-area">
                {/* Track background */}
                <div className="sexy-slider-track-bg">
                    <motion.div
                        initial={false}
                        animate={{ width: `${(value - 1) / 9 * 100}%` }}
                        className="accessory-slider-track-fill"
                    />
                </div>

                {/* Input Slider */}
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="sexy-slider-input"
                />

                {/* Custom Thumb */}
                <motion.div
                    initial={false}
                    animate={{ left: `${(value - 1) / 9 * 100}%` }}
                    className="sexy-slider-thumb"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ borderColor: '#f59e0b' }}
                >
                    <div className="sexy-slider-thumb-dot" style={{ backgroundColor: '#f59e0b' }} />
                </motion.div>

                {/* Steps markers */}
                <div className="sexy-slider-steps">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                        <div key={step} className="sexy-slider-step-item">
                            <div className={`sexy-slider-step-dot ${value >= step ? 'active' : ''}`} />
                            <span className={`sexy-slider-step-label ${value === step ? 'active' : ''}`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sexy-slider-footer">
                <div className="sexy-slider-hint">
                    <span className="hint-dot" />
                    <span>L1-3: シンプル・純粋</span>
                </div>
                <div className="sexy-slider-hint">
                    <span className="hint-dot" style={{ backgroundColor: '#fbbf24' }} />
                    <span>L4-7: 華やか・装飾的</span>
                </div>
                <div className="sexy-slider-hint">
                    <span className="hint-dot" style={{ backgroundColor: '#f59e0b' }} />
                    <span>L8-10: 豪華・絢爛な装飾</span>
                </div>
            </div>
        </div>
    );
};
