const fs = require('fs');
const path = require('path');

function walk(dir, done) {
    let results = [];
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach((file) => {
            file = path.resolve(dir, file);
            fs.stat(file, (err, stat) => {
                if (stat && stat.isDirectory()) {
                    walk(file, (err, res) => {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

walk('c:\\Users\\kharizma\\Downloads\\StudentAcademicPlatform-main\\StudentAcademicPlatform-main\\client', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        if (file.endsWith('.tsx')) {
            const content = fs.readFileSync(file, 'utf8');
            // Remove 'italic'
            // Remove 'tracking-tighter' and 'tracking-tight' for "LETTERS OTAMA"
            const newContent = content
                .replace(/\bitalic\b/g, '')
                .replace(/\btracking-tighter\b/g, '')
                .replace(/\btracking-tight\b/g, '');
                
            if (content !== newContent) {
                fs.writeFileSync(file, newContent, 'utf8');
                console.log('Cleaned (font/tracking):', file);
            }
        }
    });
});
