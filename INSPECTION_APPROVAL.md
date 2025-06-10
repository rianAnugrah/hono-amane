# Inspection Approval System

This document describes the inspection approval system that allows lead and head personnel to digitally sign inspection reports using canvas-based signatures.

## Features

### Digital Signature Canvas
- **Responsive Design**: Canvas adapts to different screen sizes and devices
- **Multi-Input Support**: Works with both mouse and touch input for mobile devices
- **High-Quality Output**: Generates base64-encoded PNG images for storage
- **User-Friendly Interface**: Clear visual feedback and intuitive controls

### Approval Workflow
- **Two-Level Approval**: Supports both Lead and Head approval signatures
- **Role-Based Access**: Users can only sign approvals based on their role permissions
- **Timestamp Tracking**: Records exact date and time of each signature
- **Signature Management**: Ability to remove signatures for corrections (with proper permissions)

### PDF Integration
- **Report Generation**: Signatures are included in generated inspection PDF reports
- **Professional Layout**: Signatures are displayed alongside approval timestamps
- **Visual Verification**: Clear indication of signed vs unsigned approvals

## User Roles and Permissions

### Lead Approval
- **Roles**: `admin`, `lead`, `supervisor`
- **Purpose**: First-level approval for inspection completion
- **Display**: Blue "Sign as Lead" button

### Head Approval  
- **Roles**: `admin`, `head`, `manager`
- **Purpose**: Final approval for inspection reports
- **Display**: Green "Sign as Head" button

## API Endpoints

### Add/Update Signature
```http
PUT /api/inspections/:id/approve
Content-Type: application/json

{
  "role": "lead" | "head",
  "signatureData": "data:image/png;base64,...",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Remove Signature
```http
DELETE /api/inspections/:id/approve
Content-Type: application/json

{
  "role": "lead" | "head"
}
```

## Database Schema

The following fields are added to the `Inspection` model:

```prisma
model Inspection {
  // ... existing fields
  lead_signature_data      String?
  head_signature_data      String?
  lead_signature_timestamp DateTime?
  head_signature_timestamp DateTime?
}
```

## Component Usage

### InspectionApproval Component
```tsx
import InspectionApproval from '@/components/inspection/InspectionApproval';

<InspectionApproval
  inspectionId="inspection-uuid"
  inspection={{
    id: "inspection-uuid",
    status: "pending",
    lead_signature_data: null,
    head_signature_data: null,
    lead_signature_timestamp: null,
    head_signature_timestamp: null
  }}
  onApprovalChange={() => {
    // Callback when signatures are added/removed
    refreshInspectionData();
  }}
/>
```

### SignatureCanvas Component
```tsx
import SignatureCanvas from '@/components/ui/SignatureCanvas';

<SignatureCanvas
  title="Digital Signature"
  onSave={(signatureData) => {
    // Handle signature save
    console.log('Signature:', signatureData);
  }}
  onCancel={() => {
    // Handle cancel
    setShowSignature(false);
  }}
  width={500}
  height={250}
  isLoading={false}
/>
```

## Integration Points

### InspectionDetail Page
The approval component is automatically included in the inspection detail view:
- Located below the inspected assets section
- Shows current approval status
- Provides signature interface for authorized users

### PDF Reports
Signatures are automatically included in generated PDF reports:
- Side-by-side layout for Lead and Head signatures
- Timestamp information below each signature
- Placeholder boxes for unsigned approvals

### Inspection List
The inspection list shows approval status through:
- Status badges indicating completion level
- Visual indicators for fully approved inspections

## Testing

### Test Page
Visit `/test-signature` to test the signature canvas component:
- Interactive signature drawing
- Save/clear functionality demo
- Base64 output display

### Manual Testing
1. Create a new inspection
2. Add assets to the inspection
3. Sign as Lead (if you have lead permissions)
4. Sign as Head (if you have head permissions)
5. Generate PDF to verify signature inclusion
6. Test signature removal functionality

## Security Considerations

- **Role Verification**: Server-side validation of user roles before accepting signatures
- **Data Integrity**: Signatures are stored as base64-encoded images
- **Audit Trail**: Timestamps provide accountability for all signature actions
- **Access Control**: Only authorized users can add/remove signatures

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: iOS Safari, Chrome Mobile, Samsung Internet
- **Canvas Support**: Required for signature functionality
- **Touch Events**: Supported for mobile/tablet drawing

## Troubleshooting

### Common Issues

1. **Signature not saving**: Check user permissions and network connection
2. **Canvas not responsive**: Ensure parent container has proper width
3. **Touch drawing not working**: Verify touch events are enabled
4. **PDF signatures missing**: Check that signatures are properly base64 encoded

### Error Messages

- `"You don't have permission to approve inspections"`: User role insufficient
- `"Failed to save signature"`: Network or server error
- `"Inspection not found"`: Invalid inspection ID provided

## Future Enhancements

- **Signature Templates**: Pre-saved signature options
- **Advanced Permissions**: More granular role-based access control
- **Signature History**: Track all signature changes and modifications
- **Mobile App Integration**: Native mobile signature capture
- **Biometric Verification**: Additional security for signature validation 