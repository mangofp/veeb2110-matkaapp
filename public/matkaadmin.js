
let matkad

async function loeMatkad() {
    const vastus = await fetch('/api/matk')
    const andmed = await vastus.json()
    console.log(andmed)
    matkad = andmed
    naitaMatkadeMenyyd(andmed)
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

    const matkaAndmedELement = document.getElementById("matka-andmed")
    matkaAndmedELement.innerHTML = `
    <h2>
        ${matk.nimetus}
    </h2>
    <h2>
        Osalejad
    </h2>
    ${vastus}
    `
}

loeMatkad()