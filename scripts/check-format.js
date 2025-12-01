const AdmZip = require('adm-zip');
const path = require('path');

const zipPath = path.join(__dirname, '..', 'bases_dados', 'cnpj_receita_federal', 'Socios0.zip');
const zip = new AdmZip(zipPath);
const entry = zip.getEntries()[0];

console.log('Arquivo:', entry.entryName);
console.log('Tamanho comprimido:', entry.header.compressedSize);
console.log('Tamanho descomprimido:', entry.header.size);

// Extrai para temp
const tempDir = path.join(__dirname, '..', 'bases_dados', 'cnpj_receita_federal');
zip.extractEntryTo(entry, tempDir, false, true);

const fs = require('fs');
const readline = require('readline');

const filePath = path.join(tempDir, entry.entryName);
const rl = readline.createInterface({
  input: fs.createReadStream(filePath, { encoding: 'latin1' }),
  crlfDelay: Infinity
});

let count = 0;
rl.on('line', (line) => {
  if (count < 10) {
    console.log(`\nLinha ${count + 1}:`);
    console.log(line.substring(0, 300));
    console.log('Tamanho:', line.length);

    // Check for semicolons (CSV) or fixed width
    if (line.includes(';')) {
      console.log('Campos (;):', line.split(';').length);
    }
  }
  count++;
});

rl.on('close', () => {
  console.log('\n\nTotal de linhas:', count);
  fs.unlinkSync(filePath);
});
