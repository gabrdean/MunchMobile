import OrderRestaurant from "../OrderRestaurant";
import CartItems from "../../Cart/CartItems";

export default function Order({items}) {
  return (
    <div>
			<OrderRestaurant restaurantId={items[0].restaurantId} />
      <CartItems items={items} />
		</div>
  );
}