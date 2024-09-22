import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap } from "@/config"; // removed categoryOptionsMap since it's not used
import { Badge } from "../ui/badge";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  cartItems = { items: [] }, // Default cartItems to an empty object with items array to prevent errors
  handleUpdateQuantity
}) {
  // Safely check cartItems and find if the product is already in the cart
  const cartItem = cartItems?.items?.find(
    (item) => item.productId === product._id
  );
  const productQuantity = cartItem ? cartItem.quantity : 0; // Get product quantity or default to 0

  const [inputValue, setInputValue] = useState(productQuantity); // Initialize quantity state

  const handleIncrement = () => {
    const newQuantity = inputValue + 1;
    setInputValue(newQuantity);
    handleUpdateQuantity(product._id, newQuantity); // Update quantity after incrementing
  };

  const handleDecrement = () => {
    const newQuantity = inputValue > 1 ? inputValue - 1 : 0; // Prevent going below 0
    setInputValue(newQuantity);
    if (newQuantity === 0) {
      handleUpdateQuantity(product._id, 0); // Optionally remove from cart if quantity is 0
    } else {
      handleUpdateQuantity(product._id, newQuantity);
    }
  };

  const handleAddToCartClick = () => {
    handleAddtoCart(product._id, product.totalStock); // Add to cart
    setInputValue(1); // Set initial quantity to 1 when added to cart
  };

   const handleInputChange = (e) => {
    const value = e.target.value; // Get the raw input value
    if (value === '' || /^[0-9]*$/.test(value)) { // Allow empty or numeric input
      setInputValue(value ? parseInt(value, 10) : ''); // Convert to number or reset to empty
    }
  };

  const handleBlur = () => {
    if (inputValue > 0) {
      handleUpdateQuantity(product._id, inputValue);
    } else {
      setInputValue(productQuantity);
    }
  };

  return (
    <Card className="w-full max-w-[280px] mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[200px] object-contain rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Coming Soon
            </Badge>
          ) : null}
        </div>
        <CardContent className="px-3 py-2">
          <h2 className="text-lg font-semibold mb-1 truncate">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="text-md font-medium text-primary">
                ₹{product?.price}
              </span>
            </span>
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : productQuantity > 0 ? (
          <div className="flex items-center gap-2 mt-1">
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full"
              size="icon"
              onClick={handleDecrement}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange} // Handle input change
              onBlur={handleBlur} // Handle when input loses focus
              className="w-1/3 text-center border"
            />
            <Button
              variant="outline"
              className="h-8 w-8 rounded-full"
              size="icon"
              onClick={handleIncrement}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={handleAddToCartClick} className="w-full">
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
