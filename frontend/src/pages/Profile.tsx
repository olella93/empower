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
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Settings,
  Security,
  ShoppingBag,
  Favorite,
  CreditCard,
  Logout,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import type { RootState } from '../store';
import { logout, updateProfile } from '../store/slices/authSlice';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    postal_code: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Initialize form with user data
    setProfileData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      date_of_birth: user.date_of_birth || '',
      gender: user.gender || '',
      address: user.address || '',
      city: user.city || '',
      postal_code: user.postal_code || '',
    });
  }, [user, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      await dispatch(updateProfile(profileData) as any).unwrap();
      setIsEditing(false);
    } catch (error) {
      // Error is handled by Redux state
    }
  };

  const handleCancelEdit = () => {
    // Reset to original data
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate('/login');
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h6" textAlign="center">
          Please log in to view your profile.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)', color: 'white' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'secondary.main',
                  fontSize: '2rem',
                  border: '4px solid white',
                }}
              >
                {user.first_name?.[0]}{user.last_name?.[0]}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {user.email}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Member since {new Date(user.created_at).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Logout />}
                onClick={() => setLogoutDialogOpen(true)}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal Information" icon={<Person />} iconPosition="start" />
            <Tab label="Order History" icon={<ShoppingBag />} iconPosition="start" />
            <Tab label="Wishlist" icon={<Favorite />} iconPosition="start" />
            <Tab label="Payment Methods" icon={<CreditCard />} iconPosition="start" />
            <Tab label="Security" icon={<Security />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6">Personal Information</Typography>
                    {!isEditing ? (
                      <Button
                        startIcon={<Edit />}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    ) : (
                      <Box display="flex" gap={1}>
                        <Button
                          startIcon={<Save />}
                          variant="contained"
                          onClick={handleSaveProfile}
                          disabled={isLoading}
                        >
                          Save
                        </Button>
                        <Button
                          startIcon={<Cancel />}
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        name="date_of_birth"
                        type="date"
                        value={profileData.date_of_birth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Gender"
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Postal Code"
                        name="postal_code"
                        value={profileData.postal_code}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Summary
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ShoppingBag color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Total Orders"
                        secondary="12 orders"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Favorite color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Wishlist Items"
                        secondary="5 items"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Settings color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Account Status"
                        secondary="Active"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Order History Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order History
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                Order history feature coming soon!
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Wishlist Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Wishlist
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                Wishlist feature coming soon!
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Payment Methods Tab */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Methods
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                Payment methods management coming soon!
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                Security settings coming soon!
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Logout Confirmation Dialog */}
        <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogout} color="error" variant="contained">
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Profile;
