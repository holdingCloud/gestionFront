import { useState } from 'react';
import { Box, Typography } from "@mui/material";
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';

const FAQS = [
    {
        q: '¿Cuántos días de vacaciones tiene el empleado?',
        a: 'Según el Art. 67 del Código del Trabajo, el trabajador con más de 1 año de servicio tiene derecho a 15 días hábiles de vacaciones anuales. Luego de 10 años de trabajo (con el mismo o distintos empleadores) se agrega 1 día adicional por cada 3 años trabajados.',
    },
    {
        q: '¿Cómo se calcula la gratificación Art. 50?',
        a: 'El empleador puede optar por pagar mensualmente el 25% del salario mensual, con tope de 4.75 Ingresos Mínimos Mensuales. En 2026, el IMM es $510.000, por lo que el tope mensual es aprox. $201.563. Este monto queda exento de cotizaciones previsionales.',
    },
    {
        q: '¿Cuál es la indemnización según Art. 161?',
        a: 'Por término de contrato por necesidades de la empresa (Art. 161), el empleador debe pagar 30 días de la última remuneración mensual devengada por cada año de servicio o fracción superior a 6 meses. El tope es 11 años. Adicionalmente se debe indemnizar por feriado proporcional.',
    },
    {
        q: '¿Cuáles son las cotizaciones AFP y salud vigentes?',
        a: 'AFP: 10% del sueldo imponible (hasta 81,6 UF ≈ $3.300.000 aprox.). Salud: 7% del sueldo imponible. Seguro de Cesantía AFC: 0.6% a cargo del trabajador + 2.4% a cargo del empleador. Las tasas de AFP pueden variar según cada institución previsional.',
    },
];

type Phase = 'idle' | 'loading' | 'answer';

interface Props {
    open: boolean;
    onClose: () => void;
}

export function AsistenteRRHH({ open, onClose }: Props) {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const [phase, setPhase] = useState<Phase>('idle');
    const [answer, setAnswer] = useState('');
    const [customQ, setCustomQ] = useState('');

    const handleFaq = (faq: typeof FAQS[0]) => {
        setPhase('loading');
        setTimeout(() => {
            setAnswer(faq.a);
            setPhase('answer');
        }, 750);
    };

    const handleCustom = () => {
        if (!customQ.trim()) return;
        setPhase('loading');
        setTimeout(() => {
            setAnswer(
                `Para la consulta: "${customQ.trim()}" — te recomiendo revisar el Código del Trabajo de Chile, especialmente el Libro I (Título II) y el Libro V. Para cálculos específicos, consulta la Dirección del Trabajo (DT) o a un especialista laboral certificado.`
            );
            setPhase('answer');
        }, 900);
    };

    const reset = () => {
        setPhase('idle');
        setAnswer('');
        setCustomQ('');
    };

    return (
        <>
            {/* Backdrop */}
            <Box
                onClick={onClose}
                sx={{
                    position: 'fixed', inset: 0, zIndex: 90,
                    background: 'rgba(0,0,0,.42)', backdropFilter: 'blur(2px)',
                    opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
                    transition: 'opacity 0.28s',
                }}
            />

            {/* Slide-in panel */}
            <Box sx={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: { xs: '100vw', sm: '440px' },
                zIndex: 91, bgcolor: t.surface,
                borderLeft: `1px solid ${t.border}`,
                transform: open ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.32s cubic-bezier(.2,.8,.2,1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '-4px 0 40px rgba(0,0,0,.18)', overflow: 'hidden',
            }}>
                {/* Header */}
                <Box sx={{
                    background: `linear-gradient(135deg,${t.brand},${t.brand2})`,
                    padding: '18px 20px',
                    display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
                }}>
                    <Box sx={{
                        width: 38, height: 38, borderRadius: '12px',
                        background: 'rgba(255,255,255,.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.brandink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '15px', color: t.brandink }}>
                            Asistente RRHH
                        </Typography>
                        <Typography sx={{ fontSize: '12.5px', color: `${t.brandink}99` }}>
                            Consultas laborales y cálculos legales
                        </Typography>
                    </Box>
                    <Box
                        onClick={onClose}
                        sx={{
                            width: 32, height: 32, borderRadius: '10px',
                            background: 'rgba(255,255,255,.1)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'background .15s',
                            '&:hover': { background: 'rgba(255,255,255,.18)' },
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.brandink} strokeWidth="2.2" strokeLinecap="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </Box>
                </Box>

                {/* Body */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {phase === 'idle' && (
                        <>
                            <Typography sx={{
                                fontSize: '11px', fontWeight: 700, color: t.muted,
                                textTransform: 'uppercase', letterSpacing: '1px',
                            }}>
                                Preguntas frecuentes
                            </Typography>
                            {FAQS.map((faq, i) => (
                                <Box
                                    key={i}
                                    onClick={() => handleFaq(faq)}
                                    sx={{
                                        p: '14px 16px', borderRadius: '12px',
                                        border: `1.5px solid ${t.border}`, bgcolor: t.surface2,
                                        cursor: 'pointer', transition: 'all .15s',
                                        '&:hover': { borderColor: t.primary, bgcolor: `${t.primary}0a` },
                                    }}
                                >
                                    <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: t.ink, lineHeight: 1.4 }}>
                                        {faq.q}
                                    </Typography>
                                </Box>
                            ))}

                            <Box>
                                <Typography sx={{
                                    fontSize: '11px', fontWeight: 700, color: t.muted,
                                    textTransform: 'uppercase', letterSpacing: '1px', mb: '8px',
                                }}>
                                    Consulta personalizada
                                </Typography>
                                <Box
                                    component="textarea"
                                    value={customQ}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomQ(e.target.value)}
                                    placeholder="Escribe tu consulta laboral..."
                                    rows={3}
                                    sx={{
                                        width: '100%', padding: '11px 13px', borderRadius: '10px',
                                        fontSize: '13.5px', border: `1.5px solid ${t.border}`,
                                        bgcolor: t.surface2, color: t.ink,
                                        outline: 'none', boxSizing: 'border-box', resize: 'none',
                                        fontFamily: 'inherit', transition: 'border-color .15s',
                                        '&:focus': { borderColor: t.primary },
                                        '&::placeholder': { color: t.muted },
                                    }}
                                />
                            </Box>
                        </>
                    )}

                    {phase === 'loading' && (
                        <Box sx={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '7px', py: '48px',
                        }}>
                            {[0, 1, 2].map(i => (
                                <Box key={i} sx={{
                                    width: 9, height: 9, borderRadius: '50%', bgcolor: t.primary,
                                    animation: `rrhh_bounce 0.9s ${i * 0.2}s infinite ease-in-out`,
                                    '@keyframes rrhh_bounce': {
                                        '0%,80%,100%': { transform: 'scale(0.65)', opacity: 0.45 },
                                        '40%': { transform: 'scale(1)', opacity: 1 },
                                    },
                                }} />
                            ))}
                        </Box>
                    )}

                    {phase === 'answer' && (
                        <Box sx={{
                            p: '18px', borderRadius: '14px',
                            bgcolor: t.surface2, border: `1px solid ${t.border}`,
                        }}>
                            <Typography sx={{ fontSize: '14px', color: t.ink, lineHeight: 1.65 }}>
                                {answer}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Footer */}
                <Box sx={{
                    p: '14px 20px', borderTop: `1px solid ${t.border}`,
                    flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px',
                }}>
                    {phase === 'idle' && (
                        <Box
                            onClick={handleCustom}
                            sx={{
                                width: '100%', padding: '12px', borderRadius: '11px',
                                background: `linear-gradient(135deg,${t.primary},${t.brand})`,
                                color: '#fff', fontWeight: 700, fontSize: '14px',
                                textAlign: 'center', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                userSelect: 'none', transition: 'opacity .15s', '&:hover': { opacity: 0.9 },
                            }}
                        >
                            Preguntar
                        </Box>
                    )}
                    {phase === 'answer' && (
                        <Box
                            onClick={reset}
                            sx={{
                                width: '100%', padding: '12px', borderRadius: '11px',
                                border: `1.5px solid ${t.border}`, bgcolor: t.surface2,
                                color: t.ink, fontWeight: 600, fontSize: '14px',
                                textAlign: 'center', cursor: 'pointer',
                                userSelect: 'none', transition: 'border-color .15s',
                                '&:hover': { borderColor: t.primary },
                            }}
                        >
                            Nueva consulta
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
}
