**Versão:** 0.78.0 · **Canal:** dev · **Data:** 2026-10-28

CDN: `news/client/dev.md`. O gump mostra este arquivo.
História completa no git: `CHANGELOG.md`.

## 0.78.0 — Sete classes no create

### Novidades

- Create com **7 classes**: Guerreiro, Berserker, Paladino, Ranger, Mago, Necromancer, Spellweaver (landing, login, kits, previews).

### Melhorias

- Meta/i18n/abilities e CSS da árvore para níveis densos e vários ícones por faixa.
- Texto do kit Spellweaver com reagentes de Magery + Spellweaving.

## 0.77.2 — Tutorial da árvore, mago e inventário

### Novidades

- Tutorial: depois da 1ª caça, guia gastar pontos na Árvore e abrir o Guarda-roupa.
- Inventário/inspeção: botões iguais para esconder robe/capa e conjunto.

### Melhorias

- Árvore: vários ícones no mesmo nível (Heal/Cure/Magic Arrow no mago).
- Botões de ação da caça em dourado (sair em cobre).
- Manequim de treino: clique/ataque no saco acerta o mobile host; pack world-art.

### Correções

- Textos do tutorial sobre skills (V3: sobem com pontos, não sozinhas na caça).

## 0.77.1 — Início de novo no nível 1

### Melhorias

- Conta nova volta a mostrar **nível 1**; starters no catálogo desbloqueiam no 1 (igual à loja de equipamentos).

## 0.77.0 — Progressão V3 na árvore e treino no lobby

### Novidades

- Árvore de classe V3: gasta pontos de skill, status e atributo acima da árvore; créditos de reset e escolha de subclasse depois do reset.
- Lobby de caça com o pátio de treino (igual ao do shard).

### Melhorias

- O seletor de slot da hotbar só lista habilidades da árvore e da subclasse escolhida (sem o dump do L300 nem duplicatas).
- Conta nova começou no nível 0 (voltou ao 1 na 0.77.1).
- Pack de effects atualizado pro Wither — republicar os PNGs no CDN.

### Correções

- A árvore não salta mais ao atualizar; reset e compra só quando não tem estoque com nomes certos.
- Lista do slot do guerreiro (e outras classes) deixa de vir vazia ou com skill de outra classe.

## 0.76.1 — Correção da barra de energia

### Correções

- O tempo de energia no topo cabe de novo na barra (estava espremido com nomes curtos), e as barras de XP e de energia têm o mesmo tamanho.

## 0.76.0 — Escada de equipamentos, reparo, Sombra melhor de 5 e NPCs por ofício

### Novidades

- Escada de equipamentos na loja: cada metal mostra o nível que pede, e o custo em lingotes sobe com o material. O material básico sai só por ouro.
- Aba Reparar no Ferreiro, no Artesão e no Alfaiate: veja a durabilidade da peça, o preço e quanto a durabilidade máxima vai cair.
- Sombra do Monstro em partidas de melhor de 5: a imagem aparece por alguns segundos e some, quem acertar primeiro leva a rodada, e quem levar 3 vence. Os chutes errados só você vê, a wiki fica fechada enquanto você joga, e no fim há o placar com Jogar de novo.
- Quando alguém entra na Sombra do Monstro, aparece um aviso no chat Global com o botão Entrar.
- Painel de NPCs com os NPCs de ofício — Minerador, Fazendeiro, Coureiro e Lenhador: "Ir até" leva você até eles e abre a janela do ofício.
- Paperdoll do inventário com a opção "Ver cosmético", e a inspeção de outro jogador com o mesmo boneco.
- Conquistas com o nível Trivial e marcos de pontos, cada um com uma roupa de prêmio.
- Energia: recarga de +1 h, +4 h ou completa.
- UO Survivor: medidor de DPS de cada arma.
- Aviso ao chegar no nível 30 para escolher a sua classe.

### Melhorias

- As roupas da criação de personagem já nascem tingidas, com cores padrão novas.
- No topo, "XP" no lugar do + e sem o peso.
- Grupo de até 6 jogadores.
- Prey sem rolar o bônus.
- Doom Gauntlet: bosses no tamanho original, sem os painéis de caça dentro da arena, Sair com os 5 segundos da caçada, e os tickets numa prateleira própria do leilão.
- A cor original da peça aparece como #0 no guarda-roupa.
- Minimizar da Sombra do Monstro; a janela do minigame e o card do boss vêm para a frente ao clicar, e o card do boss fecha com o botão direito.
- "Ir até" para na porta da casa do NPC.
- Cenas animadas: o coureiro esfola bichos na floresta, e as oficinas e a mina ganharam mais vida.

### Correções

- O avental fica por cima do sobretudo, e a fur boots (e mais 11 peças) aparece no boneco.
- A aba Vender não some depois de derreter tudo.

## 0.75.0 — Doom Gauntlet, Sombra do Monstro e ofícios novos

### Novidades

- Doom Gauntlet no lugar do boss mundial: 6 bosses por dia em horário fixo (Abyssmal Horror 04h, Shadow Knight 08h, Impaler 12h, Fleshrenderer 16h, Darknight Creeper 20h e Dark Father à meia-noite), no mapa original do Doom. Cada boss dá o seu ticket pelo correio, e o Dark Father só abre para quem tem os 5 — uma janela mostra quais você tem.
- Minigame Sombra do Monstro: adivinhe o monstro pela sombra, quem acerta primeiro leva os pontos. Sala única com mínimo de 2 jogadores, 1 ticket por partida (só quando ela começa), ranking semanal e geral, e baú com tinta rara para os 3 primeiros da semana.
- NPC Coureiro: contrate, compre a skill Tanning com ouro e receba couro por hora (Leather, Spined, Horned e Barbed), numa oficina animada.
- Artesão: o Fletcher e o Carpinteiro viraram um ofício só, com arcos, bestas, cajados e escudos nas madeiras do lenhador.
- Ferreiro: opção Derreter, ao lado de Vender — devolve 20% dos lingotes da peça, no metal dela.
- Botão Pintar no Guarda-roupa e nas montarias do Estábulo, com as tintas que você tem.
- Guilda: contribuição mínima e nível mínimo para entrar, definidos pelo líder e co-líderes; doe quanto quiser a partir do mínimo; destaque do bônus de XP na lista de guildas; conquistas de guilda.
- Conquistas do coureiro, do lenhador, do artesão e do Avarite.

### Melhorias

- Todas as lojas dos NPCs mostram os atributos do item ao passar o mouse.
- Armaduras por classe: mago usa couro, arqueiro usa tachas e osso, guerreiro usa metal. A loja avisa e trava a armadura de outra classe.
- Recompensa diária em dobro para VIP, com o que você deixa de ganhar em destaque, e uma bolinha vermelha no ícone enquanto não foi resgatada.
- Ouro e UOCoin do inventário atualizam na hora; o contador de lingotes saiu do inventário.
- Estábulo sem o filtro de famílias nas cores.
- Oficinas com a bancada no tamanho certo do personagem; o coureiro corta o couro em cima da bancada.

### Correções

- O clique no mundo escolhe o personagem desenhado onde você clicou: clicar perto de você não desmonta mais do cavalo, e um NPC não abre a janela de outro.
- Fire Gargoyle em vermelho, para não ser confundido com um Paragon.

## 0.74.0 — Caça, DGs novas e subclasses do mago (UI)

### Novidades

- Caça: família **ratman** (archer, mage) e **alligator**; novas dungeons (fogo, formigueiro, orc, pântano, village).
- Painel da caça mostra **por que** a entrada está bloqueada.
- Landing e bestiário com escala de dificuldade e XP por nível.
- Slot da hotbar lista as habilidades da classe **sem** abrir a árvore.
- Carteira: **ferro** da conta (saldo virtual da mina).
- Subclasses do mago na UI: skills Necro/Cleric/Pyro/Storm (textos pt/en/es e ícones).

### Correções

- Mundo: Z dos itens e facing no walk; texturas mortas no Safari; land pelos tiles mobile.

## 0.73.0 — Oficinas do flecheiro e do carpinteiro, conquistas do lenhador

### Novidades

- **Oficina animada** no topo das lojas do Fletcher e do Carpenter: vazia até você contratar; depois, o artesão leva tábuas à bancada, trabalha e pendura na parede o que fez.
- **Conquistas de Lenhador e madeira**: contratar o lenhador, o flecheiro e o carpinteiro, Lumberjacking 50/80/100, Bowcraft/Fletching e Carpentry 50/100, 1.000 tábuas e uma tábua de Avarwood.

### Melhorias

- O Carpenter agora fica na casa do Miner, no lugar onde ficava o Lumberjack.

## 0.72.0 — Lenhador, ofícios por material e câmbio com taxa

### Novidades

- **Lenhador**: novo NPC na casa do Miner. Contrate e suba a skill de Lumberjacking; ele entrega **tábuas** a cada hora direto no seu banco, mesmo com você offline. As madeiras seguem a escada dos metais: Dullwood, Shadowwood, Copperwood… até Valorwood e a rara **Avarwood**.
- **Flecheiro e carpinteiro** com skill própria (Bowcraft/Fletching e Carpentry), contratados e treinados na loja de cada um, com ouro e madeira.
- **Cada peça em cada material**: no ferreiro, escolha o metal (Dull Copper 65 até Valorite 99); no fletcher e no carpinteiro, a madeira. A peça sai com a cor e o nome do material e custa o material dele.
- Câmbio de UOCoin: botão **Anônimo** para comprar ou vender sem mostrar o nome.

### Melhorias

- As lojas dos ofícios separadas por categoria: espadas, machados, maças, capacetes, peitorais, escudos…
- O câmbio mostra a taxa de 5% e quanto o vendedor recebe.
- A sigla da guilda aparece depois do nome.
- Clique direito fecha as janelas.
- A janela da loja cabe na tela.
- Escolher o caminho no nível 30 pede confirmação.
- Separador depois do ícone do boss.

### Correções

- O peso (WT) saiu da barra de status; fica no inventário.

## 0.71.0 — LFG caçada pública e histórico do chat

### Correções

- Caçada pública solo: **Iniciar caça** (sem ficar à espera do grupo); botão **Cancelar caçada pública**.
- Enviar pedido marca **Pedido enviado**; o próprio card some da lista (não fecha mais a caçada pública).
- Pedido TP só se o líder estiver noutra área/mapa ou a caçar; aceitar + teleportar entra na DG do líder.
- Mensagem #1061121 (equipamento danificado) deixa de aparecer como número.

### Novidades

- Chat: **Ctrl+Q** / **Ctrl+W** percorrem os últimos ~20 textos/comandos enviados.

## 0.70.0 — Câmbio de UOCoin, a lavoura e o alfaiate

### Novidades

- **Câmbio de UOCoin** na Loja (aba UOCoin): compre e venda UOCoin por ouro com outros jogadores. De um lado as ordens de compra, do outro as ofertas de venda; dá para pegar só uma parte de uma oferta. Crie até 20 ofertas, acompanhe em **Minhas ofertas** e veja seus negócios no **Histórico**.
- **A lavoura**: fale com o Farmer, ao lado do Miner, e contrate um lavrador. Escolha o que ele planta — algodão ou os reagentes Garlic, Ginseng, Bloodmoss, Mandrake Root e Nightshade, todos liberados desde o início. Ele colhe a cada hora, mesmo com você fora do jogo, e os reagentes vão para o seu banco ao coletar.
- **O alfaiate** no costureiro: com Tailoring, as roupas vão sendo liberadas; cada uma custa ouro e algodão da lavoura.
- Novas conquistas de cores: uma série para as roupas e outra para as montarias.

### Melhorias

- Estábulo: filtro por animal numa lista.
- Estábulo no celular: a janela rola inteira, a coleção fica numa linha e as montarias aparecem antes do curral — dá para montar sem o botão ficar atrás da barra de baixo.
- Topo: a ordem agora é Caça, Prey, Boss, Diária e Minigames. O ícone do Personagem saiu — o retrato abre a mesma janela.
- Clicar numa janela traz ela para a frente da barra de vida também.
- Novo fundo na tela de entrada.
- Leilão: só as tintas mostram o nome da cor.
- A compra e a venda de UOCoin por gold ficam só na aba UOCoin: o cartão de vender UOCoin saiu do Leilão.

### Correções

- NPCs: o **Ir até** leva até onde o mercador está de verdade (o ferreiro era procurado no lugar antigo).

## 0.69.0 — Página inicial com galeria de fotos

### Novidades

- A página inicial ganhou a seção **Dentro do jogo**: 14 fotos grandes do jogo, duas por linha, cada uma com título e uma linha sobre o que mostra (cidade, dungeons, mina, loja, guarda-roupa, Prey, estábulo, guildas, conquistas e o UO Survivor).

### Melhorias

- O topo da página voltou a uma coluna só, centralizada, sem o slide.
- A pintura clássica do UO aparece atrás do topo, viva: o dragão bate as asas e a fumaça sobe (parada para quem pede menos movimento no sistema).
- Menos repetição: o relógio do closed beta e o "grátis" aparecem uma vez, no topo, e só o formulário do topo tem brilho.

## 0.68.1 — E-mail da conta na compra de UOCoin

### Melhorias

- Na compra de UOCoin, um aviso em destaque lembra de usar no pagamento o mesmo e-mail da sua conta do UO Idle — e mostra qual é, com um botão para copiar.

## 0.68.0 — Comprar UOCoin

### Novidades

- Agora dá para comprar UOCoin: na Loja, o **+** ao lado do saldo abre os pacotes. O pagamento é feito numa página segura, fora do jogo, e as UOCoin chegam na sua conta assim que ele é confirmado — com o jogo aberto, aparece um aviso no chat.
- Use no pagamento o mesmo e-mail da sua conta do site: é por ele que a compra chega até você. Por enquanto, o pacote de 100 UOCoin (R$ 10); os outros chegam em breve.

## 0.66.0 — Aviso de versão no HTML (fiável)

### Correções

- O aviso de nova versão passa a vir no `index.html` (antes do React): barra no topo, contagem de 20s e reload automático. Assim funciona mesmo na landing e em abas que ainda tinham o JS antigo.

## 0.65.0 — Aviso de nova versão no ar

### Novidades

- Se o site já publicou um build novo e a tua aba ainda está na versão antiga, aparece um aviso no topo para **Atualizar** (ou deixar para depois).

## 0.64.0 — Cursor da HudBar ao arrastar

### Correções

- Ao passar o mouse na barra de status (moldura, espaços vazios, barras), a mão fica a do UO para pan — sem trocar pela do navegador.

## 0.63.0 — Tempo de volta na dificuldade da caça

### Melhorias

- No painel de caça, cada dificuldade volta a mostrar o tempo de respawn do ponto («volta em Xs»), além do tamanho do grupo.

## 0.62.0 — Janela do personagem mais estreita

### Melhorias

- A janela do personagem fica mais estreita nas abas Personagem e Árvore (~720px); o Guarda-roupa abre um pouco mais largo só nessa aba.

### Correções

- Removido o card duplicado de bônus da árvore na coluna do status (fica só o da coluna das skills).

## 0.61.0 — Condições da hotbar (HP% e inimigo)

### Melhorias

- No config do slot: condições são opcionais — sem elas o bot já usa o slot com a regra base; aviso de que HP/Mana sem % são pontos absolutos.
- Ao marcar/desmarcar % em alvo inimigo ou aliado, deixa de converter com a vida máx do teu personagem.

## 0.60.0 — Vista do mundo em janela

### Novidades

- Em Opções → Vídeo: **Janela** (card redimensionável, como o ClassicUO) ou **Expandido** (preenche o palco). No PC o padrão é janela; no celular fica expandido.
- No modo janela, o mundo ganha moldura ornate (igual aos gumps / tela de login).
- Tamanho e posição da janela ficam salvos.

### Correções

- Ao aumentar/diminuir a janela do mundo, o mapa acompanha (sem borda preta nem corte).
- Inventário: expandir/recolher equipamento no canto volta à posição da mochila pequena.

## 0.59.0 — Chat Global/Comércio, mapa no celular e HUD

### Novidades

- Chat Global de volta, e a aba Comércio vira anúncio (vendo/compro) com item da bolsa, guarda-roupa ou montarias e preço.
- Mapas leves para celular (`mobile/`) na Cove e nas dungeons — menos crash no Safari.
- No Wi‑Fi de casa, o celular fala com o PC (API e WebSocket) sem apontar para si mesmo.

### Melhorias

- Hotbar no celular: 12 slots numa linha; gump de sessão e logo do header mais compactos.
- Cards da caça em 3 colunas, sem XP/ouro estimado errado.
- No config do slot: um só dano (média do shard) e mana alinhada ao registry.

### Correções

- Cove no celular deixava chão e telhado tortos; o bake mobile agora respeita o tamanho do land.json.
- Login no celular não esmaga mais o card.
- Ícone do Provocar no CDN.

## 0.58.0 — Mineiro e ferreiro por skill, conquistas e ajustes

### Novidades

- Janela nova do mineiro: Mining, metais, produção por hora e o treino com botões de 1x, 5x e 10x.
- O ferreiro tem a própria janela: a loja dele com a cena só com ele, e o treino de Blacksmithy.
- Conquistas: um troféu no topo abre a janela com as conquistas da conta, os pontos e o progresso. Ao ganhar uma, aparece um aviso com som, que só some quando você fecha.
- No Estábulo, o progresso da coleção: montarias encontradas, cores e o quanto falta.
- Avisos no topo da tela: quando um Paragon aparece na sua caçada e quando você ganha uma cor (com a raridade dela).
- No chat Global, uma linha dourada para todos quando alguém ganha uma cor de um Paragon.

### Melhorias

- Passar o mouse numa peça do ferreiro mostra as propriedades, como no inventário.
- Na compra dos mercadores: botões +10, +100 e +1.000, e até 10.000 de uma vez.
- Dois cliques numa bolsa já aberta trazem a janela dela para a frente.
- O nome da guilda aparece numa linha acima do nome do personagem.
- As barras de vida e mana da janela do grupo usam o desenho original do UO.
- O guarda-roupa filtra as peças por região do corpo: cabeça, tronco, pernas, pés, capa e cintura.
- Na criação de personagem, o nome fica na etapa de detalhes e o botão só avança com um nome.
- As cores de roupa da criação são só cores comuns.
- O painel de amigos mostra todas as recusas, como pedir a si mesmo ou repetir um pedido.
- Roupa com atributo (chapéu, máscara, sapato com resistência ou bônus) aparece no boneco do inventário.
- A ficha do bestiário mostra as cores que o Paragon de cada criatura pode deixar, com a chance de cada raridade.

### Correções

- As compras e vendas aparecem na aba Sistema do chat, não em Combate.

## 0.57.0 — HUD, grupo e saída da caça

### Novidades

- Contadores de reagentes e flechas sob as barras do HUD.
- Grupo: LFG, convites e busca de jogadores.
- Resumo do mob da última caçada no painel.

### Melhorias

- Saída da caça mostra a contagem em segundos; em Cove a UI deixa de achar que ainda está caçando.
- Logout na cidade não pede “sair da caça” de novo.
- Poções e bandagem aparecem no chat e na cabeça.

### Correções

- Contadores de reag/flecha baixam de verdade durante o farm.
- Comandos `[who` não aparecem no chat.

## 0.56.0 — Grátis para jogar

### Melhorias

- A página inicial deixa claro que o jogo é 100% grátis: selo no topo, no closed beta, nos destaques e na primeira pergunta.
- A pergunta sobre o cadastro agora fala da vaga no closed beta.

## 0.55.0 — Esgoto, magias e alcance do mago

### Melhorias

- O mapa do esgoto dos ratos foi refeito para coincidir com o chão que a caça usa.
- O mago (e as outras classes que lançam magia) só marca distância até 8 na barra. O bot deixa de parar longe demais para lançar.

### Correções

- Flecha Mágica, Cura e Curar Veneno continuam na lista do slot mesmo depois de saírem da barra.

## 0.54.0 — Closed beta

### Novidades

- Contagem regressiva para o closed beta, que começa em 1º de novembro às 15:00 (horário de Brasília).
- O cadastro na página inicial agora é para concorrer a uma vaga no closed beta.
- Os títulos da página inicial usam a fonte original do Ultima Online.

### Melhorias

- As classes da página inicial ficaram mais limpas, e o ranger agora atira com arco.
- As montarias da página inicial aparecem num tamanho menor e mais nítido.
- Os pontos do slide de fotos não ficam mais por cima da legenda.

### Correções

- O campo de e-mail não fica mais branco quando o navegador preenche o e-mail sozinho.
- A página inicial não mostra mais quantas pessoas se cadastraram.

## 0.53.0 — Página inicial viva

### Novidades

- As classes da página inicial ganharam vida: o personagem anda e luta com os quadros do jogo, troca de armadura e roupa a cada poucos segundos e carrega armas brilhantes.
- Nova seção de montarias na página inicial, com cavaleiros desfilando nas doze montarias, cada uma numa cor do catálogo.
- Compartilhar o link do site agora mostra imagem, título e descrição.

### Melhorias

- O campo de e-mail da lista de espera ganhou destaque, com uma luz dourada correndo pela borda.

### Correções

- As fotos do jogo voltam a aparecer na página inicial para quem tinha aberto o site antes delas existirem.

## 0.52.0 — Mina, ferreiro e página inicial

### Novidades

- A mina: contrate um mineiro que tira lingotes de ferro de hora em hora, mesmo com você fora do jogo, e treine-o de Novice a Legendary. A janela abre no capataz da mina, na casa dos manequins.
- O ferreiro: contrate-o na mina e treine-o com lingotes; cada título libera mais armas nas lojas, que passam a custar ouro e lingotes de ferro.
- A cena da mina: caverna e forja iluminadas, o seu personagem minerando e o ferreiro na bigorna, com faíscas e brasas.
- O inventário voltou a ter o boneco do personagem, só com o equipamento: vista arrastando um item até ele e tire arrastando para fora. O duplo clique continua funcionando.
- O tutorial ganhou o botão "Pular etapa" em todos os passos.
- Convide amigos e ganhe 10% da UOCoin que eles comprarem — o valor aparece no topo da aba de convites.
- A página inicial do site mostra o jogo e tem a lista de espera do lançamento.

### Melhorias

- Textos que estavam fixos em português (coleta, login, conexão, mensagens do jogo e outros) agora acompanham o idioma escolhido, e várias frases foram revisadas para o português do Brasil.
- As propriedades dos itens aparecem com o nome certo, e a aba Personagem mostra os bônus de skill dos itens vestidos.
- O boneco do guarda-roupa é só a prévia do visual: não veste nem tira nada por ele.
- A verificação de prontidão do grupo aparece acima da pergunta de seguir o líder.
- O ouro aparece como moedas de ouro no inventário e na loja do ferreiro, que mostra no topo o seu ouro e os lingotes.
- O ícone do inventário no topo é a bolsa de dinheiro, e o botão do banco saiu do topo.

### Correções

- Sair da caça não fica mais preso em "Pedindo saída…".
- O cartão do tutorial não sai mais da tela ao lado de janelas grandes.
- Soltar um item em cima de uma bolsa na mochila coloca o item dentro dela.
- Na inspeção de outro jogador, os primeiros itens da lista voltam a mostrar os detalhes ao passar o mouse.

## 0.51.0 — Moldura, caça e barra

### Mudanças

- Os gumps passam a usar a moldura ornada, com o título no centro
- A barra tem 12 slots, numerados de 1 a 12, sem atalho de teclado. No celular ficam quadrados e menores
- FPS e coordenadas ficam sob o cabeçalho, só o texto. Em Opções dá para esconder
- O login fica mais largo. Saiu o atalho de conta de staff. Robe e capa mudam de cor mesmo escondidos
- A escolha de personagem mostra o nível
- A caça fica mais larga, com os cards em três colunas e o Iniciar em cima. As dificuldades usam ícone, também com o gump minimizado
- O gump do slot mostra o ícone de cada reagente
- O gump do bot fica em cartões

### Correções

- Saíram os filtros de ordenar da caça e os textos de status e do portão

## 0.50.0 — Montarias, classes e party

### Novidades

- Novos bichos etéreos: raptor, tigres, unicórnio, palomino, dente-de-sabre, leão, caranguejo, javali de guerra, capivara, cães, clydesdale e cavalos de terra, fogo e ar
- A altura de quem vai em cima muda por montaria

### Mudanças

- A lista do slot mostra o que já abriste e o que ainda está fechado na árvore base. Escolhida a subclasse, a coluna dela aparece também
- Ao entrar na party, escolhes quem o bot segue
- Ícones novos nas habilidades, nos níveis de atributo e nas subclasses
- A distância do mago não passa do alcance da magia
- O esgoto tem pack próprio. Os caminhos andáveis das dungeons foram gerados de novo
- A recuperação da magia já não aparece como "está demasiado longe"

### Correções

- A cor escolhida fica no item. O translúcido só aparece quando pedes essa cor, e não ao montar
- Não dá para pôr a mesma habilidade duas vezes na barra
- Criação de personagem, arraste da barra e árvore no personagem
- Se a contagem para sair da caça não armar, o pedido volta
- Em Cove não se ataca. O treino é nos manequins
- Harm saiu da barra inicial
- A arte do CDN deixa de partir o mapa. A arena tem um chão de reserva

## 0.49.0 — Dungeon dos ratos no mapa novo

### Mudanças

- A caça dos ratos usa o mapa 64×96. O chão, as fachadas e o caminho andável foram gerados de novo

## 0.48.0 — Fonte do UO e opções de letra

### Melhorias

- Nomes, falas, XP e dano no mundo usam a letra bitmap do Ultima (com contorno preto)
- Em Opções → Fonte podes escolher Navegador ou Ultima e o tamanho (vem a 28)

### Correções

- Os números de dano já não aparecem cortados em baixo

## 0.47.3 — Música da dungeon muda em cada entrada

### Correções

- Na dungeon ouves a música da dungeon, e outra quando entras de novo. A faixa de combate deixou de tapar essa música durante a caça toda (era por isso que parecia sempre a mesma)

## 0.47.2 — Sem duas músicas ao mesmo tempo

### Correções

- Ao entrar em combate, a música do mapa para logo; já não se ouvem as duas juntas até a de guerra começar

## 0.47.1 — Música ao ligar o som e sem baú no login

### Correções

- Se começares com a música desligada e a ligares depois, a faixa da Cove/dungeon (ou do login) volta sem precisares de F5
- Trocar de dungeon passa a sortear outra música (antes ficava a mesma se ambas eram “dungeon”)
- Login, logout e sair da DG já não tocam o som de baú sozinhos

## 0.47.0 — Música da visita e som da mochila

### Melhorias

- Na Cove toca uma música de cidade, sorteada, e repete enquanto ficas lá. Na dungeon (ou na arena) toca uma música de dungeon, também sorteada, até saíres. Quando voltas, sai outra
- A música de combate continua por cima, só enquanto estiver mesmo a tocar

### Correções

- Abrir e fechar a mochila volta a ter som. Entrar no jogo ou na dungeon já não toca baú sem ninguém ter aberto nada

## 0.46.3 — O jogo não congela mais na caça nem ao trocar de personagem

### Correções

- Às vezes, ao entrar na dungeon ou depois de trocar de personagem, o jogo parava de responder: o personagem não andava, a caçada ficava em "Pedindo saída…" e só um F5 resolvia. Uma parte das mensagens do servidor era perdida quando chegava dividida pela rede

## 0.46.2 — Caça: o personagem não emperra mais na dungeon

### Correções

- Na dungeon da caça o personagem emperrava em certos cantos e ficava parado: o mapa de caminhada do jogo tinha passagens que o servidor não aceita

## 0.46.1 — Loja, NPCs e Estábulo voltam a abrir

### Correções

- A Loja, os NPCs e o Estábulo às vezes não abriam e o movimento travava: a barra de atalhos era reenviada ao servidor várias vezes por segundo enquanto você andava ou caçava, e os outros pedidos se perdiam

## 0.46.0 — Versão de celular

### Novidades

- Layout próprio para celular: uma janela por vez ocupando a tela, a caçada e a ida ao banco em faixas no topo, a barra de atalhos numa fileira e o cartão do tutorial preso na borda
- Andar no celular: segure o dedo no chão na direção em que quer ir
- Zoom com dois dedos no mundo

### Correções

- No celular, a ilha carrega em pedaços menores — a aba travava por falta de memória
- Sem seleção de texto ao tocar no celular
- No celular, o cartão do boss começa como o ícone no topo

## 0.45.0 — Personagem, inspeção e bestiário

### Novidades

- Aba Personagem: atributos (base + itens + outros), resistências e os bônus dos itens vestidos
- Pedra de transferência: janela para escolher a arma de origem e a de destino

### Melhorias

- Inspecionar outro jogador: abas Equipamento e Roupa, as ações em ícones (amigo, grupo, guilda, detalhes) e o equipamento com nome e propriedades ao passar o mouse
- Boneco sem mochila no guarda-roupa e na inspeção
- Bestiário organizado por tipo de criatura

### Correções

- Criaturas sem arte própria (Ghoul, Fire Gargoyle, Orcish Mage, Lich Lord, Sand Vortex) aparecem na caça, no bestiário e no Prey

## 0.44.0 — Convites, tradução do chat e Twitch

### Novidades

- Convide amigos: o seu link de convite e uma aba Convites no painel de amigos, com quem você convidou, quando, e o prêmio (1.000 gp pelo correio e +0,1% de XP por amigo, até 1%)
- Tradução automática do chat: o que os outros jogadores escrevem aparece no idioma da sua interface, com um botão para ver o original

### Melhorias

- Twitch: cada canal oficial num card com a prévia da live

## 0.43.0 — Prey: preços

### Melhorias

- Prey: a lista nova paga e o liberar do slot mostram o preço que dobra dentro da série de 24 h (um de graça por dia em cada slot)

## 0.42.0 — Mercadores da cidade

### Novidades

- Costureiro na lista de NPCs e na loja da cidade
- Ferreiro e cocheiro: a loja da cidade mostra montarias pelo desenho e preços em UOCoin
- Confirmação antes de toda compra com UOCoin: Loja, RMT, tintas e removedor, Estábulo e cocheiro

## 0.41.0 — Estábulo e recompensas

### Novidades

- Estábulo: ícone próprio no topo e uma janela com o curral onde as suas montarias andam, cada uma na cor que está usando; a aba Montarias saiu do Personagem
- Minigames com tickets: jogar gasta um ticket; o saldo aparece com um "+" que leva à Loja
- UO Survivor: o prêmio semanal no cartão do jogo e a aba Semana no ranking, com quando ela fecha

### Melhorias

- Recompensa diária: os prêmios especiais do mês (tickets, tinta, cavalo) aparecem no calendário, no dia em que caem

## 0.40.0 — Loja e cores

### Novidades

- Janela da tinta com filtros por tipo (Roupas, Montarias…), com a contagem de cada um
- Leilão e RMT: subgrupos dentro da categoria — o tipo da peça e, nele, a raridade da cor

### Melhorias

- Tintas da Loja sem o filtro de família, e o removedor numa aba própria dentro de Tintas
- Um botão Comprar só na Loja e no RMT — sem UOCoin bastante, ele abre a tela de comprar UOCoin
- Uma cor por peça: pintar troca a cor; o removedor também no painel das montarias, e o nome da cor na lista do guarda-roupa
- As cores aparecem como #1, #2… na ordem do catálogo (da comum à ultra rara)
- Na criação de personagem, a escolha de cor da roupa aparece desligada, com o aviso de que dá para personalizar dentro do jogo

## 0.39.2 — Warren: atlas CDN atualizado

### Correções

- PNGs da dungeon (ratos) republicados no CDN; cache-bust **land34** para não ficar preso no `island.png?v=33` velho da Cloudflare

## 0.39.1 — Packs: cache do mapa sem limpar cookies

### Correções

- Se `island.png` (ou outra textura de pack) falhar no browser, o cliente força novo download (`cache:reload`) e, se ainda falhar, recarrega a página **uma vez** — não precisa limpar cookies/dados do site

## 0.39.0 — Áudio UO (música + SFX)

### Novidades

- Música de login, Cove/DG e combate (packs `/packs/music`)
- SFX do mundo (0x54) com fade por distância; passos; abrir/fechar mochila
- Scripts e índices para gerar packs de music/sounds

### Melhorias

- Áudio usa `packsUrl` (CDN); mute/volume em Options → Áudio
- Volume padrão de som e música em **15** (mais baixo no primeiro uso)

## 0.38.0 — Loja: vender tudo e ignorar

### Novidades

- **Vender tudo** no gump da loja de Cove (stacks iguais agrupados)
- Botão ✓/⊘ por item para **ignorar** no lote (não vende o que marcar)

### Melhorias

- Após vender, o gump fica aberto e o catálogo atualiza

## 0.37.0 — Party sync e caça em grupo

### Novidades

- Gump de pedido de caça do líder (PARTYASK): o grupo aceita ou recusa
- Favicon da marca na aba do navegador
- Contador de FPS da caça no rodapé (dev)

### Melhorias

- Party: aceitar tudo do líder; sync de membros e follow
- Lobby da caça: falha de entrada no gump; membros andam ao portão; trocar DG mais seguro
- Cores das poções de mana e Intelligence na loja e na hotbar
- Effects pelo CDN (`packsUrl`); ouro da conta em **0** mostra 0 de verdade

### Correções

- Crash `sprite.anchor` no login ao sincronizar mobiles
- WebGL: só remonta o mundo se o contexto continuar perdido
- HUNTNAV em entering passa o líder a hunting; pose de morte do mago
- Debug de bot sem gump (logs no shard)

## 0.36.0 — Mage hunt polish (hotbar, logout, efeitos)

### Novidades

- Ícones de habilidades na hotbar (pack AbilityGumpIcon)
- Poções de Intelligence no catálogo; mana com cor mais escura
- Condições Str/Dex/Int buff na hotbar (texto em pt/en/es)
- Aviso de durabilidade quando o equipamento chega a ~20%
- Confirmar «Sair da conta» durante a caça (não continua farm offline)
- Efeitos de magery, summons e hues translúcidos no mundo
- Packs de terreno/walk da dungeon atualizados

### Melhorias

- Condições da hotbar e custo de reagentes mais claros
- Mago pode ajustar Distância; saída sem reagente só em casters
- Flag de saída sem munição no BotGump
- Dica de ouro da conta no chrome; ouro/UOCoin estáveis com filtros de pot

### Correções

- Import `findArtFrame` após o port de efeitos

## 0.35.0 — UO Survivor mais difícil

### Melhorias

- UO Survivor mais difícil: as criaturas batem mais forte, e o golpe delas cresce mais depressa com o tempo
- Os chefes batem bem mais forte e correm mais que as outras criaturas
- As árvores agora têm tronco: não dá mais para atravessá-las

## 0.34.0 — Removedor de tinta

### Novidades

- Removedor de tinta na Loja (50 UOCoin): tira uma cor de uma roupa pelo guarda-roupa e a devolve num frasco de tinta
- A cor removida sai da roupa; a cor original da peça não sai

## 0.33.0 — UOCoin

### Melhorias

- A UOCoin aparece ao lado do ouro, no inventário
- Valores em UOCoin mostram o ícone da moeda
- Comprar algo em UOCoin sem saldo abre a tela de comprar UOCoin

## 0.32.0 — Cores com raridade

### Novidades

- 464 cores com raridade (Comum, Incomum, Rara e Ultra rara) e família, todas à venda na Loja como tintas
- Filtros de cores: busca por nome ou número, raridade, coleção (descobertas ou não) e família
- O guarda-roupa mostra todas as roupas do jogo, e a aba Montarias todas as montarias; as que você não tem aparecem na cor exata, marcadas
- As cores servem também para as montarias, com prévia no próprio bicho
- Dá para comprar a tinta e pintar sem sair do guarda-roupa ou das montarias

### Melhorias

- A janela do personagem ficou mais larga, e as colunas rolam por dentro
- O guarda-roupa abre nas roupas que você tem e nas cores descobertas

## 0.31.0 — Coleção de montarias

### Novidades

- Aba Montarias: as montarias da conta numa coleção — não pesam nem ocupam a mochila
- Monte e desmonte pela aba; as montarias compradas na Loja vão direto para lá e podem ser vendidas no Leilão e no RMT

## 0.30.0 — Guarda-roupa

### Novidades

- Aba Guarda-roupa: as roupas da conta funcionam como skins — escolha o que vestir, com prévia no boneco
- Cada roupa guarda as cores que já recebeu; trocar entre elas é grátis
- Roupas que chegam à mochila vão sozinhas para o guarda-roupa
- No Leilão dá para vender uma das cores de uma roupa; as outras continuam com você

## 0.29.0 — Janela do personagem com abas

### Novidades

- A janela do personagem ganhou abas; a aba Personagem reúne status, bônus de XP e skills (o ícone de skills saiu da barra)

### Melhorias

- O retrato do personagem fica no topo do status, e o nível na seção Progresso

## 0.28.0 — Inventário numa janela só

### Novidades

- O ícone da mochila virou Inventário: equipamento, HorseBag e mochila numa janela só, com peso e ouro embaixo

### Melhorias

- A HorseBag abre de qualquer distância do cavalo

## 0.27.0 — Energia: recarga

### Novidades

- Um "+" ao lado da barra de energia abre a recarga: enche a energia toda pagando em ouro, até 4 vezes por dia

### Melhorias

- A energia volta sozinha fora da caça, mesmo com você offline

## 0.26.0 — Prey: preço por slot

### Melhorias

- Cada slot do Prey mostra o próprio preço de rolar o bônus e de uma lista nova
- Uma lista nova grátis por slot a cada 24 h; o preço de rolar sobe a cada clique e volta ao início 24 h depois

## 0.25.0 — Boss mundial: ícone sempre no topo

### Melhorias

- O ícone do boss mundial fica sempre no topo: com o cartão aberto, minimizado ou sem boss — aí ele aparece apagado e diz em quanto tempo vem o próximo

## 0.24.5 — Login: char no mundo / caça offline

### Correções

- Ao escolher outro personagem com um slot já no mundo (caça offline), mostra a mensagem em vez de timeout

## 0.24.4 — BotDbg flutuante

### Melhorias

- Log/LOS do bot de caça: gump solto (mover, resize, fechar); abre com `[BOTDBG on]`; export .txt mantido
- Removido do gump de config do Bot e do overlay fixo à esquerda

## 0.24.3 — Hotbar: HP absoluto, serial e pots

### Correções

- Condição de cura em HP/mana absoluto: não dá para pôr valor ≥ vida máx.; ao desligar `%` converte com cabeça
- Hotbar no browser passa a gravar pelo serial do mobile (apagar conta e recriar com o mesmo nome já não herda a barra antiga)
- Catálogo de abilities via CDN (`packsUrl`) + cache-bust; pots deferred escondidas
- Condição de aliado em HP absoluto não é mais cortada pela vida máx. do jogador

## 0.24.2 — Hotbar: pots de mana, descrições e CD

### Correções

- Quantidade das 3 pots de mana no gump de slot: cada tier mostra a sua (não a soma)
- Magias/habilidades com descrição do que fazem (pt/en/es)
- Passives (Slash/Arrow/Palm) fora da lista da hotbar — deixam de aparecer como "sem recarga"

## 0.24.1 — Warren/ratos: atlas novo no CDN

### Correções

- Pack da warren (`/packs/dungeon`) republicado; cache bust `land33` também nos PNGs (não só no `land.json`)

## 0.24.0 — Caça: mapas, veneno e floaters

### Melhorias

- Packs das DGs de caça com void preto (sem halo cinza/verde fora do mapa)
- Números de dano/cura/veneno com sinal (`-5` / `+25`); XP sem `+`
- Nome do personagem e floaters centrados na cabeça (sem deslizar com “Bandagem”)
- Hotbar: condições OR/AND; bandagem padrão HP ou envenenado
- Barra e ticks verdes enquanto envenenado
