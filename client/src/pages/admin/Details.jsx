import React from 'react';
import { useGetAllPaperProductQuery } from '@/redux/Postslice';

const Details = () => {
  const { data: paperProducts, isLoading, isError, refetch } = useGetAllPaperProductQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });



  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products.</div>;


  return (
    <div>
      <h2>Details</h2>
      {paperProducts && paperProducts.map((product, index) => (
        <div key={product._id + index}>
          <h3>{product.name}</h3>
          <p>Category: {product.category}</p>
          <p>Price: ${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Details;
