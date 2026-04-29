Commit the current EC12 work to git.

Steps:
1. Run `git status` to show what has changed
2. Show me the list of changed files and ask me to confirm which ones to include (default: everything in `ec12-app/`)
3. Ask me for a short commit message describing what changed
4. Run `git add` on the confirmed files, then `git commit` with the message I provided
5. Confirm the commit was successful with `git log --oneline -3`

Always explain what each git command will do before running it.
Do not push to remote unless I explicitly ask.
