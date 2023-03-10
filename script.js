let submit=document.getElementById('submit');

submit.addEventListener(
  'click',
  (e) =>
  {
    e.preventDefault();
    console.log(anime_search.value)
  });