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
template public/index.tpl > public/index.html
cd api/
go build
pm2 delete rab_api
pm2 start api.sh --name rab_api

cd ../public/
npm install
npm run build
rm -rf dist/
mv dist_future dist
