import { paperProductApi } from "./Postslice";

export const adminApi = paperProductApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: ({ page, search }) => `admin/getAllProducts?page=${page}&limit=10&search=${search}`,
      transformResponse: (response) => response.data,
      providesTags: ["Products"],
    }),
    getAllCart: builder.query({
      query: () => `/user/getAll-cart-items`,
      transformResponse: (response) => ({
        data: response.data,
        success: response.success,
        message: response.message,
        totalItems: response.totalItems,
      }),
      providesTags: ["Cart"],
    }),
    addPaperProductCart: builder.mutation({
      query: (data) => ({
        url: `/user/getAll-cart-items`,
        method: 'POST',
        body: data,
        transformResponse : (response) => response.message
      }),
      invalidatesTags: ["Cart"],
    }),
    updatePaperProductCart: builder.mutation({
      query: (body) => ({
        url: '/user/add-cart-paperproduct',
        method: "PATCH",
        body,
        transformResponse : (response ) => response.message
      }),
      invalidatesTags: ['Cart']
    }),
    deletePaperProductCart: builder.mutation({
      query: () => ({
        url: '',
        method: 'DELETE',
        transformResponse: (response) = response.message
      })
    })
  }),
  overrideExisting: false,
});

export const {
  useGetAllProductsQuery,
  useGetAllCartQuery,
  useAddPaperProductCartMutation,
  useUpdatePaperProductCartMutation,
  useDeletePaperProductCartMutation
} = adminApi;
