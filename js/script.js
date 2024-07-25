// Importing the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

if (window.matchMedia("(min-width: 600px)").matches) {
    Shery.mouseFollower({
        skew: true,
        ease: "cubic-bezier(0.23, 1, 0.320, 1)",
        duration: .5,
    });

    Shery.makeMagnet("#menuButton, .nav-panel ul li", {
        ease: "cubic-bezier(0.23, 1, 0.320, 1)",
        duration: 1,
    });
}

function mainLoader() {
    document.addEventListener("DOMContentLoaded", function () {
        const overlayLoader = document.getElementById('overlay-loader');
        const content = document.getElementById('main-div');

        function showLoader() {
            overlayLoader.style.opacity = '1';
            content.style.opacity = '0';
            document.body.style.overflow = 'hidden';
        }

        function hideLoader() {
            content.style.opacity = '1';
            document.body.style.overflow = 'visible';
            overlayLoader.style.transform = 'translateY(-100%)';
        }

        async function fetchData() {
            showLoader();
            try {
                await new Promise(resolve => setTimeout(resolve, 5000));
                console.log('Data fetched');
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                hideLoader();
            }
        }

        fetchData();
    });

    document.addEventListener("DOMContentLoaded", () => {
        const fillLine = document.querySelector(".fill-line");
        const counter = document.querySelector(".counter");

        let progress = 0;
        const duration = 4000;
        const intervalTime = duration / 100;

        const interval = setInterval(() => {
            progress++;
            fillLine.style.width = `${progress}%`;
            counter.textContent = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, intervalTime);
    });
}
mainLoader();

function models() {
    let scene, camera, renderer, controls;
    let mouseX, mouseY, object;
    let intervalId;

    function initScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            30,
            window.innerWidth / window.innerHeight,
            1,
            2000
        );
        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth * 2, window.innerHeight * 2);
        document.getElementById("container3D").appendChild(renderer.domElement);
    }

    function loadModel(
        modelName,
        position,
        animation,
        rotationCfg,
        cameraPosZ,
        lightCfg,
        initialMouse
    ) {
        clearScene();
        mouseX = initialMouse.x;
        mouseY = initialMouse.y;

        const loader = new GLTFLoader();
        loader.load(
            `models/${modelName}/scene.gltf`,
            function (gltf) {
                object = gltf.scene;
                object.position.set(position.x, position.y, position.z);
                scene.add(object);

                // Animate model on load
                gsap.from(object.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1,
                    ease: "back.out(2)",
                });

                gsap.to(object.position, animation);
            },
        );

        camera.position.z = cameraPosZ;

        const topLight = new THREE.DirectionalLight(
            lightCfg.color,
            lightCfg.intensity
        );
        topLight.position.set(
            lightCfg.position.x,
            lightCfg.position.y,
            lightCfg.position.z
        );
        topLight.castShadow = true;
        scene.add(topLight);

        const ambientLight = new THREE.AmbientLight(0x222222, 4);
        scene.add(ambientLight);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enableRotate = false;

        animate(rotationCfg);

        // Animate and change content div
        const contentEarbuds = document.querySelector(".bud-content");
        const contentSpeaker = document.querySelector(".speaker-content");
        const contentHeadphones = document.querySelector(".headphone-content");

        gsap.to([contentEarbuds, contentSpeaker, contentHeadphones], {
            x: -10,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                contentEarbuds.style.display = "none";
                contentSpeaker.style.display = "none";
                contentHeadphones.style.display = "none";

                let contentDiv;
                switch (modelName) {
                    case "Earbuds":
                        contentDiv = contentEarbuds;
                        break;
                    case "Speaker":
                        contentDiv = contentSpeaker;
                        break;
                    case "Headphone":
                        contentDiv = contentHeadphones;
                        break;
                }
                contentDiv.style.display = "block";
                gsap.to(contentDiv, {
                    x: 40,
                    opacity: 1,
                    duration: 0.5
                });
            }
        });
    }

    function clearScene() {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
        object = null;
    }

    function animate(rotationCfg) {
        requestAnimationFrame(() => animate(rotationCfg));

        if (object) {
            object.rotation.y =
                rotationCfg.yBase + (mouseX / window.innerWidth) * rotationCfg.yFactor;
            object.rotation.x =
                rotationCfg.xBase + (mouseY * rotationCfg.xFactor) / window.innerHeight;
        }
        renderer.render(scene, camera);
    }

    document.getElementById("models").onmousemove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
        let functionCounter = 1;
        function switchModel() {
            clearInterval(intervalId);
            switch (functionCounter) {
                case 1:
                    loadModel(
                        "Speaker",
                        { x: 0, y: -1.2, z: 0 },
                        {
                            y: -0.8,
                            duration: 1.5,
                            ease: "power1.inOut",
                            repeat: -1,
                            yoyo: true,
                        },
                        { yBase: -.4, yFactor: .8, xBase: -.4, xFactor: 0.6 },
                        15,
                        { color: 0xbbbbbbb, intensity: 5, position: { x: -5, y: -5, z: 5 } },
                        { x: window.innerWidth / 5, y: window.innerHeight / 1 }
                    );
                    break;
                case 2:
                    loadModel(
                        "Headphone",
                        { x: 0, y: -10, z: 0 },
                        {
                            y: -8,
                            duration: 1.5,
                            ease: "power1.inOut",
                            repeat: -1,
                            yoyo: true,
                        },
                        { yBase: 2.8, yFactor: 1, xBase: -.05, xFactor: .8 },
                        90,
                        { color: 0xbbbbbbb, intensity: 5, position: { x: 5, y: 5, z: 5 } },
                        { x: window.innerWidth / 10, y: window.innerHeight / 5 }
                    );
                    break;
                case 3:
                    loadModel(
                        "Earbuds",
                        { x: 0, y: -0.8, z: 0 },
                        {
                            y: -0.2,
                            duration: 1.5,
                            ease: "power1.inOut",
                            repeat: -1,
                            yoyo: true,
                        },
                        { yBase: 2.7, yFactor: .8, xBase: -.6, xFactor: .8 },
                        22,
                        { color: 0xbbbbbbb, intensity: 1, position: { x: 5, y: 5, z: 5 } },
                        { x: window.innerWidth / 15, y: window.innerHeight / 1 }
                    );
                    break;
                default:
                    functionCounter = 0;
                    break;
            }
            functionCounter++;
            if (functionCounter > 3) functionCounter = 1;
            intervalId = setInterval(switchModel, 8000);
            resetLoaderAnimation();
        }

        function resetLoaderAnimation() {
            const loader = document.querySelector("#Timeloader circle");
            loader.style.transition = "none";
            loader.style.strokeDashoffset = loader.style.strokeDasharray;
            setTimeout(() => {
                loader.style.transition = "stroke-dashoffset 8s linear";
                loader.style.strokeDashoffset = "0";
            }, 50);
        }

        document.querySelector(".home-page").addEventListener("click", switchModel);

        initScene();
        loadModel(
            "Earbuds",
            { x: 0, y: -0.8, z: 0 },
            { y: -0.2, duration: 1.5, ease: "power1.inOut", repeat: -1, yoyo: true },
            { yBase: 2.7, yFactor: .8, xBase: -.6, xFactor: .8 },
            22,
            { color: 0xbbbbbbb, intensity: 1, position: { x: 5, y: 5, z: 5 } },
            { x: window.innerWidth / 15, y: window.innerHeight / 1 }
        );

        intervalId = setInterval(switchModel, 8000);
        resetLoaderAnimation();
    }
    else {
        let functionCounter = 1;
        function switchModel() {
            clearInterval(intervalId);
            switch (functionCounter) {
                case 1:
                    loadModel(
                        "Speaker",
                        { x: -1, y: -1.2, z: 0 },
                        {
                            y: -0.8,
                            duration: 1.5,
                            ease: "power1.inOut",
                            repeat: -1,
                            yoyo: true,
                        },
                        { yBase: -.4, yFactor: .8, xBase: -.4, xFactor: 0.6 },
                        8,
                        { color: 0xbbbbbbb, intensity: 5, position: { x: -5, y: -5, z: 5 } },
                        { x: window.innerWidth / 5, y: window.innerHeight / 1 }
                    );
                    break;
                case 2:
                    loadModel(
                        "Headphone",
                        { x: -5, y: -10, z: 0 },
                        {
                            y: -8,
                            duration: 1.5,
                            ease: "power1.inOut",
                            repeat: -1,
                            yoyo: true,
                        },
                        { yBase: 2.8, yFactor: 1, xBase: -.05, xFactor: .8 },
                        48,
                        { color: 0xbbbbbbb, intensity: 5, position: { x: 5, y: 5, z: 5 } },
                        { x: window.innerWidth / 10, y: window.innerHeight / 5 }
                    );
                    break;
                case 3:
                    loadModel(
                        "Earbuds",
                        { x: -1, y: -0.8, z: 0 },
                        {
                            y: -0.2,
                            duration: 1.5,
                            ease: "power1.inOut",
                            repeat: -1,
                            yoyo: true,
                        },
                        { yBase: 2.7, yFactor: .8, xBase: -.6, xFactor: .8 },
                        10,
                        { color: 0xbbbbbbb, intensity: 1, position: { x: 5, y: 5, z: 5 } },
                        { x: window.innerWidth / 15, y: window.innerHeight / 1 }
                    );
                    break;
                default:
                    functionCounter = 0;
                    break;
            }
            functionCounter++;
            if (functionCounter > 3) functionCounter = 1;
            intervalId = setInterval(switchModel, 8000);
            resetLoaderAnimation();
        }

        function resetLoaderAnimation() {
            const loader = document.querySelector("#Timeloader circle");
            loader.style.transition = "none";
            loader.style.strokeDashoffset = loader.style.strokeDasharray;
            setTimeout(() => {
                loader.style.transition = "stroke-dashoffset 8s linear";
                loader.style.strokeDashoffset = "0";
            }, 50);
        }

        document.querySelector(".home-page").addEventListener("click", switchModel);

        initScene();
        loadModel(
            "Earbuds",
            { x: -1, y: -0.8, z: 0 },
            { y: -0.2, duration: 1.5, ease: "power1.inOut", repeat: -1, yoyo: true },
            { yBase: 2.7, yFactor: .8, xBase: -.6, xFactor: .8 },
            10,
            { color: 0xbbbbbbb, intensity: 1, position: { x: 5, y: 5, z: 5 } },
            { x: window.innerWidth / 15, y: window.innerHeight / 1 }
        );

        intervalId = setInterval(switchModel, 8000);
        resetLoaderAnimation();
    }

}
models();

function mainPage() {
    function earbuds() {
        let nextButton = document.getElementById('next');
        let prevButton = document.getElementById('prev');
        let earbuds = document.querySelector('.earbuds');
        let listHTML = document.querySelector('.earbuds .earbuds-list');
        let seeMoreButtons = document.querySelectorAll('.earbuds-seeMore');
        let backButton = document.getElementById('back');
        let main = document.querySelector('.main');

        nextButton.onclick = function () {
            showSlider('next');
        }
        prevButton.onclick = function () {
            showSlider('prev');
        }
        let unAcceppClick;
        const showSlider = (type) => {
            nextButton.style.pointerEvents = 'none';
            prevButton.style.pointerEvents = 'none';

            earbuds.classList.remove('next', 'prev');
            let items = document.querySelectorAll('.earbuds .earbuds-list .earbuds-item');
            if (type === 'next') {
                listHTML.appendChild(items[0]);
                earbuds.classList.add('next');
            } else {
                listHTML.prepend(items[items.length - 1]);
                earbuds.classList.add('prev');
            }
            clearTimeout(unAcceppClick);
            unAcceppClick = setTimeout(() => {
                nextButton.style.pointerEvents = 'auto';
                prevButton.style.pointerEvents = 'auto';
            }, 2000)
        }
        seeMoreButtons.forEach((button) => {
            button.onclick = function () {
                earbuds.classList.remove('next', 'prev');
                earbuds.classList.add('showDetail',);
            }
        });
        backButton.onclick = function () {
            earbuds.classList.remove('showDetail');
        }
    }
    earbuds()

    function headphone() {
        let nextButton = document.getElementById('next-headphone');
        let prevButton = document.getElementById('prev-headphone');
        let headphone = document.querySelector('.headphone');
        let listHTML = document.querySelector('.headphone .headphone-list');
        let seeMoreButtons = document.querySelectorAll('.headphone-seeMore');
        let backButton = document.getElementById('back-headphone');

        nextButton.onclick = function () {
            showSlider('next');
        }
        prevButton.onclick = function () {
            showSlider('prev');
        }
        let unAcceppClick;
        const showSlider = (type) => {
            nextButton.style.pointerEvents = 'none';
            prevButton.style.pointerEvents = 'none';

            headphone.classList.remove('next-headphone', 'prev-headphone');
            let items = document.querySelectorAll('.headphone .headphone-list .headphone-item');
            if (type === 'next') {
                listHTML.appendChild(items[0]);
                headphone.classList.add('next-headphone');
            } else {
                listHTML.prepend(items[items.length - 1]);
                headphone.classList.add('prev-headphone');
            }
            clearTimeout(unAcceppClick);
            unAcceppClick = setTimeout(() => {
                nextButton.style.pointerEvents = 'auto';
                prevButton.style.pointerEvents = 'auto';
            }, 2000)
        }
        seeMoreButtons.forEach((button) => {
            button.onclick = function () {
                headphone.classList.remove('next-headphone', 'prev-headphone');
                headphone.classList.add('showDetail');
            }
        });
        backButton.onclick = function () {
            headphone.classList.remove('showDetail');
        }

    }
    headphone()

    function watches() {
        let nextButton = document.getElementById('next-watch');
        let prevButton = document.getElementById('prev-watch');
        let watches = document.querySelector('.watches');
        let listHTML = document.querySelector('.watches .watches-list');
        let seeMoreButtons = document.querySelectorAll('.watches-seeMore');
        let backButton = document.getElementById('back-watch');

        nextButton.onclick = function () {
            showSlider('next');
        }
        prevButton.onclick = function () {
            showSlider('prev');
        }
        let unAcceppClick;
        const showSlider = (type) => {
            nextButton.style.pointerEvents = 'none';
            prevButton.style.pointerEvents = 'none';

            watches.classList.remove('next-watch', 'prev-watch');
            let items = document.querySelectorAll('.watches .watches-list .watches-item');
            if (type === 'next') {
                listHTML.appendChild(items[0]);
                watches.classList.add('next-watch');
            } else {
                listHTML.prepend(items[items.length - 1]);
                watches.classList.add('prev-watch');
            }
            clearTimeout(unAcceppClick);
            unAcceppClick = setTimeout(() => {
                nextButton.style.pointerEvents = 'auto';
                prevButton.style.pointerEvents = 'auto';
            }, 2000)
        }
        seeMoreButtons.forEach((button) => {
            button.onclick = function () {
                watches.classList.remove('next-watch', 'prev-watch');
                watches.classList.add('showDetail');
            }
        });
        backButton.onclick = function () {
            watches.classList.remove('showDetail');
        }

    }
    watches()

    function speaker() {
        let nextButton = document.getElementById('next-speaker');
        let prevButton = document.getElementById('prev-speaker');
        let speaker = document.querySelector('.speaker');
        let listHTML = document.querySelector('.speaker .speaker-list');
        let seeMoreButtons = document.querySelectorAll('.speaker-seeMore');
        let backButton = document.getElementById('back-speaker');

        nextButton.onclick = function () {
            showSlider('next');
        }
        prevButton.onclick = function () {
            showSlider('prev');
        }
        let unAcceppClick;
        const showSlider = (type) => {
            nextButton.style.pointerEvents = 'none';
            prevButton.style.pointerEvents = 'none';

            speaker.classList.remove('next-speaker', 'prev-speaker');
            let items = document.querySelectorAll('.speaker .speaker-list .speaker-item');
            if (type === 'next') {
                listHTML.appendChild(items[0]);
                speaker.classList.add('next-speaker');
            } else {
                listHTML.prepend(items[items.length - 1]);
                speaker.classList.add('prev-speaker');
            }
            clearTimeout(unAcceppClick);
            unAcceppClick = setTimeout(() => {
                nextButton.style.pointerEvents = 'auto';
                prevButton.style.pointerEvents = 'auto';
            }, 2000)
        }
        seeMoreButtons.forEach((button) => {
            button.onclick = function () {
                speaker.classList.remove('next-speaker', 'prev-speaker');
                speaker.classList.add('showDetail');
            }
        });
        backButton.onclick = function () {
            speaker.classList.remove('showDetail');
        }

    }
    speaker()

    gsap.to(".bgball", {
        // duration: 3,
        scrollTrigger: {
            trigger: ".bgball",
            start: "top 30%",
            end: "top -1575%",
            pin: true,
            scrub: true,
        },
    });

    gsap.to(".main .swipe", {
        transform: 'translateX(-300vw)',
        scrollTrigger: {
            trigger: '.main',
            scroller: 'body',
            start: 'top 0%',
            end: 'top -1500%',
            pin: true,
            scrub: true,
            ease: 'power1.in',
        }
    });
}
mainPage();

function secondPgae() {
    function productSwiper() {
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                dynamicBullets: true
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });

        document.addEventListener('DOMContentLoaded', () => {
            let countdownElement = document.getElementById('countdown');
            let loaderContainer = document.getElementById('loader-container');
            let content = document.getElementById('content');
            let countdown = 5;

            let interval = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;

                if (countdown <= 0) {
                    clearInterval(interval);
                    loaderContainer.style.transform = 'translateY(-100%)';
                    setTimeout(() => {
                        loaderContainer.style.display = 'none';
                        content.style.display = 'block';
                        document.body.style.overflow = 'auto'; // Allow scrolling after loading
                    }, 1000); // Match this duration with the CSS transition duration
                }
            }, 1000);
        });
    }
    productSwiper();
}
secondPgae();

function menubtn() {
    document.addEventListener("DOMContentLoaded", function () {
        const menuButton = document.getElementById('menuButton');
        const navPanel = document.getElementById('navPanel');

        menuButton.addEventListener('click', function () {
            menuButton.classList.toggle('change');
            navPanel.classList.toggle('open');
        });
    });
}
menubtn();