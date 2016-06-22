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

cd public/
template index.tpl > index.html
node server.js
