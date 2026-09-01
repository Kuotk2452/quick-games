import re

with open('games/08-circus-3d/js/stage3d.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix initial camera setup
old_cam_setup = '''    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 200);
    this.camera.position.set(-6.5, 4.5, 6.0);
    this.camera.lookAt(2.5, 1.2, 0);'''

new_cam_setup = '''    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 200);
    this.camera.position.set(-6.5, 4.5, 6.0);
    this.camera.lookAt(2.5, 1.2, 0);
    this.updateCameraFov();'''

c = c.replace(old_cam_setup, new_cam_setup)

# Fix resize logic and add updateCameraFov
old_resize = '''  handleResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }'''

new_resize = '''  updateCameraFov() {
    const aspect = this.width / this.height;
    const targetAspect = 1.2;
    if (aspect < targetAspect) {
      // Zoom out on portrait screens to prevent cropping
      this.camera.fov = 45 * (targetAspect / aspect) * 0.85;
      // Clamp fov to avoid extreme distortion
      if (this.camera.fov > 100) this.camera.fov = 100;
    } else {
      this.camera.fov = 45;
    }
    this.camera.updateProjectionMatrix();
  }

  handleResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.updateCameraFov();
    this.renderer.setSize(this.width, this.height);
  }'''

c = c.replace(old_resize, new_resize)

with open('games/08-circus-3d/js/stage3d.js', 'w', encoding='utf-8') as f:
    f.write(c)
