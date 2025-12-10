const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelDir = 'C:\\Users\\Vaio\\Documents\\TRABALHO\\INVESTIGA\\clientes\\CLIENTE_01\\documentos\\OFICIAL\\PLANILHAS OFICIAIS EXCEL';
const outputDir = path.join(__dirname, '../investigaree/public/data/comurg');

console.log('📊 Extraindo dados das planilhas Excel COMURG...\n');

// Criar diretório de saída se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Extrair Empregados na Comurg
const comurgFile = path.join(excelDir, 'Empregados na Comurg - CONSOLIDADO.xlsx');
if (fs.existsSync(comurgFile)) {
  console.log('📄 Processando: Empregados na Comurg');
  const workbook = XLSX.readFile(comurgFile);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Converter para JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  console.log(`  ✅ ${jsonData.length} registros encontrados`);

  // Salvar como JSON
  fs.writeFileSync(
    path.join(outputDir, 'empregados-comurg.json'),
    JSON.stringify(jsonData, null, 2),
    'utf8'
  );

  // Salvar como CSV
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  fs.writeFileSync(
    path.join(outputDir, 'empregados-comurg.csv'),
    csv,
    'utf8'
  );

  console.log(`  💾 Salvo: empregados-comurg.json e .csv\n`);
} else {
  console.log(`  ⚠️  Arquivo não encontrado: ${comurgFile}\n`);
}

// Extrair Empregados a Disposição (Cedidos)
const cedidosFile = path.join(excelDir, 'Empregados a Disposição - CONSOLIDADO.xlsx');
if (fs.existsSync(cedidosFile)) {
  console.log('📄 Processando: Empregados a Disposição (Cedidos)');
  const workbook = XLSX.readFile(cedidosFile);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Converter para JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  console.log(`  ✅ ${jsonData.length} registros encontrados`);

  // Salvar como JSON
  fs.writeFileSync(
    path.join(outputDir, 'empregados-cedidos.json'),
    JSON.stringify(jsonData, null, 2),
    'utf8'
  );

  // Salvar como CSV
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  fs.writeFileSync(
    path.join(outputDir, 'empregados-cedidos.csv'),
    csv,
    'utf8'
  );

  console.log(`  💾 Salvo: empregados-cedidos.json e .csv\n`);
} else {
  console.log(`  ⚠️  Arquivo não encontrado: ${cedidosFile}\n`);
}

// Combinar todos em um arquivo consolidado
const comurgData = fs.existsSync(path.join(outputDir, 'empregados-comurg.json'))
  ? JSON.parse(fs.readFileSync(path.join(outputDir, 'empregados-comurg.json'), 'utf8'))
  : [];

const cedidosData = fs.existsSync(path.join(outputDir, 'empregados-cedidos.json'))
  ? JSON.parse(fs.readFileSync(path.join(outputDir, 'empregados-cedidos.json'), 'utf8'))
  : [];

// Adicionar flag de grupo
const comurgComGrupo = comurgData.map(emp => ({ ...emp, grupo: 'COMURG' }));
const cedidosComGrupo = cedidosData.map(emp => ({ ...emp, grupo: 'CEDIDO' }));

const todosEmpregados = [...comurgComGrupo, ...cedidosComGrupo];

fs.writeFileSync(
  path.join(outputDir, 'empregados-todos.json'),
  JSON.stringify(todosEmpregados, null, 2),
  'utf8'
);

console.log(`📊 Arquivo consolidado criado: empregados-todos.json`);
console.log(`   Total: ${todosEmpregados.length} funcionários`);
console.log(`   COMURG: ${comurgComGrupo.length}`);
console.log(`   CEDIDOS: ${cedidosComGrupo.length}`);

console.log('\n✨ Extração concluída com sucesso!');
