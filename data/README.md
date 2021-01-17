# real-estate-layout-tool data
Listing found via: <https://www.redfin.com/CA/San-Francisco/1376-Natoma-St-94103/home/895861>

with public MLS photos via: <https://mlax.rapmls.com/Gallery.aspx?mls=SFAR&listingRid=375258> (found via MLS listing ID and <https://sfarmls.rapmls.com/>)

The photo URLs were found via via:

```js
console.log(JSON.stringify($$('.gallery-image-wrapper').map((el) => el.dataset.path), null, 2));
```

They were additionally downloaded/uploaded to Imgur via string manipulation in Sublime Text and `wget` (zero-padded names required)

> Correction: Order kept getting messed up, dragged images one by one x_x

<https://imgur.com/a/d6iPQ6F>

```js
console.log(JSON.stringify($$('.PostContent-imageWrapper-rounded').map((el) => el.querySelector('img').src), null, 2))
```
