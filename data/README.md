# real-estate-layout-tool data
Listing found via: <https://www.redfin.com/CA/San-Francisco/1376-Natoma-St-94103/home/895861>

with public MLS photos via: <https://mlax.rapmls.com/Gallery.aspx?mls=SFAR&listingRid=375258> (found via MLS listing ID and <https://sfarmls.rapmls.com/>)

The photo URLs were found via via:

```js
console.log(JSON.stringify($$('.gallery-image-wrapper').map((el) => el.dataset.path), null, 2));
```

They were secondarily backed up via <https://archive.today/> where we extracted the final URLs with the same JS

<https://archive.vn/hsQHZ>
