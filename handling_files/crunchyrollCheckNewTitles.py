import json
import os
import pandas as pd

ind=0
urls=[]
titles=[]
new_data=[]
file='animes-pt-br-crunchyroll-not-cleaned.json'

with open(file,'r',encoding='cp437') as json_file2:
    dic= json.load(json_file2)

with open('animes.json','r',encoding='cp437') as json_file:
    dic_animes= json.load(json_file)

with open('ignoreList','r',encoding='utf-8') as file:
    ignoreList=file.readlines()

for i in range(len(ignoreList)):
    ignoreList[i]=ignoreList[i].replace('\n','')

for key2 in dic_animes:
    titles.append(dic_animes[key2]['Nome'])

    if ',' in dic_animes[key2]['Url']:
        split=dic_animes[key2]['Url'].split(',')
        for i in range(len(split)):
            if 'crunchyroll' in split[i]:
                urls.append(split[i])
    else:
        urls.append(dic_animes[key2]['Url'])

for key in dic:
    title=dic[key]['Nome']
    streaming=dic[key]['Streaming']
    url=dic[key]['Url']

    if (url not in urls or title not in titles) and title not in ignoreList:
        new_data.append([title,streaming,url])

if new_data != []:
    df=pd.DataFrame(new_data,columns=['Nome','Streaming','Url'])
    df.to_csv('newTitlesCrunchyroll.csv',index=False)
    os.system('cls||clear')
    print('Arquivo newCrunchyrollTitles.csv criado com sucesso\n')

else:
    os.system('cls||clear')
    print('Nenhum novo titulo para ser adicionado\n')

input("Press Enter to finish...")