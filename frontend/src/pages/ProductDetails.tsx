import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert,
  IconButton,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Share,
  LocalShipping,
  Security,
  Refresh,
  Check,
  Star,
  Person,
} from '@mui/icons-material';
import type { RootState } from '../store';
import { fetchProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct: product, isLoading: loading, error } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  // Mock data for features not yet implemented
  const mockSizes = ['XS', 'S', 'M', 'L', 'XL'];
  const mockColors = ['Black', 'White', 'Gray', 'Navy'];
  const mockImages = [
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
  ];
  
  const mockReviews = [
    {
      id: 1,
      user: 'Sarah M.',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely love this! Great quality and perfect fit.',
      verified: true,
    },
    {
      id: 2,
      user: 'John D.',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good quality product, fast delivery.',
      verified: true,
    },
    {
      id: 3,
      user: 'Emily R.',
      rating: 5,
      date: '2024-01-05',
      comment: 'Exceeded my expectations! Will definitely buy again.',
      verified: false,
    },
  ];

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(parseInt(id)) as any);
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addToCart({
      productId: product.id,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    }) as any);
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h6" textAlign="center">
          Loading product details...
        </Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Product not found'}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/shop')}
        >
          Back to Shop
        </Button>
      </Container>
    );
  }

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;
  const inStock = product.stock_quantity > 0;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          <Button variant="text" onClick={() => navigate('/shop')} size="small">
            Shop
          </Button>
          {' > '}
          <Button variant="text" size="small" sx={{ textTransform: 'capitalize' }}>
            {product.category}
          </Button>
          {' > '} {product.name}
        </Typography>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="500"
                image={mockImages[selectedImage]}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
            
            {/* Thumbnail Images */}
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {mockImages.map((image, index) => (
                <Grid item xs={3} key={index}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid' : '1px solid',
                      borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <CardMedia
                      component="img"
                      height="100"
                      image={image}
                      alt={`${product.name} ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {product.name}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Rating value={averageRating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({mockReviews.length} reviews)
                </Typography>
              </Box>

              <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                KSh {product.price.toLocaleString()}
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                {product.description}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Chip
                  label={product.category}
                  sx={{ textTransform: 'capitalize', mr: 1 }}
                />
                <Chip
                  label={inStock ? 'In Stock' : 'Out of Stock'}
                  color={inStock ? 'success' : 'error'}
                />
              </Box>

              {/* Product Options */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Size</InputLabel>
                    <Select
                      value={selectedSize}
                      label="Size"
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      {mockSizes.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={selectedColor}
                      label="Color"
                      onChange={(e) => setSelectedColor(e.target.value)}
                    >
                      {mockColors.map((color) => (
                        <MenuItem key={color} value={color}>
                          {color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Quantity */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Quantity:
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, max: product.stock_quantity }}
                  sx={{ width: 100 }}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {product.stock_quantity} items available
                </Typography>
              </Box>

              {addedToCart && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Product added to cart successfully!
                </Alert>
              )}

              {/* Action Buttons */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={!inStock}
                  >
                    Add to Cart
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={handleBuyNow}
                    disabled={!inStock}
                  >
                    Buy Now
                  </Button>
                </Grid>
              </Grid>

              {/* Secondary Actions */}
              <Box display="flex" gap={1} sx={{ mb: 3 }}>
                <IconButton color="error">
                  <Favorite />
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
              </Box>

              {/* Product Features */}
              <Paper variant="outlined" sx={{ p: 2 }}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <LocalShipping color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Free Delivery"
                      secondary="On orders over KSh 5,000"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Refresh color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="30-Day Returns"
                      secondary="Easy return policy"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Secure Payment"
                      secondary="Your payment information is safe"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Box sx={{ mt: 6 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="product details tabs"
          >
            <Tab label="Description" />
            <Tab label="Reviews" />
            <Tab label="Shipping & Returns" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Product Description
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body1" paragraph>
              This high-quality fashion item is crafted with attention to detail and 
              designed to provide both style and comfort. Made from premium materials, 
              it's perfect for both casual and formal occasions.
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Features:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Check color="primary" />
                </ListItemIcon>
                <ListItemText primary="Premium quality materials" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Check color="primary" />
                </ListItemIcon>
                <ListItemText primary="Comfortable fit" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Check color="primary" />
                </ListItemIcon>
                <ListItemText primary="Easy care instructions" />
              </ListItem>
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Customer Reviews
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="h6">
                {averageRating.toFixed(1)} out of 5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({mockReviews.length} reviews)
              </Typography>
            </Box>

            {mockReviews.map((review) => (
              <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {review.user[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">
                      {review.user}
                      {review.verified && (
                        <Chip
                          label="Verified Purchase"
                          size="small"
                          color="success"
                          sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating value={review.rating} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2">
                  {review.comment}
                </Typography>
              </Paper>
            ))}

            {user && (
              <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Write a Review
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Review functionality coming soon!
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Typography variant="body1" paragraph>
              We offer fast and reliable shipping options to get your order to you as quickly as possible.
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Standard Delivery (2-3 days)"
                  secondary="KSh 500 - Free for orders over KSh 5,000"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Express Delivery (1-2 days)"
                  secondary="KSh 1,000"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Same Day Delivery (Nairobi only)"
                  secondary="KSh 1,500"
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Returns & Exchanges
            </Typography>
            <Typography variant="body1" paragraph>
              We want you to be completely satisfied with your purchase. If you're not happy,
              you can return or exchange your item within 30 days of purchase.
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Items must be in original condition with tags attached" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Original receipt or order confirmation required" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Refunds processed within 5-7 business days" />
              </ListItem>
            </List>
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails;
