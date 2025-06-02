import React from 'react';

const MockNextImage = (props: any) => {
  const { src, alt, width, height, ...rest } = props;
  return <img src={src} alt={alt} width={width || 'auto'} height={height || 'auto'} {...rest} />;
};

export default MockNextImage;
