+++
title = 'Why Assembly is not the perfect language'
date = 2024-09-29T17:54:13+02:00
draft = true
type = 'post'
+++

I am trying to make [my own programming language](/projects/guinea-pig/) and I
need to make sure I don't miss any good ideas already out there. I will start at
the begining and see how it feels to use the least amount of abstraction that is
still considered a programming language. This will also teach me about the low
level details any compiler developer should be aware of.

To do so, I will program a simple Game of life simulator in the x86-64 assembly
as that is the platform of my development laptop. The finished project can be
found [here](#). You can try it out yourself if you have acces to an x86-64
system running the Linux kernel (or a virtualization like
[WSL](https://learn.microsoft.com/en-us/windows/wsl/install)).

## Some useful sources

While I was writing this post, it took me quite some time to find all the
relevant specifications. Here is a convenient list of links to the most
authoritative sources I could find.

* [The online NASM
documentation](https://www.nasm.us/xdoc/2.16.03/html/nasmdoc0.html) &ndash;
There is also a [PDF version](http://www.nasm.us/xdoc/2.16.03/nasmdoc.pdf) if
you like that better.
* [Intel® 64 and IA-32 Architectures Software Developer
Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
&ndash; This is the official documentation of the instruction set.
* [ELF x86-64-ABI psABI](https://gitlab.com/x86-psABIs/x86-64-ABI) &ndash; The
Application Binary Interface to follow when linking to C programs on x86-64
systems. Here you can find information on things like calling conventions or
stack alignment.
* `man 3 <syscall-name>` &ndash; The functions in `unistd.h` often have the same
signatures as the corresponding Linux syscalls, but make sure to check the
notes.
* `man 2 syscall` &ndash; A summary of the conventions for making syscalls on
linux. Make sure to choose the exact architecture you are using (64-bit
processors can usually run 32-bit executables, but calling conventions are
different).
* [The GitHub mirror of the kernel source](https://github.com/torvalds/linux/) -
When doing any research into the Linux kernel, you will see people in
discussions mentioning file paths you can look up in here.
    * [`arch/x86/entry/syscalls/syscall_64.tbl`](https://github.com/torvalds/linux/blob/master/arch/x86/entry/syscalls/syscall_64.tbl)
    &ndash; The 64-bit syscall table. Here you can find the syscall numbers.

## Setting up a development environment

I will use [NASM](https://www.nasm.us/index.php) as it seems to be popular and
intuitive enough for a beginner like me. My development machine is running
OpenSUSE Tumbleweed, so I just got it from their software repository: 

```sh
sudo zypper in nasm
```

To make an actual executable, you will also need a linker. On linux, one usualy
comes with the [GNU binutils](https://www.gnu.org/software/binutils/) package
which I already had installed on my system.

With these we can create a `main.asm` file and a simple script to build it into
an executable:

```sh
#!/bin/sh
nasm -f elf64 main.asm -o main.o
ld main.o -o tictactoe
```

If you have ever worked with C or C++ this makes perfect sense. A larger project
would probably use a `Makefile`, but compiling assembly files is probably fast
enough not to worry about such things in most projects.

### Getting some extra editor support

I am using [Neovim](https://neovim.io/) so most readers can probably skip this
part, but if you want to configure your own editor, all you probably need to do
is search for a NASM plugin and make sure it is registered for `.asm` files.

#### Highlighting

I made a change to my Neovim filetype configuration to use the `nasm` filetype
for `*.asm` files. This makes sure that
[Treesitter](https://tree-sitter.github.io/tree-sitter/) chooses the best
grammar for the file. If you regularly work with other assembly styles, you
might want to use a special file extension instead of the generic one, but this
works for me.

```lua
-- filetype.lua
vim.filetype.add({
    extension = {
        asm = 'nasm'
    }
})

```

#### Language server

I use a standard setup with
[nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/) and
[Mason](https://github.com/williamboman/mason.nvim) so I just searched for "asm"
and found [this project](https://github.com/bergercookie/asm-lsp). The tool is
mostly designed to analyze output from compilers like `gcc` and `clang` which
produce a different assembly style than what NASM uses. You can however override
this with the following configuration in `.asm-lsp.toml` (You need to enable
`gas` if you want documentation and autocomplete for the actual instruction set.
This might be a bug.):

```toml
version = "0.1"

[assemblers]
nasm = true
gas = true

[instruction_sets]
x86_64 = true

[opts]
diagnostics = false
```

I have also changed the default configuration for nvim-lspconfig, because my
example is stored deep inside the git repository for this website and putting
the configuration in the git repository root doesn't feel right. I made the root
directory be first determined by the configuration file and then the `.git`
directory.

```lua
require("lspconfig").asm_lsp.setup {
    filetypes = { "asm", "nasm" },
    root_dir = lspconfig.util.root_pattern(".asm-lsp.toml", ".git")
}
```

And that's it. Now when I open `main.asm`, I get nice highlights and comfy
features like go to definition for labels or autocomplete and documentation for
instructions, registers and macros.

There are unfortunately no diagnostics, because I could not figure out how to
properly pass options to the command. By default, the language server uses a
compile command that generates an annoying binary file next to the source and it
ignores `compile_commands.json`. To be fair, diagnostics right in the editor are
not too important for assmebly, so I decided not to investigate further.

## A quick introduction to assembly programming for the Linux platform

This section doesn't really aim to teach you assembly. It is just supposed to
make the following examples easier to understand. It assumes that you know the
basics of how a CPU works, like what a register is.

### The minimal executable

First we will write a tiny program that is equivalent to the following C code:

```c
int main(void){
    return 0;
}
```

All this program does is tell the operating system that it wnats to exit and
that it did not run into any errors. The following file can be found at
`tutorial/00_minimal.asm`:

```nasm
section .text

global _start
_start:
    mov rax, 60
    mov rdi, 0
    syscall
```

The main thing you need to successfully link and run a Linux executable is an
exported `_start` symbol in the `.text` section. The `.text` section is where
your instructions should go, because it is loaded as executable. The `global`
directive tells the assembler to expose the symbol to the linker.

Next we define the actual `_start` label and call the `exit` syscall with the
value `0` to indicate success. You can run the `man 2 syscall` command to see
what registers should be used to set the syscall number (`rax`) and the argument
(`rdi`). The number for the syscall can be found directly in the kernel source
tree (see the links at the begining) and the arguments can usually be found
using `man 2 <name>`, but make sure to check the notes section, because the
manpage describes the POSIX C interface and linux syscalls do not always follow
it exactly.

Now you can test everything out (this assumes a somewhat POSIXy shell, with fish
for example, the last command would be `echo $status`):

```
$ cd tutorial
$ ./build.sh
$ ./build/00_minimal
$ echo $?
0
```

If you change the line that says `mov rdi, 0` to something else like `mov rdi,
42`, you can make the program return anything you want. However as the manpage
says, your shell will only see the least significant byte, so 256 will look
like 0 and so on.

### Hello World!

Now that we know, how to tell the kernel to do stuff, we can tell it to write
something to stdout. We can use the classic "Hello World!" phrase that everyone
knows.

We first have to put the text itself somewhere. For that we use the `.data`
section, that is loaded into non-executable memory on startup. We can use a
label to mark a spot in memory as usual, but this time we won't export it. `db`
is a [pseudo instruction for declaring initialized
data](https://www.nasm.us/xdoc/2.16.03/html/nasmdoc3.html#section-3.2.1). That
means that it is not a part of the x86_64 instructuion set, but it just
instructs the assembler to store the bytes we give it at that spot in the file
verbatim. `db` specifically means that the data consists of single bytes.

```nasm
section .data
string: db "Hello World!"
```

Most shells do not append a newline character after the output of a command, so
the string we print should end with a newline explicitly. In NASM, you can use
double or single quotes for regular strings, but you can also use backticks if
you need C-like escape sequences (more on that in [the
documentation](https://www.nasm.us/xdoc/2.16.03/html/nasmdoc3.html#section-3.4.2)).
You could also end the string and write `, 10` or `, 0Ah` because `db` takes an
unlimited number of arguments, but this is probably the most readable way.

```nasm
section .data
string: db `Hello World!\n`
```

We will also need to save the length of the string for later as the `write`
syscall we will be using works on arbitrary data and not null terminated
strings. This can be done with the `equ` pseudo instruction, that is used to
[define
constants](https://www.nasm.us/xdoc/2.16.03/html/nasmdoc3.html#section-3.2.4).
That means that the label before it is no longer holding the memory address at
that spot, but a specific value. The assembler can evaluate simple arithmetic
expressions while doing this as well. We will use the expression `$ - string`,
where `$` is a special symbol that means "[the address at the beginning of this
line](https://www.nasm.us/xdoc/2.16.03/html/nasmdoc3.html#section-3.5)".

```nasm
section .data
string: db `Hello World!\n`
string_len: equ $ - string
```

Now we just take a look at `man 3 write` and `man 2 syscall` to see how to
compose the `write` syscall and we are done (you can find this at
`tutorial/01_hello_world.asm`):

```nasm
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
```

Again, you can test this out and you should see something like this:

```
$ cd tutorial
$ ./build.sh
$ ./build/01_hello_world
Hello World!
$ 
```

### A more complete example: a simple calculator

Now we should make something that takes user input and does something with it.
The next project will be a simple calculator that will read input in the form of
`<x> <op> <y>` where `x` and `y` are two 64-bit signed integers and `op` is one
of `+`, `-`, `*`, `\`. This program will show some important parts of what it
feels like to program in assebmly.

#### Getting started with `libc`

For this example we will look into what it takes to make use of the standard C
library in an assembly program. While C libraries in general can be linked
without any specific adjustments, `libc` itself is designed to be the framework
for writing C programs and that includes taking over the `_start` symbol to
provide its own lifecycle with some cleanup at the end.

This can actually be bypassed, but it is easiest to just start the program with
the `main` symbol. We will also not need to perform an `exit` syscall anyway as
it we can just "return the exit code from the main function" like in C.

Another adjustment we will make is to use our C compiler (`gcc` in my case)
instead of the linker, because linking `libc` manually is a little more
complicated than I want to show here and the C compiler hides that:

```sh
nasm -f elf64 02_calculator.asm -o build/02_calculator.o
gcc build/02_calculator.o -o build/02_calculator
```

To make sure everything works, we can replicate the minimal example using the C
runtime:

```nasm
section .note.GNU-stack

section .text

global main
main:
    mov rax, 42 ; Put the status code into the accumulator.
    ret         ; And return back to _start.
```

There is a new empty section called `.note.GNU-stack` now. To be honest, my
knowledge of low level programming is reaching its limits here. If I understand
everything correctly, this section tells the loader to put map the memory for
the stack as non-executable. When I link `libc` without this, the linker
complains, that this is deprecated behaviour. I assume that this is a security
feature, because assembling executable code on the stack is never really
necessary and could be used by some exploits to make their job easier.

### Reading input with `scanf`

We can now start developing our calculator. First we will reserve some space in
the the `.bss` section. This section holds unitialized program data. There are
multiple ways of doing this in NASM and one of them uses the same syntax as
initialized data, but the values are replaced with a question mark.

```nasm
section .bss

arg1: dq ?
arg2: dq ?
operation: db ?
```

Now we can use this space to store the input. First we will declare the format
string. This time it will be null terminated. Then we declare our dependency on
the `scanf` and `printf` symbols with the extern directive.

```nasm
section .data
input_format: db `%ld %c %ld\0`

; ...

extern printf, scanf
```

Next we will need to find out, how to pass the variadic arguments to `scanf`.
