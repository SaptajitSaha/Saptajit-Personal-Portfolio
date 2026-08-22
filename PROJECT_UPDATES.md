# Updating the Portfolio

The project is mirrored to the private GitHub repository at [SaptajitSaha/Saptajit-Personal-Portfolio](https://github.com/SaptajitSaha/Saptajit-Personal-Portfolio). Its managed project remote remains separate, so routine GitHub pushes use the remote named `github`.

## Recommended update sequence

| Step | What happens | Result |
| --- | --- | --- |
| 1 | Request the portfolio change in this project. | The React site is updated and visually checked. |
| 2 | A project checkpoint is created. | A recoverable version is ready for the live project. |
| 3 | The same change is committed and pushed to `github/main`. | The GitHub repository stays synchronized. |
| 4 | Click **Publish** in the project interface. | The latest checkpoint becomes the published site version. |

For each future revision, the edit, verification, checkpoint, and GitHub push can be handled in one pass. Publication remains a user-initiated final action in the project interface; this keeps the public site release under the account owner’s control.

## Repository remote

```bash
git remote get-url github
git push github main
```

The source project is a React and Vite static portfolio. Before a GitHub push, the usual verification is:

```bash
pnpm check
pnpm build
```
