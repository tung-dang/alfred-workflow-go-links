## Features

Quick access list of urls that are simple pre-defined text file `go_list.txt`;

## Installation

Open terminal at source code workflow

1. Install `nvm` - node version manager in (https://github.com/creationix/nvm)
2. Enter `nvm install` to download node version which is defined in `.nvmrc` (current version is 7.2)
3. Enter `yarn install` to download node packages dependencies
4. Update `go_list.txt` file to contain your website URL collection.
5. Import workflow into Alfred tool by one of following ways: 
    1. Double-click on exported file in `exported-worfllow-file/Go.alfredworkflow`
    2. Copy this repository folder into Alfred custom workflow store folder, ex: `/Users/<your-user-name>/Dropbox/app_backup/Alfred.alfredpreferences/workflows`

## Usage in Alfred workflow

### Commands
- `go`: Search projects
- `go_clear_cache`: clear all local cache
- `go_edit_list_links`: open `go_list.txt` file to add/update/delete bookmark links.

### Link format in `go_list.txt`
- Each line is a link. 
- A comment line begins with `#`. Here is an example: 
- Link format 1: `URL | description`

```
# AUI
https://docs.atlassian.com/aui/latest/docs/icons.html | AUI Icons
https://design.atlassian.com/2.1/product/foundations/colors/ | AUI Color - Design Guideline
```

- Link format 2 - a Go link: `go/alias-link | description`. An example: 

```
go/helpdesk | Go Helpdesk page
```

- Link format 3 - link has a parameter: `https://abc.com/browse/{0} | description...`. An example: 

```
https://abc.com/browse/{0} | Search...
```
## Development

- `yarn run export-wf`: zip entire project and export to `exported-workflow-file/Go.alfredworklow` file 