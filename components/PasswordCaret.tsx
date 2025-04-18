import React from "react";

/**
 * Renders a custom caret for password fields, matching the login/signup style.
 * Usage: Place absolutely inside a relative parent wrapping the input.
 */
interface PasswordCaretProps {
  caretIndex: number;
  fillPercent?: number; // 0 to 1
  inputPadding?: number; // px
  charWidth?: number; // px, average width per character
  className?: string;
}

const PasswordCaret: React.FC<PasswordCaretProps> = ({ caretIndex, fillPercent = 0, inputPadding = 16, charWidth = 9, className = "" }) => {
  // Calculate left position: padding + (caretIndex * charWidth)
  const left = inputPadding + caretIndex * charWidth;
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-zinc-300 dark:bg-zinc-600 rounded pointer-events-none overflow-hidden ${className}`}
      style={{ left: `${left}px` }}
    >
      {/* Base caret (gray, full height) */}
      <div className="absolute bottom-0 left-0 w-full h-full bg-zinc-300 dark:bg-zinc-600 rounded" />
      {/* Fill bar (blue, grows with fillPercent) */}
      <div
        className="absolute bottom-0 left-0 w-full bg-indigo-600 rounded transition-all duration-200"
        style={{ height: `${Math.max(0, Math.min(1, fillPercent)) * 100}%` }}
      />
    </div>
  );
};

export default PasswordCaret;
