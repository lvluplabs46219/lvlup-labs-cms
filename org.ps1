# 1. Remove the accidental git history
Remove-Item -Path ".git" -Recurse -Force

# 2. Re-initialize the repository
git init

# 3. Create a clean .gitignore file for the CMS (if it doesn't already have one)
@"
# dependencies
node_modules/

# next.js
.next/
out/
build/

# env files
.env
.env.*
!.env.example
!.env.sample

# logs
*.log

# build artifacts
*.tsbuildinfo
dist/

# system/editor
.DS_Store
Thumbs.db
.idea/
.vscode/
"@ | Out-File -FilePath .gitignore -Encoding utf8

# 4. Add your files and commit
git add .
git commit -m "chore: initial clean commit"

# 5. Link to the correct remote repo
git remote add origin https://github.com/lvluplabs46219/lvlup-labs-cms.git

# 6. Push to GitHub
git push -u origin master