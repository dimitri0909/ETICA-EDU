// RUTA CORREGIDA: Tu carpeta se llama "documento" (singular)
const PDF_PATH = './documento/documento.pdf'; 

// Motor de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const flipSound = document.getElementById('flip-sound');

async function renderMagazine() {
    try {
        console.log("Intentando cargar PDF desde:", PDF_PATH);
        const loadingTask = pdfjsLib.getDocument(PDF_PATH);
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        const magazine = $('#magazine');

        $('#loading-container').removeClass('hidden');

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const isHard = (i === 1 || i === totalPages);
            
            const pageDiv = $('<div/>').addClass(isHard ? 'hard' : '');
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            pageDiv.append(canvas);
            magazine.append(pageDiv);

            // Progreso
            let percent = Math.round((i / totalPages) * 100);
            $('#progress-fill').css('width', percent + '%');
            $('#progress-text').text(percent + '%');
        }

        $('#loading-container').addClass('hidden');
        $('#magazine-viewport, #controls').removeClass('hidden');

        // Configuración de Turn.js
        magazine.turn({
            width: 1000,
            height: 600,
            autoCenter: true,
            duration: 1000,
            acceleration: true,
            gradients: true,
            elevation: 50,
            when: {
                turning: function() {
                    if (flipSound) {
                        flipSound.currentTime = 0;
                        flipSound.play();
                    }
                }
            }
        });

        $('#prev-btn').click(() => magazine.turn('previous'));
        $('#next-btn').click(() => magazine.turn('next'));

    } catch (error) {
        console.error("Error al cargar el PDF:", error);
        alert("No se pudo cargar el PDF. Verifica que el archivo esté en: /documento/documento.pdf y que estés usando un servidor local (Live Server).");
    }
}

$('#start-btn').on('click', function() {
    $('#welcome-screen').addClass('move-up');
    setTimeout(renderMagazine, 600);
});


