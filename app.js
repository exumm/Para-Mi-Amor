const intro = document.getElementById("intro");
const container = document.getElementById("countdown-container");
const countdown = document.getElementById("countdown");
const timerText = document.getElementById("timerText");
const tracks = document.querySelectorAll(".track");
const questionScreen = document.getElementById("questionScreen");
const scrollArrow = document.getElementById("scrollArrow");

const targetDate = new Date("February 14, 2026 22:00:00").getTime();

// INTRO -> HABILITAR SCROLL AL TERMINAR
setTimeout(() => {
    intro.style.display = "none";
    container.style.display = "flex";
    document.body.style.overflowY = "auto"; // Habilita la barra solo después de la intro
}, 10000);

function getUnlockStartDate() {
    const now = new Date();
    const start = new Date();
    start.setHours(22,0,0,0);
    if(now < start) start.setDate(start.getDate() - 1);
    return start.getTime();
}
const unlockStart = getUnlockStartDate();

function updateLogic() {
    const now = Date.now();
    const diff = targetDate - now;

    if(diff <= 0) {
        countdown.innerHTML = "💖 ES HOY 💖";
    } else {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor(diff / 3600000 % 24);
        const m = Math.floor(diff / 60000 % 60);
        const s = Math.floor(diff / 1000 % 60);
        countdown.innerHTML = `${d}D ${h}H ${m}M ${s}S`;
    }

    // CAMBIA EL 1 POR 10 PARA PRUEBA INMEDIATA
    const daysPassed = Math.floor((now - unlockStart) / 86400000) + 1;

    tracks.forEach(track => {
        const day = parseInt(track.dataset.day);
        if(daysPassed >= day) track.classList.remove("locked");
        else track.classList.add("locked");
    });
        // Temporizador próxima canción
    const nextLocked = Array.from(tracks).find(track => track.classList.contains("locked"));
    if(nextLocked){
        const day = parseInt(nextLocked.dataset.day);
        const unlockTime = unlockStart + day * 86400000;
        const remaining = unlockTime - now;
        const hours = Math.floor((remaining % (1000*60*60*24)) / (1000*60*60));
        const minutes = Math.floor((remaining % (1000*60*60)) / (1000*60));
        const seconds = Math.floor((remaining % (1000*60)) / 1000);
        timerText.textContent = `Siguiente canción desbloquea en: ${hours}h ${minutes}m ${seconds}s`;
    } else {
        timerText.textContent = "Todas las canciones desbloqueadas 🎵";
    }

    // Mostrar flecha y pregunta final
    if(daysPassed >= 5 && intro.style.display === "none") {
        questionScreen.style.display = "flex";
        scrollArrow.style.display = "flex";
    } else {
        questionScreen.style.display = "none";
        scrollArrow.style.display = "none";
    }
}
setInterval(updateLogic, 1000);

// REPRODUCTOR
let currentAudio = null;
tracks.forEach(track => {
    const btn = track.querySelector(".play-btn");
    const audio = track.querySelector("audio");
    const bar = track.querySelector(".progress-bar");

    btn.addEventListener("click", () => {
        if(currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            document.querySelectorAll(".play-btn").forEach(b => b.textContent = "▶");
        }
        if(audio.paused) {
            audio.play(); btn.textContent = "⏸"; currentAudio = audio;
        } else {
            audio.pause(); btn.textContent = "▶";
        }
    });

    audio.addEventListener("timeupdate", () => {
        bar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    });
});

// BOTONES Y FUEGOS
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const finalScreen = document.getElementById("finalScreen");
const finalMsg = document.getElementById("finalMsg");

const escapar = () => {
    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 60);
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
};

noBtn.addEventListener("mouseover", escapar);
noBtn.addEventListener("touchstart", (e) => { e.preventDefault(); escapar(); });

yesBtn.addEventListener("click", () => {
    finalScreen.style.display = "flex";
    finalMsg.innerHTML = "TE QUIEROOO HERMOSA, <br> GRACIAS POR DARME EL PRIVILEGIO <br> DE ESTAR CONTIGO! 💖";
    lanzarFuegos();
});

// Flecha con scroll suave
scrollArrow.addEventListener('click', () => {
    questionScreen.scrollIntoView({ behavior: 'smooth' });
});

function lanzarFuegos() {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];

    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.color = color;
            this.velocity = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
            this.alpha = 1;
        }
        update() {
            this.velocity.y += 0.05; this.x += this.velocity.x; this.y += this.velocity.y;
            this.alpha -= 0.01;
        }
        draw() {
            ctx.save(); ctx.globalAlpha = this.alpha;
            ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI*2);
            ctx.fillStyle = this.color; ctx.fill(); ctx.restore();
        }
    }

    function anim() {
        requestAnimationFrame(anim);
        ctx.fillStyle = "rgba(0,0,0,0.1)"; ctx.fillRect(0,0,canvas.width, canvas.height);
        if(Math.random() < 0.1) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height / 2;
            const color = `hsl(${Math.random()*360}, 100%, 50%)`;
            for(let i=0; i<30; i++) particles.push(new Particle(x, y, color));
        }
        particles.forEach((p, i) => {
            if(p.alpha <= 0) particles.splice(i, 1);
            else { p.update(); p.draw(); }
        });
    }
    anim();
}
