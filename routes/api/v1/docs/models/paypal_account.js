module.exports = {
    "id":          "PayPalAccount",
    "required":    [
        "id",
        "accountEmail",
        "accountId",
        "firstName",
        "lastName",
        "accountType",
        "accountPermissions",
        "token",
        "secret",
        "isVerified",
        "createdAt",
        "updatedAt"
    ],
    "description": "PayPal account model",
    "properties":  {
        "id":                 {
            "type":   "integer",
            "format": "int32"
        },
        "accountEmail":       {
            "type": "string"
        },
        "accountId":          {
            "type": "string"
        },
        "firstName":          {
            "type": "string"
        },
        "lastName":           {
            "type": "string"
        },
        "businessName":       {
            "type": "string"
        },
        "country":            {
            "type": "string"
        },
        "postalCode":         {
            "type": "string"
        },
        "street1":            {
            "type": "string"
        },
        "street2":            {
            "type": "string"
        },
        "city":               {
            "type": "string"
        },
        "state":              {
            "type": "string"
        },
        "phone":              {
            "type": "string"
        },
        "accountType":        {
            "type": "string",
            "enum": ["PERSONAL", "PREMIER", "BUSINESS"]
        },
        "accountPermissions": {
            "type":  "array",
            "items": {
                "type": "string",
                "enum": [
                    'EXPRESS_CHECKOUT',
                    'DIRECT_PAYMENT',
                    'SETTLEMENT_CONSOLIDATION',
                    'SETTLEMENT_REPORTING',
                    'AUTH_CAPTURE',
                    'MOBILE_CHECKOUT',
                    'BILLING_AGREEMENT',
                    'REFERENCE_TRANSACTION',
                    'AIR_TRAVEL',
                    'MASS_PAY',
                    'TRANSACTION_DETAILS',
                    'TRANSACTION_SEARCH',
                    'RECURRING_PAYMENTS',
                    'ACCOUNT_BALANCE',
                    'ENCRYPTED_WEBSITE_PAYMENTS',
                    'REFUND',
                    'NON_REFERENCED_CREDIT',
                    'BUTTON_MANAGER',
                    'MANAGE_PENDING_TRANSACTION_STATUS',
                    'RECURRING_PAYMENT_REPORT',
                    'EXTENDED_PRO_PROCESSING_REPORT',
                    'EXCEPTION_PROCESSING_REPORT',
                    'ACCOUNT_MANAGEMENT_PERMISSION',
                    'ACCESS_BASIC_PERSONAL_DATA',
                    'ACCESS_ADVANCED_PERSONAL_DATA',
                    'INVOICING'
                ]
            }
        },
        "token":              {
            "type": "string"
        },
        "secret":             {
            "type": "string"
        },
        "isVerified":         {
            "type":         "boolean",
            "defaultValue": false
        },
        "createdAt":          {
            "type":   "string",
            "format": "date-time"
        },
        "updatedAt":          {
            "type":   "string",
            "format": "date-time"
        }
    }
};
