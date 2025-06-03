import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const sampleText =
  'With over 15 years in comprehensive family practice, Dr. Thompson partners with patients across the lifespan to deliver preventive care, chronic disease management, and health education. Known for her compassionate approach and deep commitment to patient-centered care, she builds lasting relationships based on trust, respect, and open communication. Dr. Thompson holds a Doctor of Medicine degree from the University of Toronto and completed her residency in Family Medicine at Sunnybrook Health Sciences Centre. She is a strong advocate for proactive health management and takes a holistic view of wellness, integrating physical, emotional, and social factors into her practice.';

export type ReadMoreTextProps = {
  className?: string;
  text?: string;
  maxLines?: 1 | 2 | 3 | 4 | 5 | 6 | 'none';
};
export function ReadMoreText({ className, text = sampleText, maxLines = 2 }: ReadMoreTextProps) {
  const [expanded, setExpanded] = useState(false);
  const clampClass = `line-clamp-${maxLines}`;
  return (
    <div className={className}>
      {/* text content */}
      {/* <div
                className={`transition-all duration-300 ${expanded ? 'line-clamp-none' : `line-clamp-${maxLines}`
                    }`}
            >
                {text}
            </div> */}
      <motion.div
        layout
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={clsx('overflow-hidden text-[15px] leading-[24px]', {
          [clampClass]: !expanded,
        })}
      >
        {text}
      </motion.div>
      {/* show more button */}
      <div
        className="cursor-pointer leading-inherit text-inherit flex items-center gap-1"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Show Less' : 'Show More'}
        <IoIosArrowDown
          size={16}
          className={clsx('transition-all duration-300', {
            'rotate-180': expanded,
          })}
        />
      </div>
    </div>
  );
}
export default ReadMoreText;
