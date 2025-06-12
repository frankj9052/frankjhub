import { Spinner } from '@heroui/react';
// import { useEffect, useRef, useState } from 'react';
// 不清楚能不能SSR, 试着来吧
import styles from './FrankLoadingSignature.module.css';

/**
 * FrankLoadingSignature - A custom loading component that displays a signature-style SVG animation
 * alongside a spinner. Typically used to indicate loading states with branding.
 *
 * @component
 * @returns {JSX.Element} The FrankLoadingSignature component.
 */
export const FrankLoadingSignature = () => {
  // const pathRef = useRef<SVGPathElement>(null);

  // 测试用
  // useEffect(() => {
  //   if (pathRef.current) {
  //     const length = pathRef.current.getTotalLength();
  //     console.log("path length ===> ", length);
  //   }
  // }, []);

  return (
    <div className="text-[#6A59D1] flex gap-3">
      <svg
        width="561.98"
        height="90.54"
        viewBox="0 0 280.99 45.27"
        fill="none"
        className={styles.customizeSvg}
      >
        <path
          className={styles.svgPath_01}
          // ref={pathRef}
          d="M12.18.5C8.01,9.81,4.99,19.45,1.93,29.06c-.49,2.33-2.6,7.68-.55,8.64,5.12-.65,10.91-2.63,14.88-5.84"
        />
        <path
          className={styles.svgPath_02}
          // ref={pathRef}
          d="M25.31,18.74c-8.65-1.15-9.38,23-1.75,8.58,2-1.86,1.94-6.88,2.45-7.85.9,2.16,4.06,3.43,6.02,1.9,1.34-1.63,2.82-2.83,5.04-2.92,1.39-.41-2.25.08-2.84.66-3.36,1.29-7.83,18.27-1.85,10.1,2.4-3.02,4.82-9.32,6.24-11.35-1.62,2.88-3.68,17.99,2.59,13.02,2.95-3.29,4.18-7.61,7.47-10.36,1.61-1.94,2.02.34,2.66,1.27.23-3.58-2.98-1.43-4.44.04-5.62,10.47.07,14.75,3.78,1.43,3.3-5.89,4.88-12.62,7.51-19.04.8-2.44-.46,3.31-1.67,3.68-8.03,16.81-5.69,38.95,7.88,10.21-1.6,2.12-7.28,18.45,2.05,12.65,2.53-2.16,8.84-16,6.18-5.85-1.16,2.03-1.27,6.06-2.98,7.15,1.3-3.88,3.78-7.87,6.85-10.79,5.31-3.1.99,6.31,1.46,8.91,3.46,5.44,8.36-6.91,10.76-9.45.34-1.76,5.31-3.13,4.15-2.63-6.05-.01-6.01,7.1-6.89,11.62,2.78,2.32,5.82-7.49,7.44-9.84.25-2.91.55-.21-.07.73-2.58,7.66-4.47,17.56-9.71,23.34,0-8.96,15.31-14.52,18.97-23.64"
        />
        <path
          className={styles.svgPath_03}
          // ref={pathRef}
          d="M66.16,11.44c1.72-.07,2.05,1.75.58,2.92-.94.94-.83-1.11-.55-1.61,1.15-.89,1.09.44.26.88"
        />
        <path
          className={styles.svgPath_04}
          // ref={pathRef}
          d="M113.14,11.73c2.99-4.95,18.19-12.79,20.43-4.38"
        />
        <path
          className={styles.svgPath_05}
          // ref={pathRef}
          d="M121.46,2.98c-3.02,6.75-3.64,13.94-5.47,20.99.36,3.95-4.27,11.39-2.26,13.29"
        />
        <path
          className={styles.svgPath_06}
          // ref={pathRef}
          d="M116.35,22.53c-.53-.69-.43-2.19-1.05-2.89-.34-.34-1.17-.62-.32-.62,4.32.16,8.74.13,12.9.15"
        />
        <path
          className={styles.svgPath_07}
          // ref={pathRef}
          d="M132.4,20.63c.86,3.83-1.22,6.91-2.62,10.29,2.2-1.82,2.15-8.75,5.84-10.65,1.72-1.46,4.01-3.26,4.26.36.75.7,2.73,2.89,3.62,1.46,1.86-1.1,3.27-4.28,5.76-3.65-13.46,6.14-7.43,26.61.94.22-4.13,15.15,1.4,18.93,9.7,2.48,2.46.35-1.34,9.72-2.75,11.3.49-5.12,4.69-8.56,8.64-11.49,3.8-.35-1.03,6.99-.11,9.56,2.52,5.36,9.78-8.91,11.37-11.28,2.48-5.57,3.7-12.64,5.97-17.9-1.21,4.64-2.92,9.17-4.21,13.78-2.55,5.04-5.08,12.31-5.11,17.02.98-4.87,5.2-14.02,9.84-16.31,2.19,2.26-3.6,4.86-4.47,6.99-3.01,2.18-.79,7.36,1.43,9.19,5.64-.67,7.86-7.85,11.3-11.53"
        />
        <path
          className={styles.svgPath_08}
          // ref={pathRef}
          d="M201.26,22.24c1.3-.81,3.14-3.57.4-3.65-4.27,2.42-5.17,11.03-4.2,15.9.14.81-1.64,3.56-2.04,1.93,4.45-5.77,12.13-10.31,15.17-16.96"
        />
        <path
          className={styles.svgPath_09}
          // ref={pathRef}
          d="M192.07,3.13c.16,1.97.23,4.06-1.46,5.4"
        />
        <path
          className={styles.svgPath_10}
          // ref={pathRef}
          d="M231.17,1.81c-2.29,10.39-5.36,31.81-9.48,36.48"
        />
        <path
          className={styles.svgPath_11}
          // ref={pathRef}
          d="M244.89,2.54c-3.72,4.43-15.56,42.13-1.17,33.85"
        />
        <path
          className={styles.svgPath_12}
          // ref={pathRef}
          d="M224.17,25.01c-6.38-9.87,14.56-8.71,20.13-6.86"
        />
        <path
          className={styles.svgPath_13}
          // ref={pathRef}
          d="M251.31,17.57c-11.78,20.03.71,16.92,5.4-.15-3.09,4.07-4.83,22.36,4.45,11.03,5.13-8.16,7.66-17.85,10.78-26.89-.78,2.35-2.58,6.42-3.27,9.38-3.27,6.79-5.7,13.51-5.83,21.01.21-1.78,5.74-17.7,10.07-15.07-.92,7.59-3.33,10.88-8.53,16.67,3.86-2.43,13.14-6.85,16.12-13.06"
        />
      </svg>
      <Spinner color="current" variant="wave" className={styles.spinner} size="lg" />
    </div>
  );
};
export default FrankLoadingSignature;
