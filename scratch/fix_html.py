import re
with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'<span data-i18n="langs">EN / ZH / ES / JA</span>ES / JA.*?3D WebGL</span>', '<span data-i18n="langs">EN / ZH / ES / JA</span> &middot; 3D WebGL</span>', c)
c = re.sub(r'<span style="font-size: 12px; color: #94a3b8;"><span data-i18n="langs">EN / ZH / ES / JA</span>ES / JA', '<span style="font-size: 12px; color: #94a3b8;"><span data-i18n="langs">EN / ZH / ES / JA</span>', c)
# Let's just restore from git and do the replace perfectly this time.
