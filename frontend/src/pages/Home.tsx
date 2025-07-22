import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowForward,
  ShoppingBag,
  LocalShipping,
  Security,
  Support,
  Star,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'Elegant Evening Dress',
      price: 12999,
      image: 'https://images.unsplash.com/photo-1566479179817-c7b8ddc8f4c9?w=400&h=500&fit=crop',
      category: 'Dresses'
    },
    {
      id: 2,
      name: 'Classic Blazer',
      price: 8999,
      image: 'https://images.unsplash.com/photo-1617149364376-b3d21ba48092?w=400&h=500&fit=crop',
      category: 'Outerwear'
    },
    {
      id: 3,
      name: 'Designer Handbag',
      price: 15999,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop',
      category: 'Accessories'
    },
    {
      id: 4,
      name: 'Casual Jeans',
      price: 6999,
      image: 'https://images.unsplash.com/photo-1582554991973-f2b5b25e0d6e?w=400&h=500&fit=crop',
      category: 'Bottoms'
    },
  ];

  const categories = [
    {
      name: 'Dresses',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop',
      path: '/shop/dresses'
    },
    {
      name: 'Tops',
      image: 'https://images.unsplash.com/photo-1564449232985-37d7b1e62e16?w=300&h=400&fit=crop',
      path: '/shop/tops'
    },
    {
      name: 'Bottoms',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop',
      path: '/shop/bottoms'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop',
      path: '/shop/accessories'
    },
  ];

  const features = [
    {
      icon: <LocalShipping />,
      title: 'Free Delivery',
      description: 'Free shipping within Nairobi for orders over KSh 5,000'
    },
    {
      icon: <Security />,
      title: 'Secure Payment',
      description: 'Your payment information is safe and secure'
    },
    {
      icon: <Support />,
      title: '24/7 Support',
      description: 'Get help whenever you need it'
    },
    {
      icon: <ShoppingBag />,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy'
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(45deg, rgba(44, 62, 80, 0.8), rgba(231, 76, 60, 0.8)), url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            EMPOWER YOUR STYLE
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            gutterBottom
            sx={{ mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}
          >
            Discover premium fashion collections at Kenya's premier destination. 
            Located at Marsabit Plaza, Ngong Road, Nairobi.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              size="large"
              color="secondary"
              endIcon={<ArrowForward />}
              sx={{ px: 4, py: 1.5 }}
            >
              Shop Now
            </Button>
            <Button
              component={Link}
              to="/about"
              variant="outlined"
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'secondary.light', backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'grey.50' },
                  transition: 'background-color 0.3s',
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    mb: 2,
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                >
                  {feature.icon}
                </IconButton>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 6 }}
          >
            Shop by Category
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  component={Link}
                  to={category.path}
                  sx={{
                    textDecoration: 'none',
                    height: 300,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover .category-overlay': {
                      backgroundColor: 'rgba(44, 62, 80, 0.8)',
                    },
                    '&:hover .category-image': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={category.image}
                    alt={category.name}
                    className="category-image"
                    sx={{
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />
                  <Box
                    className="category-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(44, 62, 80, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <Typography
                      variant="h5"
                      color="white"
                      fontWeight="bold"
                      textAlign="center"
                    >
                      {category.name}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            fontWeight="bold"
          >
            Featured Products
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover our handpicked collection of trending fashion items
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
                  transition: 'all 0.3s',
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {product.category}
                  </Typography>
                  <Typography variant="h6" gutterBottom fontWeight="600">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="secondary.main" fontWeight="bold">
                    KSh {product.price.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} sx={{ fontSize: 16, color: '#FFD700' }} />
                    ))}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      (4.8)
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={`/product/${product.id}`}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            component={Link}
            to="/shop"
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
          >
            View All Products
          </Button>
        </Box>
      </Container>

      {/* Newsletter Section */}
      <Paper
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Stay in Style
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Subscribe to our newsletter and be the first to know about new arrivals, 
            exclusive offers, and fashion tips.
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              gap: 2,
              maxWidth: 400,
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ px: 4 }}
            >
              Subscribe
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home;
