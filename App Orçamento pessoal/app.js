class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano 
		this.mes = mes
 		this.dia = dia
		this.tipo = tipo 
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for( let i in this) {
			if(!this[i]) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)
			}

			recuperarTodosRegistros() {

				//array de despesas
				let despesas = []


				let id = localStorage.getItem('id')

				//recuperar todas as despesas cadastradas em localStorage
				for(let i = 1; i <= id; i++) {

					//recuperar a despesa
					let despesa = JSON.parse(localStorage.getItem(i))

					//existe a possibilidade de haver indeces que foram pulados/removidos
					//nestes cassos nos vamos pular esses indices
					if(despesa === null){
						continue
					}
					despesa.id = i 
					despesas.push(despesa)
				}
				return despesas
			}

			pesquisar(despesa) {

				let despesasFiltradas = []

				despesasFiltradas = this.recuperarTodosRegistros()

				//ano
				if(despesa.ano != ''){
					console.log('filtro de ano')
					despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
				}

				//mes
				if(despesa.mes != ''){
					console.log('filtro de mes')
					despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
				}

				//dia
				if(despesa.dia != ''){
					console.log('filtro de dia')
					despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
				}

				//tipo
				if(despesa.tipo != ''){
					console.log('filtro de tipo')
					despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
				}

				//descricao
				if(despesa.descricao != ''){
					console.log('filtro de descrição')
					despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
				}

				//valor
				if(despesa.valor != ''){
					console.log('filtro de valor')
					despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
				}

				return despesasFiltradas
				

			}

			remover(id) {
				localStorage.removeItem(id)
			}
		}

let bd = new Bd()


function cadastrarDespesa() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	//console.log(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
		)
	
	if(despesa.validarDados()){
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'


		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
		
	} else {

		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Existem campos obrigatórios que não foram preenchidos'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show')
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

	if(despesas.length == 0 && filtro == false){
    despesas = bd.recuperarTodosRegistros() 
  }
	//selecioandno o elemento tbody da tabela
	 let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''
	/*
	<tr>
        <td>12/06/2019</td>
        <td>Saúde</td>
        <td>4</td>
        <td>12</td>
        </tr>
	*/

	//percorrer o array despesas, listando cada despesa de forma dinamica
	despesas.forEach(function(d){


		//criando a linha(tr)
		var linha = listaDespesas.insertRow();

		//criar as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//ajustar o tipo
		switch(d.tipo){
      case '1': d.tipo = 'Alimentação'
        break
      case '2': d.tipo = 'Educação'
        break
      case '3': d.tipo = 'Lazer'
        break
      case '4': d.tipo = 'Saúde'
        break
      case '5': d.tipo = 'Transporte'
        break
		}
    linha.insertCell(1).innerHTML = d.tipo
    linha.insertCell(2).innerHTML = d.descricao
    linha.insertCell(3).innerHTML = d.valor

    //criar o botão de exclusão
    let btn = document.createElement("button")
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.id = `id_despesa_${d.id}`
    btn.onclick = function() {
    //remover a despesa
	let id = this.id.replace('id_despesa_', '')
		
	abreModal()
	bd.remover(id)
	
	//recarregar pagina apos fechar o modal
	let btn_voltar = document.getElementById('modal_btn_consulta')
	btn_voltar.onclick = function(){window.location.reload()}		
		
    }   
	
    linha.insertCell(4).append(btn)

    console.log(d)

	})
}

function pesquisarDespesa(){
	let ano = document.getElementById("ano").value
  let mes = document.getElementById("mes").value
  let dia = document.getElementById("dia").value
  let tipo = document.getElementById("tipo").value
  let descricao = document.getElementById("descricao").value
  let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	this.carregaListaDespesas(despesas, true)

}
	
function abreModal() {

	document.getElementById('modal_titulo_consulta').innerHTML = 'Registro removido com sucesso'
		document.getElementById('modal_titulo_div_consulta').className = 'modal-header text-success'
		document.getElementById('modal_conteudo_consulta').innerHTML = 'Despesa foi removida com sucesso!'
		document.getElementById('modal_btn_consulta').innerHTML = 'Voltar'
		document.getElementById('modal_btn_consulta').className = 'btn btn-success'

		//dialog de sucesso
		
 $("#modalRemoverDespesa").modal({
      show: true
    });
 
 }

 
 	
