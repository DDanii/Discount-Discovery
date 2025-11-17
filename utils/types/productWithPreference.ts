export default interface ProductWithPreference {
  id: number;
  name: string | null;
  image: string | null;
  price: number | null;
  preference: boolean | null;
  shop: {
    name: string;
    icon: string | null;
  }
  startDate: string;
  endDate: string;
  category: string | null;
}
