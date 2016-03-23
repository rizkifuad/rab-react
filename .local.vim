function! RunGo()
    if(&filetype == 'go')
        let command =  " clear && go build && ./api"
        call VimuxRunCommand(command)
    endif
endfunction
map <leader> :call RunGo()<cr>

