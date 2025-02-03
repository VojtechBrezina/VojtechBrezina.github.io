section .note.GNU-stack

section .bss

; This is wasting some bytes on the alignment, but I don't care.

arg1: dq ?
operation: db ?
arg2: dq ?

result: dq ?

section .data

input_format: db `%ld %c %ld\0`
output_format: db `%ld %c %ld = %ld\n\0`
input_error: db `Invalid input.\0`
invalid_operation: db `Invalid operation: "%c".\n\0`
division_by_zero_error: db `Cannot divide by zero.\n\0`

section .text

extern printf, scanf, puts

global main
main:
    enter 0, 0 ; Reserve 0 bytes on the stack for local variables. (This needs
               ; to be a multiple of 16.)

    ; Read the input.
    mov rax, 0
    mov rdi, input_format
    mov rsi, arg1
    mov rdx, operation
    mov rcx, arg2
    call scanf

    ; Check that all 3 input elements have been corectly read.
    cmp rax, 3
    je .ok

    mov rax, 0
    mov rdi, input_error
    call puts
    mov rax, 1
    leave
    ret
.ok:

    ; Check the operation.
    mov rax, 0
    mov al, [operation]

    cmp al, '+'
    je .plus

    cmp al, '-'
    je .minus

    cmp al, '*'
    je .times

    cmp al, '/'
    je .divide

    jmp .default

.plus:
    mov rax, [arg1]
    add rax, [arg2]
    jmp .done

.minus:
    mov rax, [arg1]
    sub rax, [arg2]
    jmp .done

.times:
    mov rax, [arg1]
    imul rax, [arg2]
    jmp .done

.divide:
    ; Check if arg2 is zero.
    mov rax, [arg2]
    cmp rax, 0
    je .division_by_zero

    mov rax, [arg1]
    mov r11, [arg2]
    idiv r11
    jmp .done

.division_by_zero:
    mov rdi, division_by_zero_error
    call puts
    mov rax, 1
    leave
    ret

.default:
    ; Report invalid operation.
    mov rax, 0
    mov rdi, invalid_operation
    mov si, 0
    mov sil, [operation]
    call printf
    mov rax, 1
    leave
    ret

.done:
    ; Save the result
    mov [result], rax

    ; Print the output.
    mov rax, 0
    mov rdi, output_format
    mov rsi, [arg1]
    mov dh, 0
    mov dl, [operation]
    mov rcx, [arg2]
    mov r8, [result]
    call printf

    ; Return.
    mov rax, 0
    leave
    ret

