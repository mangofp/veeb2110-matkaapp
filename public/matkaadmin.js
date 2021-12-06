
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