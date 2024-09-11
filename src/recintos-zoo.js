export class RecintosZoo {
constructor() {
     this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: ['MACACO', 'MACACO', 'MACACO'] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: ['GAZELA'] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: ['LEAO'] }
];

     this.animais = {
            'LEAO': { tamanho: 3, bioma: ['savana'] },
            'LEOPARDO': { tamanho: 2, bioma: ['savana'] },
            'CROCODILO': { tamanho: 3, bioma: ['rio'] },
            'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'] },
            'GAZELA': { tamanho: 2, bioma: ['savana'] },
            'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'] }
        };
}

 analisaRecintos(especie, quantidade) {
        if (!this.animais[especie]) {
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }
        const resultados = [];
        const { tamanho: tamanhoAnimal, bioma: biomaAnimal } = this.animais[especie];
        const carnivoros = ['LEAO', 'LEOPARDO', 'CROCODILO'];
        const herbivoros = ['GAZELA', 'HIPOPOTAMO', 'MACACO'];
    
        this.recintos.forEach(recinto => {
            const { numero, bioma: biomaRecinto, tamanhoTotal, animais: animaisExistentes } = recinto; //desestruturação dos locais do zoológico
    
            const biomasRecinto = biomaRecinto.split(' e '); //garantir array de biomas do animal
            const compativel = biomaAnimal.some(bioma => biomasRecinto.includes(bioma));
            if (!compativel) {
                return;
            }
            const contemCarnivoros = animaisExistentes.some(animal => carnivoros.includes(animal));
        const contemHerbivoros = animaisExistentes.some(animal => herbivoros.includes(animal));
    
           if ((carnivoros.includes(especie) && contemHerbivoros) || (herbivoros.includes(especie) && contemCarnivoros)) {
                return //2) Animais carnívoros devem habitar somente com a própria espécie
            }
      if (especie === 'HIPOPOTAMO' && biomaRecinto !== 'savana e rio' && animaisExistentes.length > 0) { //// 4) Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
                return
            }
            // 5) Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
            if (especie === 'MACACO' && animaisExistentes.length === 0 && quantidade === 1) {
                return;
            }
    
            const espacoOcupadoAtual = this.calcularEspacoOcupado(recinto);
            const espacoNecessario = quantidade * tamanhoAnimal;
    
            const especiesExistentes = new Set(animaisExistentes);
       if (!especiesExistentes.has(especie)) {
                especiesExistentes.add(especie);
            }
//6) Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
            const espacoExtra = (especiesExistentes.size > 1) ? 1 : 0;
            const espacoOcupadoComExtras = espacoOcupadoAtual + espacoNecessario + espacoExtra;
    
         if (espacoOcupadoComExtras <= tamanhoTotal) {
            const espacoLivre = tamanhoTotal - espacoOcupadoComExtras;
                resultados.push({
                 numero,
                 espacoLivre,
                 tamanhoTotal
             })
        }})
    
        if (resultados.length === 0) {
            return { erro: "Não há recinto viável" }
        }
    
        resultados.sort((a, b) => a.numero - b.numero);
    
        return {
            recintosViaveis: resultados.map(result => `Recinto ${result.numero} (espaço livre: ${result.espacoLivre} total: ${result.tamanhoTotal})`)
        };
    }
    
    calcularEspacoOcupado(recinto) {
        return recinto.animais.reduce((acc, animal) => acc + this.animais[animal].tamanho, 0);
    }
}
