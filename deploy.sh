#!/bin/sh
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

template public/index.tpl > public/index.html
template public/src/config/index.tpl > public/src/config/index.js
