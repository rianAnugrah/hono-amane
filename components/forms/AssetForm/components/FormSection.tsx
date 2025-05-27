import { motion } from "framer-motion";
import { FormSectionProps } from '../types';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export const FormSection = ({ children, direction }: FormSectionProps) => {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        duration: 0.15,
        ease: "easeOut"
      }}
      className="space-y-6 absolute w-full py-6 px-1"
    >
      {children}
    </motion.div>
  );
};