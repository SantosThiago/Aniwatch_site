from justwatch import JustWatch
import pandas as pd
import json
import os

def searchData(streaming,Page):
    streaming_name=streaming[0]
    provider=streaming[1]
    database=[]
    leftovers=[]

    print('Page:',Page,'/',totalpages)
    just_watch=JustWatch(country='BR')
    search = just_watch.search_for_item(genres=['ani'],providers=[provider],monetization_types=['flatrate'],page=Page)
    items=search['items']
    for item in items:
        title_flag=0
        item_title=item['title']
        t_id=item['id']
        type=item['object_type']
        data=just_watch.get_title(title_id=t_id,content_type=type)

        if type=='show':
            seasons=data['seasons']
        
            for season in seasons:
                urls=[]
                s_id=season['id']
                season_data=just_watch.get_season(season_id=s_id)

                if 'title' in season_data:
                    season_title=season_data['title']
                    title=item_title+' '+season_title

                    if 'offers' in season_data:
                        offers=season_data['offers']

                        for offer in offers:
                            url=offer['urls']['standard_web']
                            
                            if streaming_name in url:
                                urls.append(url)

                    if len(urls)>0:
                        database.append([title,streaming_name,urls[0]])
                
                else:
                    if title_flag==0:
                        if 'offers' in season_data:
                            offers=season_data['offers']

                            for offer in offers:
                                url=offer['urls']['standard_web']
                                
                                if streaming_name in url:
                                    urls.append(url)

                        if len(urls)>0:
                            
                            leftovers.append([item_title,streaming_name,urls[0]])

                        title_flag=1

        elif type=='movie':
            urls=[]

            if 'offers' in data:
                offers=data['offers']

                for offer in offers:
                    url=offer['urls']['standard_web']
                    
                    if streaming_name in url:
                        urls.append(url)

                if len(urls)>0:
                    database.append([item_title,streaming_name,urls[0]])
    
    return database,leftovers

def getTotalPages(streaming):
    just_watch=JustWatch(country='BR')
    totalpages = just_watch.search_for_item(genres=['ani'],providers=[streaming],monetization_types=['flatrate'])['total_pages']
    return totalpages

def getData(streaming,totalpages):
    database=[]
    leftovers=[]

    if totalpages>12 and totalpages<23:
        mid=int(totalpages/2)+1

        for i in range(1,mid):
            database_aux,leftovers_aux=searchData(streaming,i)
            database=database+database_aux
            leftovers=leftovers+leftovers_aux

        for i in range(mid,totalpages+1):
            database_aux,leftovers_aux=searchData(streaming,i)
            database=database+database_aux
            leftovers=leftovers+leftovers_aux

        return database,leftovers
    
    elif totalpages>23:
        part1=int(totalpages/3)+1
        part2=int(totalpages/3+8)+1

        for i in range(1,part1):
            database_aux,leftovers_aux=searchData(streaming,i)
            database=database+database_aux
            leftovers=leftovers+leftovers_aux

        for i in range(part1,part2):
            database_aux,leftovers_aux=searchData(streaming,i)
            database=database+database_aux
            leftovers=leftovers+leftovers_aux

        for i in range(part2,totalpages+1):
            database_aux,leftovers_aux=searchData(streaming,i)
            database=database+database_aux
            leftovers=leftovers+leftovers_aux

        return database,leftovers

    else:

        for i in range(1,totalpages+1):
            database_aux,leftovers_aux=searchData(streaming,i)
            database=database+database_aux
            leftovers=leftovers+leftovers_aux

        return database,leftovers

def createDataframe(name,database,leftovers):
    df=pd.DataFrame(database,columns=['Nome','Streaming','Url'])
    df.to_csv(name+'.csv',index=False)

    if len(leftovers)!=0:
        leftovers_df=pd.DataFrame(leftovers,columns=['Nome','Streaming','Url'])
        leftovers_df.to_csv(name+'-leftovers'+'.csv',index=False)

def json_to_csv(name,file):
    database=[]
    with open(file,'r',encoding='cp437') as json_file:
        dic= json.load(json_file)
    for key in dic.keys():
        title=dic[key]['Nome']
        url=dic[key]['Url']
        database.append([title,name,url])
    df=pd.DataFrame(database,columns=['Nome','Streaming','Url'])
    df_name='animes-pt-br-'+name+'-not-cleaned.csv'
    df.to_csv(df_name,index=False)
    os.system('cls||clear')
    print('Arquivo transformado com nome '+df_name)
    print('\n')

def csv_to_json(title,dataframe):
    df=pd.read_csv(dataframe)
    database={}

    for i,row in df.iterrows():
        name=row['Nome']
        streaming=row['Streaming']
        url=row['Url']
        database[i]={'Nome':name,'Streaming':streaming,'Url':url}
    json_file=json.dumps(database,indent=3)

    with open('animes.json', 'w') as file:
        file.write(json_file)

    print('Arquivo transformado com nome '+title+'.json')
    print('\n')

def unifyDataframes(name,dataframe1,dataframe2):
    data=[]
    df=pd.read_csv(dataframe1)
    df2=pd.read_csv(dataframe2)

    for i,row in df.iterrows():
        for j,row2 in df2.iterrows():
            if row['Nome']==row2['Nome']:
                row['Streaming']=row['Streaming']+','+row2['Streaming']
                row['Url']=row['Url']+','+row2['Url']

        print('Row:',i)

    for i,row in df2.iterrows():
        if row['Nome'] not in df['Nome'].values:
            data.append([row['Nome'],row['Streaming'],row['Url']])
        
        print('Row:',i)

    data_df=pd.DataFrame(data,columns=['Nome','Streaming','Url'])
    df = pd.concat([df,data_df],ignore_index=True)
    df.sort_values('Nome')
    print(df)
    df.to_csv(name+'.csv',index=False)

streamings=[['netflix','nfx'],['primevideo','prv'],['hbomax','hbm']]
op=0

while op!=5:
    print('1-Criar csv')
    print('2-Juntar csv')
    print('3-Transformar json em csv')
    print('4-Transformar csv em json')
    print('5-Sair')
    op=int(input('Escolha uma opcao:'))

    if op==1:
        os.system('cls||clear')
        print('netflix')
        print('primevideo')
        print('hbomax')
        streaming_name=input('Escolha o streaming:')
        if streaming_name=='netflix':
            totalpages = int(getTotalPages(streamings[0][1]))
            netflix_database,netflix_leftovers=getData(streamings[0],totalpages)
            createDataframe(streamings[0][0],netflix_database,netflix_leftovers)

        elif streaming_name=='primevideo':
            totalpages = int(getTotalPages(streamings[1][1]))
            primevideo_database,primevideo_leftovers=getData(streamings[1],totalpages)
            createDataframe(streamings[1][0],primevideo_database,primevideo_leftovers)

        elif streaming_name=='hbomax':
            totalpages = int(getTotalPages(streamings[2][1]))
            hbomax_database,hbomax_leftovers=getData(streamings[2],totalpages)
            createDataframe(streamings[2][0],hbomax_database,hbomax_leftovers)

    elif op==2:
        os.system('cls||clear')
        csv1=input('Digite o nome do primeiro arquivo csv:')
        csv2=input('Digite o nome do segundo arquivo csv:')
        name=input('Digite o nome do arquivo final:')
        
        if '.csv' in csv1 or '.csv' in csv2:
            print(csv1,csv2)
            print('Nao digite o .csv, apenas o nome do arquivo')

        else:
            unifyDataframes(name,csv1+'.csv',csv2+'.csv')

    elif op==3:
        os.system('cls||clear')
        name=input('Digite o nome do arquivo json:')

        if '.json' in name:
            print('Nao digite o .json, apenas o nome do arquivo')
        
        else:
            json_to_csv(name,name+'.json')
    
    elif op==4:
        os.system('cls||clear')
        name=input('Digite o nome do arquivo csv:')

        if '.csv' in name:
            print('Nao digite o .csv, apenas o nome do arquivo')
        
        else:
            csv_to_json(name,name+'.csv')