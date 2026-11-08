import * as THREE from 'three';

export class SceneObject {
  constructor(scene) {
    this.anchor = new THREE.Group();
    this.pivot = new THREE.Group();
    this.anchor.add(this.pivot);
    scene.add(this.anchor);
    this.material = new THREE.MeshStandardMaterial({color: 0xe85d3a, roughness: 0.35, metalness: 0.45});
    this.spinning = false;
    this.setModel('cube');
  }

  setModel(type) {
    const factories = {
      cube: () => new THREE.BoxGeometry(0.18, 0.18, 0.18),
      sphere: () => new THREE.SphereGeometry(0.11, 48, 32),
      torus: () => new THREE.TorusGeometry(0.085, 0.03, 24, 64)
    };
    if (!factories[type]) return;
    if (this.mesh) {
      this.pivot.remove(this.mesh);
      this.mesh.geometry.dispose();
    }
    const geometry = factories[type]();
    geometry.computeBoundingBox();
    geometry.translate(0, -geometry.boundingBox.min.y, 0);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.pivot.add(this.mesh);
    this.type = type;
  }

  rotate(angle) { this.pivot.rotation.y += angle; }
  setColor(color) { this.material.color.set(color); }
  update(delta) { if (this.spinning) this.rotate(delta * 0.7); }

  place(matrix) {
    matrix.decompose(this.anchor.position, this.anchor.quaternion, this.anchor.scale);
    this.anchor.visible = true;
  }

  preview() {
    this.anchor.position.set(0, 0, 0);
    this.anchor.quaternion.identity();
    this.anchor.scale.setScalar(1);
    this.anchor.visible = true;
  }
}
