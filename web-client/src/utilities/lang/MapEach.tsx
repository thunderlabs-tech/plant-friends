/**
 * Defines a dictionary object with one of each keys defined by `Keys` and whose values are of type `Value`.
 *
 * Causes a compile error if a key in `Keys` is not present in the object, or if the object posesses any keys not
 * present in `Keys`.
 *
 * E.g.
 *
 * ```
 * type VehicleType = "car" | "train" | "plane";
 *
 * // No errors
 * const vehicleToVerb: MapEach<VehicleType, string> = {
 *   car: 'drive',
 *   train: 'ride',
 *   plane: 'fly',
 * };
 *
 * const vehicleToVerb2: MapEach<VehicleType, string> = {
 *   //  ^^^^^^^^^^^^^^
 *   // Property 'plane' is missing in type '{ car: string; train: string; }' but required in type 'MapEach<VehicleType, string>'
 *   car: 'drive',
 *   train: 'ride',
 * };
 *
 *
 * const vehicleToVerb3: MapEach<VehicleType, string> = {
 *   car: "drive",
 *   train: "ride",
 *   plane: "ride",
 *   bus: "ride",
 *   // ^^^^^^^^^
 *   // Object literal may only specify known properties, and 'bus' does not exist in type 'MapEach<VehicleType, string>'.
 * };
 * ```
 */
export type MapEach<Keys extends symbol | string | number, Value> = {
  [key in Keys]: Value;
};
