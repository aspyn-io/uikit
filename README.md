# `@aspyn-io/uikit`

This repository contains the shared React components and unified styles for
Aspyn. It is designed to provide a consistent look and feel across all Aspyn
applications.

## Prerequisites

- [Node.js](https://nodejs.org/en/download) (See `.nvmrc` for version)

## Installation

```sh
npm install @aspyn-io/uikit
```

## Getting started

```sh
npm install
```

### Running the storybook

```sh
npm run storybook
```

## Git Hooks

This project uses Husky and lint-staged to run checks before each commit and push. This ensures code quality, consistent formatting, and successful builds.

### Setup

The hooks are automatically installed when you run:

```bash
npm install
```

If the hooks are not executing, make sure they're executable by running:

```bash
chmod -R +x .husky
```

### What it does

Before each commit:
- ESLint will automatically fix fixable issues in staged files
- The commit will be blocked if there are unfixable issues

Before each push:
- The project will be built to ensure it can compile successfully
- The push will be blocked if the build fails

### Manual Running

You can manually run the linting fix and build with:

```bash
npm run lint-fix
npm run build
```

### Skipping Hooks

In case you need to bypass the hooks (not recommended):

```bash
git commit -m "your message" --no-verify
git push --no-verify
```

## Contributing

Everyone is encouraged to contribute to this repository via submission of
Pull Request using [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)

## TODO

- [ ] Expose a theme for customization?

### `aspyn-io/ui` components remaining

- [x] `Breadcrumb`
- [ ] `FlowbiteWrapper`? -- Does this belong in here?
- [ ] `LoadingState`? -- Not sure if we should keep this
- [x] `Modal`
- [x] `Navbar`
- [ ] `NotFound`? -- Maybe not needed
- [x] `PhoneNumberInput`
- [ ] `QuickActions`? -- Eh
- [ ] `ReportLayout`? -- Legacy?
- [x] `SearchDropdown`? -- Maybe? There's some good flowbite options
- [x] `Sidebar`
- [ ] `TaxInput`? -- This component isn't that good
- [ ] `TruncatedId`? -- Maybe?
- [ ] `UnscopedFeaturePlaceholder`? -- We can do this one better
