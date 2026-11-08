import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { Environment } from './Environment.js';
import { UI } from './UI.js';
import { ARController } from './ARController.js';

export class App {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.02, 30);
    this.camera.position.set(0.4, 0.34, 0.6);
    this.camera.lookAt(0, 0.09, 0);
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.xr.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.prepend(this.renderer.domElement);
    this.environment = new Environment(this.renderer, this.scene);
    this.object = new SceneObject(this.scene);
    this.ui = new UI(this.object);
    this.ar = new ARController(this.renderer, this.scene, this.object, this.ui);
    this.lastTime = null;
    window.addEventListener('resize', () => this.resize());
    this.renderer.xr.addEventListener('sessionend', () => {
      this.camera.position.set(0.4, 0.34, 0.6);
      this.camera.lookAt(0, 0.09, 0);
      this.resize();
    });
    this.resize();
    this.renderer.setAnimationLoop((time, frame) => {
      const delta = this.lastTime === null ? 0 : Math.min((time - this.lastTime) / 1000, 0.05);
      this.lastTime = time;
      this.object.update(delta);
      this.ar.update(frame);
      this.renderer.render(this.scene, this.camera);
    });
  }

  resize() {
    if (this.renderer.xr.isPresenting) return;
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.camera.setViewOffset(innerWidth, innerHeight, 0, innerHeight < 580 ? 0 : innerHeight * 0.12, innerWidth, innerHeight);
    this.renderer.setSize(innerWidth, innerHeight);
  }
}
