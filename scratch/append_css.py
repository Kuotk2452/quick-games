with open('games/06-mecha-arena/css/style.css', 'a', encoding='utf-8') as f:
    f.write('''
/* Virtual Joystick */
.virtual-joystick {
  display: none; /* hidden on desktop */
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  touch-action: none; /* prevent scrolling */
  z-index: 1000;
  pointer-events: auto;
}

.joystick-knob {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  background: rgba(245, 158, 11, 0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

@media (max-width: 768px) {
  .virtual-joystick {
    display: block; /* show on mobile */
  }
}
''')
