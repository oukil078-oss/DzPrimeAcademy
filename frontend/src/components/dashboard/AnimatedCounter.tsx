'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.4,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (el) {
          el.textContent = `${prefix}${obj.val.toLocaleString('en-US', {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals,
          })}${suffix}`;
        }
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, duration, prefix, suffix, decimals]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
};
