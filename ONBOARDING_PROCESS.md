# Vendor and Venue Onboarding Process

## Overview

This document outlines the comprehensive onboarding process for both vendors and venues on the Dream Ventz platform. The process is designed to ensure quality service providers while providing a smooth user experience.

## Onboarding Flow

### 1. Registration Process

#### For New Vendors/Venues:
1. **Multi-step Registration Form**
   - Step 1: Basic Information (name, email, phone, password, business type)
   - Step 2: Business Information (business name, description, location)
   - Step 3: Services & Pricing (services offered, package details)
   - Step 4: Portfolio Upload (photos and images)

2. **Status Tracking**
   - Registration submitted with "pending" status
   - Admin approval required before activation
   - Email notifications sent at each stage

#### For Existing Vendors/Venues:
1. **Claim Process**
   - Existing vendors/venues can claim their business using Venue ID
   - Admin provides Venue ID for verification
   - Set password and gain access to dashboard

### 2. Login and Dashboard Access

#### Vendor Login Flow:
```javascript
// Enhanced vendor login with immediate redirect
const handleSubmit = async (e) => {
  // ... login logic
  if (data.success) {
    const vendorWithRole = {
      ...data.vendor,
      role: 'vendor'
    };
    dispatch(setLoggedInUser(vendorWithRole));
    navigate('/vendor-dashboard');
  }
};
```

#### Venue Login Flow:
```javascript
// Similar flow for venues
const handleSubmit = async (e) => {
  // ... login logic
  if (data.success) {
    const venueWithRole = {
      ...data.venue,
      role: 'venue'
    };
    dispatch(setLoggedInUser(venueWithRole));
    navigate('/venue-dashboard');
  }
};
```

### 3. Dashboard Onboarding

#### Status-Based Dashboard Experience:

1. **Pending Approval**
   - Show onboarding status component
   - Display approval pending message
   - Allow profile completion while waiting

2. **Approved but Incomplete Profile**
   - Show profile completion form
   - Guide through missing information
   - Portfolio upload requirements

3. **Fully Onboarded**
   - Full dashboard access
   - Booking management
   - Portfolio editing capabilities

#### Onboarding Status Component:
```javascript
const OnboardingStatus = ({ 
  status, 
  profileComplete, 
  portfolioComplete, 
  onCompleteProfile, 
  onCompletePortfolio,
  type = 'vendor' // 'vendor' or 'venue'
}) => {
  // Shows completion progress and next steps
};
```

### 4. Profile Management

#### Vendor Profile Features:
- Basic information editing
- Services and pricing management
- Portfolio photo upload
- Business hours configuration
- Social media links
- Contact information updates

#### Venue Profile Features:
- Venue details and description
- Capacity and amenities
- Photo gallery management
- Pricing packages
- Location and contact info
- Business hours

### 5. Portfolio Management

#### Photo Upload System:
```javascript
const handleImageUpload = async (e, type = 'cover') => {
  const files = Array.from(e.target.files);
  const imageFiles = files.filter(file => file.type.startsWith('image/'));
  
  // Upload to cloudinary or similar service
  // Update profile with new images
};
```

#### Portfolio Features:
- Multiple photo upload
- Cover image selection
- Photo organization
- Delete and reorder capabilities

## Technical Implementation

### Protected Routes
```javascript
// Vendor protected route
function VendorProtected({ children }) {
  const user = useSelector(selectLoggedInUser);
  
  if (!user || user.role !== 'vendor') {
    return <Navigate to="/vendorlogin" replace={true} />;
  }
  
  return children;
}

// Venue protected route
function VenueProtected({ children }) {
  const user = useSelector(selectLoggedInUser);
  
  if (!user || user.role !== 'venue') {
    return <Navigate to="/venue-login" replace={true} />;
  }
  
  return children;
}
```

### Redux State Management
```javascript
// Auth slice for user management
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedInUser: null,
    userChecked: false
  },
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    }
  }
});
```

### API Endpoints

#### Vendor Endpoints:
- `POST /vendor/register` - New vendor registration
- `POST /vendor/login` - Vendor login
- `POST /vendor/claim` - Claim existing vendor
- `GET /vendor/profile` - Get vendor profile
- `PUT /vendor/profile` - Update vendor profile

#### Venue Endpoints:
- `POST /venue/register` - New venue registration
- `POST /venue/login` - Venue login
- `POST /venue/claim` - Claim existing venue
- `GET /venue/profile` - Get venue profile
- `PUT /venue/profile` - Update venue profile

## User Experience Features

### 1. Progressive Disclosure
- Multi-step forms reduce cognitive load
- Clear progress indicators
- Save progress between steps

### 2. Status Communication
- Clear status messages
- Visual indicators (icons, colors)
- Email notifications

### 3. Help and Support
- Inline help text
- Contact support options
- FAQ sections

### 4. Mobile Responsiveness
- All forms work on mobile devices
- Touch-friendly interfaces
- Optimized image upload

## Security Considerations

### 1. Authentication
- JWT tokens for session management
- Role-based access control
- Secure password handling

### 2. Data Validation
- Client-side validation for UX
- Server-side validation for security
- File upload restrictions

### 3. Privacy
- Secure data transmission
- GDPR compliance considerations
- Data retention policies

## Admin Features

### 1. Approval Process
- Admin dashboard for vendor/venue approval
- Bulk approval capabilities
- Rejection with reasons

### 2. Management Tools
- User management interface
- Status updates
- Communication tools

## Monitoring and Analytics

### 1. Onboarding Metrics
- Registration completion rates
- Time to complete onboarding
- Drop-off points identification

### 2. User Engagement
- Dashboard usage patterns
- Profile completion rates
- Feature adoption

## Future Enhancements

### 1. Automated Onboarding
- AI-powered profile suggestions
- Automated photo optimization
- Smart pricing recommendations

### 2. Advanced Features
- Video portfolio uploads
- Virtual venue tours
- Advanced booking systems

### 3. Integration
- Social media integration
- Third-party booking systems
- Payment gateway integration

## Conclusion

The onboarding process is designed to be comprehensive yet user-friendly, ensuring that both vendors and venues can easily join the platform while maintaining quality standards. The status-based approach provides clear guidance and reduces confusion during the onboarding journey. 