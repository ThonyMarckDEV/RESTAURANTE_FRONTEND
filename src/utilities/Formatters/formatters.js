/**
 * Formatea un número a moneda Peruana (PEN)
 * @param {number|string} amount - El monto a formatear
 * @returns {string} - Ej: "S/ 1,250.50"
 */
export const formatMoney = (amount) => {
    if (amount === null || amount === undefined) return 'S/ 0.00';
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
    }).format(amount);
};

/**
 * Formatea una fecha ISO a formato legible local
 * @param {string} dateString - Fecha ISO (ej: 2026-01-27T10:00:00)
 * @returns {string} - Ej: "27/01/2026 10:00 AM"
 */
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
};