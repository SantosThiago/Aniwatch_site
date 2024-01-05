branch=$(git status | awk "NR==1")
release_num=$(($(git log -1 --pretty="%s" | cut -d '.' -f3) +1))

if [ "$branch" == 'On branch main' ]; then
    git add animes.json
    git add animes.csv
    git commit -m "v1.0.$release_num"
    git push
    git checkout release
    git checkout main -- animes.json
    git checkout main -- animes.csv
    git commit -m "v1.0.$release_num"
    git push
    git tag v1.0.$release_num
    git push origin v1.0.$release_num
    hub release create v1.0.$release_num -F patchnotes.md
    git checkout main

else
    echo "Error! Wrong branch"
    git checkout main
fi