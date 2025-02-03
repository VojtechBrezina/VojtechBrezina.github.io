#!/bin/sh
nasm -f elf64 00_minimal.asm -o build/00_minimal.o
ld build/00_minimal.o -o build/00_minimal

nasm -f elf64 01_hello_world.asm -o build/01_hello_world.o
ld build/01_hello_world.o -o build/01_hello_world

nasm -f elf64 02_calculator.asm -o build/02_calculator.o
gcc build/02_calculator.o -o build/02_calculator
