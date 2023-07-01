import database from '/animes.json' assert { type: 'json' };

var submit = document.getElementById('submit');
var container = document.getElementById("container");
const url = 'https://graphql.anilist.co';
const menu_query =
  `
  query
  {
    Page (perPage: 40)
    {
      pageInfo 
      {
        currentPage,
        lastPage,
        hasNextPage
      }
      media (type: ANIME,isAdult: false, season: WINTER, seasonYear: 2023, sort: SCORE_DESC)
      {
        episodes
        format
        duration
        siteUrl
        averageScore
        coverImage
        {
          large
        }
        title
        {
          romaji,
          english
        }
        externalLinks
        {
          site,
          url
        }
      }
    }
  }
`;
const query =
  `
  query ($search: String) 
  {
    Page (perPage: 40) 
    {
      pageInfo
      {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }

       media (type: ANIME,isAdult: false, search: $search)
      {
        episodes
        format
        duration
        siteUrl
        averageScore
        coverImage
        {
          large
        }
        title
        {
          romaji,
          english
        }
        externalLinks
        {
          site,
          url
        }
      }
    }
  }
`;
var menu_options =
{
  method: 'POST',
  headers:
  {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify(
    {
      query: menu_query
    })
};


document.addEventListener(
  "keypress",
  (e) => {
    if (e.key === 'Enter') {
      let button = document.querySelector("#submit");
      button.click();
    }
  });

submit.addEventListener(
  'click',
  (e) => {
    e.preventDefault();
    document.querySelectorAll('.card').forEach(e => e.remove());
    var variables = { 'search': anime_search.value };
    var options =
    {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(
        {
          query: query,
          variables: variables
        })
    };
    request_API(url, options, true);
  });

function check_Links(romaji,english) {
  let new_urls=[]

  for (let i in database){
    let elem= database[i];
    let name=elem['Nome'];
    let streamings=elem['Streaming'];
    let urls=elem['Url'];

    if (romaji == name || english == name){
      if (streamings.includes(','))
      {
        let streamings=elem['Streaming'].split(',');

        streamings.forEach(function(streaming){
          if (streaming == 'crunchyroll') {
            if (urls.includes(',')){
              let urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streaming)){
                  new_urls.push(url);
                }
              });
            }
          }
      
          else if (streaming == 'star+') {
            if (urls.includes(',')){
              let urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streaming)){
                  new_urls.push(url);
                }
              });
            }
          }
      
          else if (streaming== 'disneyplus') {
            if (urls.includes(',')){
              let urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streaming)){
                  new_urls.push(url);
                }
              });
            }
          }
      
          else if (streaming == 'netflix') {
            if (urls.includes(',')){
              let urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streaming)){
                  new_urls.push(url);
                }
              });
            }
          }
      
          else if (streaming == 'hbomax') {
            if (urls.includes(',')){
              let urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streaming)){
                  new_urls.push(url);
                }
              });
            }
          }
      
          else if (streaming == 'primevideo') {
            if (urls.includes(',')){
              let urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streaming)){
                  new_urls.push(url);
                }
              });
            }
          }
        });
      }
      else{
        new_urls.push(urls);
      }
    }
  }
  return new_urls;
}

function request_API(url, opt, search) {
  if (search == true) {
    fetch(url, opt).then(handleResponse)
      .then(searchData)
      .catch(handleError);
  }
  else {
    fetch(url, opt).then(handleResponse)
      .then(menuData)
      .catch(handleError);
  }
}

function handleResponse(response) {
  return response.json().then(function(json) {
    return response.ok ? json : Promise.reject(json);
  });
}

function searchData(data) {
  let mediaInfo = data['data']['Page']['media'];

  for (let value in mediaInfo) {
    let elem = mediaInfo[value];
    let episodes = elem['episodes'];
    let format = elem['format'];
    let duration = elem['duration'];
    let image = elem['coverImage']['large'];
    let romaji = elem['title']['romaji'];
    let english = elem['title']['english'];
    let externalLinks = elem['externalLinks'];
    let anilistUrl = elem['siteUrl'];
    externalLinks= check_Links(romaji,english);
    add_Card(image, romaji, externalLinks, anilistUrl, episodes, format, duration);
  }
}

function handleError(error) {
  console.log('Error!');
  console.error(error);
}

function nodeFactory(type, content, name) {
  var node = document.createElement(type);
  if (type == 'img') {
    node.src = content;
    node.id = name;
    return node;
  }

  else if (type == 'p') {
    node.innerHTML = content;
    node.id = name;
    return node;
  }

  else if (type == 'a') {
    node.id = content;
    return node;
  }

  else if (type == 'div') {
    node.className = content;
    return node;
  }

  else
    console.log("Tipo inválido");
  return -1;
}

function add_Card(image, romaji, externalLinks, anilistUrl, episodes, format, duration) {
  let card = nodeFactory('div', 'card');
  let imgElement = nodeFactory('img', image, 'coverImage');
  let imgUrl = nodeFactory('a', 'anilistUrl');
  let titleElement = nodeFactory('p', romaji, 'title');
  let streamingsTitle = nodeFactory('p', 'Streamings:', 'streamingsTitle');
  let episodesTitle = nodeFactory('p', 'Episódios:', 'episodesTitle');
  let episodesElement = nodeFactory('p', episodes, 'episodesElement');
  let formatTitle = nodeFactory('p', 'Formato:', 'formatTitle');
  let formatElement = nodeFactory('p', format, 'formatElement');
  let durationTitle = nodeFactory('p', 'Duração:', 'durationTitle');
  let durationElement = nodeFactory('p', duration + 'min', 'durationElement');
  let streamings = nodeFactory('div', 'streamings');
  let cardInfo = nodeFactory('div', 'cardInfo');
  imgUrl.href = anilistUrl;
  imgUrl.target = '_blank';


  externalLinks.forEach(function(link) {
    if (link.includes('crunchyroll')) {
      let streamingIcon = nodeFactory('img', 'Icons/crunchyrollIcon.png', 'streamingIcon');
      let streamingsElement = nodeFactory('a', 'streaming');
      streamingIcon.name = 'Crunchyroll';
      streamingsElement.href = link;
      streamingsElement.target = '_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (link.includes('netflix')) {
      let streamingIcon = nodeFactory('img', 'Icons/netflixIcon.svg', 'streamingIcon');
      let streamingsElement = nodeFactory('a', 'streaming');
      streamingIcon.name = 'Netflix';
      streamingsElement.href = link;
      streamingsElement.target = '_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (link.includes('disneyplus')) {
      let streamingIcon = nodeFactory('img', 'Icons/disneyplusIcon.svg', 'streamingIcon');
      let streamingsElement = nodeFactory('a', 'streaming');
      streamingIcon.name = 'disneyplus';
      streamingIcon.style.background = "rgb(33,3,124)";
      streamingsElement.href = link;
      streamingsElement.target = '_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (link.includes('starplus')) {
      let streamingIcon = nodeFactory('img', 'Icons/starplusIcon.jpg', 'streamingIcon');
      let streamingsElement = nodeFactory('a', 'streaming');
      streamingIcon.name = 'starplus';
      streamingsElement.href = link;
      streamingsElement.target = '_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (link.includes('primevideo')) {
      let streamingIcon = nodeFactory('img', 'Icons/primevideoIcon.webp', 'streamingIcon');
      let streamingsElement = nodeFactory('a', 'streaming');
      streamingIcon.name = 'amazon';
      streamingsElement.href = link;
      streamingsElement.target = '_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (link.includes('hbomax')) {
      let streamingIcon = nodeFactory('img', 'Icons/hbomaxIcon.webp', 'streamingIcon');
      let streamingsElement = nodeFactory('a', 'streaming');
      streamingIcon.name = 'hbomax';
      streamingsElement.href = link;
      streamingsElement.target = '_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }
  });

  imgUrl.appendChild(imgElement);
  cardInfo.appendChild(episodesTitle);
  cardInfo.appendChild(episodesElement);
  cardInfo.appendChild(formatTitle);
  cardInfo.appendChild(formatElement);
  cardInfo.appendChild(durationTitle);
  cardInfo.appendChild(durationElement);
  cardInfo.appendChild(streamingsTitle);
  cardInfo.appendChild(streamings);
  card.appendChild(cardInfo);
  card.appendChild(imgUrl);
  card.appendChild(titleElement);
  container.appendChild(card);

  if (streamings.childNodes.length == 0) {
    let streamingIcon = nodeFactory('img', 'Icons/emojiIcon.png', 'streamingIcon');
    let streamingsElement = nodeFactory('a', 'streaming');
    streamingIcon.name = 'emojiIcon';
    streamingsElement.appendChild(streamingIcon);
    streamings.appendChild(streamingsElement);
  }
}

function menuData(data) {
  let mediaInfo = data['data']['Page']['media'];

  for (let value in mediaInfo) {
    let elem = mediaInfo[value];
    let episodes = elem['episodes'];
    let format = elem['format'];
    let duration = elem['duration'];
    let averageScore = elem['averageScore'];
    let image = elem['coverImage']['large'];
    let romaji = elem['title']['romaji'];
    let english = elem['title']['english'];
    let externalLinks = elem['externalLinks'];
    let anilistUrl = elem['siteUrl'];
    externalLinks= check_Links(romaji,english);
    add_Card(image, romaji, externalLinks, anilistUrl, episodes, format, duration, averageScore);
  }
}

request_API(url, menu_options, false);