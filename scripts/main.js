document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("#3d-container");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    window.addEventListener("resize", () => {
        const { offsetWidth, offsetHeight } = container;
        camera.aspect = offsetWidth / offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(offsetWidth, offsetHeight);
    });

    animate();
});
