const cleanRut = (rut) => {
    return typeof rut === 'string' ? rut.replace(/[^0-9kK]/g, '') : '';
};

const formatRut = (rut) => {
    let value = cleanRut(rut);
    let result = value.slice(-1);
    let rutDigits = value.slice(0, -1);
    
    while (rutDigits.length > 3) {
        result = '.' + rutDigits.slice(-3) + result;
        rutDigits = rutDigits.slice(0, -3);
    }
    
    if (rutDigits.length > 0) {
        result = rutDigits + (result.startsWith('.') ? result : '.' + result);
    }
    
    // Agregar guión antes del dígito verificador
    result = result.slice(0, -1) + '-' + result.slice(-1);
    
    return result.replace(/[kK]$/, 'K').replace(/^\./, '');
};

const validateRut = (rut) => {
    if (typeof rut !== 'string') return false;
    
    // Limpiar el RUT de puntos y guión
    let rutClean = cleanRut(rut);
    
    if (rutClean.length < 2) return false;
    
    // Obtener dígito verificador
    let dv = rutClean.slice(-1).toUpperCase();
    let rutNumber = parseInt(rutClean.slice(0, -1), 10);
    
    if (isNaN(rutNumber)) return false;
    
    // Calcular dígito verificador
    let M = 0, S = 1;
    let rutTemp = rutNumber;
    while (rutTemp) {
        S = (S + rutTemp % 10 * (9 - M++ % 6)) % 11;
        rutTemp = Math.floor(rutTemp / 10);
    }
    
    const calculatedDV = S ? S === 1 ? 'K' : String(11 - S) : '0';
    
    return calculatedDV === dv;
};

module.exports = {
    cleanRut,
    formatRut,
    validateRut
};