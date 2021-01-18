# real-estate-photo-minimap
Generate a minimap browser for real estate photos

Built out of frustration with disorienting rental and real estate listings (e.g. photos jumping between rooms, no blueprint image)

<https://twolfson.github.io/real-estate-photo-minimap-public/>

## Features
- [x] Quick location categorization
- [ ] Minimap creator
  - Probably use: https://github.com/methodofaction/Method-Draw (MIT license)
    - Be sure to attribute
    - Explored this in https://github.com/twolfson/Method-Draw/tree/dev/integration.explore
    - Very plausible to integrate but concerned with taking on large external tool
      - Lack of strong documentation, possibly hard to do simple things (e.g. adding a box, integrating dragging other content (e.g. HTML elements)), fighting with React
      - Possibly going down wrong path for what we want to build (more time consumption for a prototype)
    - Alternative, use React libraries (or jQuery UI) -- just to prototype
      - Draggable (maybe drag from "clone" selection area to create new ones)
      - Resizable (for line rotation support, though can prob just have 2 different line types)
      - Left click to add
      - Right click to delete
    - Realizing that boxes might not even be right way to build this... we used pen tool in Figma after all, but concerned pen tool not intuitive for people
      - I guess anything can be built from boxes + lines though, right? (except arcs)
  - Nice touch: Prepopulate SVG editor with location names and boxes around them (added bonus: shows scale of target minimap)
  - Also need to add in drag/drop for locations/image groups
  - After building 2:
    - Pen tool is definitely necessary, there are weird walls and such at times (e.g. cut-ins, excess areas)
      - Maybe can build a dot pattern grid and allow people to click/drag different points on it?
    - Copy/paste is necessary for common workability
    - Resizing with text staying centered is nice
    - Binding taxes to center of a box is nice
    - Click/drag multiselect is prob nice to have
    - Maybe there's something that exists for blueprint layouts...
      - Whatever we build is prob always going to be lesser than that (in quality/practicality) but maybe we'll be more agile with simpler?
    - Welp, stopping here -- it's clear that needs some more thought/work
      - Might get wild hairs to build that grid editor as a separate tool
    - Need some way to recategorize images (e.g. 2 almost identical bathrooms)
- [ ] Minimap browser
  - Nice polish: Final order is based on zig-zag library shelf pattern (i.e. riiiiight, down, left, riiiiight)
  - Figma sketch: https://www.figma.com/proto/iEBsOuvBRFDVHn8yiTJOOP/Real-estate-layout-tool?node-id=0%3A3&frame-preset-name=Desktop&scaling=min-zoom

### Pending tasks
- Likely stopping soon, we've spent 2 days on this (with good amount of progress)
- but can see at least 2 more days work easily (e.g. 1 day on finalizing workflow and state persistence, 1 day on CRUD implementation and polish)
  - For individual steps, just extend the same state -- we would never create multiple database schemas, only add on new data in new columns. Same concept here

#### Initial release
- [ ] Reintroduce second step (currently only a rough prototype since usage of this is uncertain)
  - Should break up different sections into components for reuse (e.g. all images gallery)
  - Move back to listing all images, but now list as grouped variants (maybe allow person to toggle via select menu for sort)
    - Could do grouped outline but prob fine to list in order and the colors will communicate for us

#### Before open source
- [ ] Settle on license (probably dual license, maybe leave unlicensed/private for a while)

#### Polish
- [ ] Add analytics
- [ ] Add error handling
- [ ] Add "hint" notes to categorization page
  - Use ceiling fixtures (e.g. fan, light)
  - Use blinds/curtains colors
- [ ] Add freezing/immutability to store + all data accessed via getters
- [ ] Intro page on website
- [ ] CRUD listing page (after first layout creation)
- [ ] Accepting image list via `textarea` + instructions for various sites
  - Likely build instructions out as bookmarklets (if these are still allowed by browsers)
  - Document that we *are* hotlinking and relevant drawbacks (e.g. ephemeral content)
- [ ] Shareable links/restorable state
  - Be careful: Restoring state for SVG can lead to XSS vulnerabilities
- [ ] On final page (with share links), prompt for donations
- [ ] Footer info to demo page (e.g. attribution, donation info)
- [ ] Prompt user on BR/BA count to prepopulate fields

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
