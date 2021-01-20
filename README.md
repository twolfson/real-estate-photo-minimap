# real-estate-photo-minimap
Generate a minimap browser for real estate photos

Built out of frustration with disorienting rental and real estate listings (e.g. photos jumping between rooms, no blueprint image)

<https://twolfson.github.io/real-estate-photo-minimap-public/>

TODO: Persist changes to `blueprint3d`
TODO: Document `npm install` vs `npm link` workflow

Sanity checks:
TODO: Verify we are doing decent teardown between pages

Before landing:
TODO: Fix up buttons
TODO: Handle export state
TODO: Integrate with other page

TODO: Flatten out `minimapInfo.boxes` to `minimap.items` so everything has a `type` and we can use less switching logic as well as have everything at the same order

- Multiselect partially implemented on another branch, lots of small work in theory though
- Feel like boxes might be limiting so should second guess it
  - e.g. Current layout cuts off hallway awkwardly but unsure there are other good simple solutions

TODO: Adjust order of items (first is highest)
TODO: Don't crowd target space with initial items
TODO: Add "Add box" button and right click to delete functionality
TODO: Add 4 way resize

TODO: Having selection (required for multiselect) likely implies needing arrow keys which has headaches of UX for when to use arrow keys in minimap vs for photos

TODO: Stop hammering localStorage via a `rr({persist: false})` flag

We tried out another variant outside of boxes -- i.e. building via line segments
Results can be seen in `dev/gridlines.builder`

While it can be more flexible, the UX isn't great
After realizing this, we went on a long tangent:
tl;dr - Build a blueprint tool, it will be all walls with smart splitting on add
"""
Take notes on `master` about it
Solution would be to use line drawing (with grid snapping/not)
and at that point, we're rebuilding SVG
so might as well take time to use an established repo

Which we were hesitant about due to...
Not being able to do everything programmatically we want, in an easy manner

But now we realize that things like text bounded in a box is prob not so practical for visuals

But then pen tool confusion...

Ugh, no winning here =/

Oh, and pen tool is kind of broken in Method editor... yay...
and SVG edit is kind of shit for drawing...

Maybe we should just clone Figma?

Tried out PenTool, also not great... Poor hit state and lack of deletion

Ugh, such a big build if we do it...

- Pen tool itself
    - Snapping to lines
    - Snapping to points
    - Add/delete support
    - Understanding wtf a vector network is -- Pretty confident it's a graph internally (i.e. nodes + edges + faces (for fills)), then exports as separate paths (which is only when explicitly done)
- Select support
- Arrow keys
- Draggable
- Resizable
- Possible even text support

So many headaches here...

Like I know I can do it
but imagining weeks of work =/

...
Or y'know... find a blueprint tool that we can use
Maybe that UX is what we should focus on
Click start in a grid, move to target location for width/height, move in other direction to set size
Tearing down walls isn't that -- but instead they add doors and such

Neat: https://github.com/cvdlab/react-planner
That one allows for just drawing walls in series, still kind of like box model more

"blueprint cad tool github" was great

https://github.com/furnishup/blueprint3d
Awesome but lacks drawing windows and such in 2D...

https://i0.wp.com/www.lifeofanarchitect.com/wp-content/uploads/2019/08/Architectural-Sketch-Series-Schematic-Design-03.jpg?resize=1200%2C520&ssl=1
Oh duh! We make it dashed or dotted to simulate opening

It doesn't seem like we need to do bulk resizable like we're worrying about either
More grab/drag wall

So essentially it becomes eraser tool + cursor tool + add tool

...
Key point: We need to handle merging/splitting with adjacent walls
Once that's done though, we can change up hover state easily/nicely
"""

...
Revisiting https://furnishup.github.io/blueprint3d/example/#
We might actually be able to use this
It's super clean and relatively close to what we'd build
Although it's lacking good UX behavior at times =/

...
Realizing "floorplan" is the best term to search for
"""
Another decent floorplan variant

https://github.com/dcarubia/floor-plan-lab
https://floorplanlab.com/
Better drawing functionality than we had but no dragging support at all for walls...

Looked at others but nothing noteworthy

Prob best to play with the 3D one we found and see how easy it is to fix up:
- Only collapse walls on drag stop
- Ensure sane data structures
"""

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
