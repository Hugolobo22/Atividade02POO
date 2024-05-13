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

    constructor() {
        this.nome = ""
        this.ataque = 0;
        this.defesa = 0;
        this.hp = 0
        this.mp = 0
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
}

class Inventario{
    private itens: ItemInventario[];
    private quantidadeMaximaItens: number;

    constructor(quantidadeMaximaItens: number){
        this.itens = []
        this.quantidadeMaximaItens = quantidadeMaximaItens
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

}

class InventarioLimiteException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InventarioLimiteException";
    }
}