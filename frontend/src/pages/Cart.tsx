import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Divider,
  Paper,
  TextField,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCartOutlined as EmptyCartIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import type { RootState } from '../store';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, loading, error } = useSelector((state: RootState) => state.cart);

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }) as any);
    } else {
      dispatch(removeFromCart(productId) as any);
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId) as any);
  };

  const handleClearCart = () => {
    dispatch(clearCart() as any);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 5000 ? 0 : 500; // Free delivery over KSh 5,000
  const totalAmount = subtotal + deliveryFee;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h6" textAlign="center">
          Loading cart...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading cart: {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center">
          <EmptyCartIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h4" gutterBottom color="text.secondary">
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/shop"
            sx={{ minWidth: 200 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Shopping Cart
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Items</Typography>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleClearCart}
                  disabled={items.length === 0}
                >
                  Clear Cart
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {items.map((item) => (
                <Card key={item.id} sx={{ mb: 2, p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    {/* Product Image */}
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={item.image_url || '/api/placeholder/120/120'}
                        alt={item.name}
                        sx={{ borderRadius: 1, objectFit: 'cover' }}
                      />
                    </Grid>

                    {/* Product Details */}
                    <Grid item xs={12} sm={6}>
                      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                        <Typography variant="h6" gutterBottom>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.description}
                        </Typography>
                        <Box display="flex" gap={1} mb={1}>
                          <Chip label={item.category} size="small" variant="outlined" />
                          {item.size && <Chip label={`Size: ${item.size}`} size="small" />}
                          {item.color && <Chip label={`Color: ${item.color}`} size="small" />}
                        </Box>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          KSh {item.price.toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Grid>

                    {/* Quantity Controls */}
                    <Grid item xs={12} sm={3}>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              handleUpdateQuantity(item.id, newQuantity);
                            }}
                            sx={{ width: 60 }}
                            inputProps={{ min: 1, style: { textAlign: 'center' } }}
                            type="number"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock_quantity}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        
                        <Typography variant="body2" fontWeight="bold">
                          Subtotal: KSh {(item.price * item.quantity).toLocaleString()}
                        </Typography>

                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Subtotal */}
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Subtotal ({items.length} items)</Typography>
                <Typography>KSh {subtotal.toLocaleString()}</Typography>
              </Box>

              {/* Delivery */}
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Delivery</Typography>
                <Typography>
                  {deliveryFee === 0 ? (
                    <Chip label="FREE" color="success" size="small" />
                  ) : (
                    `KSh ${deliveryFee.toLocaleString()}`
                  )}
                </Typography>
              </Box>

              {subtotal < 5000 && (
                <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
                  Add KSh {(5000 - subtotal).toLocaleString()} more for free delivery!
                </Alert>
              )}

              <Divider sx={{ mb: 2 }} />

              {/* Total */}
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  KSh {totalAmount.toLocaleString()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleProceedToCheckout}
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to="/shop"
              >
                Continue Shopping
              </Button>

              {/* Security & Shipping Info */}
              <Box mt={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Why shop with us?
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <SecurityIcon color="primary" fontSize="small" />
                  <Typography variant="caption">
                    Secure checkout & payment
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <ShippingIcon color="primary" fontSize="small" />
                  <Typography variant="caption">
                    Fast & reliable delivery
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <RefreshIcon color="primary" fontSize="small" />
                  <Typography variant="caption">
                    30-day return policy
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Cart;
