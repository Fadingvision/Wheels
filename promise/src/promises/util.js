export default function isThenable(obj) {
    return obj !== null && (typeof obj === 'function' || typeof obj === 'object');
}