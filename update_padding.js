import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src/components');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // We want to replace standard top/bottom padding classes with the new desktop/mobile combo.
      // E.g. py-20, py-24, py-16 on main sections.
      // But we shouldn't replace button py-2 or py-4.
      
      content = content.replace(/\bpy-24\b/g, 'py-[64px] md:py-[120px]');
      content = content.replace(/\bpy-20\b/g, 'py-[64px] md:py-[120px]');
      content = content.replace(/\bpt-20\b/g, 'pt-[64px] md:pt-[120px]');
      content = content.replace(/\bpb-10\b/g, 'pb-[64px] md:pb-[120px]');
      content = content.replace(/\bpt-32\b/g, 'pt-[80px] md:pt-[140px]'); // catalogue page top padding
      content = content.replace(/\bpb-24\b/g, 'pb-[64px] md:pb-[120px]');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated padding in: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Padding replacement complete.');
