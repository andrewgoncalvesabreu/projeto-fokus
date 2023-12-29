const html = document.querySelector('html');
const botaoFoco = document.querySelector('.app__card-button--foco');
const descansoCurto = document.querySelector('.app__card-button--curto');
const descansoLongo = document.querySelector('.app__card-button--longo');
const imagem = document.querySelector('.app__image');
const texto = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const input = document.querySelector('#alternar-musica');
const startPauseBtn = document.querySelector('#start-pause');
const botaoIniciarOuPausar = document.querySelector('#start-pause span');
let imagemPausarOuComecar = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer')

const musica = new Audio('imagens/sons/luna-rise-part-one.mp3');
const fimTempo = new Audio('imagens/sons/beep.mp3');
const inicioAudio = new Audio('imagens/sons/play.wav');
const pausarAudio = new Audio('imagens/sons/pause.mp3');
musica.loop = true;

let tempoDecorridoEmSegundos = 5; //Ou seja, 25 minutos

let intervaloId = null;

input.addEventListener('change', () => {
    if (musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

//Aqui estamos adicionando um evento de click para os respectivos botões, com isso, pegamos o que estamos recuperando na variável html e setando um atributo novo para ela, que no caso é o data-contexto, o setAttribute recebe dois parâmetros, que são: O que queremos mudar, que no caso é o data-contexto e depois o que ele vai receber. E não só isso, estamos mudando a imagem também, que é a mesma lógica.

botaoFoco.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500; //Ou seja, 25 minutos
    alterarContexto('foco');
    botaoFoco.classList.add('active');
})

descansoCurto.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300; //Ou seja, 5 minutos
    alterarContexto('descanso-curto');
    descansoCurto.classList.add('active');
})

descansoLongo.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900; //Ou seja, 15 minutos
    alterarContexto('descanso-longo');
    descansoLongo.classList.add('active');
})

function alterarContexto(contexto) {

    mostrarTempo()
    html.setAttribute('data-contexto', contexto);
    imagem.setAttribute('src', `imagens/${contexto}.png`);
    botoes.forEach(function(contexto) {
        contexto.classList.remove('active');
    })

    switch (contexto) {
        case "foco":
            texto.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;

        case "descanso-curto":
            texto.innerHTML =  `Que tal dar uma respirada?,<br>
            <strong class="app__title-strong">Faça uma pausa curta.</strong>`
            break

        case "descanso-longo":
            texto.innerHTML = `Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        botaoIniciarOuPausar.innerHTML = 'Começar'
        imagemPausarOuComecar.setAttribute('src', 'imagens/play_arrow.png')

        fimTempo.play()
        let confirmacaoDoFimDoTempo = window.confirm('Tempo esgotado!')

        if (confirmacaoDoFimDoTempo == true || confirmacaoDoFimDoTempo == false) {
            fimTempo.pause()
        }     

        const focoAtivo = html.getAttribute('data-contexto') == 'foco'

        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        return
    }
    tempoDecorridoEmSegundos -= 1
    console.log('Temporizador: ' + tempoDecorridoEmSegundos)
    mostrarTempo()
}

startPauseBtn.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    botaoIniciarOuPausar.innerHTML = 'Pausar'
    imagemPausarOuComecar.setAttribute('src', 'imagens/pause.png')
    if(intervaloId) {
        imagemPausarOuComecar.setAttribute('src', 'imagens/play_arrow.png')
        botaoIniciarOuPausar.innerHTML = 'Começar'
        pausarAudio.play()
        zerar()
        return
    }
    inicioAudio.play()
    intervaloId = setInterval(contagemRegressiva, 1000) //Está como "1000" pois ele recebe como milisegundos, ou seja, 1 segundo
}

function zerar() {
    clearInterval(intervaloId)
    intervaloId = null
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000) // *1000 pois estamos trabalhando com milisegundos
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit' , second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()