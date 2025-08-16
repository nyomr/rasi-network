// generate-data.js
const fs = require("fs");

// Daftar nama depan & belakang Indonesia
const firstNames = ["Budi", "Andi", "Dewi", "Siti", "Agus", "Rina", "Hendra", "Fitri", "Yudi", "Citra", "Fajar", "Ratna", "Dian", "Rudi"];
const lastNames = ["Santoso", "Pratama", "Wijaya", "Saputra", "Putra", "Lestari", "Maulana", "Sari", "Susanto", "Ramadhan"];

// Kata umum untuk nama perusahaan
const companyWords = ["Makmur", "Sejahtera", "Sentosa", "Bersama", "Mandiri", "Jaya", "Abadi", "Cemerlang", "Berkah", "Gemilang"];

// Fungsi buat nama owner random
function getRandomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

// Fungsi buat nama perusahaan fiktif A–Z
function getRandomCompany() {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  const word1 = companyWords[Math.floor(Math.random() * companyWords.length)];
  const word2 = companyWords[Math.floor(Math.random() * companyWords.length)];
  return `PT ${word1} ${word2}`;
}

// Generate data
const total = 800; // jumlah data yang ingin dibuat
const data = [];

for (let i = 0; i < total; i++) {
  data.push({
    owner: getRandomName(),
    company: getRandomCompany(),
  });
}

// Simpan ke data.json
fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf-8");

console.log(`✅ Berhasil generate ${total} data di data.json`);
