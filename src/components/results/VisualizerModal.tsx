import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertTriangle, Download, Share2, Loader2, Camera } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface VisualizerModalProps {
    isOpen: boolean;
    onClose: () => void;
    prompt: string;
    onGenerate: (prompt: string) => Promise<string>;
}

export const VisualizerModal: React.FC<VisualizerModalProps> = ({
    isOpen,
    onClose,
    prompt,
    onGenerate
}) => {
    const { t } = useLanguage();
    const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleStartGeneration = async () => {
        setStatus('generating');
        setError(null);
        try {
            const url = await onGenerate(prompt);
            setGeneratedImageUrl(url);
            setStatus('success');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to generate image');
            setStatus('error');
        }
    };

    const handleDownload = () => {
        if (!generatedImageUrl) return;
        const link = document.createElement('a');
        link.href = generatedImageUrl;
        link.download = `costume-ai-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            width: '100%',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'rgba(20, 20, 25, 0.95)',
                            borderRadius: '32px',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: 'none',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ padding: '2.5rem', flex: 1, overflowY: 'auto' }}>
                            {status === 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}
                                >
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '24px',
                                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 2rem',
                                        color: '#a78bfa'
                                    }}>
                                        <Sparkles size={40} />
                                    </div>

                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {t('results.image_gen.confirm_title')}
                                    </h2>

                                    <div style={{
                                        backgroundColor: 'rgba(234, 179, 8, 0.05)',
                                        border: '1px solid rgba(234, 179, 8, 0.2)',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        marginBottom: '2.5rem',
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'flex-start',
                                        textAlign: 'left'
                                    }}>
                                        <AlertTriangle size={24} color="#eab308" style={{ flexShrink: 0 }} />
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                                            {t('results.image_gen.confirm_desc')}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleStartGeneration}
                                        style={{
                                            width: '100%',
                                            padding: '1.25rem',
                                            borderRadius: '16px',
                                            backgroundColor: '#8b5cf6',
                                            color: '#fff',
                                            border: 'none',
                                            fontSize: '1.1rem',
                                            fontWeight: 900,
                                            cursor: 'pointer',
                                            boxShadow: '0 10px 20px -5px rgba(139, 92, 246, 0.5)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        className="hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {t('results.image_gen.confirm_ok')}
                                    </button>
                                </motion.div>
                            )}

                            {status === 'generating' && (
                                <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '50%',
                                                border: '2px solid transparent',
                                                borderTopColor: '#8b5cf6',
                                                borderRightColor: '#ec4899'
                                            }}
                                        />
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                                            <Loader2 size={40} className="animate-spin" style={{ margin: 'auto' }} />
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>
                                            {t('results.image_gen.generating')}
                                        </h3>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>NEURAL SYNTHESIS IN PROGRESS...</p>
                                    </div>
                                </div>
                            )}

                            {status === 'success' && generatedImageUrl && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2.5rem', alignItems: 'start' }}
                                >
                                    <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#000', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                                        <img
                                            src={generatedImageUrl}
                                            alt="Generated Costume"
                                            style={{ width: '100%', height: 'auto', display: 'block' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            left: '1rem',
                                            padding: '0.5rem 1rem',
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            backdropFilter: 'blur(8px)',
                                            borderRadius: '100px',
                                            color: '#8b5cf6',
                                            fontSize: '0.65rem',
                                            fontWeight: 900,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <Camera size={12} />
                                            STABLE DIFFUSION / IMAGEN-3
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Visualization Complete</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                                                The AI has interpreted your prompt to create this custom visual reference.
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <button
                                                onClick={handleDownload}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                    padding: '1rem',
                                                    borderRadius: '14px',
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    color: '#fff',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                className="hover:bg-white/10"
                                            >
                                                <Download size={18} /> Download Image
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigator.share({
                                                        title: 'Costume AI Visualization',
                                                        url: generatedImageUrl
                                                    }).catch(() => { });
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                    padding: '1rem',
                                                    borderRadius: '14px',
                                                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                                    color: '#a78bfa',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                className="hover:bg-purple-500/20"
                                            >
                                                <Share2 size={18} /> Share Result
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                                    <div style={{ color: '#ef4444', marginBottom: '1.5rem' }}>
                                        <AlertTriangle size={60} style={{ margin: '0 auto' }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
                                        {t('results.image_gen.error')}
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>{error}</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        style={{
                                            padding: '0.75rem 2rem',
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            border: 'none',
                                            color: '#fff',
                                            fontWeight: 800,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
