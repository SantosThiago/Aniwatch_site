let submit=document.getElementById('submit');
var url = 'https://graphql.anilist.co';
var menu_query =
`
  query
  {
    Page
    {
      media (type: ANIME, season: WINTER, seasonYear: 2023, sort: POPULARITY_DESC)
      {
        coverImage
        {
          large
        }
        format
        id
        title
        {
          romaji,
          english
        }
        genres
        siteUrl
        externalLinks
        {
          url
        }
      }
    }
  }
`;
var query =
`
  query ($id: Int, $page: Int, $perPage: Int, $search: String) 
  {
    Page (page: $page, perPage: $perPage) 
    {
      pageInfo
      {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }

      media (id: $id, search: $search)
      {
        coverImage
        {
          large
        }
        format
        id
        title
        {
          romaji,
          english
        }
        genres
        externalLinks
        {
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

request_API(url,menu_options,false)

submit.addEventListener(
  'click',
  (e) =>
  {
    e.preventDefault();
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
    request_API(url,options,true)
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

function menu_handleData(data)
{
  var media_info=data['data']['Page']['media'];
  for (var value in media_info)
  {
    var elem=media_info[value];
    console.log(elem)
  }
}

function handleData(data) 
{
  var infos=data['data']['Page']['media'];
  var out=['MANGA','ONE_SHOT','NOVEL','MUSIC'];
  for (var value in infos)
  {
    var elem=infos[value];
    var form=elem['format'];
    if (!(out.includes(form)) && !(elem['genres'].includes("Hentai")))
    {
      var image = elem['coverImage']['large'];
      document.getElementById('image_link').innerHTML = "<img src="+image+">";
      var romaji = elem['title']['romaji'];
      var english = elem['title']['english'];
      console.log(image)
      console.log('Nome:', romaji);
      console.log('Alternativo:', english);
      console.log('Gêneros:', elem['genres']);
      console.log('Formato:',form);
      for (links in elem['externalLinks'])
      {
        console.log('Links:',elem['externalLinks'][links]['url']);
      }
      /*
      streamings = checkLinks(elem['externalLinks'],[romaji,english]);
      */
    }
  }
}

function handleError(error) 
{
  console.log('Error!');
  console.error(error);
}