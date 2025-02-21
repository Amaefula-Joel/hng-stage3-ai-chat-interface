import { useState } from "react";

// import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function LoadingAlert ({ message }) {

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         onClose();
    //     }, 5000);
    //     return () => clearTimeout(timer);
    // }, [onClose]);

    return (
        <AnimatePresence>
        {message && (
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-100 text-black px-4 py-2 rounded-lg shadow-lg"
            >
                {message}
            </motion.div>
        )}

        </AnimatePresence>
    );

}

export default LoadingAlert;

