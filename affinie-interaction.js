function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return -1;
}

function affineEncrypt(text, a, b) {
    return text.toUpperCase().split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            const p = code - 65;
            const c = (a * p + b) % 26;
            return String.fromCharCode(c + 65);
        }
        return char;
    }).join('');
}

function affineDecrypt(text, a, b) {
    const a_inv = modInverse(a, 26);
    if (a_inv === -1) return "Invalid 'a' (no modular inverse)";
    return text.toUpperCase().split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            const c = code - 65;
            const p = (a_inv * (c - b + 26)) % 26;
            return String.fromCharCode(p + 65);
        }
        return char;
    }).join('');
}

document.getElementById('affine-encrypt-btn').addEventListener('click', () => {
    const text = document.getElementById('affine-input').value;
    const a = parseInt(document.getElementById('affine-a').value);
    const b = parseInt(document.getElementById('affine-b').value);
    const result = affineEncrypt(text, a, b);
    document.getElementById('affine-result').textContent = result;
});

document.getElementById('affine-decrypt-btn').addEventListener('click', () => {
    const text = document.getElementById('affine-input').value;
    const a = parseInt(document.getElementById('affine-a').value);
    const b = parseInt(document.getElementById('affine-b').value);
    const result = affineDecrypt(text, a, b);
    document.getElementById('affine-result').textContent = result;
});
