import styles from '../styles/ShinyText.module.css';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }: ShinyTextProps) => {
  const animationDuration = `${speed}s`;
  return (
    <span
    className={[
      styles.shinyText,
      disabled ? styles.disabled : '',
      className === 'shinyLight' ? styles['shinyLight'] : className
    ].join(' ')}
      style={{ animationDuration }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
