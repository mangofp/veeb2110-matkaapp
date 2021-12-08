
let matkad

async function loeMatkad() {
    const vastus = await fetch('/api/matk')
    const andmed = await vastus.json()
    console.log(andmed)
    matkad = andmed
    naitaMatkadeMenyyd(andmed)
}

async function muudaMatka(matkaIndeks, kasAvatud) {
    const vastus = await fetch(`/api/matk/${matkaIndeks}/muuda?avatud=${kasAvatud}`)
    const andmed = await vastus.json()
    console.log(andmed)
    matkad[matkaIndeks] = andmed
    naitaMatkadeMenyyd(matkad)
    naitaOsalejaid(matkaIndeks)
}

async function muudaMatkaKirjeldust(matkaIndeks) {
    const nimetus = document.getElementById("matk-nimetus").value
    const piltUrl = document.getElementById("matk-pilt").value
    const kirjeldus = document.getElementById("matk-kirjeldus").value

    const vastus = await fetch(`/api/matk/${matkaIndeks}/muuda?nimetus=${nimetus}&piltUrl=${piltUrl}&kirjeldus=${kirjeldus}`)
    const andmed = await vastus.json()
    console.log(andmed)
    matkad[matkaIndeks] = andmed
    naitaMatkadeMenyyd(matkad)
    naitaOsalejaid(matkaIndeks)
}

function naitaMatkadeMenyyd(matkad) {
    let vastus = ''
    for ( let i in matkad) {
        const matk = matkad[i]
        vastus += `
        <button class="btn btn-link" onclick="naitaOsalejaid(${i})">
            ${matk.nimetus}
        </button>
        `
    }

    vastus += `
    <button class="btn btn-link" onclick="naitaUudiseLisamist()">
        Lisa uudis
    </button>
    `
    
    vastus += `
    <button class="btn btn-link" onclick="naitaMatkaLisamist()">
        Lisa matk
    </button>
    `

    const menyyElement = document.getElementById("matkad-menyy")
    menyyElement.innerHTML = `
    <div>
        ${vastus}
    </div>
    `
}

function naitaOsalejaid(matkaId) {
    const matk = matkad[matkaId]
    let vastus = ''
    for ( let i in matk.osalejad) {
        const osaleja = matk.osalejad[i]
        vastus += `
        <div class="row">
            <div class="col-6">
                ${osaleja.nimi}
            </div>
            <div class="col-6">
                ${osaleja.email}
            </div>
        </div>     
        `
    }

    let registreerumine = `
        <button 
            class="btn btn-link" 
            onclick="muudaMatka(${matkaId}, 'true')"
        >
            Ava registreerumine
        </button>
    `

    if (matk.kasRegistreeumineAvatud) {
        registreerumine = `
        <button 
            class="btn btn-link" 
            onclick="muudaMatka(${matkaId}, 'false')"
        >
            Sulge registreerumine
        </button>
    `
    }

    const matkaAndmedELement = document.getElementById("matka-andmed")
    matkaAndmedELement.innerHTML = `
    <h2>
        ${matk.nimetus}
    </h2>
        ${registreerumine}

        <input id="matk-nimetus" type="text" value="${matk.nimetus}" placeholder="nimetus" />
        <input id="matk-pilt" type="text" value="${matk.pildiUrl}" placeholder="pilt" />
        <textarea id="matk-kirjeldus" >${matk.kirjeldus}</textarea>
        <div>
            <button class="btn btn-primary" onclick="muudaMatkaKirjeldust(${matkaId})">
                Salvesta
            </button>
            <button class="btn btn-secondary" onclick="naitaOsalejaid(${matkaId})">
                Katkesta
            </button>
        </div>

    <h2>
        Osalejad
    </h2>
    ${vastus}
<div>
    <button class="btn btn-link" onclick="naitaUudised()">Uudised</button>
</div>
    `
}

function naitaUudiseLisamist() {
    const uusUudisHtml = `
    <h1>Uus uudis</h1>
    <input type="text" placeholder="pealkiri" id="pealkiri"/>
    <input type="text" placeholder="pildiUrl" id="pildiUrl"/>
    <div>
    <label>Kokkuvõte</label><br>
    <textarea id="kokkuvote" cols="50" rows="2"></textarea>
    </div>
    <div>
    <label>Tekst</label><br>
    <textarea id="tekst" cols="50" rows="10"></textarea>
    </div>
    <div>
        <button class="btn btn-primary" onclick="lisaUudis()">
            Lisa
        </button>
    </div>

    `
    document.getElementById("matka-andmed").innerHTML = uusUudisHtml
}

function naitaMatkaLisamist() {
    const uusUudisHtml = `
    <h1>Lisa makt</h1>
    <input type="text" placeholder="nimetus" id="nimetus"/>
    <input type="text" placeholder="pildiUrl" id="pildiUrl"/>
    <div>
    <div>
    <label>Kirjeldus</label><br>
    <textarea id="kirjeldus" cols="50" rows="10"></textarea>
    </div>
    <div>
        <button class="btn btn-primary" onclick="lisaMatk()">
            Lisa
        </button>
    </div>

    `
    document.getElementById("matka-andmed").innerHTML = uusUudisHtml
}

async function lisaUudis() {
    const nimetus = document.getElementById("pealkiri").value
    const pildiUrl = document.getElementById("pildiUrl").value
    const kokkuvote = document.getElementById("kokkuvote").value
    const tekst = document.getElementById("tekst").value
    const uudis = {
        pealkiri: nimetus,
        pildiUrl: pildiUrl,
        kokkuvote: kokkuvote,
        tekst: tekst
    }
    console.log(uudis)
    const vastus = await fetch('/api/uudis', {
        method: 'POST',
        headers:  {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(uudis) 
    })
    if (vastus.ok) {
        document.getElementById("matka-andmed").innerHTML = `
        <div>
            <h2>Uudis lisatud</h2>
        </div>
        `
    }
}

async function lisaMatk() {
    const nimetus = document.getElementById("nimetus").value
    const pildiUrl = document.getElementById("pildiUrl").value
    const kirjeldus = document.getElementById("kirjeldus").value
    const matk = {
        nimetus,
        pildiUrl: pildiUrl,
        kirjeldus,
        kasNahtav: false,
        kasRegistreeumineAvatud: false
    }
    console.log(matk)
    const vastus = await fetch('/api/matk', {
        method: 'POST',
        headers:  {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(matk) 
    })
    if (vastus.ok) {
        document.getElementById("matka-andmed").innerHTML = `
        <div>
            <h2>Matk lisatud</h2>
        </div>
        `
    }
}

async function  naitaUudised() {
    const vastus = await fetch('/api/uudis')
    const andmed = await vastus.json()
    console.log(andmed)
    let uudised = ''

    for ( let i in andmed) {
        const uudis = andmed[i]
        uudised += `
        <div class="row">
            <div class="col-8">
                <input type="text" id="uudis-${i}" value="${uudis.pealkiri}"/>
            
                </div>
            <div class="col-4">
                ${uudis.kokkuvote}
            </div>
        </div>     
        `
    }

    const matkaAndmedELement = document.getElementById("matka-andmed")
    matkaAndmedELement.innerHTML = uudised

}

loeMatkad()