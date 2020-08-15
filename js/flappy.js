const mapa = document.querySelector('[wm-flappy]')
const topo = document.createElement('section')
const fundo = document.createElement('section')

topo.classList.add('upSide')
fundo.classList.add('downSide')

mapa.appendChild(topo)
mapa.appendChild(fundo)

class Barreira {
    constructor(num) {
        this.divUP = document.createElement('div')
        this.divDOWN = document.createElement('div')
        
        this.divUP.style.left = `${num}px`
        this.divDOWN.style.left = `${num}px`
        this.num = num

        topo.appendChild(this.divUP)
        fundo.appendChild(this.divDOWN)
    }

    random() {
        let random = Math.random() * (80 - 25)
        this.divUP.style.height = `${random}vh`
        this.divDOWN.style.height = `${80 - 25 - random}vh`
    
    }
}

let barreiras = [
    new Barreira(1250),
    new Barreira(1250 + 500),
    new Barreira(1250 + 500 + 500)
]

let pontos = document.createElement('div')
pontos.classList.add('pontuacao')
mapa.appendChild(pontos)

let bird = document.createElement('img')
bird.classList.add('bird')
bird.src = './imgs/passaro.png'
bird.alt = 'bird'
mapa.appendChild(bird)

let end = () => {
    let popup = document.createElement('div')
    popup.classList.add('popup')

    let p = document.createElement('p')
    p.innerHTML = `Seu recorde: ${pontos.textContent}`

    let button = document.createElement('button')
    button.innerHTML = `Tente novamente`

    popup.appendChild(p)
    popup.appendChild(button)

    popup.style.display = 'flex'
    mapa.appendChild(popup)

    button.onclick = e => {
        button.style.display = 'none'
        slide()
    }
}

let moveBird = () => {
    let up = 260
    let fly = false

    window.onkeydown = e => fly = true ? e.keyCode == 32 : ''
    window.onkeyup = e => fly = false

    let id = setInterval(() => {
        if (fly == true && up > 0) {
            bird.style.top = `${up}px`
            up--
        }     
        else if (fly == false && up < 550) {
            bird.style.top = `${up}px`
            up++
        }

        colisao(id)
    }, 6)
    
}

let colisao = id => {
    let horizontal = false
    let vertical = false

    const passaro = bird.getBoundingClientRect()
    barreiras.forEach(cano => {
        let cima = cano.divUP.getBoundingClientRect()
        let baixo = cano.divDOWN.getBoundingClientRect()

        let cimaHorizontal = passaro.left + passaro.width >= cima.left && cima.left + cima.width >= passaro.left
        let baixoHorizontal = passaro.left + passaro.width >= baixo.left && baixo.left + baixo.width >= passaro.left
        horizontal = cimaHorizontal || baixoHorizontal 

        let cimaVertical = passaro.top + passaro.height >= cima.top && cima.top + cima.height >= passaro.top
        let baixoVertical = passaro.top + passaro.height >= baixo.top && baixo.top + baixo.height >= passaro.top
        vertical = cimaVertical || baixoVertical 

        if (horizontal && vertical) {
            clearInterval(id)
            end()
        }
    })
}

let slide = () => {
    let pontuacao = 0
    
    let mover1 = barreiras[0].num
    let mover2 = barreiras[1].num
    let mover3 = barreiras[2].num
    
    barreiras.forEach(cano => cano.random())
    
    let walk = (cano, passo) => {
        cano.divUP.style.left = `${passo}px`
        cano.divDOWN.style.left = `${passo}px`
    }
    
    moveBird()

    let id2 = setInterval(() => {
        pontos.textContent = pontuacao
        barreiras.forEach((cano, index) => {
            if (index == 0) { walk(cano, mover1) }

            else if (index == 1) { walk(cano, mover2) }

            else if (index == 2) { walk(cano, mover3) }
        })

        if (mover1 == 500 || mover2 == 500 || mover3 == 500) {
            pontuacao++
        }

        mover1--
        mover2--
        mover3--

        if (mover1 == -150) {
            barreiras[0].random()
            walk(barreiras[0], 1250)
            mover1 = 1250
        }

        else if (mover2 == -150) {
            barreiras[1].random()
            walk(barreiras[1], (1250 + 400))
            mover2 = 1250
        }

        else if (mover3 == -150) {
            barreiras[2].random()
            walk(barreiras[2], (1250 + 400 + 400))
            mover3 = 1250
        }
        
        colisao(id2)
    }, 5)
    
}

slide()
