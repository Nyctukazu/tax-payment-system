export function generateCompliantPassword() {
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Removed confusing 'I' and 'O'
    const lowercase = "abcdefghijkmnopqrstuvwxyz"; // Removed confusing 'l'
    const numbers = "23456789";                   // Removed confusing '0' and '1'
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // 1. Enforce minimum conditions immediately 
    let passwordChars = [];
    passwordChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]); // 1 Capital
    passwordChars.push(numbers[Math.floor(Math.random() * numbers.length)]);     // 1st Number
    passwordChars.push(numbers[Math.floor(Math.random() * numbers.length)]);     // 2nd Number
    passwordChars.push(symbols[Math.floor(Math.random() * symbols.length)]);     // 1st Symbol
    passwordChars.push(symbols[Math.floor(Math.random() * symbols.length)]);     // 2nd Symbol
    passwordChars.push(symbols[Math.floor(Math.random() * symbols.length)]);     // 3rd Symbol

    // 2. Pad out the remaining 6 slots with all sets to hit the 12 character minimum length
    const allAllowed = uppercase + lowercase + numbers + symbols;
    while (passwordChars.length < 12) {
        passwordChars.push(allAllowed[Math.floor(Math.random() * allAllowed.length)]);
    }

    // 3. Durstenfeld/Fisher-Yates Shuffle array algorithm so elements don't follow an obvious order
    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    return passwordChars.join("");
}
