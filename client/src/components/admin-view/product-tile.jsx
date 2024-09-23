import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  markInStock, // Function to mark product as in stock
  markOutOfStock, // Function to mark product as out of stock
}) {
  const handleDeleteClick = (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
      handleDelete(productId);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[200px] object-contain rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-lg font-bold mb-1 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-md font-semibold text-primary">
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-md font-semibold text-red-600">Out Of Stock</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          {product?.salePrice > 0 ? (
            <>
              <Button
                onClick={() => {
                  setOpenCreateProductsDialog(true);
                  setCurrentEditedId(product?._id);
                  setFormData(product);
                }}
                size="sm" // Smaller button size
              >
                Edit
              </Button>
              <Button
                onClick={() => markInStock(product?._id)} // Call markInStock function
                size="sm" // Smaller button size
              >
                Mark In Stock
              </Button>
            </>
          ) : (
            <>
            <div className="flex flex-col w-full gap-2 ">
              <div className="flex justify-between">
              <Button
                onClick={() => {
                  setOpenCreateProductsDialog(true);
                  setCurrentEditedId(product?._id);
                  setFormData(product);
                }}
                size="sm" // Smaller button size
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteClick(product?._id)} // Call delete with confirmation
                size="sm" // Smaller button size
              >
                Delete
              </Button>
              </div>
              <Button
                onClick={() => markOutOfStock(product?._id)} // Call markOutOfStock function
                size="sm" // Very small button size
                className=" bg-red-500" // Optional styling for visibility
              >
                Mark Out of Stock
              </Button>
              </div>
             
            </>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
