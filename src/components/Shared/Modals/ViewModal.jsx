import React, { useEffect, useState } from 'react';
import { XMarkIcon, ArrowDownTrayIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { exportElementToPdf } from 'utilities/Export/exportToPdf';
import { exportTableToExcel } from 'utilities/Export/exportToExcel';

const ViewModal = ({ isOpen, onClose, title, children, isLoading = false }) => {
    const [isExporting, setIsExporting] = useState(false);
    
    // ID único para el contenido
    const contentId = `modal-content-${title ? title.replace(/\s+/g, '-') : 'view'}`;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Lógica PDF
    const handleExportPdf = async () => {
        setIsExporting(true);
        await exportElementToPdf(contentId, `Reporte-${title || 'Detalle'}.pdf`);
        setIsExporting(false);
    };

    // 2. Lógica Excel
    const handleExportExcel = () => {
        // No necesitamos async/await aquí porque xlsx es síncrono, pero por consistencia:
        exportTableToExcel(contentId, `Reporte-${title || 'Detalle'}.xlsx`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden transform transition-all">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div id={contentId} className="p-6 max-h-[80vh] overflow-y-auto bg-white">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500">Cargando detalles...</p>
                        </div>
                    ) : (
                        children
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    
                    {/* ZONA DE EXPORTACIÓN */}
                    <div className="flex gap-2">
                        {!isLoading && (
                            <>
                                {/* Botón PDF (Rojo) */}
                                <button
                                    onClick={handleExportPdf}
                                    disabled={isExporting}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                                    title="Descargar como imagen PDF"
                                >
                                    {isExporting ? '...' : <ArrowDownTrayIcon className="w-4 h-4" />}
                                    PDF
                                </button>

                                {/* 3. Botón Excel (Verde) */}
                                <button
                                    onClick={handleExportExcel}
                                    disabled={isExporting}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
                                    title="Descargar tabla en Excel"
                                >
                                    <TableCellsIcon className="w-4 h-4" />
                                    Excel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewModal;