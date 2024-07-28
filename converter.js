// Define supported file formats
const supportedFormats = [
    'aac', 'abb', 'apk', '7z', 'ace', 'alz', 'appx', 'at3', 'arc', 'arj', 'ass', 'ssa', 'bin',
    'bkf', 'blend', 'bz2', 'bmp', 'cab', 'c4', 'cals', 'xaml', 'cpt', 'sea', 'cs', 'daa', 'deb', 'dmg',
    'ddz', 'dn', 'dng', 'dpe', 'egg', 'egt', 'ecab', 'esd', 'ess', 'exe', 'flipchart', 'fun', 'flm',
    'flp', 'gbs', 'ggp', 'gsc', 'gd', 'gho', 'ghs', 'gif', 'gz', 'heic', 'ipg', 'jar', 'jpg', 'jpeg',
    'lawrence', 'lbr', 'llsp3', 'lqr', 'lzh', 'lz', 'lzo', 'lzma', 'lzx', 'lua', 'mbw', 'mhtml', 'midi',
    'mid', 'mlog', 'mpq', 'nl2pkg', 'nth', 'oar', 'ogg', 'osg', 'pak', 'par', 'par2', 'part', 'paf', 'pea',
    'png', 'webp', 'php', 'pyk', 'pk3', 'pk4', 'pnj', 'pxz', 'py', 'pyw', 'pmp', 'pms', 'rar', 'rag', 'rax',
    'rbxl', 'rbxlx', 'rbxm', 'rbxmx', 'rpm', 'sb', 'sb2', 'sb3', 'sen', 'sf2', 'sf3', 'sf4', 'sitx', 'sis',
    'sisx', 'skb', 'sq', 'srt', 'swm', 'szs', 'tar', 'tb', 'tib', 'uha', 'uue', 'uf2', 'viv', 'vol', 'vsa',
    'wax', 'wav', 'wave', 'wfp', 'wim', 'xap', 'xz', 'z', 'zoo', 'zip', 'zim'
];

// Populate the output format dropdown
document.addEventListener('DOMContentLoaded', () => {
    const outputFormatSelect = document.getElementById('outputFormat');

    supportedFormats.forEach(format => {
        if (format !== 'zip') {
            const option = document.createElement('option');
            option.value = format;
            option.textContent = format.toUpperCase();
            outputFormatSelect.appendChild(option);
        }
    });
});

function detectFileType() {
    const inputFile = document.getElementById('inputFile').files[0];
    if (inputFile) {
        const inputFormat = inputFile.name.split('.').pop().toLowerCase();
        if (supportedFormats.includes(inputFormat) && inputFormat !== 'zip') {
            alert(`Detected file type: ${inputFormat.toUpperCase()}`);
        } else {
            alert("Unsupported or restricted file type.");
        }
    }
}

function updateProgressBar(percent) {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percent + '%';
}

function convertFile() {
    const inputFile = document.getElementById('inputFile').files[0];
    const outputFormat = document.getElementById('outputFormat').value;

    if (!inputFile) {
        alert("Please select a file first.");
        return;
    }

    const inputFormat = inputFile.name.split('.').pop().toLowerCase();
    if (!supportedFormats.includes(inputFormat) || inputFormat === 'zip') {
        alert("Unsupported or restricted file type.");
        return;
    }

    updateProgressBar(20); // Starting conversion

    const reader = new FileReader();
    reader.onload = function(event) {
        updateProgressBar(50); // File loaded
        const content = event.target.result;
        const fileName = inputFile.name.split('.').slice(0, -1).join('.');

        let blob;
        if (outputFormat === 'zip') {
            const zip = new JSZip();
            zip.file(inputFile.name, inputFile);
            zip.generateAsync({ type: "blob" }).then(blob => {
                updateProgressBar(100); // Conversion complete
                downloadBlob(blob, fileName, outputFormat);
            });
        } else {
            blob = new Blob([content], { type: `application/${outputFormat}` });
            updateProgressBar(100); // Conversion complete
            downloadBlob(blob, fileName, outputFormat);
        }
    };
    reader.readAsArrayBuffer(inputFile);
}

function downloadBlob(blob, fileName, outputFormat) {
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = `${fileName}.${outputFormat}`;
    downloadLink.style.display = 'block';
    downloadLink.textContent = `Download Converted ${outputFormat.toUpperCase()} File`;
}
