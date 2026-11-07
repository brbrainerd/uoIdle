**Versão:** 0.68.0 · **Canal:** dev · **Data:** 2026-10-28

CDN: `news/server/dev.md`. O gump mostra este arquivo.
História completa no git: `CHANGELOG.md`.

## 0.68.0 — Sete classes no create, casters e reagentes SW

### Novidades

- Create com **7 classes**: Guerreiro, Berserker, Paladino, Ranger, Mago, Necromancer, Spellweaver.
- Necro/SW usam a skill da escola no cast/dano (sem Magery/Eval).
- Spellweaving gasta reagentes (livro + Gift of Renewal / Nature's Fury Idle).

### Melhorias

- Árvores lineares 1–60; Arrow + Reflect partilhados nos casters; kits e loja de reags alinhados.
- Poder por nível **invertido** vs Ethernul: casters ×80, físico ×60 (cura sem DamageFactor).

## 0.67.2 — Árvore do mago: Heal e Cure

### Melhorias

- Tronco do mago mostra **Heal**, **Cure** e Magic Arrow no nível 1 (iguais ao kit). Greater Heal no 20; Lightning libera no 20.

## 0.67.1 — Início de novo no nível 1

### Melhorias

- Personagem novo volta a começar no **nível 1**, alinhado com o equipamento da loja. Habilidades iniciais e poções lesser liberam no 1; o primeiro degrau de XP fica em 200.

## 0.67.0 — Progressão V3, pátio de treino e curva de XP

### Novidades

- Progressão V3: pontos de skill, status e atributo por nível; pátio de treino com manequim (físico e mágico), consumíveis/reagentes/munição de graça no pátio.
- Personagem novo começou no nível 0 (voltou ao 1 na 0.67.1).

### Melhorias

- Poder por nível na curva Ethernul ×55 (sem scale do spellbook).
- XP: early baixo e suave até o 40, ~×1,5 por dezena depois, pós-100 +0,6%/nível; Inferno um pouco mais lento (`XpPorDegrau` 0,05).
- Árvore: o L30 da coluna dá uma habilidade de verdade do caminho; reset com créditos; atributos da árvore antiga ficam na seção Atributos.

### Correções

- Dívida fantasma de status na migração; subclasse destrava de novo depois do reset.

## 0.66.1 — Tickets do Doom Gauntlet no card dos bosses

### Correções

- Os tickets do Doom Gauntlet aparecem na hora no card dos bosses — também os que estão no banco, como os resgatados do correio ou comprados no leilão. Antes só apareciam depois de entrar de novo no jogo.

## 0.66.0 — Escada de equipamentos, reparo, Sombra melhor de 5 e NPCs por ofício

### Novidades

- Escada de equipamentos: cada metal, madeira e couro pede um nível — metais aos pares (1, 20, 40, 60, 80, Avarite 100), couros 1, 20, 40 e 80. Cada degrau dá +12% de durabilidade e resistência na armadura e +8% de dano na arma. O material básico sai só por ouro.
- Armas e armaduras por classe, sem requisito de atributo: guerreiro sem arco nem cajado, arqueiro com arco, mago com cajado; couro e osso para todos, couro reforçado para o mago, malha (chain) para o arqueiro, ringmail e placas para o guerreiro.
- Reparo de armas e armaduras no Ferreiro, no Artesão e no Alfaiate: custa 40% do preço da peça, e cada reparo tira 10% da durabilidade máxima.
- Sombra do Monstro em partidas de melhor de 5: 5 imagens por ticket, a sombra fica 4 segundos na tela, sem dicas; quem acertar primeiro leva a rodada e quem levar 3 vence.
- Conquistas com o nível Trivial e marcos de pontos (50 a 2.000), cada um com uma roupa de prêmio pelo correio.
- Recarga de energia de +1 h, +4 h ou completa (cada uma conta como uma das 4 recargas do dia).

### Melhorias

- NPCs nas casinhas perto do banqueiro, juntos por ofício: Minerador e Ferreiro; Coureiro e Alfaiate; Provisioner e Fazendeiro. O Artesão fica ao lado do Lenhador.
- O Reagent Merchant agora se chama Provisioner, e o Tanner, Leatherworker.
- O guerreiro começa com uma Scepter (Força 40) no lugar da War Mace, e o arqueiro começa de malha.
- Prey: a lista nova é paga desde a primeira, e o bônus não se rola mais.
- Grupo de até 6 jogadores.
- Derreter vale só para metal colorido e devolve parte do que a peça custou.
- A tinta diz a cor e a raridade, e a peça pintada vai direto para o guarda-roupa.
- Prêmio semanal dos minigames: a tinta vem direto na carta e vai para a mochila ao resgatar.

### Correções

- O baú do prêmio semanal aparecia sem ícone no banco.

## 0.65.0 — Doom Gauntlet, Sombra do Monstro e ofícios novos

### Novidades

- Doom Gauntlet no lugar do boss mundial: 6 bosses por dia em horário fixo de Brasília, cada um na sua sala do mapa original do Doom e com as mecânicas dele. Avisos em vermelho no chat Global 15 e 5 minutos antes, ao nascer e ao morrer. Cada boss manda o seu ticket (negociável) com 5.000 de ouro pelo correio; o Dark Father pede 1 ticket de cada e dá um baú de 50.000 de ouro e artefato do Doom.
- Minigame Sombra do Monstro: sala única, mínimo de 2 jogadores, 1 ticket cobrado só quando a partida começa, ranking semanal e geral, e os 3 primeiros da semana ganham pelo correio um baú com tinta rara.
- NPC Coureiro com a skill Tanning (30 a 100, comprada com ouro) e couro por hora no banco; o costureiro cobra ouro e couro nas armaduras de couro.
- Lenhador no estilo do UO Outlands, com as madeiras até Avarwood (110) e pergaminhos para passar de 100.
- Artesão: Fletcher e Carpinteiro num ofício só (Carpentry), com munição, arcos, bestas, cajados e escudos de madeira.
- Novo metal Avarite (110) na mina, com lingote próprio.
- Ferreiro: Derreter devolve 20% dos lingotes da arma ou armadura, no metal dela, direto no banco.
- Guilda: começa com 4 vagas e ganha mais 4 por nível; o líder e os co-líderes definem a contribuição mínima e o nível mínimo para entrar; doação livre a partir do mínimo, quantas vezes quiser; 9 conquistas de guilda.

### Melhorias

- Armaduras por classe e nível, sem exigência de força: mago couro, arqueiro tachas e osso, guerreiro metal. A loja recusa a de outra classe.
- Recompensa diária em dobro para VIP.
- Ouro e UOCoin avisam o cliente na hora em que mudam.
- Leilão: reagentes e itens de ofício voltaram a poder ser vendidos.
- Prey: liberar o slot mantém a mesma lista de monstros.
- Conquistas novas do coureiro, do lenhador, do artesão e do Avarite; as do alfaiate saíram.

## 0.64.0 — Caça (IA/DGs), mina e subclasses do mago

### Novidades

- Caça: IA do bot em módulos; validação de entrada (energia, prontos, caça ativa); dificuldade escala status/skills/mana/stam e XP.
- Novas DGs (fogo, formigueiro, orc, pântano, village) e família ratman/alligator.
- Mina: lingotes do pack/banco passam a saldo virtual de metal; comandos staff com alvo opcional.
- Mago: Necro (Strangle, Animate Dead, Lich 90s), Cleric (Bless, Arch Protection, Thunderstorm), elementais de Fogo/Ar (90s); summons limpam ao sair da caça.

### Melhorias

- Removidas flags de grupo do perfil do bot (fugir, puxar, peel, parado).

## 0.63.1 — Conquistas sem o alfaiate

### Correções

- Saíram as três conquistas do alfaiate (contratar, Tailoring 50 e 100): as roupas agora são só por ouro e não há mais alfaiate para contratar.

## 0.63.0 — Lenhador perto das árvores e conquistas de madeira

### Novidades

- **Conquistas de Lenhador e madeira**: contratar o lenhador, o flecheiro e o carpinteiro; Lumberjacking 50, 80 e 100; Bowcraft/Fletching e Carpentry 50 e 100; receber 1.000 tábuas; receber uma tábua de Avarwood.

### Melhorias

- O **Lumberjack** saiu da casa do Miner e agora fica perto das árvores (92, 77).
- O **Carpenter** passou para o lugar antigo do Lumberjack, na casa do Miner.

## 0.62.0 — Lenhador, ofícios por material e materiais no banco

### Novidades

- **Lenhador** (Lumberjack): Lumberjacking de 30.0 a 100.0 comprado com ouro; entrega tábuas por hora, e a madeira é sorteada pela skill — Wood, Dullwood 65, Shadowwood 70, Copperwood 75, Bronzewood 80, Goldwood 85, Agapwood 90, Veriwood 95, Valorwood 99 e Avarwood 100.
- **Quatro ofícios**: ferreiro, costureiro, fletcher e **carpinteiro** (NPC novo). Cada um vende as peças clássicas do UO que lhe cabem: o ferreiro só as de minério, o fletcher arcos, bestas e munição, o carpinteiro as de madeira.
- **Cada peça em cada material**: ferro (e madeira comum) em 30.0; os metais e madeiras coloridos pedem a skill da escada e custam o material deles.
- Flecheiro e carpinteiro com skill própria, treinados com ouro e madeira.

### Melhorias

- **Materiais de verdade**: lingotes, algodão, reagentes e tábuas vão para o banco como itens, e os ofícios gastam o que está no banco e na mochila.
- Roupas e armaduras de couro, tachas e osso do costureiro só por ouro.
- Itens empilháveis se juntam sozinhos (tickets, reagentes da bolsa para a mochila).
- A energia volta pelo tempo real fora da caçada, mesmo offline.
- Recarga de energia mais cara: 10 gp × nível × minutos que faltam × nº da recarga do dia.
- Câmbio: taxa de 5% sobre o ouro de quem vende UOCoin; não dá para anunciar pior do que uma oferta do outro lado; compra e venda anônimas.
- Trocar de caminho só com o pergaminho da Loja (300 UOCoin).
- Leilão e RMT sem consumíveis.

### Correções

- A lavoura não planta mais Bloodmoss.
- Sem peças repetidas no ferreiro; Club e Wooden kite shield passaram ao carpinteiro.

## 0.61.0 — LFG: pedido, TP e late join

### Correções

- `partylfgjoin` / `ok` / `no` por serial; o líder resolve-se **antes** de dissolver o party solo (pedir no próprio card já não apaga a caçada pública).
- Pedido de TP só noutra mapa/instância, longe, ou com o líder a caçar.
- `PartyGoLider` com o líder na DG: `TryJoinPartyHunt` mete o membro na mesma caçada.

## 0.60.0 — Câmbio de UOCoin, a lavoura e os NPCs do classic

### Novidades

- **Câmbio de UOCoin** entre jogadores: ofertas de venda (as UOCoin ficam reservadas) e ordens de compra (o ouro fica reservado), que qualquer outro jogador pode pegar inteiras ou em parte, mesmo com o dono fora do jogo. Cancelar devolve o que sobrou. Até 20 ofertas por conta.
- **A lavoura e o lavrador** (o Farmer, ao lado do Miner): Herding de 30.0 a 100.0 com ouro, até 120.0 com os pergaminhos de pastoreio da Loja. Ele planta o que você escolher, tudo liberado desde o início: algodão ou Garlic, Ginseng, Bloodmoss, Mandrake Root e Nightshade. Os reagentes vão para o banco de quem coleta.
- **O alfaiate** no costureiro: Tailoring de 30.0 a 100.0 com ouro e algodão; cada roupa pede o Tailoring da receita do UO e custa ouro mais algodão.
- Conquistas da lavoura e do alfaiate, e as séries de cores de roupas e de montarias.

### Melhorias

- Os NPCs vendem só o que é do Ultima Online clássico: tudo de ferro já com Blacksmithy 30.0, couro, tachas e osso no costureiro, e o costureiro só com as roupas clássicas.
- Leilão: não se anunciam mais UOCoin — a compra e a venda de UOCoin por gold ficam no câmbio (aba UOCoin). Os anúncios que já existem continuam até vender ou cancelar.

### Correções

- Correio: o ouro resgatado vai para o saldo do personagem, a mensagem diz isso e a carteira atualiza na hora.
- Leilão: só as tintas levam o nome da cor.

## 0.59.0 — UOCoin compradas chegam na conta

### Novidades

- As UOCoin compradas chegam na sua conta poucos segundos depois de o pagamento ser confirmado, com um aviso no chat se você estiver no jogo.

## 0.58.0 — Staff: gold/level em outro jogador

### Melhorias

- `[IdleSetGold`, `[IdleSetLevel` e `[IdleSetCoins` aceitam nome opcional: `IdleSetGold Nick 5000` (sem nick = a ti).
- Props `IdleGold` / `IdleClassLevel` / `IdleClassName` no personagem alvo (além do UOCoin).

## 0.57.0 — Staff: ouro, nível e coins

### Novidades

- No `[props` do personagem: `IdleGold`, `IdleClassLevel` e `IdleClassName` (só leitura); `UOCoin` já existia.
- Comandos `[IdleSetGold` e `[IdleSetCoins` na própria conta (como o `IdleSetLevel`).

## 0.56.0 — Cooldown por ponto na caça

### Melhorias

- Cada ponto da dungeon volta a ter o seu tempo de respawn (independente dos outros). A dificuldade define o tamanho do grupo e esse tempo.
- Tempos em degraus de 5s: Trivial 50s · Fácil 45s · Médio 40s · Desafiador 35s · Difícil 30s · Pesadelo 25s · Inferno 20s.

## 0.55.0 — Energia da caça e hotbar do bot

### Correções

- Energia a zero encerra a caça no mesmo tick (sem farm “de graça” depois do HUD zerar), com avisos no chat (~36 min / ~7 min / acabou).
- Sem energia não entra na DG; no grupo, quem está sem energia fica de fora.
- Hotbar: gap das poções segue o CD real (não 400 ms); sem pot/bandagem/reags/mana o bot nem tenta o slot (não trava o farm); slot sem condição extra usa a regra base do catálogo (ex. em combate / cura).
- Poção de cura não bebe com vida cheia; limiar absoluto de HP/Mana acima do máximo do personagem deixa de falhar para sempre.

## 0.54.0 — Chat Global/Comércio e AoE da hotbar

### Novidades

- Chat Global no shard e anúncios de Comércio (item + preço), com lista de itens para o picker.

### Melhorias

- Habilidades em área (Whirlwind etc.) só disparam com 3 ou mais inimigos de verdade perto — pack da caçada ou agro, não animal da cidade.

### Correções

- A contagem de “inimigos perto” ignora pet, summon e criatura abençoada.

## 0.53.0 — Mineiro e ferreiro por skill, e conquistas

### Novidades

- O mineiro agora tem Mining de 30 a 100, subindo de 0,1 em 0,1 com ouro (botões de 1x, 5x e 10x); acima de 100, até 120, com os pergaminhos da Loja.
- Quanto maior o Mining, maior a chance de vir outros metais além do ferro.
- O ferreiro sobe Blacksmithy com ouro e lingotes, e cada faixa libera mais armas, armaduras e escudos para comprar.
- Conquistas: metas da conta (caça, coleção, mina e progresso) com pontos e uma pequena recompensa pelo correio. O que você já fez conta desde já.
- Aviso no topo da tela quando um Paragon aparece na sua caçada, e quando você ganha uma cor de Paragon.
- Quando alguém ganha uma cor de um Paragon, todos veem uma linha dourada no chat Global.
- A raridade da cor que o Paragon deixa depende do monstro: o rato quase sempre deixa cores comuns (com uma chance pequena de rara), e quanto mais difícil o monstro, mais raras as cores.

### Melhorias

- O ferreiro vende só as peças do UO clássico, e passar o mouse numa peça mostra as propriedades dela.
- Na compra dos mercadores dá para levar até 10.000 de uma vez.
- Toda compra (mercadores, Loja, leilão e RMT) deixa uma linha no seu chat, na aba Sistema.
- O nome da guilda aparece numa linha acima do nome do personagem.
- Na criação de personagem, as cores de roupa, cabelo e barba são só cores comuns.
- As cores sem nome no catálogo usam o nosso número.
- Nomes como Mage, Archer e Blacksmith agora são permitidos.
- As respostas ao pedir amizade ficaram mais claras.
- Chapéus, máscaras e sapatos com atributo contam como equipamento no boneco do inventário.
- O bestiário mostra as cores que o Paragon de cada criatura pode deixar.

### Correções

- Armaduras e reagentes não podem mais ser vendidos na Loja (os escudos continuam).
- A mensagem de compra nos mercadores não vai mais para a aba Combate.
- Os nomes dos itens nas mensagens e no correio não mostram mais o "%s%" do plural.
- Os números nas mensagens do jogo saem com ponto de milhar (5.505 gp), não com vírgula.

## 0.52.0 — Caça em grupo, HUD supply e logout

### Novidades

- Contagens de reagentes e flechas para o HUD (`#SUPPLY`).
- Busca de jogadores (`[idlewho`).
- Poções e bandagem anunciam no chat e na cabeça.

### Melhorias

- Grupo: LFG e aviso quando um membro morre.
- Ranger no farm: kite/ataque como o mago; fica perto do outro DPS.
- Sem reagentes: para de spam cast e avisa uma vez.
- Portão de Cove com arte nova.

### Correções

- Dá para deslogar depois da caça (limpa o “em combate” residual).
- Flechas respeitam parede na caça.
- Provocar não dispara à toa.

## 0.51.0 — Esgoto, ouro de cada um e alcance do mago

### Melhorias

- A entrada do esgoto dos ratos e o chão andável acompanham o mapa novo. A entrada antiga estava em cima de uma parede.
- O ouro passa a ser de cada personagem. Um personagem novo começa com 2.000. O que ainda estava na conta é dividido uma vez entre os personagens vivos e a conta fica zerada.
- O mago só segura distância até 8 tiles. O bot deixa de parar fora do alcance da magia.

### Correções

- Quem caça de longe consegue sair de um beco sem saída, em vez de só se afastar do rato. Os ratos perseguem mais longe.

## 0.50.0 — Mina, ferreiro e Paragon

### Novidades

- A mina: um mineiro por conta que produz lingotes de ferro de hora em hora, com títulos de Novice a Legendary; com VIP, a produção dobra e a coleta é automática.
- O ferreiro: contratado na mina e treinado com lingotes; o título dele libera as armas das lojas aos poucos, e cada arma custa ouro mais os lingotes da receita.
- Monstros Paragon podem deixar uma roupa numa cor comum, que vai direto para o guarda-roupa — e chega uma carta avisando.
- Quem convida ganha 10% da UOCoin que os amigos convidados comprarem.

### Melhorias

- As lojas vendem só armas e armaduras comuns, nunca artefatos.
- A aba Personagem recebe os bônus de skill dos itens vestidos.
- A prontidão do grupo se atualiza quando alguém fica pronto pelo painel ou sai do grupo.

### Correções

- Pedir para sair da caça sem estar caçando recebe resposta na hora.

## 0.49.0 — Barra de 12 e cor da roupa

### Mudanças

- A barra do servidor aceita 12 slots
- A cor do robe e da capa escolhida na criação fica no kit. Fora da faixa de tinta, continua a cor original

## 0.48.0 — Montarias, classes e caça em grupo

### Novidades

- Novos itens etéreos no [add]: raptor, tigres, unicórnio, palomino, dente-de-sabre, leão, caranguejo, javali de guerra, capivara, cães, clydesdale e cavalos elementais, além de ostard, ridgeback selvagem, dreadhorn, esfinge, esqueleto e dragão do pântano com armadura

### Correções

- A cor da montaria fica gravada. Montar já não a põe translúcida sozinho

### Mudanças

- O XP sobe mais suave até o nível 100 e, depois, 0,5% por nível
- Magery e Meditation sobem na caça. O dano da arma achata depois dos 100
- Os ranks e as passivas da árvore passam a valer. A subclasse dá a skill da coluna
- A criação oferece guerreiro, ranger e mago
- O loot da caça é ouro. As fichas dos bichos ficam num catálogo
- O bot usa só a barra e segura a distância pedida, com dois tiles de folga no arco e na magia
- Quem segue anda até o tank. O Provocar segura o bicho nele, mesmo o que já estava no aliado
- O kit inicial traz cura, antídoto, stamina e mana. O ranger leva 300 flechas e já não começa com Hiding
- Caça a solo não herda o seguir da party
- O esgoto usa o pack `dg_esgoto`
- Pergaminhos de poder +1, +5 e de ligação. A skill fecha em 100
- Manequins de treino. Cove deixa de ser zona de combate

### Correções

- Sair da dungeon enche vida, stamina e mana e tira o veneno do golpe que matou
- O mago deixa de repetir a mensagem de recuperação da magia
- O pack acorda se o caçador já está na distância de ataque
- O nascimento deixa de travar quando a rota insiste no mesmo passo
- Quando o bicho entra na banda, a fuga ganha da cura e do cast

## 0.47.0 — Dungeon dos ratos no mapa novo

### Mudanças

- A caça dos ratos usa um mapa em branco 64×96. O chão vem do pacote do cliente; o servidor não abre o map1.mul
- A entrada fica em 13,70, virada para leste, e os oito pontos de bicho acompanham o mapa novo

## 0.46.0 — Caça: boss, Paragon e cavalo

### Melhorias

- O boss mundial fica 60 minutos (eram 30)
- Paragon com 0,1% de chance em todos os níveis (era 0,01%)
- O cavalo de carga sai do mundo enquanto o dono caça e volta ao lado dele

## 0.45.0 — Personagem e pedra de transferência

### Novidades

- A aba Personagem soma o que os itens vestidos dão: atributos, resistências e bônus
- Pedra de transferência (Loja, Serviços): passa as propriedades extras de uma arma para outra

### Melhorias

- Inspecionar outro jogador: separa roupa de equipamento, sem o status e as maiores skills

## 0.44.0 — Convites de amigos

### Novidades

- Convide amigos: por amigo que criar conta e personagem, 1.000 gp pelo correio e +0,1% de XP (até 1%)

## 0.43.0 — Prey: preços

### Melhorias

- Prey: liberar um slot e pedir uma lista nova são de graça uma vez por dia em cada slot; depois o preço sobe com o nível e dobra a cada uso, numa série de 24 h
- O ouro nas mensagens do Prey no formato brasileiro (2.000)

## 0.42.0 — Mercadores da cidade

### Novidades

- Costureiro na casa dos mercadores: todas as roupas do jogo na cor original
- O provisioner virou ferreiro: todas as armas e armaduras (e continua comprando minério, toras e tábuas)
- Cocheiro: as montarias da Loja, por UOCoin

### Melhorias

- A mensagem de compra diz o nome do item

## 0.41.0 — Estábulo e recompensas

### Novidades

- Dois cavalos na Loja (comum e de guerra) e a lhama
- Recompensa diária com tickets de minigame todo dia (3, VIP 6), uma tinta comum e os prêmios especiais do mês
- Ranking semanal do UO Survivor: os 3 primeiros em abates ganham um baú com tinta rara pelo correio

### Melhorias

- As montarias compradas vão para a coleção, no Estábulo

## 0.40.0 — Loja e cores

### Novidades

- A janela da tinta diz o tipo de cada peça (roupa, armadura, arma, joia, montaria)

### Melhorias

- A tinta pinta só roupas e montarias — a cor de armas e armaduras vem do minério
- Uma cor por peça: a tinta troca a cor (a anterior se perde); o removedor devolve a cor num frasco e a peça volta à original. Peças que tinham várias cores viraram uma peça por cor
- 40 cores que o jogo desenha iguais a outra saíram do catálogo (peças já pintadas continuam como estão)
- Cores da família Breeding uma raridade abaixo
- As roupas iniciais sempre na cor original

## 0.39.1 — Caça: mid-stops sem tremor

### Correções

- Mid-stops da warren: “chegou” a 4 tiles; no 1.º stall salta o elo (antes ~25s parado a tremer com HUNTNAV, ex. Magin nos ratos)
- Menos reenvios de navegação enquanto travado

### Novidades

- Script `docs/infra/fetch-hunt-logs` para puxar os logs de farm da VPS

## 0.39.0 — Economia: loot, probe, loja

### Novidades

- EconomyProbe: dumps de items/mobs/materials para o toolkit (gear/resources HTML)
- Loot de caça volta ao vanilla com prune Idle (ouro partilhado lobby/bestiário)

### Melhorias

- Provisioner compra armas/armaduras dropadas (sink de gear)
- Beber poção **consome** sem deixar garrafa vazia; NPC de reags **não** compra pots
- Bone armor de esqueleto menos frequente na caça

### Correções

- HuntBestiario usa a mesma fonte de ouro do lobby (`OuroDoNivel`)

## 0.38.0 — Party sync e caça em grupo

### Novidades

- Party: saída em cadeia, proposta de caça do líder e auto-aceitar entrada dos membros
- Hotbar Cure/Heal pode curar a si **ou** um aliado do grupo
- Pré-check no portão (`[Hunt] CHECK`) antes de andar à DG
- Logs de debug de party/bot em ficheiro (`Logs/hunt/`)

### Melhorias

- HoldTank: seguidores não passam à frente do tank; mago engaja no pack com linha de visão
- Hotbar ofensiva em rodízio; ForceBackstep só quando não está no mesmo tile
- Distância / banda de approach + LOS em magia e flechas
- Grupo tem de estar todo no portão antes de entrar
- Cores das poções de mana e Intelligence no catálogo do NPC

### Correções

- Magery Idle consome reagentes de verdade (sair sem reags volta a funcionar)
- ClearHands / alcance longo só em caça ou treino (fora Idle comporta-se como UO)
- HoldTank sem oscilar; PathFollower menos preso online
- Remount pós-morte não rouba montaria de outro personagem da conta
- Aviso de durabilidade só com jogador ligado

## 0.37.0 — Mage hunt polish (ouro, pots %, INT, caça)

### Novidades

- Ouro da conta (virtual): sem pilhas no inventário/banco; criação em Cove em 95,115
- Poções de Intelligence (normal e greater) na loja e no kit Idle
- Condições da hotbar: só beber buff se ainda não tiver Str/Dex/Int ativo
- Pack de walk da DG warren (`dg.json`) no shard

### Melhorias

- Poções de cura e mana: **15% / 25% / 35%** da vida/mana máxima (lesser / normal / greater)
- Magias Heal / Greater Heal Idle: **15% / 35%** da vida máxima do alvo
- Preços da loja de Cove sobem; garrafa removida; reagentes Magery mantidos
- Paladino Idle: Chivalry gasta ouro da conta **1 gp por ponto** (sem refill fantasma de 10k)
- Poção de mana com hue mais escuro (parece night/invis, não agility)
- Desgaste de equipamento por classe; loja com 300 HP; aviso a 20%
- Ranks de habilidades I–II, CDs de ItemUse, lista de reagentes no HABINFO

### Correções

- Mago na caça: não desarma o cajado; kit inicial mais leve; cajado conta como ranged para Distância
- Banda de alcance + kite sem travar casts; Distância do bot respeitada
- Sai da caça se faltar reagente das magias da hotbar; saída sem munição para ranged
- Entrada, Harm, GiantRat, follow, packs limpos; login não puxa quem está em Cove para o portal
- Portão da cidade é decoração (sem moongate DG); hook de ouro no Connected
- Remonta ethereal após morte; logout 0xD1 cancela farm offline
- Instâncias DG / `[go]` / warren

## 0.36.0 — Removedor de tinta

### Novidades

- Removedor de tinta (50 UOCoin na Loja): tira uma cor de uma roupa e devolve um frasco daquela cor
- A cor original da roupa não sai

## 0.35.0 — Comprar UOCoin sem saldo

### Melhorias

- Comprar algo em UOCoin sem saldo abre a tela de comprar UOCoin

## 0.34.0 — Catálogo de cores

### Novidades

- 464 cores com raridade, todas à venda na Loja como tintas
- A tinta pinta também as montarias

### Melhorias

- O guarda-roupa guarda só roupas (armadura fica fora)

## 0.33.0 — Coleção de montarias

### Novidades

- Montarias da conta numa coleção; as da Loja vão direto para ela

## 0.32.0 — Guarda-roupa da conta

### Novidades

- Guarda-roupa da conta: as roupas ficam guardadas para todos os personagens
- Cada roupa guarda as cores que já recebeu; vende-se uma cor no Leilão e as outras ficam

## 0.31.0 — HorseBag de longe

### Melhorias

- A bolsa do cavalo abre de qualquer distância

## 0.30.0 — Energia

### Novidades

- Recarga de energia paga em ouro: enche tudo, até 4 vezes por dia

### Melhorias

- A energia volta fora da caça, online ou offline (12 h do zero ao cheio)

## 0.29.0 — Prey: preço pelo nível

### Melhorias

- Lista nova do Prey grátis uma vez a cada 24 h por slot; depois custa conforme o seu nível
- Rolar o bônus fica mais caro a cada clique, e volta ao início 24 h depois

## 0.28.0 — Boss mundial a cada 2 h

### Melhorias

- O boss mundial nasce 2 h depois do fim do anterior

## 0.27.3 — Login: nome do char no mundo

### Correções

- Ao bloquear login (conta já no mundo / caça offline), tip e log com o nome do personagem

## 0.27.2 — Cura absoluta e loja

### Correções

- HP/mana absoluto ≤ vida máx. deixa de travar a caça em full (HealBetween eterno)
- Nightshade fora da loja de reagentes (junto com poison/explosion já deferred)

## 0.27.1 — Caça: cura entre packs sem travar kite

### Correções

- Entre packs, o bot espera a cura e mostra na cabeça o motivo (falta bandagem/poção, a curar…)
- Ranger/mago: a fuga (kite) deixa de ser cancelada pelo hold de cura
- Poções de mana/buff não contam mais como necessidade de cura (`HealBetween` eterno)
- HabInfo: passives fora da lista; Custom sem CD declarado usa piso de 2 s
- Overhead de cura usa o mesmo tier de poção que o drink da hotbar
- Throttle do announce de cura à prova de wraparound do `TickCount`

## 0.27.0 — Caça: mapas sunken Z + hotbar/veneno

### Melhorias

- Spawn/entrada das DGs usam Z do mapa (bosque2 ~-40; layouts com z:0 não flutuam)
- Hotbar join OR/AND; bandagem e cure com detecção de veneno
- Alcance melee das skills alinhado ao `AlcanceDeAtaque` (sem range 2 fixo)
- XP overhead sem `+`; cura/dano com feedback Idle

## 0.26.2 — O portal da caça voltou

### Correções

- O portal azul da caça, em Cove, voltou ao seu lugar e não some mais quando o servidor reinicia

## 0.26.1 — Boss mundial mais forte

### Melhorias

- O boss mundial tem 10 vezes mais vida

## 0.26.0 — Prey com lista sorteada e boss frequente

### Melhorias

- Prey: cada slot livre sorteia três monstros diferentes, sem repetir os dos outros slots; só um deles pode ser escolhido
- Nova lista de monstros por 1.000 gp do banco; liberar ou terminar um Prey dá uma lista nova de graça
- Boss mundial frequente: um boss novo poucos segundos depois do fim do anterior (para testes)

## 0.25.0 — Entrar com Discord

### Novidades

- Contas do jogo podem entrar pelo Discord (o banco guarda o id da conta do Discord)

## 0.24.7 — Caça: MandarInfo no resume

### Corrigido

- Reconnect com caça offline: manda de novo níveis/monstros (`MandarInfo`)


## 0.24.6 — Guerreiro sem mana / Meditation

### Mudanças

- Abilities do guerreiro custam 0 mana (customs + WeaponAbility)
- Meditation cap 0 e zerada no login/create do guerreiro


## 0.24.5 — HABINFO + habilidade fixa

### Adicionado

- `[habinfo` → `#HABINFO` (dano/CD/mana)
- Habilidade padrão da classe sempre tentada pelo bot

### Mudanças

- Menos sangue na caça; aviso ao quebrar a arma


## 0.24.4 — Tutorial

### Adicionado

- Tutorial do primeiro login (estado por conta no shard)


## 0.24.3 — Twitch

### Adicionado

- Twitch: ouro por assistir às lives oficiais


## 0.24.2 — Prey

### Adicionado

- Prey: bônus contra um bicho da caça (3 slots: grátis, VIP, loja; dano / redução / XP)

## 0.24.1 — Banqueiro NPCs + guilda

### Novo

- Banqueiro na lista de NPCs da cidade
- Guilda manda `possoPagar` e refresca o painel ao recusar contribuição

## 0.24.0 — Boss mundial

### Novidades

- Boss mundial uma vez por dia, num horário sorteado, numa arena só dele
- A luta usa o bot da caça; o boss troca de alvo, dá golpes em área e arremessa em quem está longe
- Quem participou recebe um baú pelo correio
- Placar com o dano real de cada jogador

## 0.23.18 — Ouro stack na mochila/banco

### Correções

- `Gold.OnDroppedInto`: junta com a maior pilha em backpack/bank

## 0.23.17 — Review Copilot (cura/cadeia)

### Correções

- Feedback pot/bandage guardado para offline/pets; poções desconhecidas sem gate L10
- Cadeia avança se o pack actual estiver inacessível

## 0.23.16 — Cura +N no combate

### Correções

- Heal pot / bandage: `Cura +N` no chat (hue 0x22) e na cabeça; sem cliloc genérico

## 0.23.15 — Feedback de cura e bless

### Correções

- Bandage: quantidade curada no paciente; ao curar aliado o healer vê `Curou X: +N`
- Poções agility/strength/refresh: `Agilidade/Força/Stamina +N` no chat e overhead

## 0.23.14 — Pack sem teleporte

### Correções

- Mobs ficam no ponto até o caçador chegar; sem rush/teleporte; pack assist só a pé após contacto

## 0.23.13 — Hunt: warmode + cast sem target

### Correções

- Tab/cliente não desliga warmode na caça
- Magias na caça: TargetLocked (sem cursor) e alvo no Combatant

## 0.23.12 — Pack chase real na DG

### Correções

- Pack: velocidade activa + leash largo; se a parede impede o path, rush ao lado do caçador

## 0.23.11 — Pack pull: Action=Combat

### Correções

- Pull setava Combatant mas a IA ficava em Wander → mobs parados; agora força Combat + Prod

## 0.23.10 — Pack pull na DG

### Correções

- Grupo do ponto: todos os mobs atacam o caçador (não só o primeiro com LOS)

## 0.23.9 — L10 abilities + chat caça/combate

### Mudanças

- Unlock L10 em todas as classes (Warrior: Armor Break L10; Heavy Strike L20)
- Rota/loot/travado → `#BOTLOG` (botdbg), não System
- Combat log: bandagem, poção, abilities, XP, level-up

## 0.23.8 — Kit lesser ×25 + pot por nível

### Correções

- Create kit: 25× Lesser Heal (stack forçado); sem Heal regular no start
- Bot/hotbar: poção por Idle level (L1 lesser, L10 heal, L20 greater) — serial não bypassa
- Mage: Lesser Heal L1; Heal Potion só L10

## 0.23.7 — Cadeia de pontos fluida + hotbar

### Correções

- Cadáver deixava o pack “ocupado”: mortos saem da lista e o próximo ponto nasce já
- Bot segue o índice da cadeia 1 a 1 (sem escolher pack por distância/ameaça)
- Necessidade de cura deixa de travar a viagem ao próximo ponto
- Abilities de combate só pela hotbar (sem auto `TryCombatAbility`)

## 0.23.6 — Ouro do kit empilha com loot da caça

### Correções

- Kit inicial dá `HuntGold` (mesmo tipo do loot) em vez de `Gold` clássico
- `Gold` ↔ `HuntGold` passam a poder empilhar (mesmo art 0xEED)
- Fallback `HuntCura` só corre se a hotbar não actuou neste tick (evita curar self a caminho do aliado)

## 0.23.5 — Cura na caça (fallback)

### Correções

- `HuntCura` volta a correr mesmo se a hotbar tiver regra de heal que falha
- Bandagem/consumível deixa de mirar o Combatant hostil por omissão
- Limiar de vida do fallback alinhado a 70%

## 0.23.4 — Caça em cadeia (sem cooldown)

### Mudanças

- Próximo ponto só nasce quando o actual está totalmente morto
- Dificuldade = tamanho/mistura do grupo; sem tempo de respawn por nível

## 0.23.3 — Offline: reconnect mantém caça

### Correções

- Refresh/reconnect do cliente no meio do farm offline deixa de evacuar pra Cove
- Ao voltar, manda `[Hunt] JOIN` para o painel do cliente retomar

## 0.23.2 — Farm offline como no peso

### Correções

- Caça offline volta a reter na queda de net: só «sair da conta» cancela (whitelist Copilot bloqueava refresh/socket)

## 0.23.1 — Kit de criação + review caça/energia

### Novidades

- Kit de classe força o equipamento no create; spawn em Cove olhando para SE
- Energia da caça grava no world save (não enche ao reiniciar o shard)

### Correções

- Caça offline: `SendMessage` só com NetState (sem crash no tick)
- Brace / Armor Break deixam de aplicar duas vezes (só em `AOS.Damage`)
- Apagar personagem limpa o estado de energia
- Postgres de docs alinhado a `uoidle-postgres` na rede `uoidle-web`
- Sem ticket Young no banco (shard Idle)

## 0.22.1 — Review farm offline

### Correções

- Kick/ban/lockdown e outros disconnects do servidor não ativam farm offline
- `IdleOfflineFarm.Configure` idempotente (sem registro duplo no login)

## 0.22.0 — Farm offline na caça

### Novidades

- Cai a net na caça: o personagem continua a farmar no shard até acabar a energia ou saíres da conta

## 0.21.19 — Review hotbar / abilities

### Correções

- Target de magia após Cast; IdleHotbar JSON; serial na mochila; unlocks `|=`; reagentes Necro

## 0.21.18 — IdleLvl target + heal entre packs

### Correções / novo

- `[IdleLvl]` clica no jogador; cura entre packs antes de avançar; docs `IDLE-LVL-AND-PARTY-HEAL.md`

## 0.21.17 — Ally heal priority + IdleLvl

### Correções / novo

- Hotbar: slots aliado antes de self; `[IdleLvl]` painel GM classe/nível

## 0.21.16 — Tank puxa; bandagem a 1 tile

### Correções

- Ranger/seguidor cola no tank e só ataca o foco dele; heal aproxima aliado sem o director apagar a rota; msg ao bandar aliado

## 0.21.15 — Cura só hotbar + bandagem aliado

### Correções

- Sem HuntCura fallback; `who` no aliado; bandagem aproxima o alvo; firing post segue o aliado escolhido

## 0.21.14 — Gate visual, teleport off

### Correções

- Cove gate permanece no mapa; teleport desativado para jogadores

## 0.21.13 — NoAmmo sem congelar

### Correções

- Ranger sem setas: restock 200 + continua combate/rota (já não `nav.Clear` no NoAmmo)

## 0.21.12 — Stall online mais tolerante

### Correções

- Stall online ~12s antes de "Travado"; resend de nav menos frequente

## 0.21.11 — Sem Empurrão online (lag)

### Correções

- PathFollower **só offline** — Empurrão com cliente ligado desalinhava posição e causava lag
- Online: reenvia nav ao cliente em stall; ApproachPack à distância não “chega” cedo no centro do pack

## 0.21.10 — Ponto 6 + stall + Blessed

### Correções

- Mid-stop P5b movido para tile andável `(55,53)` — `(55,51)` estava bloqueado na walk grid (ciclo Travado @ 61,53)
- Stall num elo de caminho recalcula rota; já não banir Ponto 6 por mid-stop
- Empurrão PathFollower só após ~3s parado; cooldown inalcançável 90s
- Blessed limpo também no party; `EnsureCanFight` a cada tick/swing
- SeekLos raio 10 + early-exit; label Entrada no Ponto 1

## 0.21.9 — Blessed bloqueava a caça

### Correções

- Pedido Idle (`ForFamily`/`ForDungeon`) volta a tirar Young/Blessed ao entrar
- ApproachPack engaja bichos do pack mesmo se `CanBeHarmful` falhar por Blessed
- `HuntAlvo.Acquire` ignora Blessed do jogador ao escolher alvo

## 0.21.8 — BOTDBG no chat

### Correções

- `[BOTDBG]` passa a emitir linhas `bot:` no chat (o `#BOTDBG` sozinho ficava escondido) + coords/distância

## 0.21.7 — Rota estável (sem oscilar ratos)

### Correções

- ApproachPack à distância usa o ponto do pack (não o Mobile) e engaja ao entrar na banda
- `TravelTo` só reinicia a rota se o destino saltar ≥2 tiles (acabava o spam `Rota →` e o travão)

## 0.21.6 — Range do bot no ApproachPack

### Correções

- Quem usa banda de distância (ranger, magos, arco + Distancia do bot) para no `Band` configurado, no bicho — não a 2 tiles do centro
- SeekLos longe usa o alcance real; só fecha a 2 quando já está na banda sem LOS

## 0.21.5 — Empurrão se o cliente travar

### Correções

- Se o cliente não andar ~1s na rota da caça, o shard dá passos com PathFollower e reenvia o nav
- Chat mostra `Empurrão servidor →` quando o fallback entra

## 0.21.4 — Parado na entrada

### Correções

- Rota Ponto 1→2 deixa de ser apagada; o chat mostra `Rota → (x,y)` ao mudar de elo

## 0.21.3 — Bloqueado no pack

### Correções

- Já não manda o path para o tile do monstro (cliente ficava “Bloqueado”); limpa o nav ao chegar ao alcance

## 0.21.2 — Ranger parado + hotbar

### Correções

- Ranger já não fica em loop “Travado” no corredor quando está no alcance sem linha de visão
- Sync da hotbar deixa de falhar por causa do `]` no comando

## 0.21.1 — Distância do ranger na caça

### Correções

- Bot de longo alcance para no alcance da arma / distância escolhida, em vez de correr para cima do monstro ao buscar visão

## 0.21.0 — Ability AI e Chivalry

### Novidades

- Bot de caça usa abilities com menos spam; cura na hotbar não bloqueia o combate da classe
- Paladino: spells de Chivalry liberam por nível Idle; tithing automático; mantra de cast no canal certo
- Poção de mana Idle (lesser) usável pela hotbar/AI
- Sair do grupo: aliados com a opção ligada também encerram a caça; quem saiu pede saída da DG

## 0.20.1 — Stam e peso do ouro

### Melhorias

- Ouro da caça pesa menos (cabe mais na bag)
- Sobrecarga gasta stamina mesmo montado
- Bag cheia / sobrecarregado: ouro da caça não entra (fica no chão/corpo)

## 0.20.0 — Kill credit na caça (party)

### Novidades

- Quem cura ou buffa o aliado na luta também ganha XP/bestiário daquele kill
- Despojo e XP em grupo só para quem participou (dano ou suporte) — AFK na dungeon não leva
- Missões da guilda contam a partir do mesmo crédito

### Correções

- Poção não dá crédito de suporte; despawn limpa o mapa de suporte; pool vazio = sem loot; pet → dono no despojo

## 0.19.0 — IA da caça (visão e posto de tiro)

### Novidades

- Bot de caça busca posição com linha de visão no monstro (e no aliado de cura) antes de atacar ou kitar
- Formação atrás do tank e pesos de decisão no perfil do bot
- Comando `[BOTDBG]` para ver ação/LOS no canal Idle (overlay no cliente vem depois)

### Melhorias

- Diretor de combate da caça em fases mais claras (sobrevivência, party, posto, golpe)

## 0.18.0 — Guildas

### Novidades

- Guildas: crie a sua com nome e sigla (custa 10.000 de ouro do banco), até 30 membros para começar
- Líder, co-líderes e membros, e o líder decide quem pode convidar
- Entrada aberta ou por aplicação
- Cofre: 1.000 de ouro por membro por dia; a guilda sobe de nível com ouro e XP, e cada nível dá +1% de XP na caça para os membros e mais vagas
- Três missões por dia, com os abates de todos os membros
- Registro de atividade: contribuições, missões, entradas e saídas

## 0.17.0 — NPCs, recompensa em calendário e correções

### Novidades

- Bandagem à venda no vendedor de reagentes
- Recompensa diária de 1.000 de ouro por dia, com o calendário do mês
- Dá para ver o equipamento e o status de outro jogador

### Melhorias

- As mensagens do jogo em português do Brasil
- Apagar personagem não pede mais confirmação por e-mail
- Personagem novo não recebe mais a escritura de casa no banco

### Correções

- Quem sai da caça volta ao lado do portão, numa casa livre, e não empilhado em cima dele
- Nome com palavra reservada é recusado, em vez de criar um "Generic Player"

## 0.16.0 — Bestiário da conta, quarentena e ranking novo

### Novidades

- Níveis do bestiário: cada bicho comum tem 5 metas de abates (500 a 10.000), e cada meta dá +0,2% de XP permanente
- O bestiário é da conta: os abates de todos os seus personagens somam, e o bônus vale para todos
- Apagar personagem: depois de confirmar pelo e-mail, o personagem fica 24 h em quarentena e o slot fica livre na hora; dá para restaurar nesse prazo, se houver slot
- Ranking: Mais rico (ouro do banco e da mochila), e o filtro de classe em todas as categorias

### Melhorias

- Ranking de skills mostra só as que sobem na caça
- O portão da caça só deixa entrar quem está indo caçar

## 0.15.1 — Logout Idle instantâneo

### Correções

- Sair no cliente libera o personagem de imediato (sem esperar 5 min por Aggressors pós-caça)

## 0.15.0 — S7/S8 (soft caps, amigos, ranking)

### Novidades

- Amigos: última vez visto, classe/nível no JSON, lista atualiza quando amigos entram/saem
- Ranking: `[ranking nivel <classe>]`, skill sem id usa a maior skill; staff fora do top

### Alterações

- SkillCheck: soft gain após 100
- ServerAccess: guard username vazio

## 0.14.0 — Entrega stack 1–6 (+ boss skeleton)

### Novidades

- Abilities, classes, hunt, AI, city shop, BossSystem skeleton
- Energy / progression / armor wear (drain na hunt)

### Nota

- Boss ainda sem spawn/loot/UI; players só `[boss list`

## 0.13.0 — City shop NPC (Cove)

### Novidades

- IdleCityShop — compra/venda nos mercadores Idle
- IdleShopNpc + spots em IdleTown (reagents, arrows, farm buy)

### Nota

- Stack 5/6.

## 0.12.0 — Hunt AI party (melee / ranged / caster)

### Novidades

- Combat director, kiting, navigation, threat, party context
- Policies por arquétipo (melee / ranged / caster)
- Ability policy ligada ao catálogo Idle

### Nota

- Stack 4/6. Completa o build do hunt-core.

## 0.11.0 — Hunt core: dungeon catalog, exit, party invite

### Novidades

- Catálogo de dungeons Idle + pack de exemplo
- HuntExitRules e HuntPartyInvite
- HuntSession / Manager / Request alinhados ao fluxo de grupo
- IdleParty: pronto / despojo para caçada

### Nota

- Stack 3/6. Build completo só após feat/idle-hunt-ai (HuntSession usa AI/).

## 0.10.0 — Classes Idle e starting kits

### Novidades

- Expandir IdleClass / progress / create e character info
- Starting kits por classe (equip + bag)
- Hooks de armor/shield/pants e equip swap para kits

### Nota

- Stack 2/6.

## 0.9.1 — Ranking dos minigames

### Melhorias

- O banco passa a guardar o ranking do minigame UO Survivor.

## 0.9.0 — Abilities / hotbar Idle

### Novidades

- Catálogo e registry de abilities Idle (IDs, kinds, CSV/JSON)
- Runner, rule engine, spell whitelist, consumables, heal policy
- Hotbar sync e bot profiles de abilities

### Nota

- Stack temática 1/6. Cliente em PR paralelo.

### Novidades (merge `origin/dev`)

- **Recompensa diária**: um baú por dia para cada personagem, com 10 a 100 de ouro. Vira à meia-noite de Brasília; se não resgatar, ela espera você entrar (não acumula).

## 0.8.0 — Loja

### Novidades

- Loja Idle (city shop)

## 0.7.0 — Ranking, correio, wiki, paragon

- Kit de classe equipado; paragon; ranking/correio; wiki bestiário
- Keep-alive idle (não cai aos 30 s)

## 0.6.0 — Caça em escada

- Distância/pronto; loot ouro + notificações; 16 famílias de caça
- Rato agressivo

## 0.5.0 — Classes, party, deploy

- Classes Idle + XP; amigos/party; painel de loot
- Schema auto no deploy; wipe; fixes VPS/nginx/hunt orphan

## 0.4.0 — Auth

- Postgres AccountBridge; create-char; Google/e-mail; convidado

## 0.3.0 — Lavoura + cavalo

- Plantar; canteiro; pack horse sai com o dono

## 0.2.0 — Instâncias + lenha

- Instance maps Idle; lenhador; menos paradas

## 0.1.0 — Mining inicial

- Mining; bank/smelt; mining horse

### Em preparação

- Playtest hunt AI / kill credit / Chivalry (`peso`) — próximo bump
- Economia Idle — branch paralela

