import json
import os
import pandas as pd

codes=[]
remove_data=[]
path="C:/Users/thiag/Desktop/Aniwatch_site/"
file=path+'animes-pt-br-crunchyroll-not-cleaned.json'

with open(file,'r',encoding='cp437') as json_file2:
    dic= json.load(json_file2)

with open(path+'animes.json','r',encoding='cp437') as json_file:
    dic_animes= json.load(json_file)

for key2 in dic:
    if ',' in dic[key2]['Url']:
        split=dic[key2]['Url'].split(',')
        for i in range(len(split)):
            if 'crunchyroll' in split[i]:
                code=split[i].split('/')[5]
                codes.append(code)
    else:
        code= dic[key2]['Url'].split('/')[5]
        codes.append(code)

for key in dic_animes:
    title=dic_animes[key]['Nome']
    streaming=dic_animes[key]['Streaming']
    url=dic_animes[key]['Url']
    
    if streaming == 'crunchyroll':
        code=url.split('/')[5]
        if code not in codes:
            remove_data.append([title,streaming,url])

if remove_data != []:
    df=pd.DataFrame(remove_data,columns=['Nome','Streaming','Url'])
    df.to_csv(path+'removeTitlesCrunchyroll.csv',index=False)
    os.system('cls||clear')
    print('Arquivo removeCrunchyrollTitles.csv criado com sucesso\n')

else:
    os.system('cls||clear')
    print('Nenhum titulo para ser removido\n')

input("Press Enter to finish...")