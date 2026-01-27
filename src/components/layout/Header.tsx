import { Settings as SettingsIcon, Terminal, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';

interface HeaderProps {
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
    showSettings,
    setShowSettings
}) => {
    const { t } = useLanguage();
    const { startTour } = useSettings();

    return (
        <header className="flex justify-between items-center mb-16 relative z-[60]">
            <div className="group cursor-default">
                <div className="title-sub" style={{ marginBottom: '0px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Terminal size={10} className="text-cyan-400" />
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '0.15em' }}>AI COSTUME SYNTHESIS</span>
                </div>
                <h1 className="title-main" style={{ fontSize: '3.8rem', lineHeight: '1.2', paddingBottom: '10px', letterSpacing: '-0.03em', display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                    <span style={{ fontWeight: 800, color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>costume</span>
                    <span style={{
                        fontWeight: 900,
                        color: '#22d3ee',
                        filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))',
                        fontStyle: 'italic',
                        background: 'linear-gradient(to bottom, #22d3ee, #06b6d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        paddingRight: '10px'
                    }}>AI</span>
                </h1>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 900, letterSpacing: '0.4em', marginLeft: '4px', marginTop: '-10px', textTransform: 'uppercase' }}>
                    こすちゃい
                </div>
            </div>

            <div className="flex gap-16 sm:gap-24 items-center">
                {/* Usage Guide Quick Link */}


                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '2px',
                    opacity: 0.6,
                    textAlign: 'right'
                }} className="hidden lg:flex">
                    <span style={{ fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.1em' }}>AI COSTUME DESIGN ATELIER</span>
                    <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', fontWeight: 800, letterSpacing: '0.05em' }}>CHARACTER SYNTHESIS SYSTEM v0.8.2</span>
                </div>

                <button
                    onClick={() => startTour()}
                    className="relative px-6 py-3 transition-all duration-300 group overflow-hidden"
                    style={{
                        background: 'rgba(234, 179, 8, 0.1)',
                        border: '1px solid rgba(234, 179, 8, 0.3)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <div className="flex items-center gap-3 relative z-10">
                        <Zap size={16} style={{ color: '#eab308' }} fill="#eab308" />
                        <span style={{ color: '#fff' }} className="text-[11px] font-black uppercase tracking-[0.3em] group-hover:text-yellow-300 transition-colors">
                            {t('results.start_tour')}
                        </span>
                    </div>
                </button>

                <button
                    id="tour-settings-btn"
                    onClick={() => setShowSettings(!showSettings)}
                    className="relative px-6 py-3 transition-all duration-300 group overflow-hidden"
                    style={{
                        background: showSettings ? 'rgba(0, 242, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: showSettings ? '1px solid var(--cyan)' : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: showSettings ? '0 0 20px rgba(0, 242, 255, 0.2)' : 'none'
                    }}
                >
                    {/* Top Glow Edge */}
                    <div
                        className="absolute inset-x-0 top-0 h-[1px] bg-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity"
                    />

                    <div className="flex items-center gap-3 relative z-10">
                        <motion.div
                            animate={showSettings ? { rotate: 90 } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            <SettingsIcon
                                size={16}
                                style={{ color: showSettings ? 'var(--cyan)' : '#fff' }}
                                className="transition-colors group-hover:text-cyan-400"
                            />
                        </motion.div>
                        <span
                            style={{ color: '#fff' }}
                            className={`text-[11px] font-black uppercase tracking-[0.3em] group-hover:text-cyan-300 transition-colors`}
                        >
                            {showSettings ? 'SYSTEM_ON' : t('common.settings_guide')}
                        </span>

                        {/* Status Light */}
                        <div className="flex items-center gap-1.5 ml-1">
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`w-1.5 h-1.5 rounded-full ${showSettings ? 'bg-cyan-400 shadow-[0_0_8px_var(--cyan)]' : 'bg-slate-500'}`}
                            />
                        </div>
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/30 group-hover:border-cyan-400 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/30 group-hover:border-cyan-400 transition-colors" />
                </button>
            </div>
        </header>
    );
};
