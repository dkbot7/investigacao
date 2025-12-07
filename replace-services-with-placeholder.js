const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'investigaree', 'src', 'app', 'servicos', 'page.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Template for placeholder service
const placeholderService = `  {
    id: "servico-placeholder",
    nome: "Serviço em Preparação",
    descricao: "Detalhes deste serviço serão adicionados em breve. Entre em contato para mais informações.",
    icon: Shield,
    caracteristicas: ["Conteúdo em preparação"],
    formato: "Sob consulta"
  }`;

// Find and replace each service array
const serviceArrays = [
  'SERVICOS_FAMILIARES',
  'SERVICOS_EMPRESARIAIS',
  'SERVICOS_POLITICOS',
  'SERVICOS_DIVORCIOS',
  'SERVICOS_INVESTIMENTOS'
];

serviceArrays.forEach(arrayName => {
  // Match the entire array from const to ];
  const regex = new RegExp(`(const ${arrayName}: Servico\\[\\] = \\[)[\\s\\S]*?(\\];)`, 'g');

  content = content.replace(regex, `$1\n${placeholderService}\n$2`);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ All service arrays replaced with placeholder');
