const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

// Konfigurasi Multer untuk menangani unggahan file ke folder 'uploads'
const upload = multer({ dest: 'uploads/' }); 

// Menyajikan file statis (index.html)
app.use(express.static(__dirname));

/**
 * Fungsi untuk mensimulasikan data analisis kulit.
 * Ini adalah satu-satunya fase yang tersisa.
 */
function simulateThirdPartyAnalysis() {
    const simulatedData = {
        "status": "success",
        "analysis_id": "SIM_ID_" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        "skin_type": ["Oily", "Combination", "Dry", "Normal"][Math.floor(Math.random() * 4)], 
        "main_concern": ["Severe Acne", "Pigmentation & Sun Damage", "Fine Lines & Dryness", "Oiliness & Large Pores"][Math.floor(Math.random() * 4)],
        "acne_score": Math.floor(Math.random() * 5) + 1, // 1 (Rendah) to 5 (Parah)
        "pigmentation_score": Math.floor(Math.random() * 100), // 0 to 100
        "is_sensitive": Math.random() < 0.3 ? true : false // 30% kemungkinan sensitif
    };
    return simulatedData;
}

// Endpoint untuk analisis kulit
app.post('/analyze', upload.single('skinImage'), async (req, res) => {
    
    if (!req.file) {
        return res.status(400).json({ error: 'Tidak ada file gambar yang diunggah.' });
    }

    const imagePath = req.file.path; 

    try {
        // --- FASE 1: SIMULASI ANALISIS KULIT (TUNGGAL) ---
        console.log('Fase 1: Menganalisis gambar...');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulasi penundaan 1.5 detik
        
        const analysisResult = simulateThirdPartyAnalysis(); 
        
        // Hapus file yang diunggah setelah simulasi
        fs.unlinkSync(imagePath);
        
        // Mengirimkan hasil analisis (dalam format JSON) langsung ke frontend
        res.json({ analysis: analysisResult });

    } catch (error) {
        console.error('SERVER ERROR:', error);
        
        if (req.file && fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
            } catch (cleanupError) {
                console.error("Error saat membersihkan file:", cleanupError);
            }
        }
        res.status(500).json({ error: error.message || 'Terjadi kesalahan internal saat memproses analisis.' });
    }
});

app.listen(port, () => {
    console.log(`Server siap! Buka http://localhost:${port} di browser Anda.`);
});