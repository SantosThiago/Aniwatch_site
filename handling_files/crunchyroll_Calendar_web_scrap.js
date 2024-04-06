import puppeteer from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth'
import * as cheerio from 'cheerio';
import * as fs from 'fs';

var databaseId=0
var page_count=1
var database= {}
var titles=[]
const url = 'https://www.crunchyroll.com/pt-br/simulcastcalendar?filter=premium'
puppeteer.use(stealthPlugin())
const browser = await puppeteer.launch({
  headless: true
});
const page = await browser.newPage();
await page.goto(url, {waitUntil: ["domcontentloaded","load","networkidle0","networkidle2"]});
// await new Promise(r => setTimeout(r, 800));
const html= await page.content();
let $= cheerio.load(html);
let $articles= $('article');

for (let i = 0; i < $articles.length; i++)
{
    let $article = $($articles[i]);
    let attr=$article.find('.js-season-name-link').attr();
    let title=$article.find('.season-name').text().trim();
    let premiere_flag=$article.find('.premiere-flag').length;

    if (attr != undefined && premiere_flag == 1)
    {
        let url=attr['href']

        if (!title.includes('Dub') && !title.includes('Audio'))
        {
            if (!(titles.includes(title)))
            {
              titles.push(title)
              database[databaseId]={'Nome':title,'Streaming':'crunchyroll','Url':url}
              databaseId=databaseId+1
            }
        }
    }
}

await browser.close();

fs.writeFile('animes-pt-br-crunchyroll-not-cleaned.json',JSON.stringify(database,null,4), (err) => {
  if (err)
    console.log(err);})
  