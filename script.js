var submit=document.getElementById('submit');
var container=document.getElementById("container");
const proxy="https://cors-anywhere.herokuapp.com/"
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
          romaji
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
          romaji
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
  (e) => 
  {
   if (e.key==='Enter')
   {
      let button = document.querySelector("#submit");
      button.click();
   }
  });

submit.addEventListener(
  'click',
  (e) =>
  {
    e.preventDefault();
    document.querySelectorAll('.card').forEach(e => e.remove());
    var variables={'search':anime_search.value};
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
    request_API(url,options,true);
  });

function check_Links(urls,title)
{
  let new_urls=[];
  
  for (let i in urls)
  {
    elem=urls[i];
    let link=elem['url'];
    let streamingName=elem['site'];
    if (streamingName=='Crunchyroll')
    {
      new_urls.push(urls[i]);
    }

    else if (streamingName=='Crunchyroll')
    {
      //Problem: return title Just a moment... :(
      new_urls.push(urls[i]);
    }
      
    else if (streamingName=='Star+')
    {
      new_urls.push(urls[i]);
    }
    
    else if (streamingName=='Disney Plus' && title=='Star Wars: Visions')
    {
      new_urls.push(urls[i]);
    }
  
    else if (streamingName=='Netflix')
    {
      let xhttp = new XMLHttpRequest();
      xhttp.open("GET", proxy+link, false);
      xhttp.send();
      let tpl = document.createElement('template');
      tpl.innerHTML = xhttp.responseText;
      let fragment = tpl.content;
      scrapTitle1=fragment.children[0]['text'];
      scrapTitle2=fragment.children[4]['text'];
      if (scrapTitle1==undefined && scrapTitle2!=undefined && scrapTitle2.length>7)
        new_urls.push(urls[i]);
    }
      
    else if (streamingName=='HBO Max')
    {
      let xhttp = new XMLHttpRequest();
      xhttp.open("GET", proxy+link, false);
      xhttp.send();
      let tpl = document.createElement('template');
      tpl.innerHTML = xhttp.responseText;
      let fragment = tpl.content;
      scrapTitle1=fragment.children[15]['text'];
      scrapTitle2=fragment.children[3]['text'];
      if (scrapTitle1==undefined && scrapTitle2!=undefined && scrapTitle2.length>7)
        new_urls.push(urls[i]);
    }

    else if (streamingName=='Amazon')
    {
      new_urls.push(urls[i]);
    }
  }
  return new_urls;
}

function request_API(url,opt,search)
{
  if (search==true)
  {
    fetch(url, opt).then(handleResponse)
                       .then(searchData)
                       .catch(handleError);
  }
  else
  {
    fetch(url, opt).then(handleResponse)
                     .then(menuData)
                     .catch(handleError);
  }
}

function handleResponse(response) 
{
  return response.json().then(function (json)
  {
    return response.ok ? json : Promise.reject(json);
  });
}

function searchData(data) 
{
  let mediaInfo=data['data']['Page']['media'];
  
  for (let value in mediaInfo)
  {
    let elem=mediaInfo[value];
    let episodes=elem['episodes'];
    let format=elem['format'];
    let duration=elem['duration'];
    let image=elem['coverImage']['large'];
    let romaji=elem['title']['romaji'];
    let externalLinks=elem['externalLinks'];
    let anilistUrl=elem['siteUrl'];
    externalLinks=check_Links(externalLinks,romaji);
    add_Card(image,romaji,externalLinks,anilistUrl,episodes,format,duration);
  }
}

function handleError(error) 
{
  console.log('Error!');
  console.error(error);
}

function nodeFactory(type,content,name)
{
    var node=document.createElement(type);
    if (type=='img')
    {
      node.src=content;
      node.id=name;
      return node;
    }
      
    else if (type=='p')
    {
      node.innerHTML=content;
      node.id=name;
      return node;
    }

    else if (type=='a')
    {
      node.id=content;
      return node;
    }

    else if (type=='div')
    {
      if (content=='carda')
        console.log(content);
      node.className=content;
      return node;
    }

    else
      console.log("Tipo inválido");
      return -1;
}

function add_Card(image,romaji,externalLinks,anilistUrl,episodes,format,duration)
{
  let card=nodeFactory('div','card');
  let imgElement=nodeFactory('img',image,'coverImage');
  let imgUrl=nodeFactory('a','anilistUrl');
  let titleElement=nodeFactory('p',romaji,'title');
  let streamingsTitle=nodeFactory('p','Streamings:','streamingsTitle');
  let episodesTitle=nodeFactory('p','Episódios:','episodesTitle');
  let episodesElement=nodeFactory('p',episodes,'episodesElement');
  let formatTitle=nodeFactory('p','Formato:','formatTitle');
  let formatElement=nodeFactory('p',format,'formatElement');
  let durationTitle=nodeFactory('p','Duração:','durationTitle');
  let durationElement=nodeFactory('p',duration+'min','durationElement');
  let streamings=nodeFactory('div','streamings');
  let cardInfo=nodeFactory('div','cardInfo');
  imgUrl.href=anilistUrl;
  imgUrl.target='_blank';
  
  
  for (let linkInfo in externalLinks)
  {
    let elem=externalLinks[linkInfo];
    let link=elem['url'];
    let linkName=elem['site'];
    
    if (linkName=='Crunchyroll')
    {
      let streamingIcon=nodeFactory('img','Icons/crunchyrollIcon.png','streamingIcon');
      let streamingsElement=nodeFactory('a','streaming');
      streamingIcon.name='Crunchyroll';
      streamingsElement.href=link;
      streamingsElement.target='_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }
      
    else if (linkName=='Netflix')
    {
      let streamingIcon=nodeFactory('img','Icons/netflixIcon.svg','streamingIcon');
      let streamingsElement=nodeFactory('a','streaming');
      streamingIcon.name='Netflix';
      streamingsElement.href=link;
      streamingsElement.target='_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (linkName=='Disney Plus')
    {
      let streamingIcon=nodeFactory('img','Icons/disneyplusIcon.svg','streamingIcon');
      let streamingsElement=nodeFactory('a','streaming');
      streamingIcon.name='disneyplus';
      streamingIcon.style.background="rgb(33,3,124)";
      streamingsElement.href=link;
      streamingsElement.target='_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (linkName=='Star+')
    {
      let streamingIcon=nodeFactory('img','Icons/starplusIcon.jpg','streamingIcon');
      let streamingsElement=nodeFactory('a','streaming');
      streamingIcon.name='starplus';
      streamingsElement.href=link;
      streamingsElement.target='_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (linkName=='Amazon')
    {
      let streamingIcon=nodeFactory('img','Icons/primevideoIcon.webp','streamingIcon');
      let streamingsElement=nodeFactory('a','streaming');
      streamingIcon.name='amazon';
      streamingsElement.href=link;
      streamingsElement.target='_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (linkName=='HBO Max')
    {
      let streamingIcon=nodeFactory('img','Icons/hbomaxIcon.webp','streamingIcon');
      let streamingsElement=nodeFactory('a','streaming');
      streamingIcon.name='hbomax';
      streamingsElement.href=link;
      streamingsElement.target='_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }
  }
  
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

  if (streamings.childNodes.length==0)
  {
    let streamingIcon=nodeFactory('img','Icons/emojiIcon.png','streamingIcon');
    let streamingsElement=nodeFactory('a','streaming');
    streamingIcon.name='emojiIcon';
    streamingsElement.appendChild(streamingIcon);
    streamings.appendChild(streamingsElement);
  }
}

function menuData(data)
{
  let mediaInfo=data['data']['Page']['media'];
  
  for (let value in mediaInfo)
  {
    let elem=mediaInfo[value];
    let episodes=elem['episodes'];
    let format=elem['format'];
    let duration=elem['duration'];
    let averageScore=elem['averageScore'];
    let image=elem['coverImage']['large'];
    let romaji=elem['title']['romaji'];
    let externalLinks=elem['externalLinks'];
    let anilistUrl=elem['siteUrl'];
    //externalLinks=check_Links(externalLinks,romaji);
    add_Card(image,romaji,externalLinks,anilistUrl,episodes,format,duration,averageScore);
  }
}


request_API(url,menu_options,false);