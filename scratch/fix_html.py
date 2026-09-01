import re

for filepath in ['games/04-cyber-slacker/index.html', 'games/03-dungeon-claw/index.html']:
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    c = c.replace('<script src=\"../../js/mock-ad-sdk.js\"></script>\\n</body>', '<script src=\"../../js/mock-ad-sdk.js\"></script>\\n</body>')
    # wait, the exact string is literally '\n</body>' because I escaped it in my powershell injection earlier.
    c = c.replace('<script src=\"../../js/mock-ad-sdk.js\"></script>\\\\n</body>', '<script src=\"../../js/mock-ad-sdk.js\"></script>\\n</body>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)
