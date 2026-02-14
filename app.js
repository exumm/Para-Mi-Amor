const intro = document.getElementById("intro");
const container = document.getElementById("countdown-container");
const countdown = document.getElementById("countdown");
const timerText = document.getElementById("timerText");
const tracks = document.querySelectorAll(".track");
const questionScreen = document.getElementById("questionScreen");
const scrollArrow = document.getElementById("scrollArrow");

const targetDate = new Date("February 14, 2026 10:00:00").getTime();

// INTRO -> HABILITAR SCROLL AL TERMINAR
setTimeout(() => {
    intro.style.display = "none";
    container.style.display = "flex";
    document.body.style.overflowY = "auto"; 
}, 10000);

// FECHA DE INICIO FIJA: Lunes 9 de Febrero a las 10:00 PM (Hora RD)
const unlockStart = new Date("February 9, 2026 20:00:00").getTime();

function updateLogic() {
    const now = Date.now();
    const diff = targetDate - now;

    // Actualización del contador principal (San Valentín)
    if(diff <= 0) {
        countdown.innerHTML = "💖 ES HOY 💖";
    } else {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor(diff / 3600000 % 24);
        const m = Math.floor(diff / 60000 % 60);
        const s = Math.floor(diff / 1000 % 60);
        countdown.innerHTML = `${d}D ${h}H ${m}M ${s}S`;
    }

    // LÓGICA DE DESBLOQUEO FIJA (No se vuelve a bloquear)
    tracks.forEach(track => {
        const dayIndex = parseInt(track.dataset.day);
        // Cada canción suma 24 horas exactas (86400000ms) desde la fecha de inicio
        const unlockTime = unlockStart + (dayIndex * 86400000);
        
        if(now >= unlockTime) {
            track.classList.remove("locked");
        } else {
            track.classList.add("locked");
        }
    });

    // Temporizador para la siguiente canción
    const nextLocked = Array.from(tracks).find(track => track.classList.contains("locked"));
    if(nextLocked){
        const dayIndex = parseInt(nextLocked.dataset.day);
        const unlockTime = unlockStart + (dayIndex * 86400000);
        const remaining = unlockTime - now;
        
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        timerText.textContent = `Siguiente canción desbloquea en: ${hours}h ${minutes}m ${seconds}s`;
    } else {
        timerText.textContent = "Todas las canciones desbloqueadas 🎵";
    }

    // Mostrar pregunta final solo cuando la ÚLTIMA canción (Día 6) se desbloquee
    const lastTrack = tracks[tracks.length - 1];
    if(lastTrack && !lastTrack.classList.contains("locked") && intro.style.display === "none") {
        questionScreen.style.display = "flex";
        scrollArrow.style.display = "flex";
    } else {
        questionScreen.style.display = "none";
        scrollArrow.style.display = "none";
    }
}
setInterval(updateLogic, 1000);

// REPRODUCTOR (Se mantiene igual)
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

// BOTONES Y FUEGOS (Se mantiene igual)
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
    finalMsg.innerHTML = "TE AMO HERMOSA <br> GRACIAS POR DARME EL PRIVILEGIO <br> DE ESTAR CONTIGO! 💖";
    lanzarFuegos();
});

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


