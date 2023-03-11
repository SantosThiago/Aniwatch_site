let submit=document.getElementById('submit');
var url = 'https://graphql.anilist.co';
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

submit.addEventListener(
  'click',
  (e) =>
  {
    e.preventDefault();
    var variables={'search':anime_search.value};
    console.log(variables)
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
    connect_API(url,options)
  });

function check_Links(links,type_Titles)
{
  //soon
  return 0
}

function connect_API(url,options)
{
  fetch(url, options).then(handleResponse)
                     .then(handleData)
                     .catch(handleError);
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
  var test=data['data']
  var infos=data['data']['Page']['media'];
  console.log(test);
  var out=['MANGA','ONE_SHOT','NOVEL','MUSIC'];
  for (var value in infos)
  {
    elem=infos[value]
    var form=elem['format'];
    if (!(out.includes(form)) && !(elem['genres'].includes("Hentai")))
    {
      var romaji = elem['title']['romaji'];
      var english = elem['title']['english'];
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