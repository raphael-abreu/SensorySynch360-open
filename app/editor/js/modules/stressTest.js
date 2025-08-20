import { randomIntFromInterval } from "./common.js";
export function runStressTest(createInfospot,qtd = 1) {
  const a = performance.now();
  for (let i = 0; i < qtd; i++) {
    const x = randomIntFromInterval(-3000, 3000);
    const y = randomIntFromInterval(-3000, 3000);
    const z = randomIntFromInterval(-3000, 3000);
    createInfospot({
      pano: panorama,
      location: new THREE.Vector3(x, y, z),
    });
  }
  const b = performance.now();
  const duration = b - a;
  return duration;
}
function test50() {
  let res;
  let avg = 0;
  let min = 99999999;
  let max = 0;
  for (let i = 0; i < 10; i++) {
    res = runStressTest(50);
    console.log(res);
    if (res < min) min = res;
    if (res > max) max = res;
    avg += res;
    panorama.dispose();
  }
  avg /= 10;
  console.log(`dur:${avg},min:${min},max:${max}`);
}

export function test100() {
  let res;
  let avg = 0;
  let min = 99999999;
  let max = 0;
  for (let i = 0; i < 10; i++) {
    res = runStressTest(100);
    console.log(res);
    if (res < min) min = res;
    if (res > max) max = res;
    avg += res;
    panorama.dispose();
  }
  avg /= 10;
  console.log(`dur:${avg},min:${min},max:${max}`);
}
export function test250() {
  let res;
  let avg = 0;
  let min = 99999999;
  let max = 0;
  for (let i = 0; i < 10; i++) {
    res = runStressTest(250);
    console.log(res);
    if (res < min) min = res;
    if (res > max) max = res;
    avg += res;
    panorama.dispose();
  }
  avg /= 10;
  console.log(`dur:${avg},min:${min},max:${max}`);
}
export function test500() {
  let res;
  let avg = 0;
  let min = 99999999;
  let max = 0;
  for (let i = 0; i < 10; i++) {
    res = runStressTest(500);
    console.log(res);
    if (res < min) min = res;
    if (res > max) max = res;
    avg += res;
    panorama.dispose();
  }
  avg /= 10;
  console.log(`dur:${avg},min:${min},max:${max}`);
}

