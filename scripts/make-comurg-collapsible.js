const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../investigaree/src/app/dashboard/layout.tsx');

console.log('📝 Making COMURG section collapsible...');

let content = fs.readFileSync(filePath, 'utf8');

// 1. Add ChevronDown import
content = content.replace(
  'import {\n  LayoutDashboard,\n  Users,\n  BarChart3,',
  'import {\n  LayoutDashboard,\n  Users,\n  BarChart3,\n  ChevronDown,'
);

// 2. Add state for collapsible section
content = content.replace(
  'const [sidebarOpen, setSidebarOpen] = useState(false);\n  const [userMenuOpen, setUserMenuOpen] = useState(false);',
  'const [sidebarOpen, setSidebarOpen] = useState(false);\n  const [userMenuOpen, setUserMenuOpen] = useState(false);\n  const [comurgSectionOpen, setComurgSectionOpen] = useState(true);'
);

// 3. Replace desktop COMURG section with collapsible version
const desktopOldSection = `          {/* Itens COMURG (apenas para tenant COMURG) */}
          {userInfo?.tenant?.code === 'COMURG' && (
            <>
              <div className="my-2 border-t border-slate-300 dark:border-navy-700" />
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-slate-500 dark:text-navy-500 uppercase tracking-wider">COMURG</p>
              </div>
              {comurgNavItems.map((item) => {`;

const desktopNewSection = `          {/* Itens COMURG (apenas para tenant COMURG) */}
          {userInfo?.tenant?.code === 'COMURG' && (
            <>
              <div className="my-2 border-t border-slate-300 dark:border-navy-700" />
              <button
                onClick={() => setComurgSectionOpen(!comurgSectionOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-slate-500 dark:text-navy-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
              >
                <p className="text-xs font-semibold uppercase tracking-wider">COMURG</p>
                <ChevronDown className={\`w-4 h-4 transition-transform \${comurgSectionOpen ? 'rotate-180' : ''}\`} />
              </button>
              {comurgSectionOpen && comurgNavItems.map((item) => {`;

content = content.replace(desktopOldSection, desktopNewSection);

// Also need to close the conditional properly for desktop
content = content.replace(
  '              {comurgNavItems.map((item) => {\n                const Icon = item.icon;\n                const isActive = isActiveRoute(item.href);\n                return (',
  '              {comurgNavItems.map((item) => {\n                const Icon = item.icon;\n                const isActive = isActiveRoute(item.href);\n                return ('
);

// Need to add closing brace for comurgSectionOpen
const desktopClosePattern = `                );
              })}
            </>
          )}

          {/* Admin (apenas para admins) */}`;

const desktopCloseReplacement = `                );
              })}
            </>
          )}

          {/* Admin (apenas para admins) */}`;

content = content.replace(desktopClosePattern, desktopCloseReplacement);

// 4. Replace mobile COMURG section with collapsible version
const mobileOldSection = `                {/* Itens COMURG (apenas para tenant COMURG) */}
                {userInfo?.tenant?.code === 'COMURG' && (
                  <>
                    <div className="my-2 border-t border-slate-300 dark:border-navy-700" />
                    <div className="px-2 py-1.5">
                      <p className="text-xs font-semibold text-slate-500 dark:text-navy-500 uppercase tracking-wider">COMURG</p>
                    </div>
                    {comurgNavItems.map((item) => {`;

const mobileNewSection = `                {/* Itens COMURG (apenas para tenant COMURG) */}
                {userInfo?.tenant?.code === 'COMURG' && (
                  <>
                    <div className="my-2 border-t border-slate-300 dark:border-navy-700" />
                    <button
                      onClick={() => setComurgSectionOpen(!comurgSectionOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 text-slate-500 dark:text-navy-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider">COMURG</p>
                      <ChevronDown className={\`w-4 h-4 transition-transform \${comurgSectionOpen ? 'rotate-180' : ''}\`} />
                    </button>
                    {comurgSectionOpen && comurgNavItems.map((item) => {`;

content = content.replace(mobileOldSection, mobileNewSection);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ COMURG section is now collapsible!');
