# Aniwatch

The aniwatch website was developed to allow users to find anime available on streaming platforms in Brazil.

The project consists of a simple web page without using frameworks, with JavaScript and Python code to create a table of anime available in Brazil.

The construction of the anime table involved 4 steps:
* Collection
* Cleaning and adjustments
* Assembly
* Maintenance

## Collection

In the collection phase, the following modules were used to gather the data:
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

The table presents anime from 6 streaming platforms in Brazil:
* Netflix
* Primevideo
* HBO Max
* Disney Plus
* Star Plus
* Crunchyroll

To better explain how this phase worked, I will separate the explanation by streaming platform.

* ## Disney Plus and Star Plus
    Due to having few anime titles, including these streaming platforms through collection would have resulted in adding unnecessary data. Therefore, I manually added the anime present on these streaming platforms to the table.

* ## Crunchyroll
    The collection of anime from Crunchyroll was done using JavaScript with web scraping through Puppeteer, associated with the use of some additional plugins to bypass Cloudflare's protection and an auto-scroll plugin. The Cheerio library was used to collect data from the HTML in a more structured way. This way, the code collects the titles while the page scrolls automatically and sends them to a CSV file.

* ## Netflix, Prime Video, and HBO Max
    The collection of anime from Netflix, Prime Video, and HBO Max was done using Python through the JustWatch API, and the Pandas library was used to create a CSV file with the collected data. An important detail is that this API does not have a specific anime category, but rather an animation category, which results in data that is not relevant and needs to be removed.

## Cleaning and Adjustments

The cleaning and adjustments phase is done manually for two reasons:

1. The website uses the [Anilist Api](https://anilist.gitbook.io/anilist-apiv2-docs/) (documentation of the query [Anilist Api Doc](https://anilist.github.io/ApiV2-GraphQL-Docs/)) as the search mechanism and to display images and information about the anime. Since the search mechanism is based on the API, it is necessary to adjust the titles I collected to the format expected by the API.

2. The collection process brings a lot of data, and some of it is unnecessary for the project's goal and needs to be removed, which was referred to as trash previously. In my case, I had to deal with two types of trash:
    * Western animations
    * Titles that are not anime but were incorrectly classified by JustWatch.

## Assembly

After the cleaning and adjustments, I merged the two tables using the Pandas library again to create the final table. This final table is provided in CSV format for easy data manipulation and in JSON format for the JavaScript code to search the streaming platforms. The Python JSON library was used for this conversion.

## Maintenance
To keep the table updated, I handle it in two ways:
* ## Crunchyroll
    An automatic check is scheduled to occur every day at 10 PM. This check performs web scraping of Crunchyroll and then compares the Crunchyroll anime with the current anime table. It also checks against a list of titles to be ignored. If there are new titles on Crunchyroll, they are added to a file so that I can verify whether they should be added to the table and make any necessary adjustments to the title. If they should not be added, they are included in the list of ignored titles.

* ## Other streaming platforms
    For the other streaming platforms, collecting and cleaning data every day is impractical due to the large volume of data. Instead, I check daily for updates on these platforms through an app called Upflix.

Check out the website: https://aniwatch.com.br

If you have any questions about the project, encounter any issues, or want to provide ideas for improvement or new features, you can contact me through:

Github <--- You are here

[Discord](https://discordapp.com/users/208000973698891776)

Email: contato@aniwatch.com.br