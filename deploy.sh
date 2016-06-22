#!/bin/bash
source ".env"

template(){
  # usage: template file.tpl
  while read -r line ; do
    line=${line//\"/\\\"}
    line=${line//\`/\\\`}
    line=${line//\$/\\\$}
    line=${line//\\\${/\${}
    eval "echo \"$line\""; 
  done < ${1}
}

git reset --hard
git pull origin master
cd api/
go build
pm2 restart rab_api

cd ../public/
npm install
npm run build
rm -rf dist/
mv dist_future dist
template index.tpl > index.html
