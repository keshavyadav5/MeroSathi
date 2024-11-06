import { paperProductApi } from "./Postslice";

export const adminApi = paperProductApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: ({ page, search }) => `admin/getAllProducts?page=${page}&limit=10&search=${search}`,
      transformResponse: (response) => response.data,
      providesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllProductsQuery,
} = adminApi;
