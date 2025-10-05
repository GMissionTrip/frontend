import React from "react";
import "./styles.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "rectangular" | "circular";
  animation?: "pulse" | "wave" | "none";
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  variant = "rectangular",
  animation = "pulse",
  className = ""
}) => {
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  const skeletonClasses = `
    skeleton
    skeleton-${variant}
    skeleton-${animation}
    ${className}
  `.trim();

  return (
    <div className={skeletonClasses} style={style} aria-hidden="true">
      <span className="sr-only">로딩 중...</span>
    </div>
  );
};

// 미리 정의된 스켈레톤 컴포넌트들
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = ""
}) => (
  <div className={`skeleton-text-container ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? "75%" : "100%"}
        height="1rem"
        className="skeleton-text-line"
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`skeleton-card ${className}`}>
    <Skeleton variant="rectangular" height="200px" className="skeleton-card-image" />
    <div className="skeleton-card-content">
      <Skeleton width="80%" height="1.5rem" className="skeleton-card-title" />
      <Skeleton width="60%" height="1rem" className="skeleton-card-subtitle" />
      <Skeleton width="40%" height="0.875rem" className="skeleton-card-meta" />
    </div>
  </div>
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = ""
}) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    className={className}
  />
);
