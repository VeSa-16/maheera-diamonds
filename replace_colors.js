import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

// Map old classes/colors to new semantic names
const replacements = [
  // Typography updates (handled by theme mapping, but some explicit cases exist)
  // Colors - old tailwind
  { regex: /\bgold-500\b/g, replace: 'antique-gold' },
  { regex: /\bgold-400\b/g, replace: 'antique-gold' },
  { regex: /\bgold-300\b/g, replace: 'champagne' },
  { regex: /\bgold-200\b/g, replace: 'champagne' },
  { regex: /\bgold-100\b/g, replace: 'blush-rose' },
  { regex: /\bgold-50\b/g, replace: 'blush-rose' },
  { regex: /\bgold-600\b/g, replace: 'antique-gold' },
  { regex: /\balabaster\b/g, replace: 'warm-ivory' },
  { regex: /\bluxury-charcoal\b/g, replace: 'obsidian' },
  { regex: /\bsoft-rose\b/g, replace: 'blush-rose' },
  
  // Hex replacements to utility classes where applicable, but in template strings or text they might need special handling.
  // We'll replace the hex codes inside class strings (e.g. bg-[#1B1B1B]) with the new named classes
  { regex: /bg-\[#1B1B1B\]/gi, replace: 'bg-obsidian' },
  { regex: /bg-\[#121212\]/gi, replace: 'bg-obsidian' },
  { regex: /text-\[#1B1B1B\]/gi, replace: 'text-obsidian' },
  { regex: /text-\[#121212\]/gi, replace: 'text-obsidian' },
  
  { regex: /bg-\[#F8F5F1\]/gi, replace: 'bg-warm-ivory' },
  { regex: /bg-\[#F4F1ED\]/gi, replace: 'bg-warm-ivory' },
  { regex: /text-\[#F8F5F1\]/gi, replace: 'text-warm-ivory' },
  
  { regex: /bg-\[#C5A059\]/gi, replace: 'bg-antique-gold' },
  { regex: /text-\[#C5A059\]/gi, replace: 'text-antique-gold' },
  { regex: /bg-\[#C8A96B\]/gi, replace: 'bg-antique-gold' },
  
  { regex: /text-zinc-400/gi, replace: 'text-slate-charcoal' },
  { regex: /bg-zinc-100/gi, replace: 'bg-platinum' },
  { regex: /text-gray-500/gi, replace: 'text-slate-charcoal' },
  { regex: /text-stone-400/gi, replace: 'text-slate-charcoal' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Color replacement complete.');
