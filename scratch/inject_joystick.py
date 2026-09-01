import re

with open('games/06-mecha-arena/js/game.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Add this.joystickX/Y to constructor
c = c.replace('this.isMouseDown = false;', 'this.isMouseDown = false;\n    this.joystickX = 0;\n    this.joystickY = 0;')

# Fix canvas multi-touch aiming (use targetTouches)
c = c.replace('e.touches[0].clientX', 'e.targetTouches[0].clientX')
c = c.replace('e.touches[0].clientY', 'e.targetTouches[0].clientY')

# Inject virtual joystick events
joystick_code = '''
    // Virtual Joystick logic
    const joystick = document.getElementById('virtualJoystick');
    const joystickKnob = document.getElementById('joystickKnob');
    if (joystick && joystickKnob) {
      let isDraggingJoystick = false;
      let jRect;
      let jCenterX;
      let jCenterY;

      const onJoystickStart = (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        isDraggingJoystick = true;
        jRect = joystick.getBoundingClientRect();
        jCenterX = jRect.left + jRect.width / 2;
        jCenterY = jRect.top + jRect.height / 2;
        updateJoystick(e);
      };

      const updateJoystick = (e) => {
        if (!isDraggingJoystick) return;
        e.preventDefault();
        e.stopPropagation();
        const clientX = e.touches ? e.targetTouches[0].clientX : e.clientX;
        const clientY = e.touches ? e.targetTouches[0].clientY : e.clientY;
        
        let dx = clientX - jCenterX;
        let dy = clientY - jCenterY;
        const maxDist = jRect.width / 2;
        const dist = Math.hypot(dx, dy);

        if (dist > maxDist) {
          dx = (dx / dist) * maxDist;
          dy = (dy / dist) * maxDist;
        }

        joystickKnob.style.transform = 	ranslate(calc(-50% + \px), calc(-50% + \px));
        
        this.joystickX = dx / maxDist;
        this.joystickY = dy / maxDist;
      };

      const onJoystickEnd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDraggingJoystick = false;
        this.joystickX = 0;
        this.joystickY = 0;
        joystickKnob.style.transform = 	ranslate(-50%, -50%);
      };

      joystick.addEventListener('touchstart', onJoystickStart, { passive: false });
      joystick.addEventListener('touchmove', updateJoystick, { passive: false });
      joystick.addEventListener('touchend', onJoystickEnd, { passive: false });
      joystick.addEventListener('touchcancel', onJoystickEnd, { passive: false });
    }
'''

if 'virtualJoystick' not in c:
    c = c.replace('window.addEventListener(\'touchend\', () => { this.isMouseDown = false; });\n    }', 'window.addEventListener(\'touchend\', () => { this.isMouseDown = false; });\n    }\n' + joystick_code)

# Add joystick movement into the update loop (where moveX/moveY are calculated)
# We find: if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
update_replacement = '''
    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
    
    // Add virtual joystick
    if (Math.abs(this.joystickX) > 0.1) moveX += this.joystickX;
    if (Math.abs(this.joystickY) > 0.1) moveY += this.joystickY;
    
    // Clamp magnitude so diagonal + joystick doesn't go crazy
    const moveMag = Math.hypot(moveX, moveY);
    if (moveMag > 1) {
      moveX /= moveMag;
      moveY /= moveMag;
    }
'''

# Replace the movement block
old_move_block = '''    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;'''

if '// Add virtual joystick' not in c:
    c = c.replace(old_move_block, update_replacement.strip('\n'))

with open('games/06-mecha-arena/js/game.js', 'w', encoding='utf-8') as f:
    f.write(c)

