module.exports = {
    "id":          "Shop",
    "required":    [
        "id",
        "title",
        "isPublic",
        "isBanned",
        "createdAt",
        "updatedAt"
    ],
    "description": "Shop model",
    "properties":  {
        "id":              {
            "type":   "integer",
            "format": "int32"
        },
        "imageId":         {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "coverImageId":    {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "title":           {
            "type": "string"
        },
        "subtitle":        {
            "type": "string"
        },
        "description":     {
            "type":         "string",
            "defaultValue": null
        },
        "tax":             {
            "type":         "number",
            "format":       "float",
            "defaultValue": 0
        },
        "street1":         {
            "type":         "string",
            "defaultValue": null
        },
        "street2":         {
            "type":         "string",
            "defaultValue": null
        },
        "locality":        {
            "type":         "string",
            "defaultValue": null
        },
        "region":          {
            "type":         "string",
            "defaultValue": null
        },
        "postalCode":      {
            "type":         "string",
            "defaultValue": null
        },
        "country":         {
            "type":         "string",
            "enum":         [
                "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
                "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR",
                "IO", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "KY", "CF", "TD", "CL", "CN", "CX", "CC",
                "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO",
                "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA",
                "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT",
                "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP",
                "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI",
                "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX",
                "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "AN", "NC", "NZ",
                "NI", "NE", "NG", "NU", "NF", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH",
                "PN", "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC",
                "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS",
                "SS", "ES", "LK", "SD", "SR", "SJ", "SZ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG",
                "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "UK", "US", "UM", "UY",
                "UZ", "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"
            ],
            "defaultValue": null
        },
        "email":           {
            "type":         "string",
            "defaultValue": null
        },
        "phoneNumber":     {
            "type":         "string",
            "defaultValue": null
        },
        "faxNumber":       {
            "type":         "string",
            "defaultValue": null
        },
        "website":         {
            "type":         "string",
            "defaultValue": null
        },
        "workingHours":    {
            "type":         "json",
            "defaultValue": null
        },
        "paypalAccountId": {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "isPublic":        {
            "type":         "boolean",
            "defaultValue": true
        },
        "isBanned":        {
            "type":         "boolean",
            "defaultValue": false
        },
        "createdAt":       {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updatedAt":       {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "image":           {
            "$ref":         "Image",
            "defaultValue": null
        }
    }
};
