export default interface ProductWithPreference {
  id: number;
  name?: string;
  image?: string;
  price?: number;
  preference: boolean | null;
}
