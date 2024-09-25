import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  currentPage: 1,
  hasMore: true, // Determines whether more products can be loaded
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams, page }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
      page, // Add page parameter
    });

    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${query}`
    );

    return result?.data;
  }
);

// Fetch the latest 12 products sorted by creation date
export const fetchLatestProducts = createAsyncThunk(
  "/products/fetchLatestProducts",
  async () => {
    // Fetch latest products and limit the result to 12
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?limit=12&sortBy=createdAt:desc`
    );

    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);



const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    resetProducts: (state) => {
      state.productList = [];
      // state.currentPage = 1;
      state.hasMore = true;
    },
    resetPaginations: (state) => {
      state.currentPage = 1;
      state.hasMore = true;

    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Set current page from payload
    },
    
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchLatestProducts.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchLatestProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.productList = action.payload.data; // Store the latest 12 products
    })
    .addCase(fetchLatestProducts.rejected, (state) => {
      state.isLoading = false;
      state.productList = [];
    })
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        const products = action.payload.data;

        // If no more products are returned, stop further requests
        if (products.length > 0) {
          state.productList = [...state.productList, ...products];
          // state.currentPage += 1; // Increment current page
        } else {
          state.hasMore = false; // No more products to load
        }
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails, resetProducts, resetPaginations,  setCurrentPage } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
