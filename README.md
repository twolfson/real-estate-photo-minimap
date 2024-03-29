# real-estate-photo-minimap
Generate a minimap browser for real estate photos

Built out of frustration with disorienting rental and real estate listings (e.g. photos jumping between rooms, no blueprint image)

<https://twolfson.github.io/real-estate-photo-minimap-public/>

## Features
- [x] Quick location categorization
- [x] Minimap creator
- [ ] Minimap browser
  - Nice polish: Final order is based on zig-zag library shelf pattern (i.e. riiiiight, down, left, riiiiight)
  - Figma sketch: https://www.figma.com/proto/iEBsOuvBRFDVHn8yiTJOOP/Real-estate-layout-tool?node-id=0%3A3&frame-preset-name=Desktop&scaling=min-zoom

### Pending tasks
- Likely stopping soon, we've spent 2 days on this (with good amount of progress)
- but can see at least 2 more days work easily (e.g. 1 day on finalizing workflow and state persistence, 1 day on CRUD implementation and polish)
  - For individual steps, just extend the same state -- we would never create multiple database schemas, only add on new data in new columns. Same concept here

#### Before open source
- [ ] Settle on license (probably dual license, maybe leave unlicensed/private for a while)

#### Polish
- [ ] Use center points for text labels (e.g. starting position in demo is no longer dead center)
  - Position center for first
  - Others are left until moved (so everything gets `position: center` when x or y changes)
- [ ] Abstract common content like page components, key listeners, page layouts
- [ ] Add analytics
- [ ] Add error handling
- [ ] Add "hint" notes to categorization page
  - Use ceiling fixtures (e.g. fan, light)
  - Use blinds/curtains colors
- [ ] Intro page on website
- [ ] CRUD listing page (after first layout creation)
- [ ] Accepting image list via `textarea` + instructions for various sites
  - Likely build instructions out as bookmarklets (if these are still allowed by browsers)
  - Document that we *are* hotlinking and relevant drawbacks (e.g. ephemeral content)
- [ ] Shareable links/restorable state
  - Be careful: Restoring state for SVG can lead to XSS vulnerabilities
- [ ] On final page (with share links), prompt for donations
- [ ] Footer info to demo page (e.g. attribution, donation info)
- [ ] Prompt user on BR/BA count to prepopulate fields (e.g. Bedoom A, Bedoom B for 2BR, add Bedoom C for 3BR)
- [ ] Set max height on images
- [x] Play with React Dev Tools to see performance issues as well as move off of `[].concat` to use nested arrays
- [ ] Update schema versioning to be more robust (e.g. use `package.json` version or temporal version, settle on how migrations are handled)

#### Low priority
- [ ] Add `destroy` cleanup for `Blueprint3d` (not a lot of memory leaks expected)
- [ ] Add undo history for blueprint
- [ ] Copy/paste walls somehow in blueprint
- [ ] Click + drag on a room itself (i.e. if there are at least 3 walls selected AND they are continuous AND clicked location inside would be n-gon, then show hover grow as well as allow dragging)
- [ ] Arrow key support for blueprint (would complicate UX with arrow keys for photos)
- [ ] Click + drag a room label to swap labels (so it swaps the numbers for all matched images, since text only would be silly)
- [ ] For "Build minimap", clicking on on label multiple times cycles through next image in label

## Getting started
To run our repo locally, run the following:

```bash
# Clone our repo
git clone https://github.com/twolfson/real-estate-photo-minimap
cd real-estate-photo-minimap

# Install our dependencies
npm install

# Run our local server
npm start
```

Our site will be accessible via <http://localhost:5000/>

## Documentation
### Development
If you're updating a dependency (e.g. `blueprint3d`), then you can use a linked version via `npm link`:

```bash
# Inside blueprint3d
# Set up a global link for our `blueprint3d` folder
npm link

# Inside real-estate-photo-minimap
# Link `node_modules/blueprint3d` to our global `blueprint3d` folder
npm link blueprint3d
```

Any new builds in `blueprint3d` should now automatically be picked up in future builds

### Minimap builder
Our minimap builder is a very heavily modified version of <https://github.com/furnishup/blueprint3d>

- e.g. Merge on drag end, selection support, text label support
- Documented in: https://github.com/twolfson/blueprint3d/tree/dev/personal.fork

Before arriving at that library, we explored/attempted other approaches:

- Boxes with labels in center or empty boxes, partially completed in `1.5.0` but lacked robust functionality
  - Also initial revision had drawback of crowding target space, though likely could be fixed
  - Started a `multiselect` exploration but stopped for some reason, <https://github.com/twolfson/real-estate-photo-minimap/tree/a43e6a4bb4e1207b98e5eacc92c5dc886bd62aae>
- Gridline-based builder, explored in <https://github.com/twolfson/real-estate-photo-minimap/tree/59a0d8291b67a53e5318f1334d3948498e5cab7a> but not promising for straight lines nor click/drag
- Other approaches considered: <https://raw.githubusercontent.com/twolfson/real-estate-photo-minimap/dev/integrate.floorplan/README.md?token=AAG4KWGAIEUOCRMG3A7VCHLABYJS2>
