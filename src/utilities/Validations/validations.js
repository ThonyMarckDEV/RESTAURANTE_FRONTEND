/**
 * Valida que el input sea solo numérico.
 * Útil para: DNI, RUC, Teléfono, Código SUNAT.
 * @param {string} value - El valor del input
 * @returns {boolean} - True si es válido
 */
export const isNumeric = (value) => {
    return value === '' || /^[0-9]*$/.test(value);
};

/**
 * Valida que el input contenga solo letras, espacios y tildes.
 * Útil para: Nombres, Apellidos, Razón Social (a veces), Categorías.
 * @param {string} value - El valor del input
 * @returns {boolean} - True si es válido
 */
export const isTextOnly = (value) => {
    return value === '' || /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value);
};

/**
 * Valida formatos de correo electrónico (si lo necesitas a futuro).
 */
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};