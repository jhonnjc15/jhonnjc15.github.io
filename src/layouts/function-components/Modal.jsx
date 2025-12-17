import React, { useEffect, useRef } from 'react'

const Modal = ({ modal_content_data, modalStateForm, setModalStateForm, confirmStateForm, setConfirmStateForm, onConfirm, fullScreen = false}) => {
    const anchorRef = useRef(null)

    useEffect(() => {
        if (!modalStateForm) return;

        const handleClickOutsideDropdown = (e) => {
            if (anchorRef.current && !anchorRef.current.contains(e.target)) {
                setModalStateForm(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideDropdown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideDropdown);
        };
    }, [modalStateForm, setModalStateForm]);

    // Escuchar tecla Escape
    useEffect(() => {
        if (!modalStateForm) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setModalStateForm(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Limpieza del evento al desmontar o cerrar modal
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [modalStateForm, setModalStateForm]);

    if (!modalStateForm) return null;

    const containerClasses = fullScreen
        ? "fixed inset-0 z-[120] flex min-h-screen w-screen items-center justify-center bg-black/70 px-4 py-8"
        : "fixed inset-0 z-50 flex min-h-full items-center justify-center bg-gray-500/75 px-4 py-8";

    const dialogClasses = fullScreen
        ? "relative w-full max-w-2xl sm:max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl"
        : "relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8";

    return (
        <div className={containerClasses} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className={dialogClasses} ref={anchorRef}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">{modal_content_data.email_confirmation}</h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">{modal_content_data.question}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button 
                        type="button" 
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-paqariYellow bg-paqariYellow px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-paqariYellowHover focus:outline-none focus:ring-2 focus:ring-paqariYellow focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => {
                            setModalStateForm(false);
                            onConfirm(); // Aquí se hace el envío
                        }}
                    >
                        {modal_content_data.send}
                    </button>
                    <button 
                        type="button" 
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={()=>setModalStateForm(false)}
                    >
                        {modal_content_data.cancel}
                    </button>
                   
                </div>
            </div>
        </div>
  )
}

export default Modal
