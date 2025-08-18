import { FC, ImgHTMLAttributes } from 'react';

type NextImageMockProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  size?: string;
};
const MockNextImage: FC<NextImageMockProps> = ({
  src,
  alt = '',
  fill,
  priority,
  width,
  height,
  className,
  style,
  ...rest
}) => {
  const loading = priority ? 'eager' : undefined;
  const srcString = src === 'string' ? src : (src as any)?.src ?? (src as any);

  if (fill) {
    // 模拟 next/image 的 fill 布局：撑满父容器
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={srcString}
          alt={alt}
          className={className}
          loading={loading}
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
      src={srcString}
      alt={alt}
      className={className}
      loading={loading}
      width={width}
      height={height}
      style={style}
      {...rest}
    />
  );
};

export default MockNextImage;
