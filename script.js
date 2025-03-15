// Элементы
const playButton = document.getElementById('playButton');
const audio = document.getElementById('song');
const volumeControl = document.getElementById('volume');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

// Настройка Canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Web Audio API
let audioContext, analyser, source;

// Инициализация аудио
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    // Визуализация
    visualize();
}

// Визуализация
function visualize() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
            ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    }

    draw();
}

// Кнопка воспроизведения
playButton.addEventListener('click', function() {
    if (!audioContext) {
        initAudio(); // Инициализация аудио при первом нажатии
    }

    if (audio.paused) {
        audio.play();
        this.textContent = 'Пауза';
    } else {
        audio.pause();
        this.textContent = 'Воспроизвести песню';
    }
});

// Громкость
volumeControl.addEventListener('input', function() {
    audio.volume = this.value;
});
