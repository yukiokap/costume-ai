import React from 'react';

interface NeonToggleProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    color?: 'amber' | 'white';
    layout?: 'left' | 'right' | 'top'; // テキストの位置
}

export const NeonToggle: React.FC<NeonToggleProps> = ({
    label,
    description,
    checked,
    onChange,
    color = 'amber',
    layout = 'left'
}) => {
    // 色設定
    const activeColor = color === 'amber' ? '#fbbf24' : '#ffffff';
    const glowColor = color === 'amber' ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.6)';

    const isTextRight = layout === 'right';
    const isTextTop = layout === 'top';

    return (
        <div
            onClick={() => onChange(!checked)}
            style={{
                display: 'flex',
                flexDirection: isTextTop ? 'column' : (isTextRight ? 'row-reverse' : 'row'),
                alignItems: 'center',
                gap: isTextTop ? '8px' : '16px',
                cursor: 'pointer',
                userSelect: 'none'
            }}
        >
            {/* テキストエリア */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isTextTop ? 'center' : (isTextRight ? 'flex-start' : 'flex-end'),
                textAlign: isTextTop ? 'center' : (isTextRight ? 'left' : 'right')
            }}>
                {/* ラベル */}
                <span style={{
                    fontSize: '11px', // 少し大きく
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: checked ? activeColor : 'rgba(255,255,255,0.3)',
                    textShadow: checked ? `0 0 8px ${glowColor}` : 'none',
                    transition: 'all 0.3s ease'
                }}>
                    {label}
                </span>

                {/* 説明文 */}
                {description && (
                    <span style={{
                        fontSize: '9px',
                        marginTop: '4px', // マージン増やす
                        color: 'rgba(255,255,255,0.5)', // 少し明るく
                        fontWeight: 400,
                        whiteSpace: 'nowrap' // 折返し防止
                    }}>
                        {description}
                    </span>
                )}
            </div>

            {/* スイッチ本体 (Track) */}
            <div style={{
                position: 'relative',
                width: '48px',
                height: '24px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.2)',
                backgroundColor: checked ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
                flexShrink: 0 // 縮小防止
            }}>

                {/* ノブ (Thumb) */}
                <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: checked ? activeColor : 'rgba(255,255,255,0.8)',
                    boxShadow: checked ? `0 0 10px ${activeColor}` : 'none',
                    transform: checked ? 'translateX(24px)' : 'translateX(0)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }} />
            </div>
        </div>
    );
};
