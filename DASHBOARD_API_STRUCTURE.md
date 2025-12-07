# Dashboard API Data Structure

## 1. Dashboard Statistics API
**Endpoint:** `GET /api/reports/dashboard?period=last_7_days`

### Response Structure:
```json
{
  "status": true,
  "code": 200,
  "message": "Dashboard statistics retrieved successfully",
  "request_time": "2025-12-07 13:48:12",
  "response_time": "2025-12-07 13:48:12",
  "duration": "25.43 ms",
  "data": {
    // === Main KPI Cards (First Row) ===
    "total_bookings": 125,           // Total bookings count
    "pending_bookings": 15,          // Pending bookings count
    "bookings_growth": 12.5,         // Growth percentage (can be negative)
    
    "active_users": 450,             // Active users count
    "total_customers": 380,          // Total customers count
    "users_growth": 8.3,             // Growth percentage
    
    "total_revenue": 45600,          // Monthly revenue (OMR)
    "revenue_growth": 15.2,          // Growth percentage
    
    "active_services": 85,           // Active services count
    "total_services": 100,           // Total services count
    "services_growth": 5.1,          // Growth percentage
    
    // === Performance Metrics (Second Row) ===
    "total_providers": 65,           // Total service providers
    "providers_growth": 7.8,         // Growth percentage
    
    "completed_bookings": 95,        // Completed bookings count
    "completion_rate": 94.2,         // Completion rate percentage
    
    "average_rating": 4.5,           // Average rating (0-5)
    "rating_growth": 2.3,            // Rating growth percentage
    
    "avg_response_time": "12 min",   // Average response time (string)
    "response_time_change": -15.2,   // Change in response time (negative is better)
    
    // === Today's Activity Section ===
    "today_bookings": 8,             // New bookings today
    "today_completed": 12,           // Completed services today
    "today_providers": 3,            // New providers today
    "today_reviews": 15,             // Customer reviews today
    
    // === Quick Stats Section ===
    "conversion_rate": 12.8,         // Conversion rate percentage
    "avg_booking_value": 42,         // Average booking value (OMR)
    "customer_retention": 87.5,      // Customer retention percentage
    
    // === Alerts Section ===
    "pending_reviews": 3,            // Pending reviews count
    "pending_providers": 5           // Pending provider approvals
  },
  "errors": null
}
```

---

## 2. Recent Bookings API
**Endpoint:** `GET /api/bookings?per_page=5&sort=created_at&order=desc`

### Response Structure:
```json
{
  "status": true,
  "code": 200,
  "message": "Bookings retrieved successfully",
  "request_time": "2025-12-07 13:48:12",
  "response_time": "2025-12-07 13:48:12",
  "duration": "18.56 ms",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "service_id": 1,
        "customer_id": 5,
        "provider_id": 9,
        "booking_date": "2025-11-23",
        "schedule_time": "10-11 PM",
        "status": "pending",              // pending, completed, cancelled, in_progress
        "price": "120.00",
        "discount_amount": "36.00",
        "net_amount": "84.00",
        "currency": "OMR",
        "address": "Muscat, Al Khuwair, Street 12",
        "mobile_no": "01712345678",
        "notes": "Regular cleaning requested",
        "created_at": "2025-11-09T17:06:43.000000Z",
        "updated_at": "2025-11-09T17:06:43.000000Z",
        
        // === Nested Relations ===
        "service": {
          "id": 1,
          "title": "Deep House Cleaning",
          "price": "120.00",
          "banner_image": "services/banners/deep-cleaning.jpg"
        },
        "customer": {
          "id": 5,
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "96512345678"
        },
        "provider": {
          "id": 9,
          "first_name": "Christopher",
          "last_name": "Taylor",
          "email": "chris.taylor@autorepair.com",
          "company_name": "Taylor Services"
        },
        
        // === Rating Object (if exists) ===
        "rating": {
          "id": 1,
          "booking_id": 1,
          "rating": 4.5,              // Use this field for display
          "comment": "Great service!"
        }
      }
      // ... more bookings
    ],
    "total": 125,
    "per_page": 5,
    "last_page": 25
  },
  "errors": null
}
```

---

## 3. Top Services API
**Endpoint:** `GET /api/reports/top-services?period=last_30_days&limit=5`

### Response Structure:
```json
{
  "status": true,
  "code": 200,
  "message": "Top services report generated successfully",
  "request_time": "2025-12-07 13:48:12",
  "response_time": "2025-12-07 13:48:12",
  "duration": "22.15 ms",
  "data": [
    {
      "id": 1,
      "title": "Deep House Cleaning",
      "name": "Deep House Cleaning",       // Fallback field
      "price": "120.00",
      "currency": "OMR",
      "status": "active",                  // active, inactive, pending
      "banner_image": "services/banners/deep-cleaning.jpg",
      
      // === Performance Metrics ===
      "total_bookings": 45,                // Total bookings count
      "bookings": 45,                      // Fallback field
      "avg_rating": 4.5,                   // Average rating (0-5)
      "rating": 4.5,                       // Fallback field
      "total_revenue": "5400.00",          // Total revenue generated
      
      // === Relations ===
      "category": {
        "id": 1,
        "name": "Home Services"
      },
      "sub_category": {
        "id": 1,
        "name": "House Cleaning",
        "category": {
          "id": 1,
          "name": "Home Services"
        }
      },
      "provider": {
        "id": 9,
        "first_name": "Christopher",
        "last_name": "Taylor",
        "company_name": "Taylor Services"
      }
    }
    // ... more services (up to limit)
  ],
  "errors": null
}
```

---

## 4. Booking Statistics API
**Endpoint:** `GET /api/bookings/statistics`

### Response Structure:
```json
{
  "status": true,
  "code": 200,
  "message": "Booking statistics retrieved successfully",
  "request_time": "2025-12-07 13:48:12",
  "response_time": "2025-12-07 13:48:12",
  "duration": "15.32 ms",
  "data": {
    // === Today's Metrics ===
    "today_bookings": 8,             // Total bookings today
    "today_completed": 12,           // Completed bookings today
    "today_pending": 5,              // Pending bookings today
    "today_cancelled": 1,            // Cancelled bookings today
    "today_revenue": "960.00",       // Today's revenue
    
    // === Overall Statistics ===
    "total_bookings": 125,
    "total_completed": 95,
    "total_pending": 15,
    "total_cancelled": 10,
    "total_in_progress": 5,
    
    // === Performance ===
    "completion_rate": 94.2,         // Percentage
    "cancellation_rate": 5.8,        // Percentage
    "avg_booking_value": 42,         // OMR
    
    // === Trends (optional) ===
    "bookings_trend": [
      {"date": "2025-12-01", "count": 12},
      {"date": "2025-12-02", "count": 15}
      // ... last 7 days
    ]
  },
  "errors": null
}
```

---

## Frontend Data Extraction Pattern

```javascript
// Extract data from API responses
const stats = dashboardData?.data || {};
const recentBookings = recentBookingsData?.data?.data || [];
const topServices = topServicesData?.data || [];
const bookingStats = bookingStatsData?.data || {};
```

---

## Key Points for Backend Implementation

### 1. **Consistent Response Structure**
All APIs should follow this pattern:
```json
{
  "status": true/false,
  "code": 200,
  "message": "Success message",
  "request_time": "timestamp",
  "response_time": "timestamp",
  "duration": "xx.xx ms",
  "data": { /* actual data */ },
  "errors": null
}
```

### 2. **Field Naming Convention**
- Use snake_case for all field names
- Provide both primary and fallback fields where applicable (e.g., `title` and `name`)
- Include nested relations where needed

### 3. **Numeric Values**
- Revenue/prices: String with decimal ("120.00")
- Counts: Integer (125)
- Percentages: Float (12.5)
- Ratings: Float (4.5)

### 4. **Date/Time Format**
- Dates: "YYYY-MM-DD" (2025-11-23)
- DateTime: ISO 8601 format with timezone (2025-11-09T17:06:43.000000Z)
- Time ranges: String format ("10-11 PM")

### 5. **Status Values**
- **Bookings**: "pending", "completed", "cancelled", "in_progress"
- **Services**: "active", "inactive", "pending"
- **Users**: "active", "inactive", "suspended"

### 6. **Growth Calculations**
```php
// Example calculation for growth percentage
$current = 125;
$previous = 110;
$growth = (($current - $previous) / $previous) * 100; // 13.64%
```

### 7. **Period Parameters**
Support these period values:
- `today`, `yesterday`
- `last_7_days`, `last_30_days`, `last_90_days`
- `this_month`, `last_month`, `last_12_months`
- `this_year`
- Custom: `start_date` & `end_date` (YYYY-MM-DD)

### 8. **Pagination**
For list endpoints (bookings, services):
```json
{
  "data": {
    "current_page": 1,
    "data": [ /* items */ ],
    "total": 125,
    "per_page": 10,
    "last_page": 13,
    "from": 1,
    "to": 10
  }
}
```

---

## SQL Query Examples

### Dashboard Statistics
```sql
SELECT 
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
    SUM(net_amount) as total_revenue,
    AVG(net_amount) as avg_booking_value,
    (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) as completion_rate
FROM bookings
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);
```

### Top Services
```sql
SELECT 
    s.id, s.title, s.price, s.status, s.banner_image,
    COUNT(b.id) as total_bookings,
    AVG(r.rating) as avg_rating,
    SUM(b.net_amount) as total_revenue
FROM services s
LEFT JOIN bookings b ON s.id = b.service_id
LEFT JOIN ratings r ON b.id = r.booking_id
WHERE b.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY s.id
ORDER BY total_bookings DESC
LIMIT 5;
```

---

## Testing API Response

Use this tool to verify your API structure matches:
```bash
curl -X GET "http://localhost/backend-service-provider/api/reports/dashboard?period=last_7_days" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```
