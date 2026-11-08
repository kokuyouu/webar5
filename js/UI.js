export class UI {
  constructor(object) {
    this.root = document.querySelector('#overlay');
    this.launch = document.querySelector('#launch');
    this.exit = document.querySelector('#exit');
    this.panel = document.querySelector('#panel');
    this.panel.addEventListener('beforexrselect', event => event.preventDefault());
    document.querySelector('#model').addEventListener('change', event => object.setModel(event.target.value));
    document.querySelector('#color').addEventListener('input', event => object.setColor(event.target.value));
    document.querySelector('#left').addEventListener('click', () => object.rotate(-Math.PI / 12));
    document.querySelector('#right').addEventListener('click', () => object.rotate(Math.PI / 12));
    document.querySelector('#spin').addEventListener('click', event => {
      object.spinning = !object.spinning;
      event.currentTarget.setAttribute('aria-pressed', String(object.spinning));
    });
    for (const key of ['roughness', 'metalness']) {
      document.getElementById(key).addEventListener('input', event => {
        object.material[key] = Number(event.target.value);
      });
    }
  }

  status(text) { document.querySelector('#status').textContent = text; }

  setAR(active) {
    document.body.classList.toggle('in-ar', active);
    this.launch.hidden = active;
    this.exit.hidden = !active;
    this.launch.disabled = false;
  }
}
