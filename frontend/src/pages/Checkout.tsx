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
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  Payment,
  CheckCircle,
  CreditCard,
  AccountBalance,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import type { RootState } from '../store';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

const steps = ['Shipping Details', 'Payment Method', 'Review Order'];

const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading: orderLoading } = useSelector((state: RootState) => state.orders);
  
  const [activeStep, setActiveStep] = useState(0);
  const [orderCreated, setOrderCreated] = useState(false);
  
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Kenya',
    saveAddress: false,
  });
  
  const [paymentData, setPaymentData] = useState({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    mpesaPhone: '',
    agreeTerms: false,
  });

  // Initialize shipping data with user data if logged in
  useEffect(() => {
    if (user) {
      setShippingData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postal_code || '',
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderCreated) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderCreated]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: name === 'saveAddress' ? checked : value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: name === 'agreeTerms' ? checked : value,
    }));
  };

  const validateShipping = () => {
    return shippingData.firstName && shippingData.lastName && 
           shippingData.email && shippingData.phone && 
           shippingData.address && shippingData.city;
  };

  const validatePayment = () => {
    if (paymentData.method === 'card') {
      return paymentData.cardNumber && paymentData.expiryDate && 
             paymentData.cvv && paymentData.cardName && paymentData.agreeTerms;
    } else if (paymentData.method === 'mpesa') {
      return paymentData.mpesaPhone && paymentData.agreeTerms;
    }
    return paymentData.agreeTerms;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateShipping()) {
      alert('Please fill in all shipping details');
      return;
    }
    if (activeStep === 1 && !validatePayment()) {
      alert('Please complete payment details and agree to terms');
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 500;
    const tax = subtotal * 0.16; // 16% VAT
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please log in to place an order');
      navigate('/login');
      return;
    }

    const { total } = calculateTotals();
    
    const orderData = {
      user_id: user.id,
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
      })),
      total_amount: total,
      shipping_address: {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        address: shippingData.address,
        city: shippingData.city,
        postalCode: shippingData.postalCode,
        country: shippingData.country,
        phone: shippingData.phone,
      },
      payment_method: paymentData.method,
      status: 'pending',
    };

    try {
      await dispatch(createOrder(orderData) as any).unwrap();
      dispatch(clearCart() as any);
      setOrderCreated(true);
      setActiveStep(3); // Success step
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  const renderShippingForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Shipping Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={shippingData.firstName}
              onChange={handleShippingChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={shippingData.lastName}
              onChange={handleShippingChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={shippingData.email}
              onChange={handleShippingChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={shippingData.phone}
              onChange={handleShippingChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={shippingData.address}
              onChange={handleShippingChange}
              required
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={shippingData.city}
              onChange={handleShippingChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Postal Code"
              name="postalCode"
              value={shippingData.postalCode}
              onChange={handleShippingChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="saveAddress"
                  checked={shippingData.saveAddress}
                  onChange={handleShippingChange}
                />
              }
              label="Save this address for future orders"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderPaymentForm = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Payment Method
        </Typography>
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <RadioGroup
            name="method"
            value={paymentData.method}
            onChange={handlePaymentChange}
          >
            <FormControlLabel
              value="card"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <CreditCard />
                  Credit/Debit Card
                </Box>
              }
            />
            <FormControlLabel
              value="mpesa"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneIcon />
                  M-Pesa
                </Box>
              }
            />
            <FormControlLabel
              value="bank"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <AccountBalance />
                  Bank Transfer
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        {paymentData.method === 'card' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentChange}
                placeholder="1234 5678 9012 3456"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={handlePaymentChange}
                placeholder="MM/YY"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CVV"
                name="cvv"
                value={paymentData.cvv}
                onChange={handlePaymentChange}
                placeholder="123"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cardholder Name"
                name="cardName"
                value={paymentData.cardName}
                onChange={handlePaymentChange}
              />
            </Grid>
          </Grid>
        )}

        {paymentData.method === 'mpesa' && (
          <TextField
            fullWidth
            label="M-Pesa Phone Number"
            name="mpesaPhone"
            value={paymentData.mpesaPhone}
            onChange={handlePaymentChange}
            placeholder="+254 712 345 678"
            sx={{ mb: 2 }}
          />
        )}

        {paymentData.method === 'bank' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Bank transfer details will be provided after order confirmation.
          </Alert>
        )}

        <FormControlLabel
          control={
            <Checkbox
              name="agreeTerms"
              checked={paymentData.agreeTerms}
              onChange={handlePaymentChange}
            />
          }
          label="I agree to the terms and conditions"
          sx={{ mt: 2 }}
        />
      </CardContent>
    </Card>
  );

  const renderOrderReview = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Review Your Order
        </Typography>
        
        {/* Shipping Address */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Shipping Address
          </Typography>
          <Typography variant="body2">
            {shippingData.firstName} {shippingData.lastName}
          </Typography>
          <Typography variant="body2">
            {shippingData.address}
          </Typography>
          <Typography variant="body2">
            {shippingData.city}, {shippingData.postalCode}
          </Typography>
          <Typography variant="body2">
            {shippingData.phone}
          </Typography>
        </Paper>

        {/* Payment Method */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Payment Method
          </Typography>
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {paymentData.method === 'card' ? 'Credit/Debit Card' : 
             paymentData.method === 'mpesa' ? 'M-Pesa' : 'Bank Transfer'}
          </Typography>
        </Paper>

        {/* Order Items */}
        <Typography variant="subtitle1" gutterBottom>
          Order Items
        </Typography>
        <List>
          {cartItems.map((item) => (
            <ListItem key={`${item.id}-${item.size}-${item.color}`}>
              <ListItemAvatar>
                <Avatar
                  src={item.image_url || '/api/placeholder/50/50'}
                  alt={item.name}
                  variant="square"
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={
                  <Box>
                    {item.size && `Size: ${item.size} | `}
                    {item.color && `Color: ${item.color} | `}
                    Qty: {item.quantity}
                  </Box>
                }
              />
              <Typography variant="body1" fontWeight="bold">
                KSh {(item.price * item.quantity).toLocaleString()}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderSuccess = () => (
    <Card sx={{ textAlign: 'center', p: 4 }}>
      <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Order Placed Successfully!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Thank you for your order. You will receive an email confirmation shortly.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={() => navigate('/orders')}
      >
        View My Orders
      </Button>
    </Card>
  );

  if (cartItems.length === 0 && !orderCreated) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h6" textAlign="center">
          Your cart is empty. Please add items before checkout.
        </Typography>
        <Box textAlign="center" mt={2}>
          <Button variant="contained" onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom>
          Checkout
        </Typography>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {activeStep === 0 && renderShippingForm()}
            {activeStep === 1 && renderPaymentForm()}
            {activeStep === 2 && renderOrderReview()}
            {activeStep === 3 && renderSuccess()}

            {/* Navigation Buttons */}
            {activeStep < 3 && (
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={activeStep === 2 ? handlePlaceOrder : handleNext}
                  disabled={orderLoading}
                >
                  {activeStep === 2 ? 
                    (orderLoading ? 'Placing Order...' : 'Place Order') : 
                    'Next'
                  }
                </Button>
              </Box>
            )}
          </Grid>

          {/* Order Summary */}
          {activeStep < 3 && (
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Subtotal</Typography>
                  <Typography>KSh {subtotal.toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Shipping</Typography>
                  <Typography>
                    {shipping === 0 ? 'FREE' : `KSh ${shipping.toLocaleString()}`}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Tax (VAT 16%)</Typography>
                  <Typography>KSh {tax.toLocaleString()}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    KSh {total.toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;
