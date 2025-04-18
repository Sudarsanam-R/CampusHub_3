"use client";
import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    const oldCursor = document.getElementById("custom-cursor");
    if (oldCursor) oldCursor.remove();
    const cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    cursor.style.position = "fixed";
    cursor.style.width = "10px";
    cursor.style.height = "10px";
    cursor.style.borderRadius = "50%";
    cursor.style.pointerEvents = "none"; // always, never block interaction
    cursor.style.zIndex = "2147483647";

    cursor.style.mixBlendMode = "difference";
    cursor.style.backgroundColor = "white";
    cursor.style.transform = "translate(-50%, -50%)";
    cursor.style.transition = "width 0.2s, height 0.2s, background 0.2s";
    document.body.appendChild(cursor);

    const move = (e: MouseEvent) => {
      cursor.style.display = "";
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const clickable = t.closest(
        "button, a, input[type='checkbox'], label, [role='button'], .clickable"
      );
      cursor.classList.toggle("cursor-hover", !!clickable);
      document.body.style.cursor = "none";
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);

    // Add styles for hover effect
    const style = document.createElement("style");
    style.innerHTML = `
      #custom-cursor {
        width: 10px !important;
        height: 10px !important;
      }
      #custom-cursor.cursor-hover {
        width: 25px !important;
        height: 25px !important;
        background: white !important;
      }
    `;
    document.head.appendChild(style);

    // Add global CSS to force-hide the native cursor on all elements
    const globalStyle = document.createElement("style");
    globalStyle.innerHTML = `
      body { cursor: none !important; }
      button, a, input[type='checkbox'], label, [role='button'], .clickable { cursor: pointer !important; }
      input, textarea { cursor: text !important; }
    `;
    document.head.appendChild(globalStyle);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);

      document.head.removeChild(style);
      document.head.removeChild(globalStyle);
      cursor.remove();
    };
  }, []);
  return null;
}
