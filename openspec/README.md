# OpenSpec — Electric Castle EC12

Spec-driven development for the EC12 artist advancing app.

## Directory Structure

```
openspec/
└── changes/
    └── <feature-name>/
        ├── proposal.md   ← What and why (required)
        ├── design.md     ← Technical approach (required)
        └── tasks.md      ← Implementation checklist (required)
```

## Workflow

1. Create a new folder under `openspec/changes/<feature-name>/`
2. Write `proposal.md`, `design.md`, `tasks.md`
3. Open a PR on GitHub — Hermes spec-validator will automatically validate
4. Address any issues flagged, then get human approval
5. Hermes coder agent generates the implementation

## Spec Format

### proposal.md
- **What** — what is being built
- **Why** — the reason / user need
- **Scope** — what's in and out
- **Success Criteria** — how to know it's done

### design.md
- Architecture / component overview
- Database / data model changes
- Frontend changes
- API / data layer changes
- Testing approach

### tasks.md
- Checkbox list (`- [ ]`) of all implementation steps
- Each task should be small enough to complete in a few hours
