<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep student identity, selections and terminal submission in the pure evaluation reducer so the result screen cannot reopen the house or mutate a grade.
- Define scene material roles in global CSS and resolve them with scene-palette; device data uses role names so all 3D colors share the design system.
- Game rendering stays client-only on the index route; unmount the scene after grading so the house is not visible behind results.
