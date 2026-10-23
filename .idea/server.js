const express = require('express');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Velkommen til din liste over alle trænerne!");
});

// Her tilføjer vi 2 træner-objekter som eksempeldata
let trainers = [
    { id: 1, name: "Ash", region: "Kanto" },
    { id: 2, name: "Misty", region: "Cerulean" }
];

// Variabel vil her holde styr på det næste ID for en nye træner
let nextId = 3;

// Hent alle trænere (GET /trainers)
app.get("/trainers", (req, res) => {
    res.json(trainers);
});

// Hent en specifik træner (GET /trainers/:id)
app.get("/trainers/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const trainer = trainers.find(t => t.id === id);

    // Hvis træneren ikke kan findes, returner en fejl
    if (trainer) {
        res.json(trainer);
    } else {
        res.status(404).send("Træner ikke fundet");
    }
});

// Opret en ny træner (POST /trainers)
app.post("/trainers", (req, res) => {
    const { name, region } = req.body || {};

    console.log("Body:", req.body);
    console.log("Name:", name);
    console.log("Region:", region);

    // Valider input
    if (
        typeof name !== "string" ||
        typeof region !== "string" ||
        name.trim().length < 3 ||
        region.trim().length < 3
    ) {
        return res.status(400).json({
            error: "Navn og region skal indeholde mindst 3 tegn"
        });
    }

    // Opret ny træner
    const newTrainer = {
        id: nextId++,
        name: name.trim(),
        region: region.trim()
    };

    // Tilføj til array
    trainers.push(newTrainer);

    // Returner den oprettede træner
    res.status(201).json(newTrainer);
});

// Opdater en eksisterende træner (PUT /trainers/:id)
app.put("/trainers/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name, region } = req.body || {};

    // Find træneren
    const trainer = trainers.find(
        trainer => trainer.id === id);

    // Hvis træneren ikke findes, returner en fejl
    if (!trainer) {
        return res.status(404).json({
            error: "Træner ikke fundet"
        });
    }

    // Valider input
    if (
        typeof name !== "string" ||
        typeof region !== "string" ||
        name.trim().length < 3 ||
        region.trim().length < 3
    ) {
        return res.status(400).json({
            error: "Navn og region skal indeholde mindst 3 tegn"
        });
    }

    // Opdater træneren
    trainer.name = name.trim();
    trainer.region = region.trim();

    // Returner den opdaterede træner
    res.json(trainer);
});

// Slet en træner (DELETE /trainers/:id)
app.delete("/trainers/:id", (req, res) => {
    const id = parseInt(req.params.id);

    // Find indexet for træneren i arrayet
    const index = trainers.findIndex(
        trainer => trainer.id === id
    );

    // Hvis træneren ikke findes, returner en fejl
    if (index === -1) {
        return res.status(404).json({
            error: "Træner ikke fundet"
        });
    }

    // Fjern træneren fra arrayet
    trainers.splice(index, 1);

    // Returner en succesbesked
    res.json({ message: "Træner slettet" });
});

// Start serveren
app.listen(3000, () => {
    console.log("Serveren kører på port 3000");
});