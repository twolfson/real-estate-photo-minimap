# real-estate-photo-minimap
Generate a minimap browser for real estate photos

Built out of frustration with disorienting rental and real estate listings (e.g. photos jumping between rooms, no blueprint image)

<https://twolfson.github.io/real-estate-photo-minimap-public/>

## Features
- [x] Quick location categorization
- [ ] Minimap creator
  - Probably use: https://github.com/methodofaction/Method-Draw (MIT license)
    - Be sure to attribute
  - Nice touch: Prepopulate SVG editor with location names and boxes around them (added bonus: shows scale of target minimap)
  - Also need to add in drag/drop for locations/image groups
- [ ] Minimap browser
  - Nice polish: Final order is based on zig-zag library shelf pattern (i.e. riiiiight, down, left, riiiiight)

### Pending tasks
#### Initial release
- [ ] Reintroduce second step
  - Should break up different sections into components for reuse (e.g. all images gallery)
  - Move back to listing all images, but now list as grouped variants (maybe allow person to toggle via select menu for sort)
    - Could do grouped outline but prob fine to list in order and the colors will communicate for us
- [ ] Write out would-be testing skeleton, even if we're not doing it -- so there's a reference for the future
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
