/* Duvidas consultar Document.txt */
import { GithubUser } from "./gitHubUsers.js"

/* classe que vai conter a lógica dos dado, 
como os dados seram utilizados. */
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    /* mapeano de dados para creatRow*/
    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    /* salvando busca no local storage */
    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    /* function asincrona para receber dado do input search */
    async add(username) {
        const userExistents = this.entries.find(entry => entry.login === username)

        if(userExistents) {
            throw new Error('Usuário já cadastrado')
        }

        try {
            const user = await GithubUser.search(username)
            
            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }

    }

    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()

    }
    
}

/* classe que vai criar a vizualizaçao e eventos do HTML */
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    /* function config button e input */
    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }

        // favoritar através da tecla Enter
        window.document.onkeyup = event => {
            if(event.key === "Enter"){ 
              const { value } = this.root.querySelector('.search input')
              this.add(value)
            }
        }
    }

    /* chama e executa as functios a qualquer evento da pagina */
    update() {
        this.emptyState()

        this.removeAllTr()

        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`

            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            
            row.querySelector('.remove').onclick = () => {
                const isOk = confirm(`Tem certeza que deseja deletar ${user.name}?`)
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }

    /* create linha de usuario no js */
    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/ivanbs14.png" alt="imagem do usuario">
                <a href="https://github.com/ivanbs14" target="_blank">
                    <p>Ivan Barbosa</p>
                    <span>ivanbs14</span>
                </a>
            </td>
            <td class="repositories">
                234
            </td>
            <td class="followers">
                976
            </td>
            <td>
                <button class="remove">
                <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                    <svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" id="delete-alt" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line"><path id="secondary" d="M5,8H18a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H5a0,0,0,0,1,0,0V8A0,0,0,0,1,5,8Z" transform="translate(26 2) rotate(90)" style="fill: hsl(191, 31%, 42%; stroke-width: 2;"></path><path id="primary" d="M16,7V4a1,1,0,0,0-1-1H9A1,1,0,0,0,8,4V7" style="fill: none; stroke: #F75A68; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><path id="primary-2" data-name="primary" d="M10,11v6m4-6v6M4,7H20M18,20V7H6V20a1,1,0,0,0,1,1H17A1,1,0,0,0,18,20Z" style="fill: none; stroke: #F75A68; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path></svg>
                </button>
            </td>
        `

        return tr
    }

    /* remove as linhas de usuario feitas antes pelo html*/
    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }

    /* condiçao para exibir a div empty-state */
    emptyState() {
        if (this.entries.length === 0) {
          this.root.querySelector('.empty-state').classList.remove('hide')
        } else {
          this.root.querySelector('.empty-state').classList.add('hide')
        }
    }
}