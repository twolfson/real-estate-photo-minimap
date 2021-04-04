# real-estate-photo-minimap
1.7.0 - Transitioned from `react-hyperscript` to JSX to minimize unclear "missing `])`" errors
  - Subtasks included:
  - Verifying no missed `,` in output
  - No missed `className` conversion `.`'s
  - Visual diff (screenshot with Firefox + `image-diff`)
  - For reference: Pug explorations in https://github.com/twolfson/real-estate-photo-minimap/tree/8a41d800798a37a978c4fb68300a79344821039a

1.6.1 - Upgraded `blueprint3d` with removed THREE.js dependency (500kb)

1.6.0 - Replaced boxes minimap builder with floorplan builder

1.5.0 - Added minimap builder via draggable/resizable

1.4.1 - Fixed sort behavior to move `null` to end

1.4.0 - Added state freezing and store isolation

1.3.0 - Added routing and quick/dirty step 2 prototype page

1.2.0 - Added linting, gh-pages support, and general polish

1.1.0 - Added React and wiring for interactive content

1.0.0 - Initial prototype layout
