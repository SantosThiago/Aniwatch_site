import subprocess
from collections import defaultdict

removed_titles={}
added_titles={}
removed_final={}
added_final={}
md_file=[]
removed=subprocess.run('git diff -U0 animes.csv | grep "^-"', shell=True, capture_output=True, text=True).stdout
added=subprocess.run('git diff -U0 animes.csv | grep "^+"', shell=True, capture_output=True, text=True).stdout
release_num=subprocess.run('git log -1 --pretty="%s" | cut -d "." -f3', shell=True, capture_output=True, text=True).stdout
release_num=int(release_num)
new_release_num=release_num+1
removed=removed.replace('-','')
added=added.replace('+','')
added=added.replace('-','')
split_removed=removed.split('\n')[1:]
split_added=added.split('\n')[1:]

for i in range(len(split_removed)):
    split2=split_removed[i].split('"')

    if len(split2)<3 and split2[0]!='':
        title=split2[0].split(',')[0].lower()
        streaming=split2[0].split(',')[1]
        removed_titles[title]=streaming

    if len(split2)==3:
        title=split2[1].lower()
        streaming=split2[2].split(',')[1]
        removed_titles[title]=streaming

    if len(split2)>3:
        title=split2[0].split(',')[0].lower()
        streaming=split2[1]
        removed_titles[title]=streaming

for i in range(len(split_added)):
    split2=split_added[i].split('"')

    if len(split2)<3 and split2[0]!='':
        title=split2[0].split(',')[0].lower()
        streaming=split2[0].split(',')[1]
        added_titles[title]=streaming

    if len(split2)==3:
        title=split2[1].lower()
        streaming=split2[2].split(',')[1]
        added_titles[title]=streaming

    if len(split2)>3:
        if split2[0] == '' and split2[2] != '':
            title=split2[1].lower()
            streaming=split2[3]

        elif split2[0] == '' and split2[2] == '':
            for item in split2:
                if 'https' in item:
                    index=split2.index(item)
            
            title=''.join(split2[:index]).lower()
            new_split=split2[index].split(',')
            streaming=new_split[1]

        else:
            title=split2[0].split(',')[0].lower()
            streaming=split2[1]

        added_titles[title]=streaming

for title in removed_titles:
    removed_streamings=removed_titles[title].split(',')
    for title2 in added_titles:
        added_streamings=added_titles[title2].split(',')

        if title==title2:
            set_diff=set(added_streamings)^set(removed_streamings)
            diff=','.join(set_diff)

            if len(removed_streamings)>len(added_streamings):
                removed_final[title]=diff

            elif len(removed_streamings)<len(added_streamings):
                added_final[title]=diff

for title in added_titles:
    if title not in removed_titles:
        added_final[title]=added_titles[title]

for title in removed_titles:
    if title not in added_titles:
        removed_final[title]=removed_titles[title]

removed_final=dict(sorted(removed_final.items()))
added_final=dict(sorted(added_final.items()))

streamings_removed = defaultdict(list)
streamings_added = defaultdict(list)

for key, value in removed_final.items():
    streamings_removed[value].append(key)

for value, key in streamings_removed.items():
    streamings_removed[value]=key

for key, value in added_final.items():
    streamings_added[value].append(key)

for value, key in streamings_added.items():
    streamings_added[value]=key

streamings_removed = dict(sorted(streamings_removed.items()))
streamings_added = dict(sorted(streamings_added.items()))

md_file.append(f'Aniwatch v1.0.{new_release_num}\n\n')

if added_final != {}:
    md_file.append("# Adicionados\n")
    for streaming in streamings_added:
        md_file.append(f'## {streaming.upper()}\n')
        for title in streamings_added[streaming]:
            md_file.append(f'* **{title.upper()}**\n')

if removed_final != {}:
    md_file.append("\n# Removidos\n")
    for streaming in streamings_removed:
        md_file.append(f'## {streaming.upper()}\n')
        for title in streamings_removed[streaming]:
            md_file.append(f'* **{title.upper()}**\n')

md_file.append(f'\n**Full Changelog**: https://github.com/SantosThiago/Aniwatch_site/compare/v1.0.{release_num}...v1.0.{new_release_num}')

try:
    with open('patchnotes.md', 'w') as file:
        for line in md_file:
            file.write(str(line))
    print('Patchnotes criado com sucesso!')

except:
    print('Erro na criação do Patchnotes!')