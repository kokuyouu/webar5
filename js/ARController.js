import * as THREE from 'three';

export class ARController {
  constructor(renderer, scene, object, ui) {
    Object.assign(this, {renderer, object, ui});
    this.session = null;
    this.hitSource = null;
    this.marker = new THREE.Mesh(
      new THREE.RingGeometry(0.06, 0.09, 48).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({color: 0x83e3be, side: THREE.DoubleSide})
    );
    this.marker.matrixAutoUpdate = false;
    this.marker.visible = false;
    scene.add(this.marker);
    ui.launch.addEventListener('click', () => this.start());
    ui.exit.addEventListener('click', () => this.session?.end());
  }

  async start() {
    this.ui.launch.disabled = true;
    let session;
    try {
      if (!navigator.xr) throw new Error('WebXR недоступен. Откройте сайт по HTTPS в браузере с поддержкой AR.');
      session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['local-floor', 'dom-overlay'],
        domOverlay: {root: this.ui.root}
      });
      this.session = session;
      session.addEventListener('end', () => this.reset(), {once: true});
      this.renderer.xr.setReferenceSpaceType('local');
      await this.renderer.xr.setSession(session);
      const viewer = await session.requestReferenceSpace('viewer');
      const source = await session.requestHitTestSource({space: viewer});
      if (this.session !== session) { source.cancel(); return; }
      this.hitSource = source;
      this.object.anchor.visible = false;
      session.addEventListener('select', () => {
        if (!this.marker.visible) return;
        this.object.place(this.marker.matrix);
        this.ui.status('Объект размещён. Настройте его кнопками или нажмите на поверхность для перемещения.');
      });
      this.ui.setAR(true);
      this.ui.status('Наведите камеру на поверхность. Нажмите на экран, когда появится кольцо.');
    } catch (error) {
      if (session && this.session === session) await session.end().catch(() => {});
      this.ui.launch.disabled = false;
      this.ui.status(error.name === 'NotSupportedError'
        ? 'Устройство не поддерживает AR с hit-test. Предпросмотр доступен.'
        : error.name === 'NotAllowedError' ? 'Запуск AR отменён или разрешение не предоставлено.' : error.message);
    }
  }

  reset() {
    this.hitSource?.cancel();
    this.hitSource = null;
    this.session = null;
    this.marker.visible = false;
    this.object.preview();
    this.ui.setAR(false);
    this.ui.status('');
  }

  update(frame) {
    this.marker.visible = false;
    if (!frame || !this.hitSource) return;
    const hit = frame.getHitTestResults(this.hitSource)[0];
    const space = this.renderer.xr.getReferenceSpace();
    const pose = hit && space ? hit.getPose(space) : null;
    if (pose) {
      this.marker.matrix.fromArray(pose.transform.matrix);
      this.marker.visible = true;
    }
  }
}
