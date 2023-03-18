var check_page=''
var submit=document.getElementById('submit');
var url = 'https://graphql.anilist.co';
var container=document.getElementById("container");
var menu_query =
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
var query =
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

submit.addEventListener(
  'click',
  (e) =>
  {
    e.preventDefault();
    //window.location='search.html';
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

function check_Links(links,type_Titles)
{
  //soon
  return 0
}

function request_API(url,opt,search)
{
  if (search==true)
  {
    fetch(url, opt).then(handleResponse)
                       .then(handleData)
                       .catch(handleError);
  }
  else
  {
    fetch(url, opt).then(handleResponse)
                     .then(menu_handleData)
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

function handleData(data) 
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
      let streamingIcon=nodeFactory('img','https://m.media-amazon.com/images/I/417bVUqe0pL.png','streamingIcon');
      let streamingsElement=nodeFactory('a','streaming');
      streamingIcon.name='Crunchyroll';
      streamingsElement.href=link;
      streamingsElement.target='_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }
      
    else if (linkName=='Netflix')
    {
      let streamingIcon=nodeFactory('img','https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg','streamingIcon');
      let streamingsElement=nodeFactory('a','streaming');
      streamingIcon.name='Netflix';
      streamingsElement.href=link;
      streamingsElement.target='_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (linkName=='Disney Plus')
    {
      let streamingIcon=nodeFactory('img','https://cdn.worldvectorlogo.com/logos/disney--1.svg','streamingIcon');
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
      let streamingIcon=nodeFactory('img','https://pbs.twimg.com/profile_images/1587180153603514369/vWiLmja1_400x400.jpg','streamingIcon');
      let streamingsElement=nodeFactory('a','streaming');
      streamingIcon.name='starplus';
      streamingsElement.href=link;
      streamingsElement.target='_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (linkName=='Amazon')
    {
      let streamingIcon=nodeFactory('img','https://img.utdstc.com/icon/8d0/5dc/8d05dcf1d6034e9b6dffbab81f64ca8e61a135cc2c738e641b081d4611ba3ca2:200','streamingIcon');
      let streamingsElement=nodeFactory('a','streaming');
      streamingIcon.name='amazon';
      streamingsElement.href=link;
      streamingsElement.target='_blank';
      streamingsElement.appendChild(streamingIcon);
      streamings.appendChild(streamingsElement);
    }

    else if (linkName=='HBO Max')
    {
      let streamingIcon=nodeFactory('img','https://img.utdstc.com/icon/db3/ff9/db3ff9df52071ba96d884cde93221b4ea43a9516d73a2164652aa3b402e33977:200','streamingIcon');
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
    let streamingIcon=nodeFactory('img','https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f625.png','streamingIcon');
    let streamingsElement=nodeFactory('a','streaming');
    streamingIcon.name='xIcon';
    streamingsElement.appendChild(streamingIcon);
    streamings.appendChild(streamingsElement);
  }
}

function menu_handleData(data)
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
    add_Card(image,romaji,externalLinks,anilistUrl,episodes,format,duration,averageScore);
  }
}

check_page=document.querySelector('.app');
if (check_page.id=='index')
  request_API(url,menu_options,false);