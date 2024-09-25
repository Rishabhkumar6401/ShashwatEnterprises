const validatePhoneNumber = (phoneNo) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phoneNo);
};
export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "userAddress",
    label: "User Address",
    placeholder: "Enter Address",
    componentType: "input",
    type: "text",
  },

  {
    name: "phoneNo",
    label: "Phone no",
    placeholder: "Enter Phone Number",
    componentType: "input",
    type: "Number",
    pattern:"[0-9]{10}"
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "phoneNo",
    label: "phone no",
    placeholder: "Enter Phone Number",
    componentType: "input",
    type: "Number",
    pattern:"[0-9]{10}"
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "Drinks", label: "Drinks" },
      { id: "Candy", label: "Candy" },
      { id: "Chips", label: "Chips" },
      { id: "Choclates", label: "Choclates" },
      { id: "Namkeen", label: "Namkeen" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "Shadani", label: "Shadani" },
      { id: "SunBeam", label: "SunBeam" },
      { id: "Zubi", label: "Zubi" },
      { id: "Skippi", label: "Skippi" },
      { id: "Vpure", label: "Vpure" },
      { id: "Chocozay", label: "Chozozay" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  // {
  //   label: "Sale Price",
  //   name: "salePrice",
  //   componentType: "input",
  //   type: "number",
  //   placeholder: "Enter sale price (optional)",
  // },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  Drinks: "Drinks",
  Candy: "Candy",
  Chips: "Chips",
  Choclates: "Choclates",
  Namkeen: "Namkeen",
};

export const brandOptionsMap = {
  Shadani: "Shadani",
  SunBeam: "SunBeam",
  Zubi: "Zubi",
  levi: "Skippi",
  Vpure: "Vpure",
  Chocozay: "Chocozay",
};

export const filterOptions = {
  category: [
    { id: "Drinks", label: "Drinks" },
    { id: "Chips", label: "Chips" },
    { id: "Candy", label: "Kids" },
    { id: "Choclates", label: "Choclates" },
    { id: "Namkeen", label: "Namkeen" },
  ],
  brand: [
    { id: "Shadani", label: "Shadani" },
    { id: "SunBeam", label: "SunBeam" },
    { id: "Zubi", label: "Zubi" },
    { id: "Skippi", label: "Skippi" },
    { id: "Vpure", label: "Vpure" },
    { id: "Chocozay", label: "Chocozay" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
