/**
 * Web implementation of GoldLogo. @react-native-masked-view has no web support,
 * so the same effect is built with CSS: the gold gradient and the moving
 * white-gold band are both clipped to the glyphs (`background-clip: text`).
 * Timing comes from theme.motion so native and web stay in sync.
 */
import React, { useEffect } from 'react';
import config from '../../config';
import { fonts, gold, motion } from '../../theme/theme';
import { GoldLogoProps, LOGO_SIZES } from './GoldLogo.shared';

const STYLE_ID = 'jardin-gold-logo-css';
const total = motion.shineSweep + motion.shinePause;
const sweepPct = ((motion.shineSweep / total) * 100).toFixed(1);

function injectCss() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  @keyframes jardin-shine-loop { 0% { background-position: 160% 0; } ${sweepPct}% { background-position: -60% 0; } 100% { background-position: -60% 0; } }
  @keyframes jardin-shine-once { 0% { background-position: 160% 0; } 100% { background-position: -60% 0; } }
  @keyframes jardin-sparkle-loop { 0%, ${(Number(sweepPct) * 0.8).toFixed(1)}% { opacity: 0; transform: scale(.3) rotate(0deg); } ${(Number(sweepPct) * 0.9).toFixed(1)}% { opacity: .9; transform: scale(1) rotate(22deg); } ${sweepPct}%, 100% { opacity: 0; transform: scale(.5) rotate(45deg); } }
  @keyframes jardin-sparkle-once { 0%, 80% { opacity: 0; transform: scale(.3); } 90% { opacity: .9; transform: scale(1) rotate(22deg); } 100% { opacity: 0; transform: scale(.5) rotate(45deg); } }
  @media (prefers-reduced-motion: reduce) { .jardin-shine, .jardin-sparkle { animation: none !important; opacity: 0 !important; } }
  `;
  document.head.appendChild(el);
}

const goldCss = `linear-gradient(135deg, ${gold.stops.map((c, i) => `${c} ${gold.locations[i] * 100}%`).join(', ')})`;
const shineCss = `linear-gradient(105deg, transparent 38%, rgba(255,250,232,0.9) 50%, transparent 62%)`;

function assetUri(src: unknown): string | undefined {
  if (!src) return undefined;
  if (typeof src === 'string') return src;
  const s = src as { uri?: string; default?: string };
  return s.uri ?? s.default;
}

export function GoldLogo({
  variant = 'header',
  shine,
  sparkle = true,
  delay = 400,
  onShineEnd,
  accessibilityLabel = 'JARDIN Luxury Boutique',
}: GoldLogoProps) {
  const mode = shine ?? (variant === 'splash' ? 'once' : 'loop');
  const s = LOGO_SIZES[variant];
  useEffect(injectCss, []);

  useEffect(() => {
    if (mode !== 'once' || !onShineEnd) return;
    // timer instead of animationend so reduced-motion users still advance
    const t = setTimeout(onShineEnd, delay + motion.shineSweep);
    return () => clearTimeout(t);
  }, [mode, onShineEnd, delay]);

  const anim =
    mode === 'off'
      ? 'none'
      : mode === 'once'
        ? `jardin-shine-once ${motion.shineSweep}ms cubic-bezier(.65,0,.35,1) ${delay}ms 1 both`
        : `jardin-shine-loop ${total}ms cubic-bezier(.65,0,.35,1) ${delay}ms infinite both`;

  const sparkleAnim =
    mode === 'off' || !sparkle
      ? 'none'
      : mode === 'once'
        ? `jardin-sparkle-once ${motion.shineSweep}ms ease-in-out ${delay}ms 1 both`
        : `jardin-sparkle-loop ${total}ms ease-in-out ${delay}ms infinite both`;

  const clip: React.CSSProperties = {
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
  };

  const logoUri = assetUri(config.logoImage);
  const sparkleSize = variant === 'splash' ? 16 : 9;

  if (logoUri) {
    const h = variant === 'splash' ? 84 : 40;
    const mask: React.CSSProperties = {
      WebkitMaskImage: `url(${logoUri})`,
      maskImage: `url(${logoUri})`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      width: h * config.logoAspectRatio,
      height: h,
      position: 'relative',
    };
    return (
      <div role="heading" aria-label={accessibilityLabel} style={mask}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: goldCss }} />
        <div
          className="jardin-shine"
          style={{ position: 'absolute', inset: 0, backgroundImage: shineCss, backgroundSize: '250% 100%', animation: anim }}
        />
      </div>
    );
  }

  const line = (text: string, size: number, spacing: number, family: string, mt = 0) => {
    const base: React.CSSProperties = {
      display: 'block',
      fontFamily: family,
      fontSize: size,
      lineHeight: `${size * 1.12}px`,
      letterSpacing: spacing,
      paddingLeft: spacing,
      marginTop: mt,
      whiteSpace: 'nowrap',
      textAlign: 'center',
      userSelect: 'none',
    };
    return (
      <span style={{ position: 'relative', display: 'block' }}>
        <span style={{ ...base, ...clip, backgroundImage: goldCss }}>{text}</span>
        <span
          aria-hidden
          className="jardin-shine"
          style={{
            ...base,
            ...clip,
            position: 'absolute',
            inset: 0,
            marginTop: mt,
            backgroundImage: shineCss,
            backgroundSize: '250% 100%',
            backgroundRepeat: 'no-repeat',
            animation: anim,
          }}
        >
          {text}
        </span>
      </span>
    );
  };

  return (
    <div
      role="heading"
      aria-label={accessibilityLabel}
      style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {line('JARDIN', s.title, s.titleSpacing, fonts.serif)}
      {line('LUXURY BOUTIQUE', s.sub, s.subSpacing, fonts.sansMedium, s.gap)}
      {sparkle && mode !== 'off' && (
        <span
          aria-hidden
          className="jardin-sparkle"
          style={{
            position: 'absolute',
            right: sparkleSize * 0.4,
            top: -sparkleSize / 2 + s.title * 0.1,
            width: sparkleSize,
            height: sparkleSize,
            animation: sparkleAnim,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle, #fff 0 1.5px, transparent 2px), linear-gradient(#FFF8DE,#FFF8DE) center/1.4px 100% no-repeat, linear-gradient(#FFF8DE,#FFF8DE) center/100% 1.4px no-repeat',
            filter: 'drop-shadow(0 0 3px #FFF3C4)',
          }}
        />
      )}
    </div>
  );
}

export default GoldLogo;
