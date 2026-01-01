import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ children, onClose }) => {
    return ReactDOM.createPortal(
        <>
            {/* Overlay */}
            <button
                className="fixed inset-0 opacity-55 z-40"
                onClick={onClose}
            ></button>

            {/* Modal Wrapper (Scrollable if content overflows) */}
            <div className="fixed inset-0 flex justify-center items-center z-50 overflow-auto">
                {/* Modal Content */}
                <div className="relative text-white max-h-[98vh]">
                    {children}
                </div>
            </div>
        </>,
        document.body
    );
};

export default Modal;