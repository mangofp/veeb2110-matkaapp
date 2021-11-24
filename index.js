const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;

const matk1 = {
  id: 0,
  nimetus: "Kevadmatk Kõrvemaal",
  kirjeldus: "Lähme ja kõnnime kolm päeva looduses",
  pildiUrl: "/assets/matk_tartus1.jpg",
  osalejad: [],
};
const matk2 = {
  id: 1,
  nimetus: "Rattamatk Jõgevamaal",
  kirjeldus: "Väntame iga päev 30 kilomeetrit",
  pildiUrl: "/assets/rattamatk.jpg",
  osalejad: [],
};
const matk3 = {
  id: 2,
  nimetus: "Kepikõnnimatk ümber Tartu",
  kirjeldus: "14 kilomeetrine jalutuskäik",
  pildiUrl: "/assets/matk_tartus1.jpg",
  osalejad: [],
};
const matk4 = {
  id: 3,
  nimetus: "Kepikõnnimatk ümber Pühajärve",
  kirjeldus: "14 kilomeetrine jalutuskäik",
  pildiUrl: "/assets/matk_tartus1.jpg",
  osalejad: [],
};

const matkad = [matk1, matk2, matk3, matk4];

let uudised = [
  {
    id:0,
    pealkiri: "Uudis 1",
    kokkuvote: 'Lühike tekst',
    tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quas dolore fugiat earum cum libero exercitationem fugit facere voluptatibus incidunt, illo iste eos. Facilis veritatis quos molestias dicta itaque rerum!",
    pildiUrl: "/assets/syst_krabi.jpg",
  },
  {
    id:1,
    pealkiri: "Uudis 2",
    kokkuvote: 'Lühike tekst',
    tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quas dolore fugiat earum cum libero exercitationem fugit facere voluptatibus incidunt, illo iste eos. Facilis veritatis quos molestias dicta itaque rerum!",
    pildiUrl: "/assets/syst1.jpg",
  },
  {
    id:3,
    pealkiri: "Uudis 3",
    kokkuvote: 'Lühike tekst',
    tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quas dolore fugiat earum cum libero exercitationem fugit facere voluptatibus incidunt, illo iste eos. Facilis veritatis quos molestias dicta itaque rerum!",
    pildiUrl: "/assets/syst_krabi.jpg",
  }
]

function registreerumiseKinnitus(req, res) {
    console.log(req.query)
    res.end(`Registreeruti matkale`)
}

function naitaUudist(req, res) {
  const uudisIndeks = req.params.uudisIndeks
  const uudis = uudised[uudisIndeks]
  res.render("pages/uudis", { uudis })
}

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("pages/index", { matkad }));
app.get("/kontakt", (req, res) => res.render("pages/kontakt"));
app.get("/uudised", (req, res) => res.render("pages/uudised", { uudised }));
app.get("/registreerumine/:matkaId", 
    (req, res) => res.render(
        "pages/registreerumine", 
        {matk: matkad[req.params.matkaId]}
    )
);
app.get("/kinnitus/:matkaId", registreerumiseKinnitus)
app.get("/uudis/:uudisIndeks", naitaUudist)

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
