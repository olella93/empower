import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  ShoppingCart as CartIcon,
  FavoriteBorder as FavoriteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import type { RootState } from '../store';
import { fetchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const Shop: React.FC = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector((state: RootState) => state.products);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Mock categories, sizes, and colors (replace with actual data from backend)
  const categories = [
    'all',
    'men',
    'women',
    'accessories',
    'shoes',
    'bags',
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Gray', 'Brown'];

  useEffect(() => {
    dispatch(fetchProducts({}) as any);
  }, [dispatch]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (productId: number) => {
    dispatch(addToCart({ product_id: productId, quantity: 1 }) as any);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearchTerm('');
  };

  const FilterPanel = () => (
    <Box sx={{ width: 280, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Category Filter */}
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Category
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          size="small"
        >
          {categories.map(category => (
            <MenuItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range */}
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Price Range
      </Typography>
      <Slider
        value={priceRange}
        onChange={(_, newValue) => setPriceRange(newValue as number[])}
        valueLabelDisplay="auto"
        min={0}
        max={10000}
        step={100}
        sx={{ mb: 3 }}
        valueLabelFormat={(value) => `KSh ${value}`}
      />
      <Typography variant="body2" color="text.secondary" textAlign="center">
        KSh {priceRange[0]} - KSh {priceRange[1]}
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Size Filter */}
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Size
      </Typography>
      <FormGroup row sx={{ mb: 3 }}>
        {sizes.map(size => (
          <FormControlLabel
            key={size}
            control={
              <Checkbox
                checked={selectedSizes.includes(size)}
                onChange={() => handleSizeChange(size)}
                size="small"
              />
            }
            label={size}
            sx={{ minWidth: '25%' }}
          />
        ))}
      </FormGroup>

      {/* Color Filter */}
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Color
      </Typography>
      <FormGroup row sx={{ mb: 3 }}>
        {colors.map(color => (
          <FormControlLabel
            key={color}
            control={
              <Checkbox
                checked={selectedColors.includes(color)}
                onChange={() => handleColorChange(color)}
                size="small"
              />
            }
            label={color}
            sx={{ minWidth: '50%' }}
          />
        ))}
      </FormGroup>

      <Button onClick={clearFilters} variant="outlined" fullWidth>
        Clear All Filters
      </Button>
    </Box>
  );

  const ProductCard = ({ product }: { product: any }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="250"
        image={product.image_url || '/api/placeholder/300/250'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            KSh {product.price.toLocaleString()}
          </Typography>
          {product.stock_quantity < 10 && (
            <Chip
              label={`${product.stock_quantity} left`}
              color="error"
              size="small"
            />
          )}
        </Box>
        <Chip
          label={product.category}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<CartIcon />}
          onClick={() => handleAddToCart(product.id)}
          fullWidth
          sx={{ mr: 1 }}
        >
          Add to Cart
        </Button>
        <IconButton size="small" color="error">
          <FavoriteIcon />
        </IconButton>
        <Button
          size="small"
          component={Link}
          to={`/product/${product.id}`}
          variant="outlined"
        >
          View
        </Button>
      </CardActions>
    </Card>
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h6" textAlign="center">
          Loading products...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h6" textAlign="center" color="error">
          Error loading products: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Shop
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover our latest fashion collections
          </Typography>
        </Box>

        {/* Controls */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={4}
        >
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilterDrawerOpen(true)}
            >
              Filters
            </Button>
            <TextField
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 250 }}
            />
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
              </Select>
            </FormControl>

            <Box display="flex" gap={1}>
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <GridViewIcon />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ListViewIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Results Count */}
        <Typography variant="body1" sx={{ mb: 3 }}>
          Showing {paginatedProducts.length} of {filteredProducts.length} products
        </Typography>

        {/* Product Grid */}
        {paginatedProducts.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No products found matching your criteria.
            </Typography>
            <Button onClick={clearFilters} variant="contained" sx={{ mt: 2 }}>
              Clear Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {paginatedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* Filter Drawer */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
        >
          <FilterPanel />
        </Drawer>
      </Container>
    </Box>
  );
};

export default Shop;
