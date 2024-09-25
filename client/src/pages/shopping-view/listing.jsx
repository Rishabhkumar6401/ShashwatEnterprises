import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { resetProducts, setCurrentPage,resetPaginations } from "@/store/shop/products-slice";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, currentPage, hasMore, isLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-hightolow");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  // function handleSort(value) {
  //   setSort(value);
  // }
  const clearFilters = () => {
    setFilters({}); // Reset filters to their initial state
  };

  function handleFilter(getSectionId, getCurrentOption) {
    setShowFilters(false)
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters[getSectionId] = [getCurrentOption];
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
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

  function handleUpdateQuantity(productId, value) {
    let getCartItems = cartItems.items || [];
    const cartItem = getCartItems.find((item) => item.productId === productId);

    if (!cartItem) {
      toast({
        title: "Product not found in the cart",
        variant: "destructive",
      });
      return;
    }

    const product = productList.find((item) => item._id === productId);
    if (!product) {
      toast({
        title: "Product details not found",
        variant: "destructive",
      });
      return;
    }

    const getTotalStock = product.totalStock;
    let newQuantity = value;

    if (newQuantity > getTotalStock) {
      toast({
        title: `Only ${getTotalStock} items are available in stock`,
        variant: "destructive",
      });
      return;
    }

    if (newQuantity < 1) {
      dispatch(deleteCartItem({ userId: user?.id, productId })).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Cart item deleted successfully",
          });
          dispatch(fetchCartItems(user?.id));
        } else {
          toast({
            title: "Failed to delete cart item",
            variant: "destructive",
          });
        }
      });
      return;
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId,
        quantity: newQuantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item updated successfully",
        });
        dispatch(fetchCartItems(user?.id));
      } else {
        toast({
          title: "Failed to update cart item",
          variant: "destructive",
        });
      }
    });
  }

   // Function to fetch products, only if not loading and has more products
   const fetchProducts = () => {
    if (!isLoading && hasMore) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
          page: currentPage,
        })
      );
    }
  };
  useEffect(() => {
    // setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);
  // Fetch products when filters or sorting changes
  useEffect(() => {
    dispatch(resetProducts()); // Reset products when the filters or sorting change
    // dispatch(resetPaginations())
    fetchProducts();
  }, [filters, sort]);

 

  // Handle sort change
  const handleSort = (newSort) => {
    setSort(newSort); // Update sort state, which will trigger useEffect to fetch products
  };

    useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      dispatch(resetPaginations())
      setSearchParams(new URLSearchParams(createQueryString));

    }
  }, [filters]);

  // Handle infinite scroll for fetching more products
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight &&
      hasMore &&
      !isLoading
    ) {
      dispatch(setCurrentPage(currentPage + 1))
      fetchProducts(); // Fetch more products if at the bottom of the page and if there are more
    }
  };

  // Attach scroll event listener for infinite scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Clean up on component unmount
  }, [hasMore, isLoading]);

  

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6 mt-16">
    {/* Toggle button for filters, visible only on mobile and tablet */}
    <button 
      className="p-2 bg-gray-200 rounded-md mb-4 md:hidden" // Hide on md and larger
      onClick={() => setShowFilters(prev => !prev)} // Toggle filter visibility
    >
      {showFilters ? "Hide Filters" : "Show Filters"}
    </button>

    {/* Filter component, shown only on mobile and tablet */}
    <div className={`transition-all duration-300 ease-in-out ${showFilters ? "block" : "hidden"} md:block`}>
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      {/* Clear Filters button, shown after filters */}
      <button 
        className="mt-2 p-2 bg-red-500 text-white rounded-md"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>

      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{productList?.length} results</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Sort <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={handleSort}
                >
                  {sortOptions.map((option, index) => (
                    <DropdownMenuRadioItem key={index} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
          {productList?.length > 0 ? (
            productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                product={productItem}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
                cartItems={cartItems}
                handleUpdateQuantity={handleUpdateQuantity}
              />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        product={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
