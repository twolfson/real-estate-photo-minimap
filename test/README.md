# real-estate-photo-minimap
Due to being an experimental tool, investing time into testing will likely cost more time than it will save in the short term (e.g. layouts may change rapidly, leading to double maintenance)

As a stand-in for now, here's what we should test assuming that the current version is stable:

## Step: Categorize images
- At start, no images have locations
- On number click, image is assigned location + moved to next image
- On typing in location input, it updates text in box (thanks React...)
- On focusing in location input,
  - If there is at least 1 photo, it jumps to matching category
  - If there are no photos, there are no errors

- Typing numeric shortcut, assigns category to current image
- Typing "s", moves to next image
- Pressing left arrow key, moves to previous image
- Pressing right arrow key, moves to next image

- Pressing left arrow key on first image, moves to last image
- Pressing right arrow key on last image, moves to first image

- Could do testing for serializing/restoring state but that's far from finished
- Omitting even smaller one-offs (e.g. showing border on categorized images, updating remaining images count)

## Store
- Generates helper state (unfrozen) and render state (frozen)
- Actions only interact with unfrozen state
- `run` methods only interact with frozen state
- `sort`
  - Will compare `null` equal to `null`
  - Will put `null` at back of list when it's first
  - Will put `null` at back of list when it's second
  - Will sort `1` in front of `2` when `1` is first
  - Will sort `1` in front of `2` when `1` is second
  - Won't change order both images have value of `1`
