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
                "type": "string"
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
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updatedAt":          {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        }
    }
};
