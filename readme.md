[Read this page in English](readme-en.md)

# Aniwatch

O site aniwatch foi desenvolvido para permitir encontrar animes disponíveis nos streamings do Brasil.

O projeto consiste em uma página web simples sem usar frameworks e códigos em JavaScript e Python para realização da montagem da tabela dos animes disponíveis no Brasil.

A construção da tabela de animes consistiu em 4 etapas:
* Coleta
* Limpeza e ajustes
* Montagem.
* Manutenção.

## Coleta

Na etapa da coleta fiz uso dos seguintes módulos para coletar os dados:
* **JavaScript**
    * [cheerio](https://cheerio.js.org/)
    * [puppeteer](https://pptr.dev/)
    * [puppeteer-extra](https://github.com/berstend/puppeteer-extra)
    * [puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)
    * [puppeteer-autoscroll-down](https://github.com/mbalabash/puppeteer-autoscroll-down)
* **Python**
    * [pandas](https://pandas.pydata.org/docs/)
    * [json](https://docs.python.org/3/library/json.html)
    * [justwatch (API)](https://github.com/dawoudt/JustWatchAPI)

A tabela apresenta animes de 6 streamings do Brasil:
* Netflix
* Primevideo
* HBO Max
* Disney Plus
* Star Plus
* Crunchyroll

Para explicar melhor como funcionou essa etapa, vou separar por streaming a explicação.

* ## Disney Plus e Star Plus
    Por apresentarem poucos animes, pela coleta trazer lixo seria custoso incluir esses streamings. Por isso, optei por adicionar os animes presentes nesses streamings manualmente na tabela.
* ## Crunchyroll
    A coleta dos animes da crunchyroll foi feita usando javascript com web scrap por meio do puppeteer associado ao uso de uns plugins extras para permitir passar a barreira da cloudfare e um plugin de auto-scroll e o  uso do cheerio para coletar os dados do html de maneira mais estruturada. Dessa forma, o código coleta os títulos enquanto a página desce automaticamente e envia para um arquivo csv.
* ## Netflix,Primevideo  e HBO Max
    A coleta dos animes da Netflix,Prime e HBO Max foi feita usando o python por meio da api do justwatch e utilizando a biblioteca pandas para criação do csv desses dados coletados. Um detalhe importante é que essa api não possui uma categoria de animes, mas sim uma de animações, isso resulta em dados que não tem valor e que precisam ser removidos.

## Limpeza e Ajustes

A etapa de limpeza de ajustes é feita de forma manual por 2 motivos:

1.  Devido ao site usar o [Anilist Api](https://anilist.gitbook.io/anilist-apiv2-docs/) (documentação da querry [Anilist Api Doc](https://anilist.github.io/ApiV2-GraphQL-Docs/)) como mecanismo de busca e também para exibição das imagens dos animes e suas informações.
Como o mecanismo de busca é da api, é necessário ajustar os titulos que eu coletei para o formato esperado pela api.

2. A coleta traz muitos dados e alguns dados são desnecessários para seu objetivo e que precisam ser removidos, foi oque eu chamei de lixo anteriormente. No meu caso, eu tive que lidar com 2 tipos de lixo:
    1. Animações ocidentais
    2. Títulos que não são animação, mas foram classificados de forma errada pelo justwatch.

## Montagem

Após a limpeza e ajustes, eu uni as duas tabelas com uso da biblioteca Pandas novamente para montar a tabela final.
Essa tabela final possui um formato csv para facilitar a manipulação dos dados e outro formato json para que o js faça a busca dos streamings.
Inclusive, a biblioteca json do python exatamente pra isso. Após construção da tabela final, é feita a conversão para json.

## Manutenção

Para manter a tabela atualiza, estou lidando de duas formas:

* ## Crunchyroll
    É feita uma checagem automaticamente agendada para ocorrer todo dias às 22h. Essa checagem executa o web scrap da crunchyroll e depois executa um código de comparação entre os animes da crunchyroll com a tabela atual de animes, é feito também uma checagem com uma lista de titulos a serem ignorados. Caso haja novos títulos na crunchyroll, eles são adicionados num arquivo para que eu verifique se eles devem ou não serem adicionados na tabela e realizar ajustes no título caso seja necessário. Caso não sejam adicionados, são incluídos na lista de ignorados. Todo dia também é executado um código para verificar se algum título foi removido da crunchyroll.

* ## Outros streamings
    Para os outros streamings, como realizar a coleta e limpeza todo dia é inviável devido ao grande volume de dados, eu checo diariamente todo dia se há atualização de animes neles por meio de um aplicativo chamado [Upflix](https://www.upflix.net/).

Confira o site: (https://aniwatch.com.br)

Caso você queira tirar dúvidas sobre o projeto, tenha algum problema ou queira dar alguma ideia de melhoria/funcionalidade, redes para contato:

Github <--- Você está aqui

[Discord](https://discordapp.com/users/208000973698891776)

Email: contato@aniwatch.com.br