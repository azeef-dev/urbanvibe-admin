export function formatPrice(value) {
    if (typeof value !== "number" || isNaN(value)) return "0";
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function parseDiscountNumber(discount) {
    if (!discount) return "";
    const match = String(discount).match(/(\d+(\.\d+)?)/);
    return match ? match[1] : "";
}

export function formatDiscount(value) {
    if (value === "" || value === null || value === undefined) return null;
    const num = Number(value);
    if (isNaN(num) || num <= 0) return null;
    return `-${num}%`;
}