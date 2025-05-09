import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const SlideUpModal = ({
  children,
  modalOpen,
  onToggle,
}: {
  children: React.ReactNode;
  modalOpen: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent SSR crash

  return createPortal(
    <AnimatePresence>
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] isolate">
          <motion.div
            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
            animate={{ height: "auto", opacity: 1, overflow: "visible" }}
            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/50 flex isolate"
              id="overlay"
              onClick={() => onToggle(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute bottom-0 bg-white h-2/5 rounded-t-4xl w-full py-4"
              id="content"
            >
              <div
                className="mx-auto flex h-2 w-20 bg-gray-300 rounded-full mb-10 cursor-pointer"
                onClick={() => onToggle(false)}
              />
              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SlideUpModal;
