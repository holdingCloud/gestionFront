import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeStore, THEME_TOKENS } from '../../store/theme/theme.store';
import { ClientResponse } from '../../interfaces/client.interface';

type Objetivo = 'recordatorio' | 'reactivacion' | 'oferta' | 'seguimiento' | 'cobro';
type Tono = 'cercano' | 'formal' | 'directo';
type Phase = 'config' | 'loading' | 'preview';

const objetivos: { key: Objetivo; label: string; icon: string }[] = [
    { key: 'recordatorio', label: 'Recordatorio', icon: '🔔' },
    { key: 'reactivacion', label: 'Reactivación', icon: '🔄' },
    { key: 'oferta', label: 'Oferta', icon: '🎁' },
    { key: 'seguimiento', label: 'Seguimiento', icon: '👋' },
    { key: 'cobro', label: 'Cobro', icon: '💳' },
];

const tonos: { key: Tono; label: string }[] = [
    { key: 'cercano', label: 'Cercano' },
    { key: 'formal', label: 'Formal' },
    { key: 'directo', label: 'Directo' },
];

function genMessage(
    client: ClientResponse,
    objetivo: Objetivo,
    tono: Tono,
    nota: string,
    variant: number,
): string {
    const first = client.fullname.split(' ')[0];
    const freq = client.frequency ? `${client.frequency} días` : 'un tiempo';
    const empresa = client.company?.name ?? 'nuestra empresa';
    const prod = nota ? ` (${nota})` : '';
    const v = ((variant % 3) + 3) % 3;

    const greetings: Record<Tono, string[]> = {
        cercano: [`¡Hola ${first}! 👋`, `Hola ${first}, ¿cómo estás? 😊`, `¡Qué gusto, ${first}! 🙌`],
        formal: [`Estimado/a ${first}:`, `Buenos días, ${first}:`, `Apreciado/a ${first}:`],
        directo: [`${first},`, `Hola ${first}.`, `${first} 👋`],
    };

    const bodies: Record<Objetivo, string[]> = {
        recordatorio: [
            `En ${empresa} notamos que tu última visita fue hace ${freq}. Es buen momento para reponer tu pedido${prod} y no quedarte sin stock.`,
            `Han pasado ${freq} desde tu último pedido${prod}. ¿Te preparamos la reposición para que no te falte nada?`,
            `Tu pedido${prod} suele durarte ${freq}. ¿Coordinamos el próximo despacho esta semana?`,
        ],
        reactivacion: [
            `Hace un tiempo que no compras con nosotros y nos encantaría tenerte de vuelta. Tenemos novedades${prod} que creemos te van a interesar.`,
            `Te extrañamos en ${empresa} 😊 Preparamos algo especial${prod} para que retomes tus pedidos cuando quieras.`,
            `¿Volvemos a trabajar juntos? Tenemos disponibilidad inmediata${prod} y condiciones especiales pensadas para ti.`,
        ],
        oferta: [
            `Tenemos una oferta especial pensada para ti${prod}, válida por tiempo limitado. No queríamos que te la perdieras.`,
            `Promo exclusiva para clientes como tú${prod}: precios rebajados solo esta semana. ¿Te reservo el tuyo?`,
            `Aprovecha: descuento especial en tu próximo pedido${prod}. Cupos limitados, avísame y lo dejo agendado.`,
        ],
        seguimiento: [
            `Queríamos saber cómo te fue con tu última compra${prod} y si necesitas reponer algo. Tu opinión nos ayuda a mejorar.`,
            `Pasamos a saludarte y consultar si todo llegó bien${prod}. Cualquier cosa, quedo atento.`,
            `¿Todo en orden con tu pedido${prod}? Si quieres, dejamos lista tu próxima entrega.`,
        ],
        cobro: [
            `Te escribimos para recordarte amablemente que tienes un saldo pendiente con ${empresa}. ¿Coordinamos el pago esta semana?`,
            `Solo un recordatorio cordial sobre tu saldo pendiente. ¿Te acomoda regularizarlo en estos días?`,
            `Queremos ayudarte a mantener tu cuenta al día. Tienes un pago pendiente, ¿lo vemos juntos?`,
        ],
    };

    const closings: Record<Tono, string[]> = {
        cercano: ['¡Quedamos atentos! 🙌', 'Cualquier cosa me avisas 😊', 'Un abrazo y buen día 🌟'],
        formal: [
            'Quedamos atentos a su respuesta. Saludos cordiales.',
            'Agradecemos su preferencia. Atentamente,',
            'Quedamos a su disposición. Cordialmente,',
        ],
        directo: ['¿Te preparo el pedido?', 'Avísame y lo dejo listo.', 'Respóndeme y coordinamos.'],
    };

    return `${greetings[tono][v]}\n\n${bodies[objetivo][v]}\n\n${closings[tono][v]}\n— ${empresa}`;
}

function buildWhatsAppUrl(phone: string, message: string): string {
    const digits = phone.replace(/\D/g, '');
    const number = digits.startsWith('56') ? digits : `56${digits}`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

interface Props {
    open: boolean;
    onClose: () => void;
    client: ClientResponse | null;
}

export function AiWhatsappPanel({ open, onClose, client }: Props) {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const [objetivo, setObjetivo] = useState<Objetivo>('recordatorio');
    const [tono, setTono] = useState<Tono>('cercano');
    const [nota, setNota] = useState('');
    const [phase, setPhase] = useState<Phase>('config');
    const [variant, setVariant] = useState(0);
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (client) {
            setPhase('config');
            setNota('');
            setVariant(0);
            setCopied(false);
            setMessage('');
        }
    }, [client?.id]);

    const runGenerate = useCallback(
        (v: number) => {
            if (!client) return;
            setPhase('loading');
            setTimeout(() => {
                setMessage(genMessage(client, objetivo, tono, nota, v));
                setPhase('preview');
            }, 900);
        },
        [client, objetivo, tono, nota],
    );

    const handleGenerate = () => runGenerate(variant);

    const handleOtraVersion = () => {
        const next = variant + 1;
        setVariant(next);
        runGenerate(next);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const avatarLetter = client?.fullname?.[0]?.toUpperCase() ?? '?';

    const resetToConfig = () => {
        if (phase === 'preview') setPhase('config');
    };

    return (
        <>
            {/* Backdrop */}
            <Box
                onClick={onClose}
                sx={{
                    position: 'fixed', inset: 0, zIndex: 90,
                    background: 'rgba(20,14,8,.42)',
                    backdropFilter: 'blur(2px)',
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'auto' : 'none',
                    transition: 'opacity 0.28s',
                }}
            />

            {/* Slide-in panel */}
            <Box sx={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: { xs: '100vw', sm: '440px' },
                zIndex: 91,
                bgcolor: t.surface,
                borderLeft: `1px solid ${t.border}`,
                transform: open ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.32s cubic-bezier(.2,.8,.2,1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '-4px 0 40px rgba(0,0,0,.18)',
                overflow: 'hidden',
            }}>

                {/* Header */}
                <Box sx={{
                    background: `linear-gradient(135deg,${t.brand},${t.brand2})`,
                    padding: '18px 20px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    flexShrink: 0,
                }}>
                    <Box sx={{
                        width: 38, height: 38, borderRadius: '12px',
                        background: 'rgba(14,159,140,.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3" />
                            <circle cx="12" cy="12" r="3.2" />
                        </svg>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontFamily: "'Bricolage Grotesque', system-ui", fontWeight: 700, fontSize: '15px', color: t.brandink }}>
                            Copiloto · Mensaje IA
                        </Typography>
                        <Typography sx={{ fontSize: '12.5px', color: `${t.brandink}99` }}>
                            Redacta mensajes de WhatsApp en segundos
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

                {/* Scrollable body */}
                <Box sx={{
                    flex: 1, overflowY: 'auto', padding: '18px 20px',
                    display: 'flex', flexDirection: 'column', gap: '16px',
                }}>

                    {/* Client summary card */}
                    {client && (
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '14px', borderRadius: '14px',
                            bgcolor: t.surface2, border: `1px solid ${t.border}`,
                        }}>
                            <Box sx={{
                                width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                                background: `linear-gradient(135deg,${t.primary},${t.brand})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: '18px', color: '#fff',
                            }}>
                                {avatarLetter}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{
                                    fontWeight: 700, fontSize: '14px', color: t.ink,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {client.fullname}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '12.5px', color: t.muted,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {client.phone}
                                    {client.contactStatus ? ` · ${client.contactStatus}` : ''}
                                    {client.frequency ? ` · ${client.frequency}d` : ''}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Objetivo */}
                    <Box>
                        <Typography sx={{
                            fontSize: '11px', fontWeight: 700, color: t.muted,
                            textTransform: 'uppercase', letterSpacing: '1px', mb: '10px',
                        }}>
                            Objetivo
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                            {objetivos.map(o => (
                                <Box
                                    key={o.key}
                                    onClick={() => { setObjetivo(o.key); resetToConfig(); }}
                                    sx={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '7px 13px', borderRadius: '10px', cursor: 'pointer',
                                        fontSize: '13px', fontWeight: 600,
                                        border: `1.5px solid ${objetivo === o.key ? t.primary : t.border}`,
                                        bgcolor: objetivo === o.key ? `${t.primary}18` : t.surface2,
                                        color: objetivo === o.key ? t.primary : t.ink,
                                        transition: 'all .15s',
                                        userSelect: 'none',
                                    }}
                                >
                                    <span>{o.icon}</span> {o.label}
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Tono */}
                    <Box>
                        <Typography sx={{
                            fontSize: '11px', fontWeight: 700, color: t.muted,
                            textTransform: 'uppercase', letterSpacing: '1px', mb: '10px',
                        }}>
                            Tono
                        </Typography>
                        <Box sx={{ display: 'flex', gap: '8px' }}>
                            {tonos.map(tn => (
                                <Box
                                    key={tn.key}
                                    onClick={() => { setTono(tn.key); resetToConfig(); }}
                                    sx={{
                                        flex: 1, textAlign: 'center',
                                        padding: '10px 0', borderRadius: '10px', cursor: 'pointer',
                                        fontSize: '13.5px', fontWeight: 600,
                                        border: `1.5px solid ${tono === tn.key ? t.primary : t.border}`,
                                        bgcolor: tono === tn.key ? `${t.primary}18` : t.surface2,
                                        color: tono === tn.key ? t.primary : t.ink,
                                        transition: 'all .15s', userSelect: 'none',
                                    }}
                                >
                                    {tn.label}
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Optional note */}
                    <Box>
                        <Typography sx={{
                            fontSize: '11px', fontWeight: 700, color: t.muted,
                            textTransform: 'uppercase', letterSpacing: '1px', mb: '8px',
                        }}>
                            Producto / Nota (opcional)
                        </Typography>
                        <Box
                            component="input"
                            value={nota}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setNota(e.target.value);
                                resetToConfig();
                            }}
                            placeholder="ej: aceite, azúcar 5kg, producto X…"
                            sx={{
                                width: '100%', padding: '11px 13px', borderRadius: '10px',
                                fontSize: '13.5px', border: `1.5px solid ${t.border}`,
                                bgcolor: t.surface2, color: t.ink,
                                outline: 'none', boxSizing: 'border-box',
                                fontFamily: "'Hanken Grotesque', system-ui",
                                transition: 'border-color .15s',
                                '&:focus': { borderColor: t.primary },
                                '&::placeholder': { color: t.muted },
                            }}
                        />
                    </Box>

                    {/* Loading dots */}
                    {phase === 'loading' && (
                        <Box sx={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '7px', py: '28px',
                        }}>
                            {[0, 1, 2].map(i => (
                                <Box key={i} sx={{
                                    width: 9, height: 9, borderRadius: '50%', bgcolor: t.primary,
                                    animation: `aiBounce 0.9s ${i * 0.2}s infinite ease-in-out`,
                                    '@keyframes aiBounce': {
                                        '0%,80%,100%': { transform: 'scale(0.65)', opacity: 0.45 },
                                        '40%': { transform: 'scale(1)', opacity: 1 },
                                    },
                                }} />
                            ))}
                        </Box>
                    )}

                    {/* WhatsApp preview */}
                    {phase === 'preview' && message && (
                        <Box>
                            <Typography sx={{
                                fontSize: '11px', fontWeight: 700, color: t.muted,
                                textTransform: 'uppercase', letterSpacing: '1px', mb: '10px',
                            }}>
                                Vista previa
                            </Typography>
                            <Box sx={{
                                bgcolor: '#0b141a', borderRadius: '14px',
                                padding: '16px', position: 'relative', overflow: 'hidden',
                            }}>
                                <Box sx={{
                                    position: 'absolute', inset: 0, opacity: 0.04,
                                    backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 19px,rgba(255,255,255,.5) 19px,rgba(255,255,255,.5) 20px),repeating-linear-gradient(90deg,transparent,transparent 19px,rgba(255,255,255,.5) 19px,rgba(255,255,255,.5) 20px)',
                                }} />
                                <Box sx={{
                                    bgcolor: '#202c33', borderRadius: '0 10px 10px 10px',
                                    padding: '11px 13px', maxWidth: '88%',
                                    position: 'relative', zIndex: 1,
                                    boxShadow: '0 1px 4px rgba(0,0,0,.4)',
                                }}>
                                    <Typography sx={{
                                        fontSize: '13.5px', color: '#e9edef',
                                        lineHeight: 1.55, whiteSpace: 'pre-line',
                                        fontFamily: "'Hanken Grotesque', system-ui",
                                    }}>
                                        {message}
                                    </Typography>
                                    <Typography sx={{ fontSize: '11px', color: '#8696a0', textAlign: 'right', mt: '4px' }}>
                                        {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} ✓✓
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Footer */}
                <Box sx={{
                    padding: '14px 20px', borderTop: `1px solid ${t.border}`,
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    flexShrink: 0, bgcolor: t.surface,
                }}>
                    {phase === 'config' && (
                        <Box
                            onClick={handleGenerate}
                            sx={{
                                width: '100%', padding: '13px', borderRadius: '12px',
                                background: `linear-gradient(135deg,${t.primary},${t.brand})`,
                                color: '#fff', fontWeight: 700, fontSize: '14.5px',
                                textAlign: 'center', cursor: 'pointer',
                                boxShadow: `0 8px 20px rgba(14,159,140,.28)`,
                                fontFamily: "'Hanken Grotesque', system-ui",
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                userSelect: 'none', transition: 'opacity .15s',
                                '&:hover': { opacity: 0.92 },
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3" />
                                <circle cx="12" cy="12" r="3.2" />
                            </svg>
                            Generar mensaje
                        </Box>
                    )}

                    {phase === 'loading' && (
                        <Box sx={{
                            width: '100%', padding: '13px', borderRadius: '12px',
                            bgcolor: t.surface2, border: `1px solid ${t.border}`,
                            color: t.muted, fontWeight: 600, fontSize: '14.5px',
                            textAlign: 'center', fontFamily: "'Hanken Grotesque', system-ui",
                        }}>
                            Generando…
                        </Box>
                    )}

                    {phase === 'preview' && (
                        <Box sx={{ display: 'flex', gap: '8px' }}>
                            <Box
                                onClick={handleOtraVersion}
                                sx={{
                                    flex: 1, padding: '11px', borderRadius: '11px',
                                    border: `1.5px solid ${t.border}`, bgcolor: t.surface2,
                                    color: t.ink, fontWeight: 600, fontSize: '13px',
                                    textAlign: 'center', cursor: 'pointer',
                                    fontFamily: "'Hanken Grotesque', system-ui",
                                    userSelect: 'none', transition: 'border-color .15s',
                                    '&:hover': { borderColor: t.primary },
                                }}
                            >
                                Otra versión
                            </Box>
                            <Box
                                onClick={handleCopy}
                                sx={{
                                    flex: 1, padding: '11px', borderRadius: '11px',
                                    border: `1.5px solid ${copied ? t.success : t.border}`,
                                    bgcolor: copied ? `${t.success}18` : t.surface2,
                                    color: copied ? t.success : t.ink,
                                    fontWeight: 600, fontSize: '13px', textAlign: 'center',
                                    cursor: 'pointer', fontFamily: "'Hanken Grotesque', system-ui",
                                    userSelect: 'none', transition: 'all .15s',
                                }}
                            >
                                {copied ? '¡Copiado!' : 'Copiar'}
                            </Box>
                            {client?.phone && (
                                <Box
                                    component="a"
                                    href={buildWhatsAppUrl(client.phone, message)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        flex: 1, padding: '11px', borderRadius: '11px',
                                        background: '#25D366', color: '#fff',
                                        fontWeight: 700, fontSize: '13px', textAlign: 'center',
                                        textDecoration: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                        transition: 'background .15s',
                                        '&:hover': { background: '#1ebe5d' },
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
}

export default AiWhatsappPanel;
