import json
import os
import pandas as pd

title='animes'
dataframe='animes.csv'
database={}
df=pd.read_csv(dataframe)

for i,row in df.iterrows():
    name=row['Nome']
    streaming=row['Streaming']
    url=row['Url']
    database[i]={'Nome':name,'Streaming':streaming,'Url':url}
json_file=json.dumps(database,indent=3)

with open('animes.json', 'w') as file:
    file.write(json_file)

os.system('cls||clear')
print('Animes atualizados com sucesso!')