"use client";
import { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
  siteKey: string;
  theme: "light" | "dark";
  onVerify: (token: string) => void;
}

export default function TurnstileWidget({ siteKey, theme, onVerify }: TurnstileWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const turnstileId = useRef<string | null>(null);

  useEffect(() => {
    // Load Turnstile script if not present
    if (!window.turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = renderWidget;
      return () => {
        script.remove();
      };
    } else {
      renderWidget();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, theme]);

  const renderWidget = () => {
    if (!window.turnstile || !widgetRef.current) return;
    if (turnstileId.current) {
      window.turnstile.remove(turnstileId.current);
      turnstileId.current = null;
    }
    turnstileId.current = window.turnstile.render(widgetRef.current, {
      sitekey: siteKey,
      theme,
      callback: (token: string) => {
        if (onVerify) onVerify(token);
      },
    });
  };

  return <div ref={widgetRef} />;
}

declare global {
  interface Window {
    turnstile?: any;
  }
}
