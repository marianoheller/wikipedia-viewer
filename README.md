
Build process for gh-pages:

Remove build/ from .gitignore
Make changes
npm run build
open /build/index.html
transform "/static/..." srcs and hrefs to "statis/..."
Commit to master
Run "git subtree push --prefix build origin gh-pages"
Enjoy!