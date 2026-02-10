const intro = document.getElementById("intro");
const container = document.getElementById("countdown-container");
const countdown = document.getElementById("countdown");
const timerText = document.getElementById("timerText");
const tracks = document.querySelectorAll(".track");

// Fecha final
const targetDate = new Date("February 14, 2026 22:00:00").getTime();

// INTRO → CONTADOR
setTimeout(() => {
    intro.style.display = "none";
    container.style.display = "flex";
}, 10000);

// Obtener la fecha de desbloqueo diaria a las 22:00
function getUnlockStartDate() {
    const now = new Date();
    const start = new Date();
    start.setHours(20,0,0,0);
    if(now < start) start.setDate(start.getDate() - 1);
    return start.getTime();
}
const unlockStart = getUnlockStartDate();

// ACTUALIZA CONTADOR Y DESBLOQUEO
function updateCountdownAndUnlock() {
    const now = Date.now();
    const diff = targetDate - now;

    // Contador
    if(diff <= 0){
        countdown.innerHTML = "💖 ES HOY 💖";
        timerText.textContent = "";
    } else {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor(diff / 3600000 % 24);
        const m = Math.floor(diff / 60000 % 60);
        const s = Math.floor(diff / 1000 % 60);
        countdown.innerHTML = `${d}D ${h}H ${m}M ${s}S`;
    }

    // Canciones desbloqueadas según días pasados
    const daysPassed = Math.floor((now - unlockStart) / 86400000);
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
}
setInterval(updateCountdownAndUnlock, 1000);
updateCountdownAndUnlock();

// PLAYER FUNCIONAL
let currentAudio = null;
tracks.forEach(track => {
    const btn = track.querySelector(".play-btn");
    const audio = track.querySelector("audio");
    const bar = track.querySelector(".progress-bar");

    btn.addEventListener("click", () => {
        if(track.classList.contains("locked")) return;

        if(currentAudio && currentAudio !== audio){
            currentAudio.pause();
            document.querySelectorAll(".play-btn").forEach(b => b.textContent = "▶");
        }

        if(audio.paused){
            audio.play();
            btn.textContent = "⏸";
            currentAudio = audio;
        } else {
            audio.pause();
            btn.textContent = "▶";
        }
    });

    audio.addEventListener("timeupdate", () => {
        if(!isNaN(audio.duration)) bar.style.width = (audio.currentTime / audio.duration)*100 + "%";
    });

    audio.addEventListener("ended", () => {
        btn.textContent = "▶";
        bar.style.width = "0%";
    });
});


// Seleccionamos el botón
const loveBtn = document.getElementById("loveBtn");

// Cuando se reproduzca la última canción (día 5)
const lastTrack = document.querySelector('.track[data-day="5"] audio');

lastTrack.addEventListener('play', () => {
    // Mostrar el corazón con animación
    loveBtn.style.transform = "rotate(-45deg) scale(1)";
    loveBtn.style.opacity = "1";
});

// Click en el corazón → abrir pregunta
loveBtn.addEventListener('click', () => {
    document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;color:white;font-family:sans-serif;text-align:center;">
            <h1>¿QUIERES SER MI NOVIA?</h1>
            <div style="margin-top:20px;">
                <button id="yesBtn" style="padding:10px 20px;margin-right:20px;font-size:1rem;cursor:pointer;">SI</button>
                <button id="noBtn" style="padding:10px 20px;font-size:1rem;cursor:pointer;position:relative;">NO</button>
            </div>
        </div>
    `;

    const noBtn = document.getElementById("noBtn");

    // Botón NO que se mueve
    noBtn.addEventListener('mousemove', () => {
        const x = Math.random() * 200 - 100; // mueve aleatorio
        const y = Math.random() * 100 - 50;
        noBtn.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Botón SI → mensaje final
    document.getElementById("yesBtn").addEventListener('click', () => {
        document.body.innerHTML = `
            <div style="display:flex;justify-content:center;align-items:center;height:100vh;color:white;font-family:sans-serif;text-align:center;">
                <h1>💖 GG!! Ahora el que te mire lo fusilo 💖</h1>
            </div>
        `;
    });
});

