section .data

string: db `Hello World!\n`
string_len: equ $ - string

section .text

global _start
_start:
    mov rax, 1 ; write
    mov rdi, 1 ; stdout
    mov rsi, string
    mov rdx, string_len
    syscall

    mov rax, 60 ; exit
    mov rdi, 0
    syscall
