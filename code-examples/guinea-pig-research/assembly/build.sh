#!/bin/sh
nasm -f elf64 main.asm -o build/main.o
ld build/*.o -o build/tictactoe
