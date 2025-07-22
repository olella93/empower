import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Refresh,
  RateReview,
  Receipt,
  Print,
} from '@mui/icons-material';
import type { RootState } from '../store';
import { fetchUserOrders } from '../store/slices/orderSlice';

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: Array<{
    id: number;
    product_id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  payment_method: string;
  tracking_number?: string;
}

const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { userOrders, loading, error } = useSelector((state: RootState) => state.orders);
  
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    productId?: number;
    productName?: string;
  }>({
    open: false,
  });
  
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  // Mock orders data for demonstration (replace with actual API data)
  const mockOrders: Order[] = [
    {
      id: 1,
      order_number: 'EMP-2024-001',
      status: 'delivered',
      total_amount: 8500,
      created_at: '2024-01-15T10:30:00Z',
      tracking_number: 'TRK123456789',
      payment_method: 'card',
      shipping_address: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Kimathi Street',
        city: 'Nairobi',
        postalCode: '00100',
        country: 'Kenya',
        phone: '+254 712 345 678',
      },
      items: [
        {
          id: 1,
          product_id: 1,
          product_name: 'Classic Cotton T-Shirt',
          product_image: '/api/placeholder/100/100',
          quantity: 2,
          price: 2500,
          size: 'M',
          color: 'Black',
        },
        {
          id: 2,
          product_id: 2,
          product_name: 'Denim Jeans',
          product_image: '/api/placeholder/100/100',
          quantity: 1,
          price: 3500,
          size: '32',
          color: 'Blue',
        },
      ],
    },
    {
      id: 2,
      order_number: 'EMP-2024-002',
      status: 'shipped',
      total_amount: 12000,
      created_at: '2024-01-20T14:15:00Z',
      tracking_number: 'TRK987654321',
      payment_method: 'mpesa',
      shipping_address: {
        firstName: 'Jane',
        lastName: 'Smith',
        address: '456 Moi Avenue',
        city: 'Nairobi',
        postalCode: '00200',
        country: 'Kenya',
        phone: '+254 733 456 789',
      },
      items: [
        {
          id: 3,
          product_id: 3,
          product_name: 'Summer Dress',
          product_image: '/api/placeholder/100/100',
          quantity: 1,
          price: 4500,
          size: 'L',
          color: 'Red',
        },
        {
          id: 4,
          product_id: 4,
          product_name: 'Leather Handbag',
          product_image: '/api/placeholder/100/100',
          quantity: 1,
          price: 7500,
          color: 'Brown',
        },
      ],
    },
    {
      id: 3,
      order_number: 'EMP-2024-003',
      status: 'processing',
      total_amount: 5500,
      created_at: '2024-01-22T09:00:00Z',
      payment_method: 'card',
      shipping_address: {
        firstName: 'Michael',
        lastName: 'Johnson',
        address: '789 Tom Mboya Street',
        city: 'Nairobi',
        postalCode: '00300',
        country: 'Kenya',
        phone: '+254 701 234 567',
      },
      items: [
        {
          id: 5,
          product_id: 5,
          product_name: 'Sports Sneakers',
          product_image: '/api/placeholder/100/100',
          quantity: 1,
          price: 5500,
          size: '42',
          color: 'White',
        },
      ],
    },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(fetchUserOrders(user.id) as any);
  }, [dispatch, user, navigate]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'processing':
        return <Refresh />;
      case 'shipped':
        return <LocalShipping />;
      case 'delivered':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <ShoppingBag />;
    }
  };

  const handleReorder = (orderId: number) => {
    // Add order items back to cart
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
      // This would dispatch actions to add items to cart
      console.log('Reordering items from order:', orderId);
      navigate('/cart');
    }
  };

  const handleCancelOrder = (orderId: number) => {
    // Implement order cancellation logic
    console.log('Cancelling order:', orderId);
  };

  const handleReviewProduct = (productId: number, productName: string) => {
    setReviewDialog({
      open: true,
      productId,
      productName,
    });
  };

  const submitReview = () => {
    // Submit review logic
    console.log('Submitting review:', {
      productId: reviewDialog.productId,
      ...reviewData,
    });
    
    setReviewDialog({ open: false });
    setReviewData({ rating: 5, comment: '' });
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h6" textAlign="center">
          Please log in to view your orders.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h6" textAlign="center">
          Loading your orders...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading orders: {error}
        </Alert>
      </Container>
    );
  }

  // Use mock orders for now (replace with userOrders when API is ready)
  const orders = mockOrders;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Typography variant="h3" component="h1" gutterBottom>
          My Orders
        </Typography>
        
        {orders.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <ShoppingBag sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No orders yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You haven't placed any orders yet. Start shopping to see your order history here.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/shop')}
            >
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`order-${order.id}-content`}
                    id={`order-${order.id}-header`}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Typography variant="h6">
                          {order.order_number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.created_at).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          color={getStatusColor(order.status) as any}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="h6" color="primary">
                          KSh {order.total_amount.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {order.status === 'delivered' && (
                            <Button
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(order.id);
                              }}
                            >
                              Reorder
                            </Button>
                          )}
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <Button
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(order.id);
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  
                  <AccordionDetails>
                    <Grid container spacing={4}>
                      {/* Order Items */}
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                          Order Items
                        </Typography>
                        <List>
                          {order.items.map((item) => (
                            <ListItem key={item.id} sx={{ px: 0 }}>
                              <ListItemAvatar>
                                <Avatar
                                  src={item.product_image}
                                  alt={item.product_name}
                                  variant="square"
                                  sx={{ width: 80, height: 80 }}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={item.product_name}
                                secondary={
                                  <Box>
                                    {item.size && `Size: ${item.size} | `}
                                    {item.color && `Color: ${item.color} | `}
                                    Qty: {item.quantity} | 
                                    Price: KSh {item.price.toLocaleString()}
                                  </Box>
                                }
                                sx={{ mx: 2 }}
                              />
                              <Box textAlign="right">
                                <Typography variant="body1" fontWeight="bold">
                                  KSh {(item.price * item.quantity).toLocaleString()}
                                </Typography>
                                {order.status === 'delivered' && (
                                  <Button
                                    size="small"
                                    startIcon={<RateReview />}
                                    onClick={() => handleReviewProduct(item.product_id, item.product_name)}
                                    sx={{ mt: 1 }}
                                  >
                                    Review
                                  </Button>
                                )}
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                      </Grid>

                      {/* Order Details */}
                      <Grid item xs={12} md={4}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Order Details
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Order Date
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {new Date(order.created_at).toLocaleString()}
                          </Typography>

                          {order.tracking_number && (
                            <>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Tracking Number
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 2 }}>
                                {order.tracking_number}
                              </Typography>
                            </>
                          )}

                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Payment Method
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2, textTransform: 'capitalize' }}>
                            {order.payment_method === 'card' ? 'Credit/Debit Card' : 
                             order.payment_method === 'mpesa' ? 'M-Pesa' : 
                             order.payment_method}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Shipping Address
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {order.shipping_address.firstName} {order.shipping_address.lastName}<br />
                            {order.shipping_address.address}<br />
                            {order.shipping_address.city}, {order.shipping_address.postalCode}<br />
                            {order.shipping_address.country}<br />
                            {order.shipping_address.phone}
                          </Typography>

                          <Divider sx={{ my: 2 }} />

                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="h6" fontWeight="bold">
                              Total Amount
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              KSh {order.total_amount.toLocaleString()}
                            </Typography>
                          </Box>

                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<Receipt />}
                            sx={{ mt: 2 }}
                          >
                            Download Invoice
                          </Button>
                        </Paper>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Review Dialog */}
        <Dialog
          open={reviewDialog.open}
          onClose={() => setReviewDialog({ open: false })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Review Product: {reviewDialog.productName}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography component="legend" gutterBottom>
                Rating
              </Typography>
              <Rating
                name="product-rating"
                value={reviewData.rating}
                onChange={(event, newValue) => {
                  setReviewData(prev => ({ ...prev, rating: newValue || 5 }));
                }}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Write your review"
              value={reviewData.comment}
              onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your thoughts about this product..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewDialog({ open: false })}>
              Cancel
            </Button>
            <Button 
              onClick={submitReview}
              variant="contained"
              disabled={!reviewData.comment.trim()}
            >
              Submit Review
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Orders;
