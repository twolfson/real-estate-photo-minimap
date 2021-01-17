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
