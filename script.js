var database;
var submit = document.getElementById('submit');
const url = 'https://graphql.anilist.co';
const menu_query =
  ` 
  query
  {
    Page (perPage: 48)
    {
      pageInfo 
      {
        currentPage,
        lastPage,
        hasNextPage
      }
      media (type: ANIME,isAdult: false, season: FALL, seasonYear: 2024, sort: SCORE_DESC)
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

       media (type: ANIME,isAdult: false, search: $search, sort: POPULARITY_DESC)
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
      }
    }
  }
`;

async function fetchData() {
  try {
    let response = await fetch('/animes.json');

    if (!response.ok) {
      throw new Error('Error with json file.');
    }

    let data = await response.json();
    
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

database = await fetchData();

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

document.getElementById("searchButton").addEventListener("click", function() {
  
  document.getElementById("searchButton").style.display = "none";
  document.getElementById("search_bar").style.display = "flex";
  document.getElementById("close_search_bar").style.display = "flex";
  document.getElementById("anime_search").value = '';
  document.getElementById("logoIcon").style.marginLeft = '11px';
});

document.getElementById("close_search_bar").addEventListener("click", function() {
  document.getElementById("searchButton").style.display = "block";
  document.getElementById("search_bar").style.display = "none";
  document.getElementById("close_search_bar").style.display = "none";
  document.getElementById("logoIcon").style.marginLeft = '30px';
});

submit.addEventListener(
  'click',
  (e) => {
    if (anime_search.value.trim() === '') {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    window.location.href='search?anime='+encodeURIComponent(anime_search.value);
    performSearch();
  });

function getSearchQueryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const getAnimeSearch = urlParams.get('anime');
    return getAnimeSearch;
}

function performSearch(searchQuery)
{
  var variables = { 'search': searchQuery };
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
}

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
        streamings=elem['Streaming'].split(',');
        streamings.forEach(function(streaming){
          if (streaming == 'crunchyroll') {
            urls=elem['Url'].split(',');
            urls.forEach(function(url){
              if (url.includes(streaming))
                new_urls.push(url);
            });
          }
      
          else if (streaming == 'star+') {
            urls=elem['Url'].split(',');
            urls.forEach(function(url){
              if (url.includes(streaming))
                new_urls.push(url);
            });
          }
      
          else if (streaming== 'disneyplus') {
            urls=elem['Url'].split(',');
            urls.forEach(function(url){
              if (url.includes(streaming))
                new_urls.push(url);
            });
          }
      
          else if (streaming == 'netflix') {
            urls=elem['Url'].split(',');
            urls.forEach(function(url){
              if (url.includes(streaming))
                new_urls.push(url);
            });
          }
      
          else if (streaming == 'max') {
            urls=elem['Url'].split(',');
            urls.forEach(function(url){
              if (url.includes(streaming))
                new_urls.push(url);
            });
          }
      
          else if (streaming == 'primevideo') {
            urls=elem['Url'].split(',');
            urls.forEach(function(url){
              if (url.includes(streaming))
                new_urls.push(url);
            });
          }
        });
      }
      else{
          if (streamings == 'crunchyroll') {
            if (urls.includes(',')){
              urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streamings)){
                  new_urls.push(url);
                }
              });
            }
            else
              new_urls.push(urls);
          }
      
          else if (streamings == 'starplus') {
            if (urls.includes(',')){
              urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streamings)){
                  new_urls.push(urls);
                }
              });
            }
            else
              new_urls.push(urls);
          }
      
          else if (streamings == 'disneyplus') {
            if (urls.includes(',')){
              urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streamings)){
                  new_urls.push(url);
                }
              });
            }
            else
              new_urls.push(urls);
          }
      
          else if (streamings == 'netflix') {
            
            if (urls.includes(',')){
              urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streamings)){
                  new_urls.push(url);
                }
              });
            }
            else
              new_urls.push(urls);
          }
      
          else if (streamings == 'max') {
            if (urls.includes(',')){
              urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streamings)){
                  new_urls.push(url);
                }
              });
            }
            else
              new_urls.push(urls);
          }
      
          else if (streamings == 'primevideo') {
            if (urls.includes(',')){
              urls=elem['Url'].split(',');
              urls.forEach(function(url){
                if (url.includes(streamings)){
                  new_urls.push(url);
                }
              });
            }
            else
              new_urls.push(urls);
          }
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

  if (mediaInfo.length != 0){
    for (let value in mediaInfo) {
      let elem = mediaInfo[value];
      let episodes = elem['episodes'];
      let format = elem['format'];
      let duration = elem['duration'];
      let image = elem['coverImage']['large'];
      let romaji = elem['title']['romaji'];
      let english = elem['title']['english'];
      let anilistUrl = elem['siteUrl'];
      let Links= check_Links(romaji,english);
      add_Card(image, romaji, Links, anilistUrl, episodes, format, duration);
    }
  }
  
  else{
    let notFoundDiv = nodeFactory('div','notFoundDiv');
    
    let notFoundImg = 'Icons/notfound.gif'
    let notFoundImgElem = nodeFactory('img',notFoundImg,'notFoundImgElem');
    let notFoundTxt = nodeFactory('p','Nenhum resultado para a busca','text-1')
    let body = document.body;
    notFoundImgElem.setAttribute('style','border-radius: 10px;height: 200px')
    notFoundDiv.style.display = 'flex';
    notFoundDiv.setAttribute('style','display: flex; flex-direction: column;flex-wrap: wrap; justify-content: center; align-content: center; align-items: center; margin-top: 50px;')
    notFoundDiv.appendChild(notFoundImgElem);
    notFoundDiv.appendChild(notFoundTxt);
    body.appendChild(notFoundDiv);
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

function add_Card(image, romaji, Links, anilistUrl, episodes, format, duration) {
  let card = nodeFactory('div', 'cardElem');
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

  Links.forEach(function(link) {
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

    else if (link.includes('max')) {
      let streamingIcon = nodeFactory('img', 'Icons/maxIcon.webp', 'streamingIcon');
      let streamingsElement = nodeFactory('a', 'streaming');
      streamingIcon.name = 'max';
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
  box.appendChild(card);

  if (streamings.childNodes.length == 0) {
    let streamingIcon = nodeFactory('img','Icons/emojiIcon.png', 'streamingIcon');
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
    let anilistUrl = elem['siteUrl'];
    let Links= check_Links(romaji,english);
    add_Card(image, romaji, Links, anilistUrl, episodes, format, duration, averageScore);
  }
}

window.addEventListener('pageshow', function(){
  document.getElementById("anime_search").value = getSearchQueryFromURL();
});

if (window.location.pathname=='/')
  request_API(url, menu_options, false);

else if (window.location.pathname=='/search'){
  let searchQuery = getSearchQueryFromURL();
  performSearch(searchQuery);
  document.getElementById("logoIcon").style.marginLeft = '11px';
  document.getElementById("searchButton").style.display = "none";
  document.getElementById("search_bar").style.display = "flex";
  document.getElementById("close_search_bar").style.display = "flex";
  document.getElementById("anime_search").value = searchQuery;
}

else if (window.location.pathname=='/info')
{
  document.getElementById("searchButton").addEventListener("click", function() {
    document.getElementById("title-center").style.top = "70px";
    document.getElementById("text-left").style.top = "70px";
  });
  
  document.getElementById("close_search_bar").addEventListener("click", function() {
    document.getElementById("title-center").style.top = "0px";
    document.getElementById("text-left").style.top = "0px";
  });
}

else if (window.location.pathname=='/donate')
{
  document.addEventListener('DOMContentLoaded', function() {
    let copyImage = document.getElementById('pix-icon');
    let copyImage2 = document.getElementById('pix-qrcode');
  
    copyImage.addEventListener('click', function() {
      let textToCopy = "c6948497-1cbf-47c2-b805-29856e623317";
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          alert('Chave pix copiada para área de transferência!');
        })
        .catch((error) => {
          console.error('Falha ao copiar texto!', error);
        });
    });
  
    copyImage2.addEventListener('click', function() {
      let textToCopy = "c6948497-1cbf-47c2-b805-29856e623317";
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          alert('Chave pix copiada para área de transferência!');
        })
        .catch((error) => {
          console.error('Falha ao copiar texto!', error);
        });
    });
  });

  document.getElementById("searchButton").addEventListener("click", function() {
    document.getElementById("title-center").style.top = "70px";
    document.getElementById("text-center").style.top = "70px";
    document.getElementById("pix-container").style.top = "50%";
    document.getElementById("ritsu-heart").style.top = "550px";
  });
  
  document.getElementById("close_search_bar").addEventListener("click", function() {
    document.getElementById("title-center").style.top = "0px";
    document.getElementById("text-center").style.top = "0px";
    document.getElementById("pix-container").style.top = "40%";
    document.getElementById("ritsu-heart").style.top = "445px";
  });
}