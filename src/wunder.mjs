import { Util } from "./util.mjs";

export async function WunderFetch(secrets, startDate, endDate) {

  //Get secrets for querying
  const MAX_PRICE = parseInt(secrets.MAX_PRICE);
  const POI_LAT = parseFloat(secrets.POI_LAT);
  const POI_LON = parseFloat(secrets.POI_LON);

  //Note bounding box is defined here
  const url = new URL(`https://wunderflats.com/api/regions/${secrets.BOUNDING_BOX}/query`);
    
  //Build search params and append to url
  const searchParams = {
    availableFrom: startDate,
    availableTo: endDate,
    itemsPerPage: 30,
    minPrice: 0,
    maxPrice: MAX_PRICE * 100
  };
  for(const [key, value] of Object.entries(searchParams)){

    url.searchParams.append(key, value);
  }

  //Fetch and return JSON promise
  const request = new Request(url, { method: 'GET' });
  const response = await fetch(request, {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });

  const { items } = await response.json();

  //Remap
  return items.map((item) => {

    const id = item.partOfGroup ? item.groupId : item._id;
    const name = item.title.en;
    const coord = item.address.location.coordinates;
    
    return {
      id,
      name,
      price: `${item.price/100}`,
      image: item.coverImage ? item.coverImage.urls.thumbnail : undefined,
      coord,
      hsDistance: Util.asTheCrowFlies(POI_LAT, POI_LON, coord[1], coord[0]),
      url: item.partOfGroup ? 
        `https://wunderflats.com/en/furnished-apartment/g/${Util.slugify(name)}/${id}` : 
        `https://wunderflats.com/en/furnished-apartment/${Util.slugify(name)}/${id}`
    };
  });
}

