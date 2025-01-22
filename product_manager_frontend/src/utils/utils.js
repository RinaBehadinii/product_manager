export const IS_NOT_SIMPLE_USER = ['Admin', 'Advanced User'];
export const USER_ROLES = ['Admin', 'Advanced User', "Simple User"];

export const INITIAL_EDITABLE_PRODUCT = {
    name: '',
    description: '',
    price: '',
    discount: '',
    quantity: '',
    category: '',
    brand: '',
    color: '',
    size: '',
    gender: '',
}

export const FILTERS_INITIAL_VALUES = {
    category: '',
    brand: '',
    gender: '',
    price_min: '',
    price_max: '',
    size: '',
    color: '',
}

export const FILTER_OPTIONS_INITIAL_VALUES = {
    categories: [],
    brands: [],
    genders: [],
    sizes: [],
    colors: [],
}

export const isSimpleUser = (role) => {
    return role === "Simple User";
}
export const isAdvancedUser = (role) => {
    return role === "Advanced User";
}

export const isAdmin = (role) => {
    return role === "Admin";
}