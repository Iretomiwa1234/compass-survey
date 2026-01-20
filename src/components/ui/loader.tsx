type LoaderProps = {
  size?: number;
  className?: string;
};

export function Loader({ size = 16, className }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`relative ${className ?? ""}`}
      style={{ fontSize: size, width: "2.5em", height: "2.5em" }}
    >
      <div className="loader" />
    </div>
  );
}
