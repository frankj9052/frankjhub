import { FC, ImgHTMLAttributes } from 'react';

type NextImageMockProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | { src: string };
  fill?: boolean;
  priority?: boolean;
  sizes?: string; // ✅ 使用 sizes，而不是 size
  unoptimized?: boolean; // 可选，保持 API 对齐
};

const MockNextImage: FC<NextImageMockProps> = ({
  src,
  alt = '',
  fill,
  priority,
  sizes,
  width,
  height,
  className,
  style,
  ...rest
}) => {
  const resolvedSrc = typeof src === 'string' ? src : (src as any)?.src ?? (src as any);

  const loading = priority ? 'eager' : undefined;
  const fetchPriority = priority ? ('high' as any) : undefined; // 与 next/image 对齐

  if (fill) {
    // ✅ fill 时提供默认 sizes，模拟 Next 的默认 100vw 行为，避免在实际项目里忘记 sizes
    const imgSizes = sizes ?? '100vw';

    // 模拟 next/image 的 fill 布局（需要父容器 position: relative）
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={resolvedSrc}
          alt={alt}
          className={className}
          loading={loading}
          fetchPriority={fetchPriority}
          sizes={imgSizes}
          style={{
            width: '100%',
            height: '100%',
            objectFit: (style as any)?.objectFit,
            objectPosition: (style as any)?.objectPosition,
            ...style,
          }}
          {...rest}
        />
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      sizes={sizes}
      width={width}
      height={height}
      style={style}
      {...rest}
    />
  );
};

export default MockNextImage;
