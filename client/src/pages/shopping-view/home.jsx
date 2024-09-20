import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";

const categoriesWithIcon = [
  { id: "Drinks", label: "Drinks", icon: ShirtIcon },
  { id: "Candy", label: "Candy", icon: CloudLightning },
  { id: "Chips", label: "Chips", icon: BabyIcon },
  { id: "Choclates", label: "Choclates", icon: WatchIcon },
  { id: "Namkeen", label: "Namkeen", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "Shadani", label: "Shadani", icon: Shirt },
  { id: "Zubi", label: "Zubi", icon: WashingMachine },
  { id: "Vpure", label: "Vpure", icon: ShoppingBasket },
  { id: "Chocozay", label: "Chocozay", icon: Airplay },
  { id: "SunBeam", label: "SunBeam", icon: Images },
  { id: "Skippi", label: "Skippi", icon: Heater },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock, newQuantity) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleUpdateQuantity(productId, typeOfAction) {
    let getCartItems = cartItems.items || [];
    
    // Find the product in the cart
    const cartItem = getCartItems.find((item) => item.productId === productId);
  
    if (!cartItem) {
      toast({
        title: "Product not found in the cart",
        variant: "destructive",
      });
      return;
    }
  
    // Find the product details from the product list
    const product = productList.find((item) => item._id === productId);
    if (!product) {
      toast({
        title: "Product details not found",
        variant: "destructive",
      });
      return;
    }
  
    const getTotalStock = product.totalStock;
    const currentQuantity = cartItem.quantity;
    let newQuantity = typeOfAction === "plus" ? currentQuantity + 1 : currentQuantity - 1;
  
    // Validate the new quantity based on stock and ensure it does not go below 1
    if (newQuantity > getTotalStock) {
      toast({
        title: `Only ${getTotalStock} items are available in stock`,
        variant: "destructive",
      });
      return;
    }
  
    if (newQuantity < 1) {
      // Delete the item from the cart if quantity is less than 1
      dispatch(
        deleteCartItem({ userId: user?.id, productId: productId })
      ).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Cart item deleted successfully",
          });
          dispatch(fetchCartItems(user?.id));  // Fetch updated cart items
        } else {
          toast({
            title: "Failed to delete cart item",
            variant: "destructive",
          });
        }
      });
      return;
    }
  
    // Dispatch the updated quantity to the cart
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: productId,
        quantity: newQuantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item updated successfully",
        });
        dispatch(fetchCartItems(user?.id));  // Fetch updated cart items
      } else {
        toast({
          title: "Failed to update cart item",
          variant: "destructive",
        });
      }
    });
  }
  

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    
    <div className="flex flex-col min-h-screen p-3">
     <div className="relative w-full h-[190px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden ">
  {featureImageList && featureImageList.length > 0
    ? featureImageList.map((slide, index) => (
        <img
          src={slide?.image}
          key={index}
          className={`${
            index === currentSlide ? "opacity-100" : "opacity-0"
          } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 rounded-lg`}
        />
      ))
    : null}

  {/* Dots at the bottom */}
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
    {featureImageList.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-2 h-   rounded-full ${
          index === currentSlide ? "bg-blue-500" : "bg-gray-300"
        }`}
      />
    ))}
  </div>
</div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                  product={productItem}
                  handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
                    cartItems={cartItems}
                    handleUpdateQuantity={handleUpdateQuantity}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
