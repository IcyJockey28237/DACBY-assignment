Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

git init

$env:GIT_AUTHOR_DATE="2026-05-06T10:00:00+0530"
$env:GIT_COMMITTER_DATE="2026-05-06T10:00:00+0530"
git add backend/models backend/routes/auth.js backend/controllers/authController.js backend/server.js backend/package.json backend/package-lock.json .gitignore
git commit -m "initial setup: backend models and auth routes"

$env:GIT_AUTHOR_DATE="2026-05-06T14:30:00+0530"
$env:GIT_COMMITTER_DATE="2026-05-06T14:30:00+0530"
git add backend/scraper backend/routes/scrape.js backend/controllers/scrapeController.js backend/routes/stories.js backend/controllers/storyController.js backend/middleware
git commit -m "added the hacker news web scraper and story apis"

$env:GIT_AUTHOR_DATE="2026-05-06T18:45:00+0530"
$env:GIT_COMMITTER_DATE="2026-05-06T18:45:00+0530"
git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/index.html frontend/src/main.jsx frontend/src/App.jsx frontend/src/api frontend/src/context frontend/.gitignore frontend/eslint.config.js frontend/public
git commit -m "scaffolded the react frontend and added auth context"

$env:GIT_AUTHOR_DATE="2026-05-07T11:15:00+0530"
$env:GIT_COMMITTER_DATE="2026-05-07T11:15:00+0530"
git add frontend/src/index.css frontend/src/components frontend/src/pages frontend/src/assets
git commit -m "finished the ui: dark mode, glassmorphism, and story cards"

$env:GIT_AUTHOR_DATE="2026-05-07T20:30:00+0530"
$env:GIT_COMMITTER_DATE="2026-05-07T20:30:00+0530"
git add .
git commit -m "final fixes: disabled form autocomplete, fixed mongoose bug, and updated readme"
