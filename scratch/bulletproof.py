import os

def bulletproof_game_js():
    file_path = "games/09-orbit-odyssey/js/game.js"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Safeguard disposeObject
    old_cleanup_1 = "this.planets.forEach(p => this.space.disposeObject(p.mesh));"
    new_cleanup_1 = "this.planets.forEach(p => { if (this.space.disposeObject) this.space.disposeObject(p.mesh); else this.space.scene.remove(p.mesh); });"
    content = content.replace(old_cleanup_1, new_cleanup_1)

    old_cleanup_2 = "this.asteroids.forEach(a => this.space.disposeObject(a.mesh));"
    new_cleanup_2 = "this.asteroids.forEach(a => { if (this.space.disposeObject) this.space.disposeObject(a.mesh); else this.space.scene.remove(a.mesh); });"
    content = content.replace(old_cleanup_2, new_cleanup_2)

    old_cleanup_3 = "this.blackholes.forEach(b => this.space.disposeObject(b.group));"
    new_cleanup_3 = "this.blackholes.forEach(b => { if (this.space.disposeObject) this.space.disposeObject(b.group); else this.space.scene.remove(b.group); });"
    content = content.replace(old_cleanup_3, new_cleanup_3)

    old_cleanup_4 = "if (p.y < thresholdY) { this.space.disposeObject(p.mesh); return false; }"
    new_cleanup_4 = "if (p.y < thresholdY) { if (this.space.disposeObject) this.space.disposeObject(p.mesh); else this.space.scene.remove(p.mesh); return false; }"
    content = content.replace(old_cleanup_4, new_cleanup_4)

    old_cleanup_5 = "if (a.y < thresholdY) { this.space.disposeObject(a.mesh); return false; }"
    new_cleanup_5 = "if (a.y < thresholdY) { if (this.space.disposeObject) this.space.disposeObject(a.mesh); else this.space.scene.remove(a.mesh); return false; }"
    content = content.replace(old_cleanup_5, new_cleanup_5)

    old_cleanup_6 = "if (b.y < thresholdY) { this.space.disposeObject(b.group); return false; }"
    new_cleanup_6 = "if (b.y < thresholdY) { if (this.space.disposeObject) this.space.disposeObject(b.group); else this.space.scene.remove(b.group); return false; }"
    content = content.replace(old_cleanup_6, new_cleanup_6)

    # 2. Add an explicit visual alert to triggerAdBoost so user knows it's the new version
    old_trigger = """  triggerAdBoost() {
    if (window.QuickGamesAdSDK) {"""
    new_trigger = """  triggerAdBoost() {
    console.log("Triggered Ad Boost! (v3.0)");
    if (window.QuickGamesAdSDK) {"""
    content = content.replace(old_trigger, new_trigger)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    bulletproof_game_js()
