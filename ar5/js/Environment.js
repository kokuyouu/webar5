import * as THREE from 'three';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

export class Environment {
  constructor(renderer, scene) {
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(renderer);
    this.target = generator.fromScene(room, 0.04);
    scene.environment = this.target.texture;
    scene.environmentIntensity = 1.2;
    room.dispose();
    generator.dispose();
  }
}
