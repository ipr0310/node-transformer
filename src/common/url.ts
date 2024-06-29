export const vehicleMakesUrl =
  'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML';

export const getVehicleTypePerMakeUrl = (makeId: string) =>
  `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${makeId}?format=xml`;
