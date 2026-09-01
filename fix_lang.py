import os

for i in range(1, 10):
    folders = [f for f in os.listdir('games') if f.startswith(f'{i:02d}-')]
    if folders:
        p = f'games/{folders[0]}/js/i18n.js'
        if os.path.exists(p):
            with open(p, 'r', encoding='utf-8') as f:
                c = f.read()
            c = c.replace("|| this.detectUserLanguage()", "|| 'en'")
            c = c.replace("|| 'zh'", "|| 'en'")
            c = c.replace('|| "zh"', "|| 'en'")
            with open(p, 'w', encoding='utf-8') as f:
                f.write(c)
            print('Fixed', p)
