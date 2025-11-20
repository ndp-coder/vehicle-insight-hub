# Vehicle Lookup Application

A full-stack vehicle information lookup tool that decodes VIN numbers and searches by license plate to provide comprehensive vehicle specifications, manufacturing details, and history.

## Features

- 🚗 **VIN Decoder** - Decode 17-character VINs using the NHTSA vPIC API
- 🔍 **License Plate Search** - Look up vehicles by plate number and state
- 📊 **Detailed Specifications** - View engine, transmission, fuel type, and more
- 🏭 **Manufacturing Info** - Plant location and model year details
- 📋 **Vehicle History** - Title status, accidents, owners, and service records (placeholder)
- ⚡ **Rate Limiting** - Built-in API rate limiting (10 requests/minute per IP)
- 🎨 **Modern UI** - Responsive design with beautiful automotive theme
- 🔒 **Secure Backend** - Serverless functions via Lovable Cloud

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- shadcn/ui (components)
- Lucide React (icons)
- React Router (routing)
- TanStack Query (data fetching)

**Backend:**
- Lovable Cloud (Supabase Edge Functions)
- Deno runtime
- NHTSA vPIC API integration

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── VehicleLookupForm.tsx
│   │   └── VehicleResults.tsx
│   ├── pages/
│   │   ├── Index.tsx        # Main page
│   │   └── NotFound.tsx
│   ├── integrations/
│   │   └── supabase/        # Auto-generated Supabase client
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── functions/
│       └── vehicle-lookup/  # Backend API endpoint
│           └── index.ts
└── public/
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Lovable account with Cloud enabled

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:8080`

## API Endpoints

### POST `/vehicle-lookup`

Decodes vehicle information by VIN or license plate.

**Request Body:**
```json
{
  "vin": "1HGBH41JXMN109186"
}
```
or
```json
{
  "plate": "ABC123",
  "state": "CA"
}
```

**Response:**
```json
{
  "vin": "1HGBH41JXMN109186",
  "make": "Honda",
  "model": "Accord",
  "year": "2021",
  "manufacturer": "HONDA",
  "vehicleType": "PASSENGER CAR",
  "bodyClass": "Sedan/Saloon",
  "engineConfiguration": "In-Line",
  "engineCylinders": "4",
  "displacement": "1.5L",
  "fuelType": "Gasoline",
  "transmission": "Automatic",
  "driveType": "FWD",
  "doors": "4",
  "plantCity": "Marysville",
  "plantCountry": "UNITED STATES (USA)",
  "history": {
    "title": "Clean",
    "accidents": 0,
    "owners": 1,
    "service": "Regular maintenance records available"
  }
}
```

## Integrating Paid Services

### License Plate Lookup

Replace the placeholder `lookupPlate()` function in `supabase/functions/vehicle-lookup/index.ts`:

```typescript
async function lookupPlate(plate: string, state: string) {
  // TODO: Integrate with your paid plate lookup provider
  // Example providers: DataOne, CarFax, AutoCheck
  
  const apiKey = Deno.env.get('PLATE_LOOKUP_API_KEY');
  const response = await fetch(
    `https://your-provider.com/api/lookup?plate=${plate}&state=${state}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    }
  );
  
  const data = await response.json();
  return {
    plate: { number: plate, state: state, expiration: data.expiration },
    vin: data.vin // Most providers return the VIN
  };
}
```

### Vehicle History

Replace the placeholder `getVehicleHistory()` function:

```typescript
async function getVehicleHistory(vin: string) {
  // TODO: Integrate with NMVTIS, VinAudit, or Carfax
  
  const apiKey = Deno.env.get('VEHICLE_HISTORY_API_KEY');
  const response = await fetch(
    `https://your-provider.com/api/history/${vin}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    }
  );
  
  const data = await response.json();
  return {
    title: data.titleStatus,
    accidents: data.accidentCount,
    owners: data.ownerCount,
    service: data.serviceRecords
  };
}
```

### Adding API Keys

Store your API keys securely in Lovable Cloud:

1. Navigate to your project in Lovable
2. Click on the Cloud tab
3. Go to Secrets
4. Add your secrets:
   - `PLATE_LOOKUP_API_KEY`
   - `VEHICLE_HISTORY_API_KEY`

These will be automatically available as environment variables in your edge functions via `Deno.env.get()`.

## Validation

### VIN Validation
- Must be exactly 17 characters
- Cannot contain letters I, O, or Q
- Automatically converts to uppercase

### License Plate Validation
- Plate number required
- State selection required (50 US states)
- Automatically converts to uppercase

## Rate Limiting

The backend implements in-memory rate limiting:
- **Limit:** 10 requests per minute per IP address
- **Response:** 429 Too Many Requests when exceeded
- **Reset:** Automatically resets after 1 minute

For production, consider implementing Redis-based rate limiting for persistence across function instances.

## Deployment

### Deploy Frontend & Backend

Click the **Publish** button in Lovable to deploy both frontend and backend:
- Frontend updates require clicking "Update" in the publish dialog
- Backend functions deploy automatically

### Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains
2. Click "Connect Domain"
3. Follow the DNS configuration instructions

Note: Custom domains require a paid Lovable plan.

## API Credits & Usage

The NHTSA vPIC API is **free** and requires no API key. For paid services (plate lookup, vehicle history), costs depend on your chosen provider.

Lovable Cloud has usage-based pricing. Monitor your usage in Project Settings > Cloud.

## Error Handling

The application handles:
- Invalid VIN format
- Missing plate/state data
- NHTSA API failures
- Rate limit exceeded
- Network errors

All errors display user-friendly toast notifications.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Resources

- [NHTSA vPIC API Documentation](https://vpic.nhtsa.dot.gov/api/)
- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Cloud Features](https://docs.lovable.dev/features/cloud)
- [shadcn/ui Components](https://ui.shadcn.com/)

## Support

For issues or questions:
- Check the [Lovable Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- Review [Lovable Docs](https://docs.lovable.dev/)
- Open an issue in this repository

---

Built with ❤️ using [Lovable](https://lovable.dev)
