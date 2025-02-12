# @aspyn-io/uikit

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

## Contributing

Everyone is encouraged to contribute to this repository via submission of
Pull Request using [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)

### Local Development Setup

- Ensure you have [Nodejs](https://nodejs.org/en/download) >= v22 installed
  - Ensure you have npm package manager installed (usually comes with nodejs)
- Run `npm install` to install dependancies
- Run Storybook locally with `npm run storybook`

## TODO

- [ ] Actually move some components in..
- [ ] Expose a theme for customization?

### `aspyn-io/ui` components remaining

- [ ] `Breadcrumb`
- [ ] `FlowbiteWrapper`? -- Does this belong in here?
- [ ] `LoadingState`? -- Not sure if we should keep this
- [x] `Modal`
- [ ] `Navbar`
- [ ] `NotFound`? -- Maybe not needed
- [ ] `PhoneNumberInput`? -- This component isn't that good
- [ ] `QuickActions`? -- Eh
- [ ] `ReportLayout`? -- Legacy?
- [ ] `SearchDropdown`? -- Maybe? There's some good flowbite options
- [ ] `Sidebar`
- [ ] `SymbolInput`? -- This component isn't that good
- [ ] `TaxInput`? -- This component isn't that good
- [ ] `TruncatedId`? -- Maybe?
- [ ] `UnscopedFeaturePlaceholder`? -- We can do this one better
