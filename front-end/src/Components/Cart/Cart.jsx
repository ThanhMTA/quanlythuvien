import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import Breadcrumb from '../Breadcrumb/Breadcrumb';

const CartPage = () => {
  // Dữ liệu giỏ hàng
  const cartItems = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 15 },
    { id: 3, name: 'Product 3', price: 20 },
  ];

  return (
    <div className="books-page">
        <Breadcrumb />
      <Typography variant="h4" gutterBottom>
        Giỏ hàng
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="body1">Giỏ hàng trống</Typography>
      ) : (
        <Grid container spacing={2}>
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body1">Giá: {item.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default CartPage;
