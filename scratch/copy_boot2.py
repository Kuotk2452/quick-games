import os

src = 'games/03-dungeon-claw/js/arcade_boot.js'
dst = 'games/05-cosmic-orbit/js/arcade_boot.js'

with open(src, 'rb') as f:
    c = f.read().decode('utf-8')

c = c.replace('INITIALIZING CLAW MECHANISM...', 'INITIALIZING GRAV-DRIVE...')
c = c.replace('./audio.js?v=8.3', './audio.js?v=1.1')
c = c.replace('soundEngine', 'cosmicAudio')
c = c.replace('playCoinDrop', 'playTelemetryBeeps')
c = c.replace('playPowerUp', 'playAirlockSwoosh')

with open(dst, 'wb') as f:
    f.write(c.encode('utf-8'))
