// thisi is a method for RSA encryption and decryption from book
// Computes (base^exponent) % modulus efficiently using binary exponentiation
function modPow(base, exponent, modulus) {
  base = BigInt(base);
  exponent = BigInt(exponent);
  modulus = BigInt(modulus);
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }
  return result;
}

// Converts a letter (A-Z) to a 2-digit string
// A = 00, B = 01, ..., Z = 25
function letterToNumber(char) {
  const code = char.charCodeAt(0) - 65;
  return code < 10 ? "0" + code : "" + code;
}

// Converts a 2-digit string back to a letter
function numberToLetter(twoDigitStr) {
  const code = parseInt(twoDigitStr);
  return String.fromCharCode(code + 65);
}

// Encrypts a message using RSA public key (n, e)
// Returns an object containing digit string, message blocks, and encrypted blocks
function encryptRSA(message, n, e) {
  message = message.toUpperCase();
  let digitStr = "";

  // Convert message letters to digits
  for (let char of message) {
    if (char >= "A" && char <= "Z") {
      digitStr += letterToNumber(char);
    }
  }

  const blockSize = 4; // Two letters = 4 digits per block
  const blocks = [];

  // Pad with 'X' if necessary
  while (digitStr.length % blockSize !== 0) {
    digitStr += letterToNumber("X");
  }

  // Split into blocks
  for (let i = 0; i < digitStr.length; i += blockSize) {
    const block = digitStr.slice(i, i + blockSize);
    blocks.push(BigInt(block));
  }

  // Encrypt each block with RSA formula: c = m^e mod n
  const encryptedBlocks = blocks.map((m) => modPow(m, BigInt(e), BigInt(n)));

  return {
    digitStr,
    blocks,
    encryptedBlocks,
  };
}

// Decrypts encrypted cipher blocks using private key (d, n)
function decryptRSA(cipherBlocks, d, n) {
  // Decrypt each block: m = c^d mod n
  const decryptedNumbers = cipherBlocks.map((c) =>
    modPow(BigInt(c), BigInt(d), BigInt(n))
  );

  // Convert back to digit string
  let digitStr = decryptedNumbers
    .map((m) => m.toString().padStart(4, "0"))
    .join("");

  // Convert digits back to letters
  let message = "";
  for (let i = 0; i < digitStr.length; i += 2) {
    message += numberToLetter(digitStr.slice(i, i + 2));
  }

  return message;
}

// Triggered when "Encrypt" button is clicked
function runRSA() {
  //const n = 3233;
  //const e = 467;
  const nInput = document.getElementById("rsa-encrypt-key-n-book").value.trim(); // modolus is n a result from p* q
  const eInput = document.getElementById("rsa-encrypt-key-e-book").value.trim(); // d is private exponent d
  const message = document.getElementById("messageInputBookVersion").value;
  const result = encryptRSA(message, nInput, eInput);

  // Display results in the page
  //document.getElementById("digitStr").textContent = result.digitStr;
  //document.getElementById("blocks").textContent = result.blocks
  //.map((b) => b.toString().padStart(4, "0"))
  // .join(" ");
  document.getElementById("rsa-encrypt-result-book").textContent =
    result.encryptedBlocks.map((c) => c.toString().padStart(4, "0")).join(" ");
}

// Triggered when "Decrypt" button is clicked
function runDecrypt() {
  const nInput = document.getElementById("rsa-decrypt-key-n-book").value.trim(); // modolus is n a result from p* q
  const dInput = document.getElementById("rsa-decrypt-key-d-book").value.trim(); // d is private exponent d
  const input = document.getElementById("rsa-decrypt-input-book").value.trim();
  if (!input) return;
  const encrypted = input.split(/\s+/).map((str) => BigInt(str));
  const decryptedMessage = decryptRSA(encrypted, dInput, nInput);
  document.getElementById("rsa-decrypt-result-book").textContent =
    decryptedMessage;
}
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("rsa-encrypt-btn-book")
    .addEventListener("click", runRSA);
    document
    .getElementById("rsa-decrypt-btn-book")
    .addEventListener("click", runDecrypt);
});