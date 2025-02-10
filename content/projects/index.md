# Projects

Information about my long-term projects and more importantly all the things I
learned from them.

## Active projects

These are the one I am actively working on.

<script type="text/python">
print("TODO: List projects")
</script>

## Stuff I would like to try one day

Things I haven't had time to look into yet.

###  Configuring my own Linux From Scratch system

I would like to get my hands dirty and unerstand everyhing that goes on in a
Linux system. They say that Linux distributions are just a bunch of
configuration files so how hard could this be... My goal is to create a system
that builds its software from source where possible and uses something like
flatpak for the rest. I would like to gradually build my own version of the
following utilities:

- A package manager -- Preferably not a package repository though. Maybe there
is a clever way to steel someone's homework...
- A Wayland compositor -- Or maybe a library, that lets you build your own super
fast. I have some ideas about window management that I haven't seen anywhere
else.
- An init system -- systemd has some issues. I will first have to carefully
examine the alternatives to see if I find something I would like better.
- Text editor, web browser, terminal multiplexer... -- I hate tabs, splits and
all that stuff. I am greatly dissatisfied that my system doesn't have a unified
keyboard shortcut that would mean "move the focus in this direction". I always
have to conciously decide if I am switching tabs in my browser, splits in my
code editor or windows on my desktop. Why can everything not be its own window?

### Creating a tool that understands natural language without machine learning

Today, the term "Artificial Inteligence" is commonly understood to mean machine
learning, usually neural networks. I don't like this. They feel unpredictable
and their accuracy seems to be limited. The way to address their shortcomings
seems to be to just layer them on top of each other and run them in loops. I
would like to bring some order to this madness.

Natural language is annoying because to understand a sentence, you often have to
have additional knowledge. The popular example is something like: "The laptop
cannot fit into my backpack, because it is too large." This statement gives us
two pieces of information:

- A laptop cannot fit into a backpack.
- The reason for that is that one of them is too large.

To a program trying to parse it without any context, the subject of the second
part of this sentence is unknown. To succesfully solve this problem I will have
to find an efficient way to store all the information needed to make such
distinctions. The [Resource Description Framework](https://www.w3.org/RDF/) gave
me some ideas about that.
