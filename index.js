const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");
const PORT = process.env.PORT || 5000;


const salasona = "HerneSupp12"
const andmebaas = "matkaApp"
const mongoUrl = `mongodb+srv://matka-app:${salasona}@cluster0.9x3tf.mongodb.net/${andmebaas}?retryWrites=true&w=majority`

const client = new MongoClient(mongoUrl)

const matk1 = {
  id: 0,
  nimetus: "Kevadmatk Kõrvemaal",
  kirjeldus: "Lähme ja kõnnime kolm päeva looduses",
  pildiUrl: "/assets/matk_tartus1.jpg",
  osalejad: [],
  kasNahtav: true,
  kasRegistreeumineAvatud: false
};
const matk2 = {
  id: 1,
  nimetus: "Rattamatk Jõgevamaal",
  kirjeldus: "Väntame iga päev 30 kilomeetrit",
  pildiUrl: "/assets/rattamatk.jpg",
  osalejad: [],
  kasNahtav: true,
  kasRegistreeumineAvatud: false
};
const matk3 = {
  id: 2,
  nimetus: "Kepikõnnimatk ümber Tartu",
  kirjeldus: "14 kilomeetrine jalutuskäik",
  pildiUrl: "/assets/matk_tartus1.jpg",
  osalejad: [],
  kasNahtav: true,
  kasRegistreeumineAvatud: true
};
const matk4 = {
  id: 3,
  nimetus: "Kepikõnnimatk ümber Pühajärve",
  kirjeldus: "14 kilomeetrine jalutuskäik",
  pildiUrl: "/assets/matk_tartus1.jpg",
  osalejad: [],
  kasNahtav: true,
  kasRegistreeumineAvatud: true
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
    tekst: `
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
      </p>
      <p>
        Laudantium quas dolore fugiat earum cum 
        libero <strong>exercitationem fugit</strong> facere voluptatibus incidunt, 
        illo iste eos. Facilis veritatis quos molestias dicta 
      </p>
      <h4>
        Tavaline alapealkiri
      </h4>
      <p>
        itaque rerum!
      </p>  
        `
      ,
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

async function registreerumiseKinnitus(req, res) {
    console.log(req.query.nimi)
    if (!req.query.email) {
      res.end("Emaili ei ole - registreerumine ebaõnnestus")
      return false
    }

    const matk = matkad[req.params.matkaId]

    const registreerumine = {
      matkId: matk.id,
      nimi: req.query.nimi,
      email: req.query.email,
      markus: req.query.markus
    }

    matk.osalejad.push(registreerumine)

    await client.connect()
    const database = client.db(andmebaas)
    const registreerumised = database.collection("registreerumised")
    const tulemus = await registreerumised.insertOne(registreerumine)
    console.log(`Lisati registreerumine idd-ga: ${tulemus.insertedId}`)
    res.end(`Registreeruti matkale`)
}

async function lisaUudis(req, res) {
  const uusUudis = {
    pealkiri: req.body.pealkiri,
    kokkuvote: req.body.kokkuvote,
    tekst: req.body.tekst,
    pildiUrl: req.body.pildiUrl
  }
  await client.connect()
  const database = client.db(andmebaas)
  const uudisedCollection = database.collection("uudis")
  const tulemus = await uudisedCollection.insertOne(uusUudis)
  uusUudis.id = tulemus.insertedId
  uudised.push(uusUudis)
  res.send(uusUudis)
}

async function lisaMatk(req, res) {
  const uusMatk = {
    nimetus: req.body.nimetus,
    kirjeldus: req.body.kirjeldus,
    pildiUrl: req.body.pildiUrl,
    osalejad: [],
    kasNahtav: req.body.kasNahtav,
    kasRegistreeumineAvatud: req.body.kasRegistreeumineAvatud,
  }
  await client.connect()
  const database = client.db(andmebaas)
  const matkadCollection = database.collection("matk")
  const tulemus = await matkadCollection.insertOne(uusMatk)
  uusMatk.id = matkad.length
  matkad.push(uusMatk)
  res.send(uusMatk)
}

function naitaUudist(req, res) {
  const uudisIndeks = req.params.uudisIndeks
  const uudis = uudised[uudisIndeks]
  res.render("pages/uudis", { uudis })
}

function matkNahtav(matk) {
  return matk.kasNahtav
}

function naitaMatkad(req, res) {
  const nahtavadMatkad = matkad.filter(matkNahtav)
  res.render("pages/index", { matkad: nahtavadMatkad })
}

function tagastaMatkad(req, res) {
  //todo: lisa uudiste lugemine andmebaasist
  res.send(matkad)
}

async function loeUudised() {
  await client.connect()
  const database = client.db(andmebaas)
  const uudisedCollection = database.collection("uudis")
  const andmed = await uudisedCollection.find().toArray()
  for (i in andmed) {
    const uudis = andmed[i]
    uudis.id = uudised.length
    uudised.push(uudis)
  }
  console.log("Uudised loetud")
}

async function loeMatkad() {
  await client.connect()
  const database = client.db(andmebaas)
  const matkCollection = database.collection("matk")
  const andmed = await matkCollection.find().toArray()
  for (i in andmed) {
    const matk = andmed[i]
    matk.id = matkad.length
    matkad.push(matk)
  }
  console.log("Matkad loetud")
}

function tagastaUudised(req, res) {
  res.send(uudised)
}

function muudaMatka(req, res) {
  const matk = matkad[req.params.matkaId]
  if (req.query.avatud != undefined) {
    matk.kasRegistreeumineAvatud = (req.query.avatud === 'true')
  }

  if (req.query.nahtav != undefined) {
    matk.kasNahtav = (req.query.nahtav === 'true')
  }

  if (req.query.nimetus != undefined) {
    matk.nimetus = req.query.nimetus
  }

  if (req.query.piltUrl != undefined) {
    matk.piltUrl = req.query.piltUrl
  }
  
  if (req.query.kirjeldus != undefined) {
    matk.kirjeldus = req.query.kirjeldus
  }

  console.log(matk)
  res.send(matk)
}
function muudaUudist(req, res) {
  const uudis = uudised[req.params.uudisIndeks]
  if (req.query.pealkiri != undefined) {
    uudis.pealkiri = (req.query.pealkiri)
  }

  console.log(uudis)
  res.send(uudis)
}

async function loeRegistreerumised(matkId) {
  await client.connect()
  const database = client.db(andmebaas)
  const registreerumised = database.collection("registreerumised")

  let filter = {}

  if (matkId !== undefined) {
    filter = {matkId: parseInt(matkId)}
  }

  console.log(filter)

  const tulemus = await registreerumised.find(filter).toArray()  
  client.close()
  return tulemus
}

async function tagastaRegistreerumised(req, res) {
  const andmed = await loeRegistreerumised(req.params.matkId)
  res.send(andmed)
}

async function lisaOsalejadMatkadele() {
  for (matkId in matkad) {
    const matk = matkad[matkId]
    const osalejad = await loeRegistreerumised(matk.id)
    matk.osalejad = osalejad
  }
}

const app = express();
lisaOsalejadMatkadele()
loeUudised()
loeMatkad()

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/",naitaMatkad);
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
app.get("/api/matk", tagastaMatkad)
app.get("/api/uudis", tagastaUudised)
app.post("/api/uudis", lisaUudis)
app.post("/api/matk", lisaMatk)
app.get("/api/matk/:matkaId/muuda", muudaMatka)
app.get("/api/uudis/:uudisIndeks/muuda", muudaUudist)
app.get("/api/registreerumised", tagastaRegistreerumised)
app.get("/api/registreerumised/:matkId", tagastaRegistreerumised)


app.listen(PORT, () => console.log(`Listening on ${PORT}`));
