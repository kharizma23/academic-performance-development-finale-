const fs = require('fs');
const path = require('path');

const compDir = 'c:\\Users\\kharizma\\Downloads\\StudentAcademicPlatform-main\\StudentAcademicPlatform-main\\client\\components\\admin';

const components = fs.readdirSync(compDir).filter(f => f.endsWith('.tsx'));

components.forEach(c => {
    const compPath = path.join(compDir, c);
    let content = fs.readFileSync(compPath, 'utf8');
    
    // 1. Light Theme Convergence: Replace bg-black, bg-indigo-950, bg-slate-900 with bg-white or bg-slate-50
    // And update text colors to be dark
    content = content.replace(/bg-black text-white/g, 'bg-white text-slate-900 border-4 border-slate-100 shadow-2xl');
    content = content.replace(/bg-indigo-950 text-white/g, 'bg-indigo-50 text-slate-900 border-4 border-white shadow-2xl');
    content = content.replace(/bg-slate-900 text-white/g, 'bg-slate-50 text-slate-900 border-4 border-slate-200');
    content = content.replace(/bg-\[#1F2937\] text-white/g, 'bg-white text-slate-900 border-4 border-slate-100');
    
    // Fix icons that were text-white in these cards
    // content = content.replace(/text-white/g, 'text-slate-900'); // Too aggressive, might break buttons
    
    // 2. High-Impact Typography: Increase font sizes again
    content = content.replace(/text-3xl font-black/g, 'text-5xl font-black');
    content = content.replace(/text-2xl font-black/g, 'text-4xl font-black');
    content = content.replace(/text-xl font-bold/g, 'text-3xl font-black');
    content = content.replace(/text-lg font-black/g, 'text-2xl font-black');
    content = content.replace(/text-base font-black/g, 'text-xl font-black');
    content = content.replace(/text-sm font-black/g, 'text-lg font-black');
    
    fs.writeFileSync(compPath, content, 'utf8');
    console.log(`Upgraded theme and typography in ${c}`);
});
