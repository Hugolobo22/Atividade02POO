abstract class Item{
    constructor(nome: string, descricao: string) {
        this.nome = nome;
        this.descricao = descricao;
    }
    protected nome: string;
    protected descricao: string;
    
    getNome(){
        return this.nome
    }
    setNome(n: string){
        this.nome = n
    }

    getDesc(){
        return this.descricao
    }
    setDesc(d: string){
        this.descricao = d
    }
    abstract aplicarBeneficios(personagem: Personagem);

    abstract removerBeneficios(personagem: Personagem);
}

class ItemInventario{
    private quantidade: number;
    private item: Item

    constructor(quantidade: number, item: Item){
        this.quantidade = quantidade;
        this.item = item;
    }

    getItem(){
        return this.item
    }
    getQuant(){
        return this.quantidade
    }
    setQuant(q: number){
        this.quantidade = q
    }
}

class Arma extends Item {
    constructor(nome: string, descricao: string) {
        super(nome, descricao);
    }
    aplicarBeneficios(personagem: Personagem) {
        personagem.aumentarAtaque(10);
        personagem.aumentarDefesa(5);
    }

    removerBeneficios(personagem: Personagem) {
        personagem.diminuirAtaque(10);
        personagem.diminuirDefesa(5);
    }
}

class Pocao extends Item{
    constructor(nome: string, descricao: string) {
        super(nome, descricao);
    }
    aplicarBeneficios(personagem: Personagem) {
        const hpRestaurado = personagem.getMaxHP(0.5)
        const mpRestaurado = personagem.getMaxMP(0.2)
    }
    removerBeneficios(personagem: Personagem) {}
}
class Personagem {
    private nome: string;
    private ataque: number;
    private defesa: number;
    private hp: number;
    private mp: number;
    private inventario: Inventario;
    private arma: Arma;


    constructor(nome: string, ataque: number, defesa: number, hp: number, mp: number, inventario: Inventario, arma: Arma) {
        this.nome = nome
        this.ataque = ataque;
        this.defesa = defesa;
        this.hp = hp;
        this.mp = mp;
        this.inventario = inventario;
        this.arma = arma;
    }

    getNome(){
        return this.nome
    }
    getAtaque(){
        return this.ataque
    }
    getDefesa(){
        return this.defesa
    }
    getHP(){
        return this.hp
    }
    getMP(){
        return this.mp
    }
    getInventario(){
        return this.inventario
    }
    getArma(){
        return this.arma
    }

    aumentarAtaque(valor: number) {
        this.ataque += valor;
    }

    diminuirAtaque(valor: number) {
        this.ataque -= valor;
    }

    aumentarDefesa(valor: number) {
        this.defesa += valor;
    }

    diminuirDefesa(valor: number) {
        this.defesa -= valor;
    }

    getMaxHP(valor: number){
        this.hp *= valor
    }    

    getMaxMP(valor: number){
        this.hp *= valor
    }
    
    abrirInventario() {
        console.log("Inventário:");
        this.inventario.getItensInv().forEach((item, indice) => {
            console.log(`${indice + 1} - ${item.getItem().getNome()} (${item.getQuant()})`);
        });
        console.log(`Total: ${this.inventario.getTotalItens()}/${this.inventario.getQuantidadeMaximaItens()}`);
    }

    usarItem(item: Item) {
        if (item instanceof Arma) {
            if (this.arma) {
                this.arma.removerBeneficios(this);
            }
            this.arma = item;
            this.arma.aplicarBeneficios(this);
        } else if (item instanceof Pocao) {
            item.aplicarBeneficios(this);
            const itemInventario = this.inventario.getItensInv(item);
            if (itemInventario) {
                const quantidadeAtual = itemInventario.getQuant();
                if (quantidadeAtual > 1) {
                    itemInventario.setQuant(quantidadeAtual - 1);
                } else {
                    this.inventario.removerItem(item);
                }
            }
        }
    }

    desequiparArma() {
        if (this.arma) {
            this.arma.removerBeneficios(this);
            this.getArma() = null
        } else {
            console.log("O personagem não está equipado com uma arma.");
        }
    }

    exibirInformacoes(): string {
        let info = `Nome: ${this.nome}\n`;
        info += `Ataque: ${this.ataque}\n`;
        info += `Defesa: ${this.defesa}\n`;
        info += `HP: ${this.hp}\n`;
        info += `MP: ${this.mp}\n`;
        info += `Arma equipada: ${this.arma ? this.arma.getNome() : 'Nenhuma'}\n`;
        info += `Inventário:\n`;
        this.inventario.getItensInv().forEach((item, indice) => {
            info += `${indice + 1} - ${item.getItem().getNome()} (${item.getQuant()})\n`;
        });
        info += `Total de itens: ${this.inventario.getTotalItens()}\n`;
        info += `Limite de itens no inventário: ${this.inventario.getQuantidadeMaximaItens()}\n`;
        return info;
    }
}

class Inventario{
    private itens: ItemInventario[];
    private quantidadeMaximaItens: number;

    constructor(quantidadeMaximaItens: number){
        this.itens = []
        this.quantidadeMaximaItens = quantidadeMaximaItens
    }

    getItensInv(){
        return this.itens
    }

    getTotalItens(): number {
        return this.itens.reduce((total, item) => total + item.getQuant(), 0);
    }

    getQuantidadeMaximaItens(): number {
        return this.quantidadeMaximaItens;
    }
    
    adicionarItem(item: Item, quantidade: number = 1) {
        if (this.itens.length >= this.quantidadeMaximaItens) {
            throw new InventarioLimiteException("Inventário cheio. Não é possível adicionar mais itens.");
        }

        const itemExistente = this.itens.findIndex((element) => element.getItem() === item)
        if (itemExistente !== -1) {
            this.itens[itemExistente].setQuant(quantidade);
        } else {
            this.itens.push(new ItemInventario(quantidade, item));
        }
    }

    removerItem(item: Item) {
        const index = this.itens.findIndex(itemInv => itemInv.getItem() === item);
        if (index !== -1) {
            this.itens.splice(index, 1);
        }
    }

}

class InventarioLimiteException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InventarioLimiteException";
    }
}

class itemMenu{
    private opcao: string;
    private textoOpcao: string

    constructor(op: string, txtop: string) {
        this.opcao = op;
        this.textoOpcao = txtop;
    }

    getOp(){
        return this.opcao
    }
    setQuant(o: string){
        this.opcao = o
    }

    getTxt(){
        return this.textoOpcao
    }
    setTxt(tx: string){
        this.textoOpcao = tx
    }
}

class Menu {
    private itensMenu: itemMenu[];

    constructor() {
        this.itensMenu = [];
    }

    imprimirMenu(): string {
        console.log("Opções do Menu:");
        this.itensMenu.forEach(item => {
            console.log(`${item.getOp}: ${item.getTxt}`);
        });

        return "";
    }
}

// Exemplo de uso
const menu = new Menu();

const opcaoSelecionada = menu.imprimirMenu();
console.log("Opção selecionada:", opcaoSelecionada);

const Hugo = new Personagem("Hugo", 10, 5, 15, 15, [], "")