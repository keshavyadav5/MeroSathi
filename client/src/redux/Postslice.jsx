import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paperProductApi = createApi({
  reducerPath: "paperProductApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URI}/api`,
    credentials: 'include',
  }),
  tagTypes: ["PaperProduct"],
  endpoints: (builder) => ({
    getAllPaperProduct: builder.query({
      query: () => `/paper-product`,
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response?.error?.message || "An unknown error occurred",
      providesTags: ["PaperProduct"],
    }),
    uploadPaperProduct: builder.mutation({
      query: (body) => ({
        url: `/paper-product/upload`,
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) => response?.error?.message,
      invalidatesTags: ["PaperProduct"],
    }),
    deletePaperProduct: builder.mutation({
      query: (productId) => ({
        url: `paper-product/delete/${productId}`,
        method: 'DELETE',
      }),
      transformErrorResponse: (response) => response?.error?.message,
      invalidatesTags: ["PaperProduct"],
    }),
    updatePaperProduct: builder.mutation({
      query: ({ body, productId }) => ({
        url: `/paper-product/update/${productId}`,
        method: 'PATCH',
        body,
      }),
      transformErrorResponse: (response) => response?.error?.message,
      invalidatesTags: ["PaperProduct"],
    }),

    // other product slice
    getPaperProduct: builder.query({
      query: `/product`,
      transformResponse: (response) => response.data,
      transformErrorResponse: response => response?.error?.message || "An unknown error occured",
      providesTags: ['product']
    }),
    uploadProduct: builder.mutation({
      query: (body) => ({
        url: `/product/upload`,
        method: 'POST',
        body,
      }),
      transformErrorResponse: response => response?.error?.message,
      invalidatesTags: ["PaperProduct", 'product'],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/product/delete/${productId}`,
        method: 'DELETE',
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ body, productId }) => ({
        url: `/product/update/${productId}`,
        method: 'PATCH',
        body,
      }),
      transformErrorResponse: response => response?.error?.message,
      invalidatesTags: ['product', 'paperProduct']
    })
  }),
});

export const {
  useGetAllPaperProductQuery,
  useUploadPaperProductMutation,
  useDeletePaperProductMutation,
  useUpdatePaperProductMutation,
  useGetPaperProductQuery,
  useUploadProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = paperProductApi;
