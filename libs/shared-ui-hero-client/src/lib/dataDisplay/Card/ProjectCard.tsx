import { FrankCard } from '@frankjhub/shared-ui-hero-ssr';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

const coverVariants: Variants = {
  rest: {},
  hover: {},
};

const overlayVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 0.5 },
};

const titleBoxVariants: Variants = {
  rest: { y: 24, opacity: 0 },
  hover: { y: 0, opacity: 1 },
};
export interface ProjectCardProps {
  image: {
    width: number;
    height: number;
    alt: string;
    src: string;
  };
  title: string;
  subTitle: string;
  onPress?: () => void;
}
export const ProjectCard = ({ image, title, subTitle, onPress }: ProjectCardProps) => {
  return (
    <motion.div initial="rest" animate="rest" whileHover="hover" variants={coverVariants}>
      <FrankCard
        cardCover={
          <div className="h-full relative overflow-hidden">
            <Image
              height={image.height}
              width={image.width}
              alt={image.alt}
              src={image.src}
              className="h-full w-full object-cover"
            />
            {/* overlay */}
            <motion.div
              className="absolute bg-black inset-0 pointer-events-none z-10"
              variants={overlayVariants}
              transition={{ duration: 0.25 }}
            />
            {/* title & sub-title */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 text-white z-20 text-start"
              variants={titleBoxVariants}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-xl font-bold mb-1">{title}</h3>
              <p className="mb-4">{subTitle}</p>
            </motion.div>
          </div>
        }
        cardWidth={300}
        cardHeight={339}
        isPressable={true}
        shadow="none"
        onPress={onPress}
      />
    </motion.div>
  );
};
