module.exports = {
    "id":          "Product",
    "required":    [
        "id",
        "shopId",
        "title",
        "isUnique",
        "isPublic",
        "isBanned",
        "createdAt",
        "updatedAt"
    ],
    "description": "Product model",
    "properties":  {
        "id":                     {
            "type":   "integer",
            "format": "int32"
        },
        "shopId":                 {
            "type":   "integer",
            "format": "int32"
        },
        "categoryId":             {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "title":                  {
            "type": "string"
        },
        "subtitle":               {
            "type": "string"
        },
        "description":            {
            "type":         "string",
            "defaultValue": null
        },
        "brand":                  {
            "type":         "string",
            "defaultValue": null
        },
        "manufacturerPartNumber": {
            "type":         "string",
            "defaultValue": null
        },
        "ean":                    {
            "type":         "string",
            "defaultValue": null
        },
        "isbn":                   {
            "type":         "string",
            "defaultValue": null
        },
        "upc":                    {
            "type":         "string",
            "defaultValue": null
        },
        "price":                  {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shippingCost":           {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shippingWeight":         {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "shippingWeightUnits":    {
            "type":         "string",
            "enum":         ["mg", "g", "kg", "lb", "oz"],
            "defaultValue": "kg"
        },
        "weight":                 {
            "type":         "number",
            "format":       "float",
            "defaultValue": null
        },
        "weightUnits":            {
            "type":         "string",
            "enum":         ["mg", "g", "kg", "lb", "oz"],
            "defaultValue": "kg"
        },
        "amountInStock":          {
            "type":         "integer",
            "format":       "int32",
            "defaultValue": null
        },
        "availability":           {
            "type":         "string",
            "enum":         ["inStock", "availableForOrder", "outOfStock"],
            "defaultValue": "inStock"
        },
        "condition":              {
            "type":         "string",
            "enum":         ["new", "refurbished", "used"],
            "defaultValue": "new"
        },
        "ageGroup":               {
            "type":         "string",
            "enum":         ["kids", "adult"],
            "defaultValue": null
        },
        "targetGender":           {
            "type":         "string",
            "enum":         ["female", "male", "unisex"],
            "defaultValue": null
        },
        "expirationTime":         {
            "type":         "string",
            "defaultValue": null
        },
        "color":                  {
            "type":         "string",
            "defaultValue": null
        },
        "material":               {
            "type":         "string",
            "defaultValue": null
        },
        "pattern":                {
            "type":         "string",
            "defaultValue": null
        },
        "size":                   {
            "type":         "string",
            "defaultValue": null
        },
        "isUnique":               {
            "type":         "boolean",
            "defaultValue": false
        },
        "isPublic":               {
            "type":         "boolean",
            "defaultValue": true
        },
        "isBanned":               {
            "type":         "boolean",
            "defaultValue": false
        },
        "createdAt":              {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "updatedAt":              {
            "type":         "string",
            "format":       "date-time",
            "defaultValue": null
        },
        "shop":                   {
            "$ref": "Shop"
        },
        "category":               {
            "$ref": "Category"
        }
    }
};
