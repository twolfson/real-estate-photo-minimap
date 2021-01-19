# real-estate-photo-minimap
Generate a minimap browser for real estate photos

Built out of frustration with disorienting rental and real estate listings (e.g. photos jumping between rooms, no blueprint image)

<https://twolfson.github.io/real-estate-photo-minimap-public/>

Next steps to finish this out:
- Approach 1
  - Deep copy objects + freeze them before handing them out of `Store` via getters
      - Deep copy via either `lodash/deepCopy` or `JSON.stringify/parse` for hacks
        - https://stackoverflow.com/questions/39241046/deepcopy-in-react
- Approach 2
  - Freeze entire state and update everything massively (prop
- Why we've stopped
  - Likely going to get headaches around the following:
  - Need to implement sort logic differently (i.e. on "Next" click -- prob just another method, but not bound to `render` call)
  - Moving to `this.state` in components makes us lose a lot of convenience methods, not sure what the common solution is -- really hoping it's not a massive component or lots of helpers
    - Would need to dig through more Redux examples which I don't want to spend time on
  - Pulling out one-off references to `Store` without having tests as backup (depends on last point's Redux learnings)

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
      - After some thorough thought, not worth rebuilding that functionality. We'll wind up building a full blueprint tool when this is intended as quick/dirty (for now)
        - Same fallacy as rebuilding DSL for an API (it never stops with just 1 or 2 functions)
    - Copy/paste is necessary for common workability
    - Resizing with text staying centered is nice
    - Binding taxes to center of a box is nice
    - Click/drag multiselect is prob nice to have
    - For text, prob use `contenteditable` `span` tags (way easier to manage than toggling `input` styles)
    - Maybe there's something that exists for blueprint layouts...
      - Whatever we build is prob always going to be lesser than that (in quality/practicality) but maybe we'll be more agile with simpler?
    - Welp, stopping here -- it's clear that needs some more thought/work
      - Might get wild hairs to build that grid editor as a separate tool
    - Need some way to recategorize images (e.g. 2 almost identical bathrooms)
    - Maybe we don't even need to have blueprint support at all... maybe people doing the minimap generation on their own computer is "good enough"
      - Eh, was kind of tedious with Inkscape but I can imagine there are better tools (e.g. Figma)
    - Before we build anything, we want more confidence that it's the right path (e.g. usability, state persistence)
      - which itself is a bit of a contradiction, but I don't think we're really creating any unique tool -- more watering down existing ones
      - Let's keep using Inkscape with only boxes to see how viable it is
      - After doing 50 listings, then we'll prob be more confident (also will show us how often we really need to do this)
      - For closer viability, added `reference-files/minimap-template.svg` which has content we can copy/paste -- similar to our imagined drag/drop clone idea
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
- [ ] Abstract common content like page components, key listeners, page layouts
- [ ] Behavior
  - [ ] Sort once when we navigate between pages, not on every render
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
