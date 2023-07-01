import puppeteer from 'puppeteer';
import { scrollPageToBottom } from 'puppeteer-autoscroll-down'
import * as cheerio from 'cheerio';
import * as fs from 'fs';

var databaseId=0
var page_count=1
var database= {}
var titles=[]
const url = 'https://www.crunchyroll.com/pt-br/videos/alphabetical'

const browser = await puppeteer.launch({
  headless: false
});
const page = await browser.newPage();
await page.goto(url);
await new Promise(r => setTimeout(r, 2000));

while (page_count<106)
{
  console.log('Page:',page_count,'/105',)
  const html= await page.content();
  let $= cheerio.load(html);
  let $a= $('div > a')
  for (let i in $a)
  {
    if ($a[i]['attribs']!=undefined)
      {
        if ($a[i]['attribs']['title']!=undefined)
        {
          let title=$a[i]['attribs']['title']
          let url=$a[i]['attribs']['href']

          if (!(titles.includes(title)))
            {
              console.log(title)
              titles.push(title)
              database[databaseId]={'Nome':title,'Streaming':'crunchyroll','Url':'crunchyroll.com'+url}
              databaseId=databaseId+1
            }
        }
      }
  }
  await scrollPageToBottom(page, { size: 2000,stepsLimit: 1})
  await new Promise(r => setTimeout(r, 2000));
  page_count=page_count+1
}
await browser.close();

fs.writeFile('animes-pt-br-crunchyroll-not-cleaned.json',JSON.stringify(database), (err) => {
  if (err)
    console.log(err);})