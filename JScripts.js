// Password check
if (localStorage.getItem('access_granted') !== 'true') {
    window.location.href = 'Passwort-Abfrage.html'; // nur wenn NICHT eingeloggt
}

//Matrix Regen
let rainIntervalLeft = null;
let rainIntervalRight = null;

function createMatrixRain(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Set size
    canvas.height = window.innerHeight;
    canvas.width = canvas.offsetWidth;

    // Characters
    const letters = 'アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂツッヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const chars = letters.split('');

    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * canvas.height / fontSize));


    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Return draw function for later start/stop
    return draw;
}

// Erstellt die Draw-Funktionen, aber startet sie noch nicht
const drawLeft = createMatrixRain('matrix-left');
const drawRight = createMatrixRain('matrix-right');

// Funktionen zum Ein-/Ausschalten
function matrixOn() {
    if (!rainIntervalLeft && !rainIntervalRight) {
        rainIntervalLeft = setInterval(drawLeft, 33);
        rainIntervalRight = setInterval(drawRight, 33);
    }
}

function matrixOff() {
    clearInterval(rainIntervalLeft);
    clearInterval(rainIntervalRight);
    rainIntervalLeft = null;
    rainIntervalRight = null;
}

// Direkt beim Laden einschalten
matrixOn();

function matrixClear() {
    const canvasLeft = document.getElementById('matrix-left');
    const ctxLeft = canvasLeft.getContext('2d');
    ctxLeft.fillStyle = '#000';
    ctxLeft.fillRect(0, 0, canvasLeft.width, canvasLeft.height);

    const canvasRight = document.getElementById('matrix-right');
    const ctxRight = canvasRight.getContext('2d');
    ctxRight.fillStyle = '#000';
    ctxRight.fillRect(0, 0, canvasRight.width, canvasRight.height);
}


    // Es folgt der Code für die Console
    const inputEl = document.getElementById('input');
    const outputEl = document.getElementById('output');
    const consoleEl = document.getElementById('console');

    let commandHistory = [];
    let historyIndex = -1;

    inputEl.focus();

    consoleEl.addEventListener('click', () => {
        inputEl.focus();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = inputEl.textContent.trim();
            runCommand(command);
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            inputEl.textContent = '';
        }
        else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                inputEl.textContent = commandHistory[historyIndex];
            }
            e.preventDefault();
        }
        else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputEl.textContent = commandHistory[historyIndex];
            } else {
                inputEl.textContent = '';
            }
            e.preventDefault();
        }
    });

    function runCommand(cmd) {
        if (!cmd) return;
        printLine(`> ${cmd}`);

        switch (cmd.toLowerCase()) {
            case 'help':
                printLine("Available commands:\nhelp - show this help\nmatrix on - start matrix rain\nmatrix off - stop matrix rain\nclear matrix - clear matrix\ngoto startseite - go to startseite\ngoto lebenslauf - go to lebenslauf\ngoto code vorschau - go to code vorschau\ndelete localstorage - clear saved data (password reset)\nclear - clear console");
                break;
            case 'matrix on':
                printLine("Matrix rain started.");
                matrixOn();
                break;
            case 'matrix off':
                printLine("Matrix rain stopped.");
                matrixOff();
                break;
            case 'clear matrix':
                printLine("Matrix cleared.");
                matrixClear();
                break;
            case 'goto startseite':
                printLine("Loading...");
                setTimeout(() => {
                    window.location.href = 'index.html';
                    }, 120);
                break;
            case 'goto lebenslauf':
                printLine("Loading...");
                setTimeout(() => {
                    window.location.href = 'Lebenslauf.html#Lebenslauf-ueberschrift';
                    }, 120);
                break;
            case 'goto code vorschau':
                setTimeout(() => {
                printLine("Loading...");
                    window.location.href = 'Code-Vorschau.html#code-vorschauID';
                    }, 120);
                break;
            case 'delete localstorage':
                printLine("Local storage cleared.");
                localStorage.clear();
                    setTimeout(() => {
                    location.reload();
                    }, 220);
                break;
            case 'clear':
                outputEl.textContent = '';
                break;
            default:
                printLine(`Unknown command: ${cmd}`);
        }

        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    function printLine(text) {
        outputEl.textContent += text + "\n";
    }

    // Dummy matrix rain toggles for now
    function startMatrixRain() {
        document.body.classList.add('matrix-active');
    }
    function stopMatrixRain() {
        document.body.classList.remove('matrix-active');
    }

    // Lebenslaufeinbindung

const url = 'lebenslauf.pdf'; // Dein PDF

let pdfDoc = null,
    pageNum = 1,
    canvas = document.getElementById('pdf-canvas'),
    ctx = canvas.getContext('2d');

// PDF laden
pdfjsLib.getDocument(url).promise.then(function(pdf) {
    pdfDoc = pdf;
    renderPage(pageNum);
});

function renderPage(num) {
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({ scale: 1.5 }); // Zoomfaktor
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        page.render(renderContext);
    });

    document.getElementById('page-info').textContent = `${num} / ${pdfDoc.numPages}`;
}

// Buttons
document.getElementById('prev').addEventListener('click', function() {
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
});

document.getElementById('next').addEventListener('click', function() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPage(pageNum);
});

