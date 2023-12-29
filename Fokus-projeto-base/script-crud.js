const botaoAdicionarTarefa = document.querySelector('.app__button--add-task');
const formularioAdicionarTarefa = document.querySelector('.app__form-add-task');
const areaDoTexto = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const botaoCancelar = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const botaoRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const botaoRemoverTodasAsTarefas = document.querySelector('#btn-remover-todas');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

let tarefaSelecionada = null
let liTarefaSelecionada = null

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `

    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    botao.onclick = () => {
        let novaTarefa = prompt("Novo nome da tarefa: ")

        if (novaTarefa == "") {
            alert('Por favor, insira uma tarefa.')
            return botao.onclick()
        } else if (novaTarefa == null) {
            return
        }

        paragrafo.textContent = novaTarefa
        tarefa.descricao = novaTarefa
        atualizarTarefas()
    }

    const imagemBotao = document.createElement('img')

    imagemBotao.setAttribute('src', 'imagens/edit.png')

    botao.append(imagemBotao)

    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', true)
    } else {
        li.onclick = () => {

            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                li.classList.remove('app__section-task-list-item-active')
                return
            }
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
    
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
    
            //CHAT-GPT QUE RESOLVEU, AQUI ESTAMOS PRIMEIRAMENTE PEGANDO TODOS OS ELEMENTOS QUE CONTÉM A CLASSE "app__section-task-list-item-active" que no caso é nenhum (POR ENQUANTO), COMO NÃO TEM NENHUM, ELE SÓ VAI SER ADICIONADO QUANDO CLICARMOS, OK, ADICIONOU, AÍ DEPOIS QUANDO CLICAMOS EM OUTRO ELEMENTO AQUELA CLASSE JÁ EXISTIA CERTO? CERTO, AÍ OQ O forEach faz, ELE Vê QUE QUANDO ESTAMOS CLICANDO EM OUTRO ELEMENTO AQUELA CLASSE JÁ EXISTE, POR ISSO ELE REMOVE ELA DO ELEMENTO QUE NELA ESTAVA E COMO ESTAMOS PEDINDO PRA ADICIONAR A CLASSE QUANDO CLICAMOS, ELE ADICIONA E REMOVE A OUTRA DE ONDE TAVA.
    
            document.querySelectorAll('.app__section-task-list-item-active').forEach(function(clicada) {  
                clicada.classList.remove('app__section-task-list-item-active')
                })
    
            li.classList.add('app__section-task-list-item-active')
        }
    }

    return li  //ESQUECI ESQUECI ESQUECI ESQUECI
}

botaoAdicionarTarefa.addEventListener('click', () => {
    formularioAdicionarTarefa.classList.toggle('hidden');

    //OU 

    // if(formularioAdicionarTarefa.classList.contains('hidden')) {
    //     formularioAdicionarTarefa.classList.remove('hidden')
    // } else {
    //     formularioAdicionarTarefa.classList.add('hidden')
    // }

    //O toggle é um jeito mais simplificado é que faz a mesma tarefa, mas fazer uma condicional e utilizar o método contains, add e remove também funciona, mas é recomendado o toggle quando vai se fazer a tarefa de adicionar e remover uma classe dessa forma.
})

formularioAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: areaDoTexto.value
    }
    tarefas.push(tarefa)
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    areaDoTexto.value = ''
    formularioAdicionarTarefa.classList.add('')
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
});

botaoCancelar.addEventListener('click', function cancelarFormulario() {
    areaDoTexto.value = '';
    formularioAdicionarTarefa.classList.add('hidden')
})

document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')

        if (liTarefaSelecionada.classList.contains('app__section-task-list-item-complete')){
            paragrafoDescricaoTarefa.textContent = ''
        }

        liTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item"
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefas = somenteConcluidas ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

//.app__section-task-list-item
 
botaoRemoverConcluidas.onclick = () => removerTarefas(true)
botaoRemoverTodasAsTarefas.onclick = () => removerTarefas(false)

