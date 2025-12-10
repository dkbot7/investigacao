const fs = require('fs');
const path = require('path');

const investigareePath = path.join(__dirname, '../investigaree/src/app/dashboard');

const pagesToFix = [
  'comurgoverview',
  'comurgbeneficios',
  'comurgatividadepolitica',
  'comurganaliserisco',
  'comurglistasrestritivas',
  'comurgcpfsvalidos',
  'comurgrelatorios',
];

console.log('🔧 Fixing COMURG pages...\n');

pagesToFix.forEach((pageName) => {
  const pagePath = path.join(investigareePath, pageName, 'page.tsx');

  if (!fs.existsSync(pagePath)) {
    console.log(`⚠️  File not found: ${pagePath}`);
    return;
  }

  let content = fs.readFileSync(pagePath, 'utf8');

  // Fix 1: Remove GroupTabs imports
  content = content.replace(/import.*GroupTabs.*\n/g, '');
  content = content.replace(/import.*from "@\/components\/GroupTabs";\n/g, '');

  // Fix 2: Replace useData with useComurgData
  content = content.replace(/const.*= useData\(\);/g, '');
  content = content.replace(/useData/g, 'useComurgData');

  // Fix 3: Add dataLoading variable if missing
  if (content.includes('{ funcionarios, loading }') || content.includes('{ funcionarios, loading:')) {
    content = content.replace(
      /const \{ funcionarios, loading \} = useComurgData\(\);/g,
      'const { funcionarios, loading: dataLoading, error } = useComurgData();'
    );
  }

  // Fix 4: Replace { kpis, loading } with proper destructuring
  if (content.includes('{ kpis, loading }')) {
    content = content.replace(
      /const \{ kpis, loading \} = useKPIs\(\);/g,
      'const { kpis, loading: kpisLoading } = useKPIs();'
    );
    content = content.replace(
      /if \(authLoading \|\| dataLoading\)/g,
      'if (authLoading || dataLoading || kpisLoading)'
    );
  }

  // Fix 5: Remove activeTab and tabCounts if they exist
  content = content.replace(/const \[activeTab.*\n/g, '');
  content = content.replace(/const tabCounts = useMemo.*\n.*\n.*\n/g, '');
  content = content.replace(/\/\/ Calcular contadores para as abas.*\n/g, '');

  // Fix 6: Fix the broken loading state - find and replace the malformed div
  content = content.replace(
    /if \(authLoading \|\| [^\)]+\) \{\s+return \(\s+<div className=/g,
    'if (authLoading || dataLoading) {\n    return (\n      <div className='
  );

  // Fix 7: Remove Card imports
  content = content.replace(/import \{ Card \}.*\n/g, '');

  // Fix 8: Replace <Card with <div
  content = content.replace(/<Card/g, '<div');
  content = content.replace(/<\/Card>/g, '</div>');

  // Fix 9: Remove GroupTabs JSX usage
  content = content.replace(/<GroupTabs[^>]*\/>/g, '');

  // Fix 10: Fix any remaining motion.div issues - make sure there's a closing div
  const motionDivCount = (content.match(/<motion\.div/g) || []).length;
  const motionClosingCount = (content.match(/<\/motion\.div>/g) || []).length;

  if (motionDivCount > motionClosingCount) {
    // Add missing closing tags before the final </div>
    const lastDivIndex = content.lastIndexOf('</div>');
    const missing = motionDivCount - motionClosingCount;
    let closingTags = '';
    for (let i = 0; i < missing; i++) {
      closingTags += '      </motion.div>\n    ';
    }
    if (lastDivIndex > -1) {
      content = content.slice(0, lastDivIndex) + closingTags + content.slice(lastDivIndex);
    }
  }

  fs.writeFileSync(pagePath, content, 'utf8');
  console.log(`✅ Fixed: ${pageName}`);
});

console.log('\n✨ All pages fixed!');
