const fs = require('fs');
const path = require('path');

const compDirs = [
    'c:\\Users\\kharizma\\Downloads\\StudentAcademicPlatform-main\\StudentAcademicPlatform-main\\client\\components\\admin',
    'c:\\Users\\kharizma\\Downloads\\StudentAcademicPlatform-main\\StudentAcademicPlatform-main\\client\\components\\admin\\faculty'
];

compDirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
    files.forEach(f => {
        const p = path.join(dir, f);
        let content = fs.readFileSync(p, 'utf8');
        
        // Final Typography Force: Everything must be massive
        // Map common small classes to huge classes
        content = content.replace(/text-xs/g, 'text-xl font-black');
        content = content.replace(/text-sm/g, 'text-2xl font-black');
        content = content.replace(/text-base/g, 'text-3xl font-black');
        content = content.replace(/text-lg/g, 'text-3xl font-black');
        content = content.replace(/text-xl/g, 'text-4xl font-black');
        
        // Remove italics again just in case
        content = content.replace(/italic/g, '');
        
        // Ensure bold
        content = content.replace(/font-bold/g, 'font-black');
        content = content.replace(/font-semibold/g, 'font-black');
        
        // Restore icons (Recharts/Lucide) that shouldn't be scaled by text classes if possible
        // Actually text-xx on a parent affects child and can be overridden.
        
        fs.writeFileSync(p, content, 'utf8');
        console.log(`Mega-Scaled ${f}`);
    });
});
