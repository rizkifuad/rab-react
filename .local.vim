function! RunGo()
    if(&filetype == 'go')
        let command =  " clear && go build && ./api"
        call VimuxRunCommand(command)
    endif
endfunction
map <leader> :call RunGo()<cr>
set softtabstop=2
set tabstop=2
set shiftwidth=2
autocmd FileType javascript set ft=javascript.jsx
