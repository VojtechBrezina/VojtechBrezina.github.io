generate:
    HUGO_ENV=production hugo
    cp -r public/* ../output
