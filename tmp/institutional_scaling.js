const fs = require('fs');
const path = require('path');

const adminDir = 'c:\\Users\\kharizma\\Downloads\\StudentAcademicPlatform-main\\StudentAcademicPlatform-main\\client\\app\\admin';
const compDir = 'c:\\Users\\kharizma\\Downloads\\StudentAcademicPlatform-main\\StudentAcademicPlatform-main\\client\\components\\admin';

// 1. Full Screen Expansion: Update all page.tsx in admin subdirectories
const subdirs = fs.readdirSync(adminDir).filter(f => fs.statSync(path.join(adminDir, f)).isDirectory());

subdirs.forEach(d => {
    const pagePath = path.join(adminDir, d, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        // Replace max-w-7xl mx-auto with w-full
        content = content.replace(/max-w-7xl mx-auto/g, 'w-full');
        // If it's a centered container, make it px-4 or similar
        fs.writeFileSync(pagePath, content, 'utf8');
        console.log(`Expanded ${d}/page.tsx to Full Screen`);
    }
});

// 2. Tiny Text Purge: Update all components in components/admin
const components = fs.readdirSync(compDir).filter(f => f.endsWith('.tsx'));

components.forEach(c => {
    const compPath = path.join(compDir, c);
    let content = fs.readFileSync(compPath, 'utf8');
    
    // Replace text-[8px], text-[9px], text-[10px], text-[11px] with text-sm or text-base
    // We'll be tactical: 8px -> text-xs (12px), 9/10/11px -> text-sm (14px)
    content = content.replace(/text-\[8px\]/g, 'text-xs font-black');
    content = content.replace(/text-\[9px\]/g, 'text-sm font-black');
    content = content.replace(/text-\[10px\]/g, 'text-sm font-black');
    content = content.replace(/text-\[11px\]/g, 'text-base font-black');
    
    // Also check for tracking-[0.5em] or similar in these components just in case
    content = content.replace(/tracking-\[0\.5em\]/g, 'tracking-normal');
    content = content.replace(/tracking-\[0\.4em\]/g, 'tracking-tight');
    content = content.replace(/tracking-\[0\.3em\]/g, 'tracking-tight');
    
    fs.writeFileSync(compPath, content, 'utf8');
    console.log(`Purged tiny text in ${c}`);
});
