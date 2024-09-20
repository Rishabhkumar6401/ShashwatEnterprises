import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  cartItems,
  handleUpdateQuantity
}) {
  
  const cartItem = cartItems.items.find(
    (item) => item.productId === product._id
  );
  const productQuantity = cartItem ? cartItem.quantity : 0;
  const [inputValue, setInputValue] = useState(productQuantity); // Assuming product.quantity holds the current quantity

  const handleIncrement = () => {
    const incValue = setInputValue(productQuantity+1)

    handleUpdateQuantity(product._id, productQuantity+1); // Call handleUpdate after incrementing
  };

  const handleDecrement = () => {
    const decValue = setInputValue(productQuantity-1)
 
      handleUpdateQuantity(product._id, productQuantity-1); // Decrement by 1
   
     // Call handleUpdate after decrementing
  };


  const handleAddToCartClick = () => {
    handleAddtoCart(product._id, product.totalStock);
   
  };
 const handleInputChange = (e) => {
    // Only set the local state for input value
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    // Update productQuantity when the input field loses focus
    const numericValue = parseInt(inputValue, 10);
    if (!isNaN(numericValue) && numericValue >= 0) {
      handleUpdateQuantity(product._id, numericValue); // Update quantity in the cart
    } else {
      setInputValue(productQuantity); // Reset to original quantity if input is invalid
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
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="px-3 py-2">
          <h2 className="text-lg font-semibold mb-1 truncate">{product?.title}</h2>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">
            {brandOptionsMap[product?.brand]}
            </span>
            <span className="text-sm text-muted-foreground">
            <span className="text-md font-medium text-primary">
            ₹{product?.salePrice}
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
            size="icon" onClick={handleDecrement} >
              <Minus className="w-4 h-4" />
            </Button>
            <input
               type="text"
               value={inputValue}
               onChange={handleInputChange} // Handle input change
               onBlur={handleBlur} // Handle when input loses focustype="text"
              
              
              className="w-1/3 text-center border"
            />
            <Button variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"onClick={handleIncrement} >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAddToCartClick}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}


export default ShoppingProductTile;
